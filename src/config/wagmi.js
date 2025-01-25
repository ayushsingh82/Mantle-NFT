import { configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'

const codexChain = {
  id: 9990,
  name: 'OpenCampus Codex',
  network: 'codex',
  nativeCurrency: {
    decimals: 18,
    name: 'EDU',
    symbol: 'EDU',
  },
  rpcUrls: {
    public: { http: ['https://rpc.opencampus.space'] },
    default: { http: ['https://rpc.opencampus.space'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.opencampus.space' },
  },
}

const { chains, publicClient } = configureChains(
  [codexChain],
  [publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'NFT Staking App',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Get from https://cloud.walletconnect.com
  chains,
})

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

export { chains } 