'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { animate, createScope, onScroll, type Scope } from 'animejs'

export default function ScrollReveal({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const root = useRef<HTMLDivElement>(null)
  const scope = useRef<Scope | null>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return

    scope.current = createScope({ root }).add(() => {
      animate(el, {
        opacity: [0, 1],
        translateY: [24, 0],
        duration: 400,
        ease: 'outQuad',
        autoplay: onScroll({
          target: el,
          repeat: false,
        }),
      })
    })

    return () => scope.current?.revert()
  }, [])

  return (
    <div ref={root} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  )
}
