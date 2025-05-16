// src/components/BetssonBanner.tsx
import { useEffect, useRef, useState } from 'react'

const BETSSON_SRC_DESKTOP =
  'https://c.bannerflow.net/a/66d093873ec9f495810c7169?did=657fff592225a91f2b2e2296&deeplink=on&adgroupid=66d093873ec9f495810c716b&redirecturl=https://record.betsson.com/_3kUZiOfSVrUyGSrLOh2Z7yMsVN57gzkV/1/&media=208754&campaign=1'

const BETSSON_SRC_MOBILE =
  'https://c.bannerflow.net/a/66d093873ec9f495810c7168?did=657fff592225a91f2b2e2296&deeplink=on&adgroupid=66d093873ec9f495810c716b&redirecturl=https://record.betsson.com/_3kUZiOfSVrUyGSrLOh2Z72RE1tCYoFqI/1/&media=208753&campaign=1'

export default function BetssonBanner() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check initial screen size
    checkScreenSize()

    // Add resize listener
    window.addEventListener('resize', checkScreenSize)

    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const script = document.createElement('script')
    script.src = isMobile ? BETSSON_SRC_MOBILE : BETSSON_SRC_DESKTOP
    script.async = true

    // Limpieza previa por si el comp. se vuelve a montar
    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(script)

    // Limpieza al desmontar (buena práctica)
    return () => {
      containerRef.current?.replaceChildren()
    }
  }, [isMobile])

  // Puedes añadir estilos inline o una clase Tailwind para reservar espacio
  return (
    <div
      ref={containerRef}
      style={{ width: '100%', maxWidth: '728px', margin: '0 auto' }}
    />
  )
}
