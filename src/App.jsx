import { WagmiConfig, createConfig } from 'wagmi'
import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit'
import { 
  injectedWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { createPublicClient, http } from 'viem'
import '@rainbow-me/rainbowkit/styles.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'

import EditNFT from './components/EditNFT'
import Mint from './components/Mint'
import MyNFTs from './components/MyNFTs'

const projectId = 'e7fa7d19fd057ecd9403a0e89bd62b8b'

// Define Open Campus Codex Sepolia network
const openCampusCodex = {
  id: 656476,
  name: 'Open Campus Codex Sepolia',
  network: 'codex-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'EDU',
    symbol: 'EDU',
  },
  rpcUrls: {
    public: { http: ['https://open-campus-codex-sepolia.drpc.org'] },
    default: { http: ['https://open-campus-codex-sepolia.drpc.org'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.opencampus.xyz' },
  },
  testnet: true,
}

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains: [openCampusCodex] }),
      metaMaskWallet({ projectId, chains: [openCampusCodex] }),
      coinbaseWallet({ appName: 'NFT Staking Platform', chains: [openCampusCodex] }),
      walletConnectWallet({ projectId, chains: [openCampusCodex] }),
    ],
  },
])

const config = createConfig({
  connectors,
  publicClient: createPublicClient({
    chain: openCampusCodex,
    transport: http()
  }),
})

function App() {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={[openCampusCodex]}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/edit-nft" element={<EditNFT />} />
            <Route path="/mint" element={<Mint />} />
            <Route path="/my-nfts" element={<MyNFTs />} />
          </Routes>
        </Router>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App 