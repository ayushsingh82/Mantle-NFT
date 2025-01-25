import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import { useAccount } from 'wagmi'

function MyNFTs() {
  const { address } = useAccount()
  const [nfts, setNfts] = useState([])

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-12 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            My NFTs
          </h1>
          {/* Add NFT gallery here */}
        </div>
      </div>
    </div>
  )
}

export default MyNFTs 