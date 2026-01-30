import { motion } from 'framer-motion'

export type CharacterEmotion = 'happy' | 'curious' | 'proud' | 'thoughtful' | 'excited'
export type CharacterName = 'coach' | 'user'

interface CharacterProps {
  name: CharacterName
  emotion: CharacterEmotion
  size?: number
}

export function Character({ name, emotion, size = 120 }: CharacterProps) {
  const isCoach = name === 'coach'

  return (
    <motion.div
      className="character-container"
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="character-svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Coach: Pot shape */}
        {isCoach && (
          <g filter="url(#glow)">
            {/* Pot body */}
            <ellipse cx="50" cy="55" rx="28" ry="22" fill="#c8ff00" />
            {/* Pot rim */}
            <ellipse cx="50" cy="33" rx="24" ry="7" fill="#c8ff00" />
            {/* Pot rim inner */}
            <ellipse cx="50" cy="33" rx="18" ry="5" fill="#b4e600" />
            {/* Pot shine */}
            <ellipse cx="38" cy="50" rx="6" ry="10" fill="rgba(255,255,255,0.3)" />

            {/* Face */}
            <CharacterFace emotion={emotion} />
          </g>
        )}

        {/* User: Person shape */}
        {!isCoach && (
          <g filter="url(#glow)">
            {/* Body */}
            <ellipse cx="50" cy="75" rx="20" ry="15" fill="#6366f1" />
            {/* Head */}
            <circle cx="50" cy="45" r="20" fill="#fcd34d" />
            {/* Hair */}
            <ellipse cx="50" cy="30" rx="18" ry="10" fill="#4b5563" />
            {/* Eyes bg */}
            <ellipse cx="43" cy="45" rx="5" ry="6" fill="white" />
            <ellipse cx="57" cy="45" rx="5" ry="6" fill="white" />

            <CharacterFace emotion={emotion} isUser />
          </g>
        )}

        {/* Floating sparkles for excited emotion */}
        {emotion === 'excited' && (
          <>
            <motion.circle
              cx="15"
              cy="20"
              r="3"
              fill="#fbbf24"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: 0,
              }}
            />
            <motion.circle
              cx="85"
              cy="15"
              r="2"
              fill="#fbbf24"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: 0.3,
              }}
            />
            <motion.circle
              cx="80"
              cy="85"
              r="2.5"
              fill="#fbbf24"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: 0.5,
              }}
            />
          </>
        )}
      </svg>
    </motion.div>
  )
}

interface CharacterFaceProps {
  emotion: CharacterEmotion
  isUser?: boolean
}

function CharacterFace({ emotion, isUser = false }: CharacterFaceProps) {
  const baseY = isUser ? 45 : 52

  return (
    <g>
      {/* Eyes */}
      {emotion === 'happy' && (
        <>
          <circle cx="40" cy={baseY - 7} r="4" fill="#1f2937" />
          <circle cx="60" cy={baseY - 7} r="4" fill="#1f2937" />
          {/* Eye shines */}
          <circle cx="41" cy={baseY - 8} r="1.5" fill="white" />
          <circle cx="61" cy={baseY - 8} r="1.5" fill="white" />
        </>
      )}

      {emotion === 'curious' && (
        <>
          <circle cx="40" cy={baseY - 7} r="5" fill="#1f2937" />
          <circle cx="60" cy={baseY - 7} r="5" fill="#1f2937" />
          {/* Eyebrows */}
          <path d="M35 62 L45 60" stroke="#1f2937" strokeWidth="2" />
          <path d="M55 60 L65 62" stroke="#1f2937" strokeWidth="2" />
        </>
      )}

      {emotion === 'proud' && (
        <>
          <path d="M35 48 Q40 45 45 48" stroke="#1f2937" strokeWidth="2" fill="none" />
          <path d="M55 48 Q60 45 65 48" stroke="#1f2937" strokeWidth="2" fill="none" />
        </>
      )}

      {emotion === 'thoughtful' && (
        <>
          <circle cx="40" cy={baseY - 7} r="3" fill="#1f2937" />
          <circle cx="60" cy={baseY - 9} r="3" fill="#1f2937" />
          {/* Thought bubble */}
          <g>
            <circle cx="75" cy="30" r="3" fill="rgba(0,0,0,0.2)" />
            <circle cx="80" cy="25" r="4" fill="rgba(0,0,0,0.15)" />
            <circle cx="87" cy="18" r="6" fill="rgba(0,0,0,0.1)" />
          </g>
        </>
      )}

      {emotion === 'excited' && (
        <>
          <circle cx="40" cy={baseY - 7} r="6" fill="#1f2937" />
          <circle cx="60" cy={baseY - 7} r="6" fill="#1f2937" />
          {/* Big eye shines */}
          <circle cx="42" cy={baseY - 9} r="2" fill="white" />
          <circle cx="62" cy={baseY - 9} r="2" fill="white" />
        </>
      )}

      {/* Mouth */}
      {emotion === 'happy' && (
        <path
          d="M42 58 Q50 66 58 58"
          stroke="#1f2937"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      )}

      {emotion === 'curious' && (
        <ellipse cx="50" cy="62" rx="4" ry="3" fill="#1f2937" />
      )}

      {emotion === 'proud' && (
        <path
          d="M38 58 Q50 70 62 58"
          stroke="#1f2937"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      )}

      {emotion === 'thoughtful' && (
        <line x1="47" y1="62" x2="53" y2="62" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
      )}

      {emotion === 'excited' && (
        <ellipse cx="50" cy="64" rx="8" ry="5" fill="#1f2937" />
      )}

      {/* Blush for cute emotions */}
      {(emotion === 'happy' || emotion === 'proud' || emotion === 'excited') && (
        <>
          <ellipse cx="32" cy="60" rx="5" ry="3" fill="rgba(244, 114, 182, 0.4)" />
          <ellipse cx="68" cy="60" rx="5" ry="3" fill="rgba(244, 114, 182, 0.4)" />
        </>
      )}
    </g>
  )
}
