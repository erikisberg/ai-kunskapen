"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ArrowRight, ChevronRight, ChevronLeft } from "lucide-react"
import { useJourney, type JourneyType } from "@/lib/journey-context"
import { cn } from "@/lib/utils"

interface FlowStep {
  label: string
  description: string
  icon?: string
}

interface FlowSlideProps {
  type: JourneyType
  title: string
  steps: FlowStep[]
}

// ============================================================
// ANIMATED SVG SCENES — one per concept
// ============================================================

function SceneTyping() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      {/* Laptop body */}
      <rect x="80" y="60" width="240" height="160" rx="12" fill="#1a1a1a" />
      <rect x="90" y="70" width="220" height="140" rx="6" fill="#2a2a2a" />

      {/* Screen content — chat interface */}
      <rect x="100" y="80" width="200" height="120" rx="4" fill="#1e1e2e" />

      {/* AI response bubble */}
      <rect x="110" y="90" width="120" height="30" rx="8" fill="#3a3a5a" />
      <motion.rect x="115" y="98" height="6" rx="3" fill="#7546FF" opacity="0.6"
        animate={{ width: [0, 50, 80, 110] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
      />
      <rect x="115" y="108" width="60" height="5" rx="2.5" fill="#4a4a6a" opacity="0.4" />

      {/* User typing bubble */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <rect x="160" y="135" width="130" height="30" rx="8" fill="#7546FF" />
        {/* Animated typing text */}
        <motion.rect x="170" y="145" height="5" rx="2.5" fill="white" opacity="0.9"
          animate={{ width: [0, 30, 60, 100] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 0.5 }}
        />
        {/* Blinking cursor */}
        <motion.rect y="143" width="2" height="10" rx="1" fill="white"
          animate={{ x: [170, 200, 230, 270], opacity: [1, 1, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 0.5 }}
        />
      </motion.g>

      {/* Laptop base */}
      <path d="M60 220 L80 220 L80 225 Q80 230 85 230 L315 230 Q320 230 320 225 L320 220 L340 220 Q345 220 343 225 L330 245 Q328 250 323 250 L77 250 Q72 250 70 245 L57 225 Q55 220 60 220Z" fill="#2a2a2a" />

      {/* Keyboard dots */}
      {[0,1,2,3,4].map(i => (
        <motion.circle key={i} cx={170 + i * 15} cy={235} r="2" fill="#4a4a4a"
          animate={{ fill: ["#4a4a4a", "#7546FF", "#4a4a4a"] }}
          transition={{ duration: 0.3, delay: i * 0.15, repeat: Infinity, repeatDelay: 2 }}
        />
      ))}
    </svg>
  )
}

function SceneSendToServer() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      {/* Phone on left */}
      <rect x="30" y="90" width="60" height="100" rx="8" fill="#1a1a1a" />
      <rect x="35" y="100" width="50" height="75" rx="4" fill="#2a2a4a" />
      <circle cx="60" cy="185" r="3" fill="#3a3a3a" />

      {/* Server rack on right */}
      <rect x="300" y="70" width="70" height="140" rx="6" fill="#1a1a1a" />
      {[0,1,2,3].map(i => (
        <g key={i}>
          <rect x="308" y={82 + i * 32} width="54" height="24" rx="3" fill="#2a2a2a" />
          <motion.circle cx="350" cy={94 + i * 32} r="3"
            animate={{ fill: ["#333", "#7546FF", "#333"] }}
            transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
          />
          <rect x="314" y={90 + i * 32} width="20" height="2" rx="1" fill="#3a3a3a" />
        </g>
      ))}

      {/* Animated data packets flying */}
      {[0, 1, 2].map(i => (
        <motion.g key={i}>
          <motion.rect
            width="16" height="10" rx="3" fill="#7546FF"
            initial={{ x: 95, y: 130 + i * 8, opacity: 0 }}
            animate={{
              x: [95, 150, 220, 295],
              y: [130 + i * 8, 115 + i * 15, 120 + i * 5, 135],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 1.8, delay: i * 0.4, repeat: Infinity, repeatDelay: 0.5, ease: "easeInOut" }}
          />
          {/* Packet glow */}
          <motion.rect
            width="16" height="10" rx="3" fill="#7546FF" opacity="0.3" filter="blur(4px)"
            initial={{ x: 95, y: 130 + i * 8 }}
            animate={{
              x: [95, 150, 220, 295],
              y: [130 + i * 8, 115 + i * 15, 120 + i * 5, 135],
              opacity: [0, 0.4, 0.4, 0],
            }}
            transition={{ duration: 1.8, delay: i * 0.4, repeat: Infinity, repeatDelay: 0.5, ease: "easeInOut" }}
          />
        </motion.g>
      ))}

      {/* Connection line */}
      <path d="M90 140 Q200 100 300 140" stroke="rgba(117,70,255,0.15)" strokeWidth="1.5" fill="none" strokeDasharray="6 4" />

      {/* Lock icon on path */}
      <motion.g animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
        <rect x="185" y="108" width="16" height="12" rx="2" fill="none" stroke="#7546FF" strokeWidth="1.5" opacity="0.5" />
        <path d="M189 108 L189 104 Q189 99 193 99 Q197 99 197 104 L197 108" fill="none" stroke="#7546FF" strokeWidth="1.5" opacity="0.5" />
      </motion.g>

      {/* Labels */}
      <text x="60" y="215" textAnchor="middle" fill="currentColor" opacity="0.3" fontSize="10" fontFamily="system-ui">Din enhet</text>
      <text x="335" y="230" textAnchor="middle" fill="currentColor" opacity="0.3" fontSize="10" fontFamily="system-ui">Datacenter</text>
    </svg>
  )
}

