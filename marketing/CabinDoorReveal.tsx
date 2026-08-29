'use client'

import { useEffect, useRef } from 'react'

const STROKE = '#3D2208'
const GOLD = '#C4A882'
const CREAM = '#F5EEE6'
const PARCHMENT = '#FBF7F2'

type ItemId = 'cup' | 'board' | 'croissant' | 'glass'

type ItemConfig = {
  id: ItemId
  start: { x: number; y: number; r: number; s: number }
  startAt: number
}

const ITEMS: ItemConfig[] = [
  { id: 'cup', start: { x: -160, y: 110, r: -35, s: 0.45 }, startAt: 0.3 },
  { id: 'board', start: { x: 170, y: 120, r: 30, s: 0.45 }, startAt: 0.38 },
  { id: 'croissant', start: { x: -150, y: -110, r: -30, s: 0.45 }, startAt: 0.46 },
  { id: 'glass', start: { x: 160, y: -120, r: 35, s: 0.45 }, startAt: 0.54 },
]

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export default function CabinDoorReveal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const doorRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Record<ItemId, SVGGElement | null>>({
    cup: null,
    board: null,
    croissant: null,
    glass: null,
  })
  const progressRef = useRef(0)
  const smoothedRef = useRef(0)

  useEffect(() => {
    let raf = 0
    let lastTime = performance.now()

    function updateProgress() {
      const el = containerRef.current
      if (el) {
        const rect = el.getBoundingClientRect()
        const raw = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
        progressRef.current = clamp(raw, 0, 1)
      }
      raf = requestAnimationFrame(updateProgress)
    }

    function render(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now

      const lambda = 6
      smoothedRef.current += (progressRef.current - smoothedRef.current) * (1 - Math.exp(-lambda * dt))
      const p = smoothedRef.current

      if (doorRef.current) {
        const doorT = easeOutCubic(clamp(p / 0.65, 0, 1))
        const rotateY = lerp(0, -112, doorT)
        doorRef.current.style.transform = `rotateY(${rotateY}deg)`
      }

      ITEMS.forEach((item) => {
        const g = itemRefs.current[item.id]
        if (!g) return
        const localT = easeOutCubic(clamp((p - item.startAt) / (1 - item.startAt), 0, 1))
        const x = lerp(item.start.x, 0, localT)
        const y = lerp(item.start.y, 0, localT)
        const r = lerp(item.start.r, 0, localT)
        const s = lerp(item.start.s, 1, localT)
        const op = lerp(0.15, 1, localT)
        g.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s})`
        g.style.opacity = String(op)
      })

      raf = requestAnimationFrame(render)
    }

    raf = requestAnimationFrame(updateProgress)
    const renderRaf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(renderRaf)
    }
  }, [])

  const itemStyle: React.CSSProperties = {
    transformBox: 'fill-box',
    transformOrigin: 'center',
    opacity: 0.15,
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full mx-auto"
      style={{ maxWidth: '700px', aspectRatio: '700 / 500', perspective: '1600px' }}
    >
      {/* interior scene */}
      <svg
        viewBox="0 0 700 500"
        className="absolute inset-0 w-full h-full"
        fill="none"
        stroke={STROKE}
        strokeWidth={3}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* doorframe */}
        <rect x="130" y="15" width="440" height="470" rx="52" />

        {/* tray */}
        <ellipse cx="350" cy="300" rx="195" ry="90" stroke={GOLD} strokeWidth={2.5} />

        {/* coffee cup */}
        <g transform="translate(255,220)">
          <g ref={(el) => { itemRefs.current.cup = el }} style={itemStyle}>
            <ellipse cx="0" cy="34" rx="38" ry="9" stroke={GOLD} strokeWidth={2} />
            <path d="M-24,-26 L24,-26 L18,26 C18,32 -18,32 -18,26 Z" />
            <path d="M22,-14 C42,-14 42,10 22,10" />
          </g>
        </g>

        {/* charcuterie board */}
        <g transform="translate(445,225)">
          <g ref={(el) => { itemRefs.current.board = el }} style={itemStyle}>
            <ellipse cx="0" cy="0" rx="70" ry="30" />
            <path d="M15,-12 L48,-2 L15,14 C8,8 8,-6 15,-12 Z" />
            <circle cx="-30" cy="-6" r="6" />
            <circle cx="-16" cy="4" r="6" />
            <circle cx="-32" cy="10" r="6" />
          </g>
        </g>

        {/* croissant */}
        <g transform="translate(270,350)">
          <g ref={(el) => { itemRefs.current.croissant = el }} style={itemStyle}>
            <path d="M-32,14 C-40,-14 -18,-32 8,-30 C32,-27 40,-6 30,14 C22,4 12,2 2,8 C-8,14 -20,20 -32,14 Z" />
            <path d="M-18,-6 C-6,-2 8,-2 20,-8" stroke={GOLD} strokeWidth={2} />
            <path d="M-14,6 C-2,10 12,10 24,4" stroke={GOLD} strokeWidth={2} />
          </g>
        </g>

        {/* champagne flute */}
        <g transform="translate(430,350)">
          <g ref={(el) => { itemRefs.current.glass = el }} style={itemStyle}>
            <path d="M-16,-32 C-16,-8 -6,4 0,6 C6,4 16,-8 16,-32 Z" />
            <line x1="0" y1="6" x2="0" y2="30" />
            <ellipse cx="0" cy="32" rx="14" ry="4" />
          </g>
        </g>
      </svg>

      {/* door panel */}
      <div
        ref={doorRef}
        className="absolute"
        style={{
          left: '18.57%',
          top: '3%',
          width: '62.86%',
          height: '94%',
          transformOrigin: '0% 50%',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          filter: 'drop-shadow(6px 6px 10px rgba(61,34,8,0.15))',
        }}
      >
        <svg
          viewBox="0 0 440 470"
          className="w-full h-full block"
          fill="none"
          stroke={STROKE}
          strokeWidth={3}
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          <rect x="3" y="3" width="434" height="464" rx="50" fill={CREAM} />
          <ellipse cx="220" cy="150" rx="72" ry="88" fill={PARCHMENT} />
          <rect x="350" y="250" width="58" height="16" rx="8" />
          <circle cx="350" cy="258" r="6" />
          <rect x="0" y="90" width="12" height="42" rx="4" fill={STROKE} />
          <rect x="0" y="230" width="12" height="42" rx="4" fill={STROKE} />
          <rect x="0" y="370" width="12" height="42" rx="4" fill={STROKE} />
        </svg>
      </div>
    </div>
  )
}
