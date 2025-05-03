// src/components/TeamMembersCards.tsx
import React from 'react'
import { useSelectedParticipantStore } from '@/stores/useSelectedParticipantStore'
import {
  useParticipantsStore,
  Participant,
} from '@/stores/useParticipantsStore'
import { useTeamsStore, Team } from '@/stores/useTeamsStore'
import { useIntegratesStore, Integrate } from '@/stores/useIntegratesStore'

export const TeamMembersCards: React.FC = () => {
  // 1) Who’s selected?
  const selectedId = useSelectedParticipantStore((s) => s.selectedId)

  // 2) Lookup that participant → to get their teamId
  const participant = useParticipantsStore((s) =>
    selectedId != null ? s.getById(selectedId) : undefined,
  )

  // 3) Lookup their team → to get the 5 integrateIds
  const team = useTeamsStore((s) =>
    participant ? s.getById(participant.teamId) : undefined,
  )

  // 4) Pull in all integrates & all participants lists
  const allIntegrates = useIntegratesStore((s) => s.integrates)
  const allParticipants = useParticipantsStore((s) => s.participants)

  // 5) Build your 5‐member array
  const members: (Integrate & { name: string })[] = team
    ? team.integrateIds
        .map((id) => {
          const integ = allIntegrates.find((i) => i.integrateid === id)
          if (!integ) return null
          // if they’re one of the original 8 captains, grab name from participants.json
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 p-8">
      {members.map((m) => (
        <div key={m.integrateid} className="flex flex-col items-center">
          <div className="relative w-40">
            {/* top‐left red triangle */}
            <div className="absolute w-0 h-0 border-t-[12px] border-t-red-500 border-r-[12px] border-r-transparent top-1 left-1 z-20" />
            {/* bottom‐right red triangle */}
            <div className="absolute w-0 h-0 border-b-[12px] border-b-red-500 border-l-[12px] border-l-transparent bottom-1 right-1 z-20" />
            {/* top-right red triangle */}
            <div className="absolute w-0 h-0 border-t-[12px] border-t-red-500 border-l-[12px] border-l-transparent top-1 right-1 z-20" />
            {/* bottom-left red triangle */}
            <div className="absolute w-0 h-0 border-b-[12px] border-b-red-500 border-r-[12px] border-r-transparent bottom-1 left-1 z-20" />

            <img
              className="w-full rounded-lg shadow-xl"
              src={`/src/assets/images/integrates/${m.avatarImage}`}
              alt={m.name}
            />
          </div>

          {/* Nickname in uppercase, wrapped in quotes */}
          <h3 className="mt-4 text-lg font-black uppercase tracking-wider text-white">
            {"'" + m.name.toUpperCase() + "'"}
          </h3>

          {/* If you have a separate fullName, show it here */}
          {/* <p className="text-sm text-gray-300">Clement Ivanov</p> */}

          <span className="mt-1 text-xs font-semibold text-red-500">
            {m.integrateid === team.teamleaderid
              ? 'CAPTAIN'
              : `POSITION ${m.laneposition}`}
          </span>
        </div>
      ))}
    </div>
  )
}
