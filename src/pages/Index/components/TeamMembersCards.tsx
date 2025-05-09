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

  const members: (Integrate)[] = team
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
        .filter((x): x is Integrate => !!x)
    : []

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
  const teamNameVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        delay: 0.5,
      },
    },
  }
  const backgroundBlurVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1, // La clase bg-pink-400/90 ya define la opacidad del color
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        delay: 0.4, // Retraso para empezar después del logo/nombre
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
          className="w-full overflow-hidden md:overflow-visible px-0 flex justify-center"
        >
          <div className="w-full max-w-6xl relative">
            <div className="relative flex items-center justify-center mb-10 pt-6 lg:pt-0 lg:mb-1 2xl:mb-10 2xl:pt-6">
              <div className="relative flex items-center w-fit overflow-visible">
                <motion.div
                  className="absolute blur-3xl bg-red-500/50 z-0 pointer-events-none"
                  variants={backgroundBlurVariants}
                  style={{
                    width: 'calc(100% + 8rem)',
                    height: 'calc(100% + 4rem)',
                    left: '-4rem',
                    top: '-2rem',
                    borderRadius: '50%',
                  }}
                />

                <motion.div
                  className="w-24 h-auto mr-4 logo-container-shine relative z-10"
                  variants={logoVariants}
                >
                  <img
                    src={`/images/teams/${team.teamlogo}`}
                    alt={team.teamname}
                    className="w-full h-auto block"
                  />
                </motion.div>

                <motion.h2
                  className="text-2xl font-bold uppercase text-white font-reaver relative z-10"
                  variants={teamNameVariants}
                >
                  {team.teamname}
                </motion.h2>
              </div>
            </div>
            <motion.div
              className="flex 2xl:grid 2xl:grid-cols-5 gap-4 md:gap-8 px-2 md:p-8 overflow-x-auto snap-x snap-mandatory w-full no-scrollbar 2xl:overflow-visible"
              variants={containerVariants}
              style={{
                overflowX: 'auto',
                maxWidth: '100%',
                boxSizing: 'border-box',
                paddingTop: '2.5rem',
                paddingBottom: '2rem',
              }}
            >
              {members.map((m, index) => (
                <motion.div
                  key={m.integrateid}
                  className="group bg-[#111111] rounded-xl p-4 md:p-6 flex flex-col items-center flex-shrink-0 w-[200px] md:w-auto snap-center mx-1 md:mx-0 mt-16"
                  variants={itemVariants}
                >
                  <div className="relative w-40 h-40 -mt-28 overflow-hidden rounded-xl">
                    <div className="z-0 transition-opacity duration-300 group-hover:opacity-0 rounded-xl">
                      <div className="relative rounded-xl">
                        <div className="absolute inset-0 bg-white rounded-xl" />
                        <div 
                          className="w-full h-[160px] shadow-xl relative z-10 bg-cover bg-center bg-no-repeat rounded-xl"
                          style={{ backgroundImage: `url(/images/integrates/${m.avatarImage})` }}
                          role="img"
                          aria-label={m.name}
                        />
                        {m.isLive && (
                          <>
                            <div className="absolute inset-0 border-3 rounded-xl border-green-500 z-20" />
                            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 transform bg-green-500 px-2 py-1 text-[10px] font-bold capitalize leading-[1.2] z-20">
                              LIVE
                            </span>
                          </>
                        )}
                      </div>
                    </div>
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

                    <div className="absolute w-0 h-0 border-t-[12px] border-t-red-700 border-r-[12px] border-r-transparent top-1 left-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute w-0 h-0 border-b-[12px] border-b-red-700 border-l-[12px] border-l-transparent bottom-1 right-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute w-0 h-0 border-t-[12px] border-t-red-700 border-l-[12px] border-l-transparent top-1 right-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute w-0 h-0 border-b-[12px] border-b-red-700 border-r-[12px] border-r-transparent bottom-1 left-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