function SceneNeuralNetwork() {
  // 3-layer neural network visualization
  const layers = [
    [80, 100, 140, 180, 220],   // input
    [120, 160, 200],             // hidden
    [140, 180],                  // hidden 2
    [160],                       // output
  ]
  const layerX = [60, 160, 260, 350]

  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      {/* Connections */}
      {layers.map((layer, li) => {
        if (li === layers.length - 1) return null
        const nextLayer = layers[li + 1]
        return layer.map((y1, ni) =>
          nextLayer.map((y2, nj) => (
            <motion.line
              key={`${li}-${ni}-${nj}`}
              x1={layerX[li]} y1={y1}
              x2={layerX[li + 1]} y2={y2}
              stroke="#7546FF"
              strokeWidth="1"
              initial={{ opacity: 0.05 }}
              animate={{ opacity: [0.05, 0.3, 0.05] }}
              transition={{
                duration: 1.5,
                delay: li * 0.3 + (ni + nj) * 0.1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))
        )
      })}

      {/* Nodes */}
      {layers.map((layer, li) =>
        layer.map((y, ni) => (
          <g key={`node-${li}-${ni}`}>
            {/* Glow */}
            <motion.circle
              cx={layerX[li]} cy={y} r="12"
              fill="#7546FF"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.15, 0] }}
              transition={{
                duration: 1.5,
                delay: li * 0.4 + ni * 0.15,
                repeat: Infinity,
              }}
            />
            {/* Node */}
            <motion.circle
              cx={layerX[li]} cy={y} r="8"
              fill="#1a1a1a"
              stroke="#7546FF"
              strokeWidth="1.5"
              animate={{
                fill: ["#1a1a1a", "#7546FF", "#1a1a1a"],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                delay: li * 0.4 + ni * 0.15,
                repeat: Infinity,
              }}
            />
          </g>
        ))
      )}

      {/* Labels */}
      <text x={layerX[0]} y="255" textAnchor="middle" fill="currentColor" opacity="0.25" fontSize="9" fontFamily="system-ui">Input</text>
      <text x={(layerX[1] + layerX[2]) / 2} y="255" textAnchor="middle" fill="currentColor" opacity="0.25" fontSize="9" fontFamily="system-ui">Dolda lager</text>
      <text x={layerX[3]} y="255" textAnchor="middle" fill="currentColor" opacity="0.25" fontSize="9" fontFamily="system-ui">Output</text>

      {/* Scanning line */}
      <motion.line
        x1="40" x2="40" y1="70" y2="250"
        stroke="#7546FF" strokeWidth="1" opacity="0.1"
        animate={{ x1: [40, 380], x2: [40, 380] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  )
}

