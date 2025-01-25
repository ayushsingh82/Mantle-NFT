import { useState, useRef } from 'react'
import Navbar from './Navbar'
import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'

function EditNFT() {
  const { address, isConnected } = useAccount()
  const [nftData, setNftData] = useState({
    name: '',
    description: '',
    image: null,
    attributes: []
  })
  const [previewImage, setPreviewImage] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState(null)
  const [imageAdjustments, setImageAdjustments] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
  })
  const [imagePrompt, setImagePrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const imageRef = useRef(null)

  const colorFilters = [
    { name: 'Original', filter: '' },
    { name: 'Cyberpunk', filter: 'hue-rotate(180deg) saturate(150%)' },
    { name: 'Vintage', filter: 'sepia(50%) contrast(90%)' },
    { name: 'Neon', filter: 'brightness(110%) saturate(150%) hue-rotate(30deg)' },
    { name: 'B&W', filter: 'grayscale(100%)' },
    { name: 'Purple', filter: 'hue-rotate(290deg) saturate(120%)' },
    { name: 'Golden', filter: 'sepia(50%) saturate(150%) brightness(110%)' },
  ]

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNftData({ ...nftData, image: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
        setSelectedFilter(null)
        setImageAdjustments({
          brightness: 100,
          contrast: 100,
          saturation: 100,
          hue: 0,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter)
  }

  const handleAdjustmentChange = (type, value) => {
    setImageAdjustments(prev => ({
      ...prev,
      [type]: value
    }))
  }

  const getImageStyle = () => {
    const adjustments = `brightness(${imageAdjustments.brightness}%) 
                        contrast(${imageAdjustments.contrast}%) 
                        saturate(${imageAdjustments.saturation}%) 
                        hue-rotate(${imageAdjustments.hue}deg)`
    return {
      filter: selectedFilter ? `${selectedFilter} ${adjustments}` : adjustments
    }
  }

  const handleAttributeAdd = () => {
    setNftData({
      ...nftData,
      attributes: [...nftData.attributes, { trait_type: '', value: '' }]
    })
  }

  const handleAttributeChange = (index, field, value) => {
    const newAttributes = [...nftData.attributes]
    newAttributes[index] = { ...newAttributes[index], [field]: value }
    setNftData({ ...nftData, attributes: newAttributes })
  }

  const handleMint = async () => {
    // Add minting logic here
    console.log('Minting NFT:', nftData)
  }

  const generateImage = async () => {
    if (!imagePrompt) return
    
    setIsGenerating(true)
    try {
      // First, submit the generation request
      const submitResponse = await fetch(
        "https://api.monsterapi.ai/v1/generate/txt2img",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjRmMzdiMjYzYjM2NTdjMDZkNzU0ZTkxY2E0Zjg4MDE0IiwiY3JlYXRlZF9hdCI6IjIwMjQtMTItMjNUMDU6MjA6NTEuNTQxNzY0In0.QVA-B0ASwNzA1m8BBCM8TgbCt7HmsJaTschBXLEI8zc"
          },
          body: JSON.stringify({
            prompt: imagePrompt,
            negative_prompt: "blurry, bad quality, distorted, ugly, deformed",
            samples: 1,
            steps: 30,
            width: 512,
            height: 512,
            guidance_scale: 7.5,
            model_id: "sdxl"
          }),
        }
      );

      if (!submitResponse.ok) {
        const errorData = await submitResponse.json();
        throw new Error(errorData.error || 'Failed to submit generation request');
      }

      const submitData = await submitResponse.json();
      const processId = submitData.process_id;

      // Poll for the result
      let attempts = 0;
      const maxAttempts = 60;
      const pollInterval = 1000;

      while (attempts < maxAttempts) {
        const statusResponse = await fetch(
          `https://api.monsterapi.ai/v1/status/${processId}`,
          {
            headers: {
              "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjRmMzdiMjYzYjM2NTdjMDZkNzU0ZTkxY2E0Zjg4MDE0IiwiY3JlYXRlZF9hdCI6IjIwMjQtMTItMjNUMDU6MjA6NTEuNTQxNzY0In0.QVA-B0ASwNzA1m8BBCM8TgbCt7HmsJaTschBXLEI8zc"
            }
          }
        );

        if (!statusResponse.ok) {
          throw new Error('Failed to check generation status');
        }

        const statusData = await statusResponse.json();
        
        if (statusData.status === 'completed' && statusData.result?.output?.[0]) {
          // Get the image URL from the result
          const imageUrl = statusData.result.output[0];
          
          try {
            // Fetch the image as blob
            const imageResponse = await fetch(imageUrl);
            if (!imageResponse.ok) throw new Error('Failed to fetch generated image');
            
            const blob = await imageResponse.blob();
            if (blob.size === 0) throw new Error('Generated image is empty');
            
            // Create a file from the blob
            const file = new File([blob], 'ai-generated.png', { type: 'image/png' });
            
            // Update NFT data and preview
            setNftData(prev => ({ ...prev, image: file }));
            setPreviewImage(URL.createObjectURL(blob));
            
            // Reset filters and adjustments
            setSelectedFilter(null);
            setImageAdjustments({
              brightness: 100,
              contrast: 100,
              saturation: 100,
              hue: 0,
            });
            
            return;
          } catch (error) {
            console.error('Error processing generated image:', error);
            throw new Error('Failed to process generated image');
          }
        } else if (statusData.status === 'failed') {
          throw new Error('Image generation failed: ' + (statusData.error || 'Unknown error'));
        } else if (statusData.status === 'processing') {
          // Still processing, wait and try again
          await new Promise(resolve => setTimeout(resolve, pollInterval));
          attempts++;
        } else {
          throw new Error('Unknown status: ' + statusData.status);
        }
      }

      throw new Error('Generation timed out after ' + maxAttempts + ' attempts');

    } catch (error) {
      console.error('Error generating image:', error);
      alert(error.message || 'Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Update your preview section to include accessories
  const renderPreview = () => (
    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-800 mb-4">
      {previewImage && (
        <img
          ref={imageRef}
          src={previewImage}
          alt="NFT Preview"
          className="w-full h-full object-cover transition-all duration-300"
          style={getImageStyle()}
        />
      )}
      {/* Accessories Section */}
      {/* <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
        <h4 className="text-sm font-medium mb-2">Accessory Controls</h4>
        <div className="space-y-3">
          <div>
            <label className="text-xs">Scale</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={activeAccessory.scale}
              onChange={(e) => {
                setSelectedAccessories(prev => prev.map(acc => {
                  if (acc.instanceId === activeAccessory.instanceId) {
                    return { ...acc, scale: parseFloat(e.target.value) }
                  }
                  return acc
                }))
              }}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="text-xs">Rotation</label>
            <input
              type="range"
              min="-180"
              max="180"
              value={activeAccessory.rotation}
              onChange={(e) => {
                setSelectedAccessories(prev => prev.map(acc => {
                  if (acc.instanceId === activeAccessory.instanceId) {
                    return { ...acc, rotation: parseInt(e.target.value) }
                  }
                  return acc
                }))
              }}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div> */}
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-12 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Create & Edit NFT
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* NFT Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/50 backdrop-blur-md rounded-2xl p-6 border border-purple-500/20"
            >
              <h2 className="text-2xl font-bold mb-6">Preview</h2>
              {renderPreview()}
              {previewImage && (
                <>
                  {/* Color Filters */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Color Filters</h3>
                    <div className="flex flex-wrap gap-2">
                      {colorFilters.map((filter) => (
                        <button
                          key={filter.name}
                          onClick={() => handleFilterChange(filter.filter)}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            selectedFilter === filter.filter
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-800 hover:bg-gray-700'
                          }`}
                        >
                          {filter.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Adjustments */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Adjustments</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm">Brightness</label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={imageAdjustments.brightness}
                          onChange={(e) => handleAdjustmentChange('brightness', e.target.value)}
                          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-sm">Contrast</label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={imageAdjustments.contrast}
                          onChange={(e) => handleAdjustmentChange('contrast', e.target.value)}
                          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-sm">Saturation</label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={imageAdjustments.saturation}
                          onChange={(e) => handleAdjustmentChange('saturation', e.target.value)}
                          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-sm">Hue Rotate</label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={imageAdjustments.hue}
                          onChange={(e) => handleAdjustmentChange('hue', e.target.value)}
                          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="space-y-2 mt-4">
                <p className="font-bold text-xl">{nftData.name || 'Untitled NFT'}</p>
                <p className="text-gray-400">{nftData.description || 'No description'}</p>
              </div>
            </motion.div>

            {/* NFT Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black/50 backdrop-blur-md rounded-2xl p-6 border border-purple-500/20"
            >
              <h2 className="text-2xl font-bold mb-6">NFT Details</h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                {/* AI Image Generation */}
                <div>
                  <label className="block text-sm font-medium mb-2">Generate Image with AI</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="Describe the image you want to generate..."
                      className="flex-1 bg-gray-800 rounded-lg p-2 border border-gray-700 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={generateImage}
                      disabled={isGenerating || !imagePrompt}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        isGenerating || !imagePrompt
                          ? 'bg-gray-700 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                      }`}
                    >
                      {isGenerating ? (
                        <div className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Generating...
                        </div>
                      ) : (
                        'Generate'
                      )}
                    </button>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Or Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full bg-gray-800 rounded-lg p-2 border border-gray-700 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={nftData.name}
                    onChange={(e) => setNftData({ ...nftData, name: e.target.value })}
                    className="w-full bg-gray-800 rounded-lg p-2 border border-gray-700 focus:outline-none focus:border-purple-500"
                    placeholder="Enter NFT name"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={nftData.description}
                    onChange={(e) => setNftData({ ...nftData, description: e.target.value })}
                    className="w-full bg-gray-800 rounded-lg p-2 border border-gray-700 focus:outline-none focus:border-purple-500 h-32"
                    placeholder="Enter NFT description"
                  />
                </div>

                {/* Attributes */}
                <div>
                  <label className="block text-sm font-medium mb-2">Attributes</label>
                  {nftData.attributes.map((attr, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={attr.trait_type}
                        onChange={(e) => handleAttributeChange(index, 'trait_type', e.target.value)}
                        className="w-1/2 bg-gray-800 rounded-lg p-2 border border-gray-700 focus:outline-none focus:border-purple-500"
                        placeholder="Trait"
                      />
                      <input
                        type="text"
                        value={attr.value}
                        onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                        className="w-1/2 bg-gray-800 rounded-lg p-2 border border-gray-700 focus:outline-none focus:border-purple-500"
                        placeholder="Value"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAttributeAdd}
                    className="text-sm text-purple-500 hover:text-purple-400"
                  >
                    + Add Attribute
                  </button>
                </div>

                {/* Mint Button */}
                <button
                  type="button"
                  onClick={handleMint}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-bold hover:opacity-90 transition-opacity"
                >
                  Mint NFT
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditNFT 