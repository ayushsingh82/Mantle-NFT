import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'

function NFTCard({ nft, action, onAction }) {
  return (
    <div className="bg-black/30 rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-500/40 transition-all hover:scale-[1.02]">
      <div className="relative aspect-square">
        <img
          src={nft?.image || 'placeholder.png'}
          alt={nft?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-between p-4">
          <div>
            <h3 className="font-bold text-white">{nft?.name || 'NFT Name'}</h3>
            <p className="text-sm text-gray-300">#{nft?.tokenId}</p>
          </div>
          <button
            onClick={onAction}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 backdrop-blur-sm transition-colors ${
              action === 'stake'
                ? 'bg-purple-500/80 hover:bg-purple-600/80'
                : 'bg-pink-500/80 hover:bg-pink-600/80'
            }`}
          >
            {action === 'stake' ? (
              <>
                Stake
                <ArrowUpIcon className="w-4 h-4" />
              </>
            ) : (
              <>
                Unstake
                <ArrowDownIcon className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NFTCard 