function SceneWordPrediction() {
  const words = ["Här", "är", "ett", "recept", "på", "pasta", "med", "fem", "ingredienser:"]
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      {/* Document background */}
      <rect x="60" y="40" width="280" height="220" rx="8" fill="#1a1a1a" />
      <rect x="70" y="50" width="260" height="200" rx="4" fill="#1e1e2e" />

      {/* Words appearing one by one */}
      {words.map((word, i) => {
        const row = Math.floor(i / 4)
        const col = i % 4
        const x = 85 + col * 62
        const y = 80 + row * 35
        return (
          <motion.g key={i}>
            {/* Word highlight */}
            <motion.rect
              x={x - 4} y={y - 12} rx="4"
              height="20"
              fill="#7546FF"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: [0, word.length * 7.5 + 8], opacity: [0, 0.2, 0.08] }}
              transition={{ duration: 0.6, delay: i * 0.35 + 0.5, repeat: Infinity, repeatDelay: words.length * 0.35 }}
            />
            {/* Word text */}
            <motion.text
              x={x} y={y}
              fill="white" fontSize="13" fontFamily="system-ui"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1] }}
              transition={{ duration: 0.3, delay: i * 0.35 + 0.5, repeat: Infinity, repeatDelay: words.length * 0.35 }}
            >
              {word}
            </motion.text>
          </motion.g>
        )
      })}

      {/* Blinking cursor at end */}
      <motion.rect
        x="85" y="143" width="2" height="16" rx="1" fill="#7546FF"
        animate={{
          x: [85, 147, 209, 271, 85, 147, 209, 271, 85],
          y: [68, 68, 68, 68, 103, 103, 103, 103, 138],
          opacity: [1, 1, 1, 1, 1, 1, 1, 1, 1],
        }}
        transition={{ duration: words.length * 0.35 + 0.5, repeat: Infinity, repeatDelay: 0.5, ease: "linear" }}
      />

      {/* Probability bars at bottom */}
      <text x="80" y="215" fill="white" opacity="0.15" fontSize="8" fontFamily="monospace">nästa ord:</text>
      {["pasta", "nudlar", "ris"].map((w, i) => (
        <g key={w}>
          <text x="80" y={228 + i * 14} fill="white" opacity="0.25" fontSize="9" fontFamily="monospace">{w}</text>
          <rect x="130" y={222 + i * 14} height="8" rx="2" fill="#333" width="120" />
          <motion.rect
            x="130" y={222 + i * 14} height="8" rx="2"
            fill={i === 0 ? "#7546FF" : "#444"}
            animate={{ width: [0, i === 0 ? 105 : i === 1 ? 45 : 20] }}
            transition={{ duration: 0.8, delay: 0.2, repeat: Infinity, repeatDelay: words.length * 0.35 }}
          />
          <motion.text
            x="255" y={229 + i * 14} fill="white" opacity="0.3" fontSize="8" fontFamily="monospace"
            animate={{ opacity: [0, 0.4] }}
            transition={{ duration: 0.5, delay: 0.5, repeat: Infinity, repeatDelay: words.length * 0.35 }}
          >
            {i === 0 ? "87%" : i === 1 ? "8%" : "3%"}
          </motion.text>
        </g>
      ))}
    </svg>
  )
}

function SceneStreaming() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      {/* Cloud/server */}
      <ellipse cx="200" cy="50" rx="60" ry="25" fill="#2a2a2a" />
      <rect x="160" y="50" width="80" height="30" fill="#2a2a2a" />
      <ellipse cx="200" cy="80" rx="60" ry="15" fill="#2a2a2a" />
      <motion.ellipse cx="200" cy="50" rx="60" ry="25" fill="none" stroke="#7546FF" strokeWidth="1"
        animate={{ opacity: [0.1, 0.4, 0.1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Stream of text blocks falling down */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <motion.rect
          key={i}
          width={20 + Math.random() * 30} height="8" rx="3"
          fill="#7546FF"
          initial={{ x: 180 + (i % 3) * 15 - 15, y: 85, opacity: 0 }}
          animate={{
            y: [85, 140, 200, 250],
            x: [180 + (i % 3) * 15 - 15, 60 + (i % 5) * 55, 60 + (i % 5) * 55, 60 + (i % 5) * 55],
            opacity: [0, 0.8, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            delay: i * 0.25,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: "easeIn",
          }}
        />
      ))}

      {/* Phone at bottom receiving */}
      <rect x="130" y="230" width="140" height="50" rx="8" fill="#1a1a1a" />
      <rect x="138" y="236" width="124" height="38" rx="4" fill="#1e1e2e" />

      {/* Text appearing on phone */}
      {[0, 1, 2].map(i => (
        <motion.rect
          key={i}
          x="145" y={243 + i * 10} height="5" rx="2" fill="#7546FF" opacity="0.5"
          animate={{ width: [0, 80 - i * 20] }}
          transition={{ duration: 1, delay: i * 0.3, repeat: Infinity, repeatDelay: 2 }}
        />
      ))}

      {/* Speed lines */}
      {[0, 1, 2].map(i => (
        <motion.line
          key={`speed-${i}`}
          x1={175 + i * 20} y1="100"
          x2={175 + i * 20} y2="220"
          stroke="#7546FF" strokeWidth="0.5" opacity="0"
          animate={{ opacity: [0, 0.15, 0] }}
          transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity, repeatDelay: 1.5 }}
        />
      ))}
    </svg>
  )
}

