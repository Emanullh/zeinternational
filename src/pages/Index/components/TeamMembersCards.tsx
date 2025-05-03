// src/components/TeamMembersCards.tsx

import React from 'react'
import { motion, AnimatePresence } from 'motion/react'

import { useSelectedParticipantStore } from '@/stores/useSelectedParticipantStore'
import { useParticipantsStore } from '@/stores/useParticipantsStore'
import { useTeamsStore } from '@/stores/useTeamsStore'
import { useIntegratesStore, Integrate } from '@/stores/useIntegratesStore'

export const TeamMembersCards: React.FC = () => {
  const selectedId = useSelectedParticipantStore((s) => s.selectedId)
  const participant = useParticipantsStore((s) =>
    selectedId != null ? s.getById(selectedId) : undefined,
  )
  const team = useTeamsStore((s) =>
    participant ? s.getById(participant.teamId) : undefined,
  )
  const allIntegrates = useIntegratesStore((s) => s.integrates)
  const allParticipants = useParticipantsStore((s) => s.participants)

  const members: (Integrate & { name: string })[] = team
    ? team.integrateIds
        .map((id) => {
          const integ = allIntegrates.find((i) => i.integrateid === id)
          if (!integ) return null
          const p = allParticipants.find((p) => p.id === id)
          return {
            ...integ,
            name: p ? p.name : integ.name || `Player ${id}`,
          }
        })
        .filter((x): x is Integrate & { name: string } => !!x)
    : []

  // --- Variantes de Animación Tarjetas ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  }
  // --- Fin Variantes Tarjetas ---

  // --- Variantes Animación Logo ---
  const logoVariants = {
    hidden: {
      opacity: 0,
      y: -150, // Empieza 150px por encima
    },
    visible: {
      opacity: 1,
      y: 0, // Cae a su posición final
      transition: {
        type: 'spring', // Para el rebote
        stiffness: 80,
        damping: 8,
        mass: 0.8,
        delay: 0.2,
      },
    },
  }
  // --- Fin Variantes Logo ---

  // --- Variantes Nombre Equipo ---
  const teamNameVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        delay: 0.5, // Empieza un poco después del logo
      },
    },
  }
  // --- Fin Variantes Nombre Equipo ---
  // 👇 NUEVAS VARIANTES PARA EL BRILLO 👇
  const backgroundBlurVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1, // La clase bg-pink-400/90 ya define la opacidad del color
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        delay: 1.3, // Retraso para empezar después del logo/nombre
      },
    },
  }
  return (
    <AnimatePresence mode="wait">
      {!team ? (
        <motion.div
          key="no-team-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="py-16 text-center text-gray-400"
        >
          Selecciona un equipo para ver sus miembros
        </motion.div>
      ) : (
        <motion.div
          key={team.teamid}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Team header: logo and uppercase name */}
          {/* 👇 SE AÑADIÓ justify-center AQUÍ 👇 */}
          <div className="relative flex items-center justify-center mb-10">
            <div className="relative flex items-center w-fit">
              {/* Elemento del Brillo: Ahora está DENTRO del wrapper */}
              {/* 'left-0 right-0' ahora se refieren al ancho del wrapper */}
              {/* 'z-0' lo pone detrás del logo y nombre */}
              {/* 👇 Elemento del Brillo AHORA ES motion.div y usa variantes 👇 */}
              <motion.div
                className="absolute top-0 bottom-0 left-0 right-0 blur-2xl bg-red-500/50 z-0 pointer-events-none"
                variants={backgroundBlurVariants}
                // initial="hidden" // Heredado del padre
                // animate="visible" // Heredado del padre
              />

              {/* Contenedor del Logo: Ya no necesita ser 'relative' para el brillo */}
              {/* 'relative z-10' (opcional) asegura que esté sobre el brillo z-0 */}
              <motion.div
                className="w-24 h-auto mr-4 logo-container-shine relative z-10" // Añadido relative z-10
                variants={logoVariants}
              >
                <img
                  src={`/src/assets/images/teams/${team.teamlogo}`}
                  alt={team.teamname}
                  className="w-full h-auto block"
                />
              </motion.div>

              {/* Nombre del Equipo */}
              {/* 'relative z-10' (opcional) asegura que esté sobre el brillo z-0 */}
              <motion.h2
                className="text-2xl font-bold uppercase text-white font-reaver relative z-10" // Añadido relative z-10
                variants={teamNameVariants}
              >
                {team.teamname}
              </motion.h2>
            </div>
          </div>

          {/* Grid container con animación */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 p-8"
            variants={containerVariants}
          >
            {members.map((m) => (
              // Card individual con animación
              <motion.div
                key={m.integrateid}
                className="group bg-[#111111] rounded-xl p-6 flex flex-col items-center"
                variants={itemVariants}
              >
                {/* ... Contenido de la tarjeta sin cambios ... */}
                <div className="relative w-40 h-40 -mt-16 overflow-hidden">
                  {/* Avatar (hides on hover) */}
                  <div className="z-0 transition-opacity duration-300 group-hover:opacity-0">
                    <img
                      className="w-full rounded-lg shadow-xl"
                      src={`/src/assets/images/integrates/${m.avatarImage}`}
                      alt={m.name}
                    />
                  </div>
                  {/* Overlay info (appears on hover) */}
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black bg-opacity-75 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 cursor-pointer">
                    <p className="text-sm text-white">MMR: {m.mmr}</p>
                    <a
                      href={m.kickUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 text-xs font-semibold text-[#ff6046] underline"
                    >
                      Ver en Kick
                    </a>
                  </div>

                  {/* Decorative triangles */}
                  <div className="absolute w-0 h-0 border-t-[12px] border-t-red-700 border-r-[12px] border-r-transparent top-1 left-1 z-20" />
                  <div className="absolute w-0 h-0 border-b-[12px] border-b-red-700 border-l-[12px] border-l-transparent bottom-1 right-1 z-20" />
                  <div className="absolute w-0 h-0 border-t-[12px] border-t-red-700 border-l-[12px] border-l-transparent top-1 right-1 z-20" />
                  <div className="absolute w-0 h-0 border-b-[12px] border-b-red-700 border-r-[12px] border-r-transparent bottom-1 left-1 z-20" />
                </div>

                <h3 className="mt-4 text-lg font-black uppercase tracking-wider text-white font-notosans">
                  {`'${m.name.toUpperCase()}'`}
                </h3>

                <span className="mt-1 text-xs font-semibold text-red-500 font-notosans">
                  {m.integrateid === team.teamleaderid
                    ? 'CAPITAN'
                    : `POSICIÓN ${m.laneposition}`}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
