'use client'

import { useEffect, useRef } from 'react'
import { animate } from 'animejs/animation'
import { createScope, type Scope } from 'animejs/scope'
import { stagger } from 'animejs/utils'
import Image from 'next/image'
import Link from 'next/link'

export default function AnimatedHero() {
  const root = useRef<HTMLDivElement>(null)
  const scope = useRef<Scope | null>(null)

  useEffect(() => {
    scope.current = createScope({ root }).add(() => {
      animate('.hero-in', {
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 400,
        delay: stagger(50),
        ease: 'outQuad',
      })
    })

    return () => scope.current?.revert()
  }, [])

  return (
    <div ref={root}>
      {/* Top bar */}
      <div className="hero-in flex items-start justify-between mb-20" style={{ opacity: 0 }}>
        <p
          style={{
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: '#6B4226',
            textTransform: 'uppercase',
          }}
        >
          Professor Java&apos;s &nbsp;&middot;&nbsp; Catering &amp; Concierge &nbsp;&middot;&nbsp; Albany
        </p>
        <Image
          src="/professor-logo.png"
          alt="Professor Java's Logo"
          width={40}
          height={58}
          className="object-contain"
        />
      </div>

      {/* Headline */}
      <h1
        className="hero-in mb-8"
        style={{
          fontSize: 'clamp(32px, 6vw, 58px)',
          fontWeight: 500,
          color: '#2C1810',
          letterSpacing: '0.01em',
          lineHeight: 1.15,
          opacity: 0,
        }}
      >
        Professor Java&apos;s Inflight Catering and Concierge
      </h1>

      <p
        className="hero-in mb-6"
        style={{ fontSize: '22px', color: '#6B4226', lineHeight: 1.5, opacity: 0 }}
      >
        Catering from takeoff to touchdown.
      </p>

      <p
        className="hero-in mb-10 max-w-xl"
        style={{ fontSize: '17px', color: '#2C1810', lineHeight: 1.7, opacity: 0 }}
      >
        We prepare meals for clients and crew aboard private aircraft,
        coordinated around your flight schedule and delivered to your FBO.
        Personal shopping is also available on request.
      </p>

      {/* Sign in button */}
      <div className="hero-in mb-16" style={{ opacity: 0 }}>
        <Link
          href="/login"
          className="inline-block"
          style={{
            background: 'transparent',
            border: '1px solid #C4A882',
            color: '#6B4226',
            padding: '12px 24px',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
          }}
        >
          Client &amp; Staff Sign In →
        </Link>
      </div>
    </div>
  )
}
