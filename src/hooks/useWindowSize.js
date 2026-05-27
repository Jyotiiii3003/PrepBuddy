import { useState, useEffect } from 'react'

export function useWindowSize() {
  const [size, setSize] = useState({
    width:  window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return size
}

export function useIsMobile() {
  const { width } = useWindowSize()
  return width < 768
}