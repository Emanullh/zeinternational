import { useState, useEffect } from 'react'
import TournamentGroups from './components/TournamentGroups'
import MatchList from './components/MatchList'
import { useMatchesStore } from '../../stores/useMatchesStore'

const TournamentView = () => {
  const { tournamentData } = useMatchesStore()

  // Avoid rendering before data is ready
  if (tournamentData.groups.length === 0) {
    return (
      <div className="text-center text-white p-8">
        Cargando datos del torneo...
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white pb-8 pt-24">
      <div className="container mx-auto">
        <h1 className="text-3xl font-black text-center mb-8 text-[#ff6046] uppercase tracking-wide font-reaver">
          Posiciones del Torneo
        </h1>

        <TournamentGroups />

        <div className="mt-12 mb-6">
          <h2 className="text-2xl font-black text-center mb-6 text-[#ff6046] uppercase tracking-wide font-reaver">
            Partidos por Grupo
          </h2>

          <div className="flex flex-col md:flex-row justify-center gap-8">
            {tournamentData.groups.map((group) => (
              <div key={group.id} className="flex justify-center">
                <MatchList groupId={group.id} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TournamentView
