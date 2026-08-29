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
          <path d="M225,220 C185,175 120,80 68,15 L108,250 Z" />
        </g>

        {/* Tail stabilizer */}
        <g className="plane-part-tailStabilizer" style={partStyle}>
          <path d="M280,218 C300,200 315,183 330,165 L235,222 Z" />
        </g>

        {/* Wing */}
        <g className="plane-part-wing" style={partStyle}>
          <path d="M620,296 L575,345 L358,418 L400,385 Z" />
        </g>

        {/* Engine */}
        <g className="plane-part-engine" style={partStyle}>
          <path d="M555,378 C555,361 578,350 605,350 C632,350 653,363 653,383 C653,403 632,416 605,416 C578,416 555,403 555,378 Z" />
        </g>

        {/* Nose gear */}
        <g className="plane-part-noseGear" style={partStyle}>
          <path d="M750,330 C750,345 750,360 750,372" />
          <circle cx="750" cy="383" r="10" />
        </g>

        {/* Main gear */}
        <g className="plane-part-mainGear" style={partStyle}>
          <path d="M330,345 C330,358 330,371 330,382" />
          <circle cx="330" cy="393" r="10" />
        </g>

        {/* Fuselage (stays put as the anchor piece) */}
        <path d="M862,300 C838,266 800,244 755,233 C690,218 400,213 235,220 C185,222 140,232 108,250 L65,262 C90,272 105,282 130,292 C220,312 380,330 520,340 C650,348 760,338 815,315 C835,308 850,304 860,298 Z" />

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
