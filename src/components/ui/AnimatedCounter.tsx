import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  value: number
  className?: string
}

export default function AnimatedCounter({ value, className = '' }: AnimatedCounterProps) {
  const [display, setDisplay] = useState(value)
  const prevRef = useRef(value)

  useEffect(() => {
    const start = prevRef.current
    const end   = value
    if (start === end) return

    const duration = 400
    const startTime = performance.now()

    const step = (now: number) => {
      const elapsed  = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(start + (end - start) * eased))
      if (progress < 1) requestAnimationFrame(step)
      else prevRef.current = end
    }

    requestAnimationFrame(step)
  }, [value])

  return <span className={className}>{display}</span>
}
