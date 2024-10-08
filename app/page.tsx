'use client'

import { useState, useEffect, useRef } from 'react'
import { DraggableEvent, DraggableData } from 'react-draggable'
import Draggable from 'react-draggable'; // Add this import at the top of your file

export default function Home() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isAnimating, setIsAnimating] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [isLiveActive, setIsLiveActive] = useState(false)  // Add this line
  const nodeRef = useRef(null)

  useEffect(() => {
    const finalX = window.innerWidth - 480 - 16
    const finalY = window.innerHeight - 270 - 16

    // Posizione iniziale: fuori dallo schermo in basso
    setPosition({ x: finalX, y: window.innerHeight })

    // Avvia l'animazione dopo un breve ritardo
    const animationTimer = setTimeout(() => {
      // Animazione verso l'alto
      setPosition({ x: finalX, y: finalY })
      
      const animationDuration = 500
      setTimeout(() => setIsAnimating(false), animationDuration)
    }, 100)

    // Check if the live is active
    checkLiveStatus()

    return () => clearTimeout(animationTimer)
  }, [])

  const checkLiveStatus = async () => {
    try {
      // Replace 'iamvizzi' with the actual channel name
      const response = await fetch('https://kick.com/api/v1/channels/xqc')
      const data = await response.json()
      setIsLiveActive(data.livestream !== null)
    } catch (error) {
      console.error('Error checking live status:', error)
      setIsLiveActive(false)
    }
  }

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    // Non aggiorniamo lo stato durante il trascinamento
  }

  const handleStop = (e: DraggableEvent, data: DraggableData) => {
    setPosition({ x: data.x, y: data.y })
  }

  const handleSubmit = async (_e: React.FormEvent, _data: string) => {
    // Your function implementation
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Draggable 
        nodeRef={nodeRef}
        position={position} 
        onDrag={handleDrag}
        onStop={handleStop}
        bounds="parent" 
        handle=".drag-handle"
        disabled={isAnimating}
      >
        <div 
          ref={nodeRef}
          className="absolute inline-block overflow-hidden rounded-xl shadow-lg transition-all duration-300 ease-in-out"
          style={{ 
            width: 480, 
            height: 270,
            transition: isAnimating ? 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative w-full h-full">
            <div className={`responsive-iframe-container ${isHovered ? 'hovered' : ''}`}>
              <iframe 
                className="responsive-iframe"
                src="https://player.kick.com/xqc?autoplay=true?muted=false" 
                frameBorder="0" 
                scrolling="no" 
                allowFullScreen={true}
                allow="fullscreen; picture-in-picture"
              />
            </div>
            <div className="absolute top-2 left-2">
              <button 
                className="drag-handle w-8 h-8 bg-gray-800 bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-75 focus:outline-none transition-colors duration-200"
                title="Trascina per spostare"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </button>
            </div>
            {isHovered && (
              <div 
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  boxShadow: '0 0 0 3px #53FC18',
                  animation: 'pulse 2s infinite'
                }}
              />
            )}
          </div>
        </div>
      </Draggable>
      <style jsx>{`
        .responsive-iframe-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border: 3px solid transparent;
          border-radius: 0.75rem; // This matches the rounded-xl class
          transition: border-color 0.3s ease;
        }
        .responsive-iframe-container.hovered {
          border-color: #53FC18;
        }
        .responsive-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
          border-radius: 0.6rem; // Slightly smaller to fit inside the container
        }
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(83, 252, 24, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(83, 252, 24, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(83, 252, 24, 0);
          }
        }
      `}</style>
    </div>
  )
}