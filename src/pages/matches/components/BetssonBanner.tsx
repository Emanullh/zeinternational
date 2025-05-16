// src/components/BetssonBanner.tsx
import { useEffect, useRef } from 'react'

const BETSSON_SRC =
  'https://c.bannerflow.net/a/66d093873ec9f495810c7169?did=657fff592225a91f2b2e2296&deeplink=on&adgroupid=66d093873ec9f495810c716b&redirecturl=https://record.betsson.com/_3kUZiOfSVrUyGSrLOh2Z7yMsVN57gzkV/1/&media=208754&campaign=1'

export default function BetssonBanner() {
  // El contenedor donde el script inyectará el banner
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Solo inyectamos el script en cliente (no SSR)
    if (!containerRef.current) return

    const script = document.createElement('script')
    script.src = BETSSON_SRC
    script.async = true

    // Limpieza previa por si el comp. se vuelve a montar
    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(script)

    // Limpieza al desmontar (buena práctica)
    return () => {
      containerRef.current?.replaceChildren()
    }
  }, [])

  // Puedes añadir estilos inline o una clase Tailwind para reservar espacio
  return (
    <div
      ref={containerRef}
      style={{ width: '100%', maxWidth: '728px', margin: '0 auto' }}
    />
  )
}