function SceneReview() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      {/* Document */}
      <rect x="100" y="30" width="200" height="180" rx="8" fill="#1a1a1a" />
      <rect x="108" y="38" width="184" height="164" rx="4" fill="#1e1e2e" />

      {/* Text lines */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <rect key={i} x="120" y={55 + i * 22} width={140 - (i % 3) * 30} height="6" rx="3" fill="#3a3a5a" opacity="0.4" />
      ))}

      {/* Scanning highlight */}
      <motion.rect
        x="115" width="175" height="22" rx="4" fill="#7546FF" opacity="0.08"
        animate={{ y: [48, 70, 92, 114, 136, 158, 48] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Checkmarks appearing */}
      {[0, 1, 2].map(i => (
        <motion.g key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0, 1, 1], scale: [0, 0, 1.2, 1] }}
          transition={{ duration: 4, delay: i * 1.2, repeat: Infinity }}
        >
          <circle cx="295" cy={60 + i * 45} r="10" fill="#22c55e" opacity="0.15" />
          <path
            d={`M${289} ${60 + i * 45} L${293} ${64 + i * 45} L${301} ${56 + i * 45}`}
            stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round"
          />
        </motion.g>
      ))}

      {/* Thumbs up at bottom */}
      <motion.g
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: [20, 20, 0, 0], opacity: [0, 0, 1, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <circle cx="200" cy="250" r="22" fill="#7546FF" opacity="0.1" />
        <text x="200" y="257" textAnchor="middle" fontSize="22">
          &#x1F44D;
        </text>
      </motion.g>
    </svg>
  )
}

// Scam flow scenes
function SceneVoiceCapture() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      {/* Phone */}
      <rect x="160" y="60" width="80" height="140" rx="12" fill="#1a1a1a" />
      <rect x="167" y="75" width="66" height="110" rx="6" fill="#2a2a4a" />

      {/* Video playing on phone */}
      <rect x="175" y="85" width="50" height="35" rx="3" fill="#1e1e2e" />
      <polygon points="195,97 195,112 210,104.5" fill="#7546FF" opacity="0.6" />

      {/* Sound waves emanating */}
      {[0, 1, 2, 3].map(i => (
        <motion.path
          key={i}
          d={`M${250 + i * 15} 100 Q${255 + i * 15} 130 ${250 + i * 15} 160`}
          stroke="#F8FE22" strokeWidth="1.5" fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
        />
      ))}

      {/* "3 sec" label */}
      <motion.g animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
        <rect x="170" y="210" width="60" height="20" rx="10" fill="#F8FE22" opacity="0.2" />
        <text x="200" y="224" textAnchor="middle" fill="currentColor" opacity="0.5" fontSize="10" fontFamily="monospace">3 sek</text>
      </motion.g>
    </svg>
  )
}

