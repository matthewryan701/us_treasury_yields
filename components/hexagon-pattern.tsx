"use client"

export function HexagonPattern() {
  return (
    <div className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden">
      <svg width="100%" height="300%" xmlns="http://www.w3.org/2000/svg" className="opacity-50">
        <defs>
          {/* Hexagon pattern */}
          <pattern id="hexagons" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
            {/* First hexagon */}
            <path
              d="M28 0 L56 16.6 L56 50 L28 66.6 L0 50 L0 16.6 Z"
              fill="none"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1"
            />
            {/* Second hexagon offset */}
            <path
              d="M28 66.6 L56 83.2 L56 116.6 L28 133.2 L0 116.6 L0 83.2 Z"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1"
            />
          </pattern>

          {/* Linear gradient for fade effect */}
          <linearGradient id="hexFade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="40%" stopColor="white" stopOpacity="0.6" />
            <stop offset="70%" stopColor="white" stopOpacity="0.2" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          {/* Mask using the gradient */}
          <mask id="fadeMask">
            <rect width="100%" height="100%" fill="url(#hexFade)" />
          </mask>
        </defs>

        {/* Apply pattern with fade mask */}
        <rect width="100%" height="100%" fill="url(#hexagons)" mask="url(#fadeMask)" />
      </svg>
    </div>
  )
}
