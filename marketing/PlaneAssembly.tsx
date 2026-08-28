'use client'

import { useEffect, useRef } from 'react'
import { animate } from 'animejs/animation'
import { createScope, type Scope } from 'animejs/scope'
import { onScroll } from 'animejs/events'

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
        style={{ maxWidth: '600px' }}
        fill="none"
        stroke={STROKE}
        strokeWidth={3}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* Tail fin */}
        <g className="plane-part-tailFin" style={partStyle}>
          <path d="M232,222 C195,175 130,95 75,25 L115,248 Z" />
        </g>

        {/* Tail stabilizer */}
        <g className="plane-part-tailStabilizer" style={partStyle}>
          <path d="M258,220 C280,200 300,175 316,150 L212,220 Z" />
        </g>

        {/* Wing */}
        <g className="plane-part-wing" style={partStyle}>
          <path d="M615,298 C602,320 590,340 580,358 C500,378 420,398 355,418 L398,388 C465,368 545,335 615,298 Z" />
        </g>

        {/* Engine */}
        <g className="plane-part-engine" style={partStyle}>
          <path d="M540,362 C540,345 563,334 590,334 C617,334 638,347 638,367 C638,387 617,400 590,400 C563,400 540,387 540,362 Z" />
        </g>

        {/* Nose gear */}
        <g className="plane-part-noseGear" style={partStyle}>
          <path d="M750,320 C750,335 750,350 750,362" />
          <circle cx="750" cy="373" r="10" />
        </g>

        {/* Main gear */}
        <g className="plane-part-mainGear" style={partStyle}>
          <path d="M335,335 C335,348 335,361 335,372" />
          <circle cx="335" cy="383" r="10" />
        </g>

        {/* Fuselage (stays put as the anchor piece) */}
        <path d="M860,298 C838,266 800,244 755,233 C690,218 400,213 235,220 C185,222 140,232 108,250 C96,257 90,264 88,270 C92,278 105,286 130,292 C220,312 380,330 520,340 C650,348 760,338 815,315 C835,308 850,304 860,298 Z" />

        {/* Canopy: windows + cockpit glass */}
        <g className="plane-part-canopy" style={partStyle}>
          <rect x="700" y="248" width="28" height="42" rx="8" />
          {[310, 348, 386, 424, 462, 500, 538, 576, 614, 652].map((cx) => (
            <circle key={cx} cx={cx} cy="277" r="10" />
          ))}
        </g>
      </svg>
    </div>
  )
}
