import React, { useState, useEffect } from 'react'
import participants from '../../../data/participants.json'
import { useSelectedParticipantStore } from '@/stores/useSelectedParticipantStore'

const InteractiveCardSelector: React.FC = () => {
  const selectedId =
    useSelectedParticipantStore((s) => s.selectedId)?.toString() ?? '-1'
  const setSelectedId = useSelectedParticipantStore((s) => s.setSelectedId)
  const [hoverId, setHoverId] = useState<string>('-1')
  const participants_path = '/images/participants/'

  // Efecto para mostrar hover automático en cada tarjeta
  useEffect(() => {
    // Solo ejecutar al montar el componente
    if (selectedId === '-1') {
      let currentIndex = 0
      let timerId: NodeJS.Timeout

      const showNextHover = () => {
        if (currentIndex < participants.length) {
          setHoverId(participants[currentIndex].id.toString())

          // Mantener el hover por 150ms (reducido significativamente)
          timerId = setTimeout(() => {
            setHoverId('-1')

            // Esperar solo 50ms antes de pasar al siguiente
            setTimeout(() => {
              currentIndex++
              showNextHover()
            }, 50)
          }, 150)
        } else {
          // Al terminar con todos, volver al estado normal
          setHoverId('-1')
        }
      }

      // Iniciar la secuencia casi inmediatamente
      const initialTimer = setTimeout(showNextHover, 100)

      // Limpiar timers al desmontar
      return () => {
        clearTimeout(initialTimer)
        clearTimeout(timerId)
      }
    }
  }, [])

  return (
    // Añadido w-full aquí para restringir el ancho del contenedor scrollable
    <div className="w-full flex flex-nowrap overflow-x-auto p-4 md:flex-wrap md:justify-center md:space-x-0 md:overflow-visible">
      {participants.map((p) => {
        const isSelected = selectedId === p.id.toString()
        const isHovered = hoverId === p.id.toString()
        return (
          <div
            key={p.id}
            className={`
              relative flex-shrink-0 md:w-30 w-24 md:h-70 h-56 overflow-visible group cursor-pointer z-0 
              ${isHovered ? 'z-20' : ''}
              ${isSelected ? 'z-10' : ''}
            `}
            onClick={() => setSelectedId(p.id)}
            onMouseEnter={() => setHoverId(p.id.toString())}
            onMouseLeave={() => setHoverId('-1')}
          >
            {/* 1) Fondo "normal" */}
            <div
              className={`
                w-full h-full
                bg-no-repeat bg-top bg-cover
                filter grayscale brightness-75
                transition-all duration-300
                ${isSelected ? 'hidden' : 'group-hover:hidden'}
                ${isHovered ? 'hidden' : ''}
              `}
              style={{ backgroundImage: `url(${participants_path}${p.image})` }}
            />

            {/* 2) Fondo "expandido" */}
            <div
              className={`
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                bg-no-repeat bg-top bg-cover
                shadow-[0_0_10px_4px_rgba(255,0,0,0.7)]
                opacity-0 pointer-events-none w-full h-full
                transition-all duration-300 ease-out origin-center
                group-hover:opacity-100 group-hover:w-64 group-hover:h-80 group-hover:filter-none group-hover:pointer-events-auto group-hover:z-10
                ${isSelected ? 'opacity-100 w-64 h-80 filter-none pointer-events-auto z-10' : ''}
                ${isHovered ? 'opacity-100 w-64 h-80 filter-none pointer-events-auto z-10' : ''}
              `}
              style={{ backgroundImage: `url(${participants_path}${p.image})` }}
            />
          </div>
        )
      })}
    </div>
  )
}

export default InteractiveCardSelector
