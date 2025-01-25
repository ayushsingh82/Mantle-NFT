import { ConnectButton } from '@rainbow-me/rainbowkit';

function StakingDashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">NFT Staking</h1>
          <ConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatsCard title="Total Staked" value="0 NFTs" />
          <StatsCard title="Your Staked" value="0 NFTs" />
          <StatsCard title="Rewards Available" value="0 $REWARD" />
        </div>

        {/* Staking Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Available to Stake */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Available to Stake</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* NFT Cards will go here */}
            </div>
          </div>

          {/* Currently Staked */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Currently Staked</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Staked NFT Cards will go here */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatsCard({ title, value }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-gray-400">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default StakingDashboard; 