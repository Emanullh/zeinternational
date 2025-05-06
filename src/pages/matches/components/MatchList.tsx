import { useState, useMemo } from 'react'
import { useMatchesStore, Match } from '../../../stores/useMatchesStore'
import { useTeamsStore } from '../../../stores/useTeamsStore'

interface MatchListProps {
  groupId: number
}

const MatchCard = ({ match }: { match: Match }) => {
  // Use the store once, outside of render calculations
  const { getById } = useTeamsStore()
  const teamA = getById(match.teamAId)
  const teamB = getById(match.teamBId)

  if (!teamA || !teamB) return null

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="bg-[#111111] border border-[#333] rounded-lg overflow-hidden mb-4">
      <div className="bg-black text-white text-sm py-2 px-4">
        <span className="text-gray-400">Fecha del Partido:</span>{' '}
        {formatDate(match.date)}
      </div>
      <div className="p-4 flex items-center justify-between">
        <div className="flex flex-col items-center w-2/5">
          <img
            src={`/images/teams/${teamA.teamlogo}`}
            alt={teamA.teamname}
            className="h-16 w-16 mb-2"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src =
                '/images/teams/team_logo.webp'
            }}
          />
          <span className="text-white text-center font-medium text-sm">
            {teamA.teamname}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-3xl font-black text-white mb-2">
            <span
              className={
                match.scoreA > match.scoreB ? 'text-green-500' : 'text-white'
              }
            >
              {match.scoreA}
            </span>
            <span className="mx-2">-</span>
            <span
              className={
                match.scoreB > match.scoreA ? 'text-green-500' : 'text-white'
              }
            >
              {match.scoreB}
            </span>
          </div>
          <span className="text-gray-400 text-xs">Marcador Final</span>
        </div>

        <div className="flex flex-col items-center w-2/5">
          <img
            src={`/images/teams/${teamB.teamlogo}`}
            alt={teamB.teamname}
            className="h-16 w-16 mb-2"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src =
                '/images/teams/team_logo.webp'
            }}
          />
          <span className="text-white text-center font-medium text-sm">
            {teamB.teamname}
          </span>
        </div>
      </div>
    </div>
  )
}

const MatchList = ({ groupId }: MatchListProps) => {
  const { getMatchesByGroupId, getGroupById } = useMatchesStore()

  // Use useMemo to prevent recalculations on every render
  const matches = useMemo(
    () => getMatchesByGroupId(groupId),
    [groupId, getMatchesByGroupId],
  )
  const group = useMemo(() => getGroupById(groupId), [groupId, getGroupById])

  // Calculate matchesByDate with useMemo to avoid recalculations
  const { matchesByDate, sortedDates } = useMemo(() => {
    const matchesByDate: Record<string, Match[]> = {}

    matches.forEach((match) => {
      if (!matchesByDate[match.date]) {
        matchesByDate[match.date] = []
      }
      matchesByDate[match.date].push(match)
    })

    // Sort dates
    const sortedDates = Object.keys(matchesByDate).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime()
    })

    return { matchesByDate, sortedDates }
  }, [matches])

  if (matches.length === 0) {
    return (
      <div className="bg-[#0D0D0D] rounded-xl p-4 w-full max-w-md text-center text-gray-400">
        No se encontraron partidas para este grupo
      </div>
    )
  }

  return (
    <div className="bg-[#0D0D0D] rounded-xl p-4 w-full max-w-md">
      <h2 className="font-black uppercase tracking-wider text-[#ff6046] text-xl mb-4 text-center font-reaver">
        Partidas de {group?.name || 'Grupo'}
      </h2>

      {sortedDates.map((date) => (
        <div key={date} className="mb-6">
          <h3 className="text-gray-400 text-sm mb-2 font-medium">
            {new Date(date).toLocaleDateString('es-ES', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </h3>

          {matchesByDate[date].map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default MatchList
