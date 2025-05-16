import { useState, useEffect } from 'react'
import TournamentGroups from './components/TournamentGroups'
import MatchList from './components/MatchList'
import { useMatchesStore } from '../../stores/useMatchesStore'
import PlayoffsBracket from './components/PlayoffsBracket'
import PlayoffsMatchList from './components/PlayoffsMatchList'
import BetssonBanner from './components/BetssonBanner'
const TournamentView = () => {
  const { tournamentData } = useMatchesStore()

  // Avoid rendering before data is ready
  if (tournamentData.groups.length === 0) {
    return (
      <div className="text-center text-white p-8 font-notosans">
        Cargando datos del torneo...
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white pb-8 pt-24">
      <BetssonBanner />
      <div className="mb-6" />
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white uppercase tracking-[0.2em] font-notosans">
            Playoffs
          </h1>
          <div className="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] h-[2px] sm:h-[3px] md:h-[4px] lg:h-[5px] bg-[#ff6046] rounded-[1px] mt-4" />
        </div>

        <PlayoffsBracket />

        <div className="mt-12 mb-6">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white uppercase tracking-[0.2em] font-notosans">
              Fechas de Playoffs
            </h2>
            <div className="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] h-[2px] sm:h-[3px] md:h-[4px] lg:h-[5px] bg-[#ff6046] rounded-[1px] mt-4" />
          </div>

          <PlayoffsMatchList />
        </div>

        <div className="flex flex-col items-center mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white uppercase tracking-[0.2em] font-notosans">
            Posiciones del Torneo
          </h1>
          <div className="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] h-[2px] sm:h-[3px] md:h-[4px] lg:h-[5px] bg-[#ff6046] rounded-[1px] mt-4" />
        </div>

        <TournamentGroups />

        <div className="mt-12 mb-6">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white uppercase tracking-[0.2em] font-notosans">
              Fecha de partidas
            </h2>
            <div className="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] h-[2px] sm:h-[3px] md:h-[4px] lg:h-[5px] bg-[#ff6046] rounded-[1px] mt-4" />
          </div>

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
