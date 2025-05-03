// src/components/TeamMembersCards.tsx
import React from 'react'
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
            name: p ? p.name : `Player ${id}`,
          }
        })
        .filter((x): x is Integrate & { name: string } => !!x)
    : []

  if (!team) {
    return (
      <div className="py-16 text-center text-gray-400">
        Selecciona un equipo para ver sus miembros
      </div>
    )
  }

  return (
    <>
      {/* Team header: logo and uppercase name */}
      <div className="flex items-center mb-10">
        <img
          src={`/src/assets/images/teams/${team.teamlogo}`}
          alt={team.teamname}
          className="w-24 h-auto mr-4"
        />
        <h2 className="text-2xl font-bold uppercase text-white font-reaver">
          {team.teamname}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 p-8">
        {members.map((m) => (
          <div
            key={m.integrateid}
            className="group bg-[#111111] rounded-xl p-6 flex flex-col items-center"
          >
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
              {"'" + m.name.toUpperCase() + "'"}
            </h3>

            <span className="mt-1 text-xs font-semibold text-red-500 font-notosans">
              {m.integrateid === team.teamleaderid
                ? 'CAPITAN'
                : `POSICIÓN ${m.laneposition}`}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}
