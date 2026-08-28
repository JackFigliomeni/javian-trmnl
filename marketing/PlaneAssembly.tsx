'use client'

import { useEffect, useRef } from 'react'
import { animate, createScope, onScroll, type Scope } from 'animejs'

const STROKE = '#3D2208'

type PartTransform = {
  x: number
  y: number
  rotate: number
}

const EXPLODE: Record<string, PartTransform> = {
  tailFin: { x: -55, y: -85, rotate: -30 },
  tailStabilizer: { x: -75, y: 55, rotate: 25 },
  wing: { x: -40, y: 130, rotate: 18 },
  engine: { x: 15, y: 175, rotate: 12 },
  noseGear: { x: 30, y: 120, rotate: -14 },
  mainGear: { x: -15, y: 130, rotate: 14 },
  canopy: { x: 0, y: -80, rotate: 0 },
}

const partStyle: React.CSSProperties = {
  transformBox: 'fill-box',
  transformOrigin: 'center',
}

export default function PlaneAssembly() {
  const root = useRef<HTMLDivElement>(null)
  const scope = useRef<Scope | null>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return

    scope.current = createScope({ root }).add(() => {
      Object.entries(EXPLODE).forEach(([part, target]) => {
        animate(`.plane-part-${part}`, {
          translateX: [0, target.x],
          translateY: [0, target.y],
          rotate: [0, target.rotate],
          ease: 'inOutQuad',
          autoplay: onScroll({
            target: el,
            sync: true,
            enter: 'center start',
            leave: 'center end',
          }),
        })
      })
    })

    return () => scope.current?.revert()
  }, [])

  return (
    <div ref={root} className="flex justify-center py-6">
      <svg
        viewBox="0 0 900 500"
        width="100%"
        style={{ maxWidth: '560px' }}
        fill="none"
        stroke={STROKE}
        strokeWidth={3.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* Tail fin */}
        <g className="plane-part-tailFin" style={partStyle}>
          <path d="M226,218 C190,175 155,130 142,92 L108,246 Z" />
        </g>

        {/* Tail stabilizer */}
        <g className="plane-part-tailStabilizer" style={partStyle}>
          <path d="M250,223 C268,206 286,192 300,180 L262,233 Z" />
        </g>

        {/* Wing */}
        <g className="plane-part-wing" style={partStyle}>
          <path d="M617,293 C605,315 592,336 581,356 C500,375 420,395 347,417 L400,381 C470,362 545,330 617,293 Z" />
        </g>

        {/* Engine */}
        <g className="plane-part-engine" style={partStyle}>
          <path d="M538,353 C538,336 561,325 587,325 C613,325 634,338 634,357 C634,376 613,389 587,389 C561,389 538,374 538,353 Z" />
        </g>

        {/* Nose gear */}
        <g className="plane-part-noseGear" style={partStyle}>
          <path d="M735,318 C735,330 735,342 735,352" />
          <circle cx="735" cy="363" r="10" />
        </g>

        {/* Main gear */}
        <g className="plane-part-mainGear" style={partStyle}>
          <path d="M335,330 C335,343 335,356 335,368" />
          <circle cx="335" cy="379" r="10" />
        </g>

        {/* Fuselage (stays put as the anchor piece) */}
        <path d="M864,300 C864,282 836,262 812,250 C772,229 720,220 650,217 C520,212 340,213 228,220 C188,222 142,232 108,250 C98,255 92,262 90,268 C104,290 132,304 168,312 C270,332 400,344 520,347 C630,350 730,344 800,322 C824,314 848,308 864,300 Z" />

        {/* Canopy: windows + cockpit glass */}
        <g className="plane-part-canopy" style={partStyle}>
          <rect x="700" y="250" width="26" height="40" rx="7" />
          {[314, 350, 386, 422, 458, 494, 530, 566, 602, 638].map((cx) => (
            <circle key={cx} cx={cx} cy="278" r="10" />
          ))}
        </g>
      </svg>
    </div>
  )
}
