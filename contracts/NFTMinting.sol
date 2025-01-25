// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMinting is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;
    
    // Base URI for metadata
    string private _baseURIextended;

    // Minting price in EDU
    uint256 public mintPrice = 0.1 ether;

    // Maximum supply
    uint256 public maxSupply = 10000;

    constructor() ERC721("NFT Studio", "NFTS") Ownable(msg.sender) {}

    function mint(string memory tokenURI) public payable returns (uint256) {
        require(msg.value >= mintPrice, "Insufficient payment");
        require(totalSupply() < maxSupply, "Max supply reached");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        return newTokenId;
    }

    function batchMint(string[] memory tokenURIs) public payable returns (uint256[] memory) {
        require(msg.value >= mintPrice * tokenURIs.length, "Insufficient payment");
        require(totalSupply() + tokenURIs.length <= maxSupply, "Would exceed max supply");
        
        uint256[] memory newTokenIds = new uint256[](tokenURIs.length);
        
        for (uint i = 0; i < tokenURIs.length; i++) {
            _tokenIds.increment();
            uint256 newTokenId = _tokenIds.current();
            
            _safeMint(msg.sender, newTokenId);
            _setTokenURI(newTokenId, tokenURIs[i]);
            
            newTokenIds[i] = newTokenId;
        }
        
        return newTokenIds;
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

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
} 