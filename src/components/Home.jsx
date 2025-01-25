import { useRef, useEffect } from 'react'
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'

function Home() {
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const floatingNFTs = [
    {
      id: 1,
      image: 'https://i.seadn.io/gcs/files/c49d2493f2ef4a40a5306fdf1f5c6b43.png',
      name: 'Cyber Ape',
      animation: {
        y: [-20, 20],
        rotateZ: [-5, 5],
        rotateY: [-15, 15],
        scale: [1, 1.05],
        transition: {
          duration: 4,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }
      }
    },
    {
      id: 2,
      image: 'https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&dpr=1&w=1000',
      name: 'Bored Ape',
      animation: {
        y: [20, -20],
        rotateZ: [5, -5],
        rotateY: [15, -15],
        scale: [1.05, 1],
        transition: {
          duration: 5,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }
      }
    },
    {
      id: 3,
      image: 'https://i.seadn.io/gae/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ?auto=format&dpr=1&w=1000',
      name: 'Doodle',
      animation: {
        y: [-15, 15],
        rotateZ: [-3, 3],
        rotateY: [-10, 10],
        scale: [1, 1.03],
        transition: {
          duration: 4.5,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }
      }
    }
  ]

  // Animated particles
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  }))

  const features = [
    {
      title: "AI-Powered Editing",
      description: "Transform your images with advanced AI filters and enhancements",
      icon: "✨",
      gradient: "from-blue-500 to-purple-500"
    },
    {
      title: "Smart Filters",
      description: "Apply professional-grade filters with one click",
      icon: "🎨",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Quick Minting",
      description: "Mint your NFTs instantly with minimal gas fees",
      icon: "⚡",
      gradient: "from-pink-500 to-red-500"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden" ref={targetRef}>
      <Navbar />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: 0.2
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <motion.section 
        style={{ y, opacity }}
        className="relative min-h-screen flex items-center justify-center pt-20"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black z-0"></div>
        
        {/* Floating NFTs */}
        <div className="absolute inset-0 overflow-hidden perspective-1000">
          {floatingNFTs.map((nft, index) => (
            <motion.div
              key={nft.id}
              className="absolute hidden md:block"
              style={{
                left: `${25 + index * 25}%`,
                top: '20%',
                transformStyle: 'preserve-3d'
              }}
              animate={nft.animation}
              whileHover={{ 
                scale: 1.1,
                rotateY: 180,
                transition: { duration: 0.8 }
              }}
            >
              <div className="relative group cursor-pointer">
                <motion.img
                  src={nft.image}
                  alt={nft.name}
                  className="w-48 h-48 rounded-2xl shadow-2xl shadow-purple-500/20 object-cover 
                           group-hover:shadow-purple-500/40 transition-shadow"
                  style={{ backfaceVisibility: 'hidden' }}
                />
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/90 to-pink-600/90
                           backdrop-blur-sm flex items-center justify-center"
                  initial={{ opacity: 0, rotateY: 180 }}
                  whileHover={{ opacity: 1 }}
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <div className="text-center p-4">
                    <h3 className="text-xl font-bold mb-2">{nft.name}</h3>
                    <p className="text-sm text-white/80">Click to Edit</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hero Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-4 z-10 text-center"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-8xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent
                         animate-gradient-x inline-block mt-[180px]">
              Create Stunning NFTs
            </span>
            <br />
            <motion.span
              animate={{
                scale: [1, 1.02, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent"
            >
              in Minutes
            </motion.span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
          >
            Transform your art into unique NFTs with our powerful AI-powered editing tools.
            <br />
            <span className="text-purple-400">No design experience needed.</span>
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex gap-6 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
           
            </motion.div>

           
          </motion.div>
        </motion.div>
      </motion.section>

   

      {/* Features Section */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
          >
            Create Like Never Before
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 10,
                  transition: { duration: 0.3 }
                }}
                className="relative group transform perspective-1000"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative p-8 bg-black/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all h-full">
                  <div className={`text-6xl mb-6 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent transform group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
          >
            How It Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Upload Your Art",
                description: "Start with any image you want to transform into an NFT",
                icon: "🎨",
                step: "1"
              },
              {
                title: "Customize & Edit",
                description: "Use our AI-powered tools to enhance and customize your NFT",
                icon: "✨",
                step: "2"
              },
              {
                title: "Mint & Share",
                description: "Mint your NFT and share it with the world",
                icon: "🚀",
                step: "3"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative bg-black p-8 rounded-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-bold">{item.title}</h3>
                  </div>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative group max-w-4xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-300" />
            <div className="relative bg-black/50 backdrop-blur-sm p-12 rounded-3xl border border-purple-500/20 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Join Our Community
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Connect with other creators, share your work, and get inspired.
              </p>
              <div className="flex gap-4 justify-center">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-purple-500/20 hover:bg-purple-500/30 px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>Discord</span>
                  <span>→</span>
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-pink-500/20 hover:bg-pink-500/30 px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>Twitter</span>
                  <span>→</span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home 