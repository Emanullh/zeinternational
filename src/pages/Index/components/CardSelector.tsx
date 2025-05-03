import React, { useState } from 'react'
import participants from '../../../data/participants.json'
import { useSelectedParticipantStore } from '@/stores/useSelectedParticipantStore'

const InteractiveCardSelector: React.FC = () => {
  const selectedId =
    useSelectedParticipantStore((s) => s.selectedId)?.toString() ?? '-1'
  const setSelectedId = useSelectedParticipantStore((s) => s.setSelectedId)
  const [hoverId, setHoverId] = useState<string>('-1') // Nueva variable de estado
  const participants_path = '/images/participants/'

  return (
    <div className="flex flex-wrap justify-center p-4">
      {participants.map((p) => {
        const isSelected = selectedId === p.id.toString()
        const isHovered = hoverId === p.id.toString() // Puedes usar isHovered si lo necesitas
        return (
          <div
            key={p.id}
            className={`
              relative flex-shrink-0 w-30 h-70 overflow-visible group cursor-pointer z-0
              ${isHovered ? 'z-20' : ''}
              ${isSelected ? 'z-10' : ''}
            `}
            onClick={() => setSelectedId(p.id)}
            onMouseEnter={() => setHoverId(p.id.toString())} // Al entrar hover
            onMouseLeave={() => setHoverId('-1')} // Al salir hover
          >
            {/* 1) Fondo “normal” */}
            <div
              className={`
                w-full h-full
                bg-no-repeat bg-center bg-auto
                filter grayscale brightness-75
                transition-all duration-300
                ${isSelected ? 'hidden' : 'group-hover:hidden'}
              `}
              style={{ backgroundImage: `url(${participants_path}${p.image})` }}
            />

            {/* 2) Fondo “expandido” */}
            <div
              className={`
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                bg-no-repeat bg-center bg-auto
                shadow-[0_0_10px_4px_rgba(255,0,0,0.7)]
                opacity-0 pointer-events-none w-full h-full
                transition-all duration-300 ease-out origin-center
                group-hover:opacity-100 group-hover:w-64 group-hover:h-80 group-hover:filter-none group-hover:pointer-events-auto group-hover:z-10
                ${isSelected ? 'opacity-100 w-64 h-80 filter-none pointer-events-auto z-10' : ''}
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
