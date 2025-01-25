import { useState } from 'react'
import Navbar from './Navbar'

function Mint() {
  const [nftData, setNftData] = useState({
    name: '',
    description: '',
    image: null
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-12 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Mint New NFT
          </h1>
          {/* Add minting interface here */}
        </div>
      </div>
    </div>
  )
}

export default Mint 