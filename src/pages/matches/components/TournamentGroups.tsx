import { useState, useMemo } from 'react'
import { useMatchesStore } from '../../../stores/useMatchesStore'
import GroupStandings from './GroupStandings'
import Crosstable from './Crosstable'

const TournamentGroups = () => {
  const { tournamentData } = useMatchesStore()

  // Use a memoized version of groups to prevent unnecessary rerenders
  const groups = useMemo(() => tournamentData.groups, [tournamentData.groups])

  if (groups.length === 0) {
    return (
      <div className="text-center text-white p-8">
        No hay grupos disponibles en el torneo
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-12 mx-auto max-w-6xl p-4">
      {groups.map((group) => (
        <div key={group.id} className="flex flex-col">
          <h2 className="text-xl font-black text-center mb-6 text-[#ff6046] uppercase tracking-wide font-reaver">
            {group.name}
          </h2>
          <div className="flex flex-col lg:flex-row gap-6 justify-center">
            <div className="flex-shrink-0">
              <GroupStandings groupId={group.id} />
            </div>
            <div className="flex-grow">
              <Crosstable groupId={group.id} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TournamentGroups
