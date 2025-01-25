// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title DynamicNFT
 * @dev Implementation of ERC-7007 Dynamic NFT standard
 */
contract DynamicNFT is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Mapping for token states
    mapping(uint256 => uint256) private _tokenStates;
    
    // Mapping for token URIs per state
    mapping(uint256 => mapping(uint256 => string)) private _stateURIs;
    
    // Maximum number of states per token
    mapping(uint256 => uint256) private _maxStates;
    
    uint256 public mintPrice = 0.1 ether;
    uint256 public maxSupply = 10000;
    
    // Add gas configurations for Mantle
    uint256 public constant GAS_LIMIT = 500000;
    uint256 public constant GAS_PRICE = 1000000000; // 1 gwei
    
    // Add mint status tracking
    mapping(uint256 => bool) public mintingCompleted;
    event MintingStatus(uint256 indexed tokenId, bool completed);
    
    // Events for ERC-7007
    event StateChanged(uint256 indexed tokenId, uint256 oldState, uint256 newState);
    event StateURISet(uint256 indexed tokenId, uint256 state, string uri);

    constructor() ERC721("Dynamic NFT", "DNFT") Ownable(msg.sender) {}

    function mint(string memory initialURI, uint256 numberOfStates) public payable returns (uint256) {
        require(tx.gasprice <= GAS_PRICE * 2, "Gas price too high");
        require(gasleft() >= GAS_LIMIT, "Insufficient gas");
        require(msg.value >= mintPrice, "Insufficient payment");
        require(totalSupply() < maxSupply, "Max supply reached");
        require(numberOfStates > 0, "Must have at least one state");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        try _safeMint(msg.sender, newTokenId) {
            _setInitialState(newTokenId, initialURI, numberOfStates);
            mintingCompleted[newTokenId] = true;
            emit MintingStatus(newTokenId, true);
            return newTokenId;
        } catch {
            _tokenIds.decrement();
            revert("Minting failed");
        }
    }

    function _setInitialState(uint256 tokenId, string memory uri, uint256 numberOfStates) internal {
        _tokenStates[tokenId] = 0;
        _stateURIs[tokenId][0] = uri;
        _maxStates[tokenId] = numberOfStates - 1;
        
        emit StateURISet(tokenId, 0, uri);
    }

    function setStateURI(uint256 tokenId, uint256 state, string memory uri) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Caller is not owner nor approved");
        require(state <= _maxStates[tokenId], "State exceeds maximum states");
        
        _stateURIs[tokenId][state] = uri;
        emit StateURISet(tokenId, state, uri);
    }

    function evolve(uint256 tokenId) public {
        require(tx.gasprice <= GAS_PRICE * 2, "Gas price too high");
        require(gasleft() >= GAS_LIMIT / 2, "Insufficient gas");
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Caller is not owner nor approved");
        require(_tokenStates[tokenId] < _maxStates[tokenId], "Token is at maximum state");
        
        uint256 oldState = _tokenStates[tokenId];
        uint256 newState = oldState + 1;
        
        _tokenStates[tokenId] = newState;
        emit StateChanged(tokenId, oldState, newState);
    }

    function getState(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenStates[tokenId];
    }

    function getMaxState(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        return _maxStates[tokenId];
    }

    // Override tokenURI to return current state URI
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(_exists(tokenId), "Token does not exist");
        return _stateURIs[tokenId][_tokenStates[tokenId]];
    }

    // Required overrides
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // Owner functions
    function setMintPrice(uint256 _price) public onlyOwner {
        mintPrice = _price;
    }

    function setMaxSupply(uint256 _maxSupply) public onlyOwner {
        require(_maxSupply >= totalSupply(), "Cannot set max supply lower than current supply");
        maxSupply = _maxSupply;
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    // Add function to check transaction status
    function getMintStatus(uint256 tokenId) public view returns (bool) {
        return mintingCompleted[tokenId];
    }
} 