function SceneAIClone() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      {/* Original voice wave left */}
      <g>
        {[0,1,2,3,4,5,6,7].map(i => (
          <motion.rect
            key={`orig-${i}`}
            x={50 + i * 12} width="6" rx="3" fill="#F8FE22" opacity="0.5"
            animate={{ height: [10, 20 + Math.random() * 30, 10], y: [145, 130 - Math.random() * 15, 145] }}
            transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity }}
          />
        ))}
        <text x="100" y="190" textAnchor="middle" fill="currentColor" opacity="0.3" fontSize="9">Original</text>
      </g>

      {/* AI processing in center */}
      <motion.g>
        <rect x="170" y="100" width="60" height="60" rx="12" fill="#1a1a1a" />
        <motion.rect x="170" y="100" width="60" height="60" rx="12" fill="none" stroke="#F8FE22" strokeWidth="1"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {/* Brain/chip icon */}
        <text x="200" y="138" textAnchor="middle" fontSize="24">&#x1F9E0;</text>
      </motion.g>

      {/* Arrow left to center */}
      <motion.line x1="150" y1="130" x2="170" y2="130" stroke="#F8FE22" strokeWidth="1.5" opacity="0.3"
        animate={{ opacity: [0.1, 0.5, 0.1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />

      {/* Arrow center to right */}
      <motion.line x1="230" y1="130" x2="250" y2="130" stroke="#F8FE22" strokeWidth="1.5" opacity="0.3"
        animate={{ opacity: [0.1, 0.5, 0.1] }}
        transition={{ duration: 1, delay: 0.5, repeat: Infinity }}
      />

      {/* Cloned voice wave right */}
      <g>
        {[0,1,2,3,4,5,6,7].map(i => (
          <motion.rect
            key={`clone-${i}`}
            x={260 + i * 12} width="6" rx="3" fill="#ef4444" opacity="0.5"
            animate={{ height: [10, 20 + Math.random() * 30, 10], y: [145, 130 - Math.random() * 15, 145] }}
            transition={{ duration: 0.8, delay: i * 0.1 + 0.5, repeat: Infinity }}
          />
        ))}
        <text x="310" y="190" textAnchor="middle" fill="#ef4444" opacity="0.5" fontSize="9">Klon</text>
      </g>

      {/* "identical" indicator */}
      <motion.text x="200" y="210" textAnchor="middle" fill="currentColor" opacity="0.2" fontSize="9" fontFamily="monospace"
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        99.7% matchning
      </motion.text>
    </svg>
  )
}

// Scene selector
const learnScenes = [SceneTyping, SceneSendToServer, SceneNeuralNetwork, SceneWordPrediction, SceneStreaming, SceneReview]
const scamScenes = [SceneVoiceCapture, SceneAIClone, SceneVoiceCapture, SceneAIClone, SceneVoiceCapture, SceneAIClone]

function getScene(type: JourneyType, index: number) {
  const scenes = type === "learn" ? learnScenes : scamScenes
  const Scene = scenes[index % scenes.length]
  return <Scene />
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function FlowSlide({ type, title, steps }: FlowSlideProps) {
  const { nextStep, markCurrentStepComplete } = useJourney()
  const [activeStep, setActiveStep] = useState(0)
  const allRevealed = activeStep >= steps.length - 1

  const handleNext = () => {
    if (activeStep < steps.length - 1) setActiveStep(prev => prev + 1)
  }

  const handlePrev = () => {
    if (activeStep > 0) setActiveStep(prev => prev - 1)
  }

  const handleContinue = () => {
    markCurrentStepComplete()
    nextStep()
  }

  const step = steps[activeStep]
  const color = type === "learn" ? "primary" : "accent"

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center overflow-auto">
        <div className="w-full max-w-lg px-6 py-8">
          {/* Illustration */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="w-full aspect-[4/3] mb-6 rounded-2xl bg-foreground/[0.02] border border-foreground/[0.04] overflow-hidden"
            >
              {getScene(type, activeStep)}
            </motion.div>
          </AnimatePresence>

          {/* Step counter */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className={cn(
              "text-xs font-mono px-2.5 py-1 rounded-full",
              type === "learn" ? "bg-primary/10 text-primary" : "bg-accent/10 text-foreground"
            )}>
              {activeStep + 1} / {steps.length}
            </span>
          </div>

          {/* Title + description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-8"
            >
              <h3 className="font-semibold text-lg mb-2">{step.label}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                {step.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-3">
            {activeStep > 0 && (
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {!allRevealed ? (
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "inline-flex items-center gap-2 px-7 py-3 rounded-full font-medium",
                  type === "learn" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
                )}
              >
                Nästa steg
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                onClick={handleContinue}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "inline-flex items-center gap-2 px-7 py-3 rounded-full font-medium",
                  type === "learn" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
                )}
              >
                Fortsätt
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 mt-6">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => i <= activeStep && setActiveStep(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === activeStep ? "w-6" : "w-1.5",
                  i <= activeStep && type === "learn" && "bg-primary",
                  i <= activeStep && type === "safe" && "bg-accent",
                  i > activeStep && "bg-foreground/10",
                  i <= activeStep && "cursor-pointer",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
