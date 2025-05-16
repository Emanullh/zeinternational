import { useMemo } from 'react'
import { useTeamsStore } from '../../../stores/useTeamsStore'
import playoffsDataJson from '../../../data/playoffs.json'

interface Team {
  teamid: number
  teamname: string
  teamlogo: string
}

interface MatchTeam {
  teamid: number | null
  score: number | null
}

interface Game {
  winner: number | null
  scheduledTime: string | null
}

interface MatchData {
  id: string
  matchType: 'bo1' | 'bo3' | 'bo5'
  teams: MatchTeam[]
  status: string
  matches: Game[]
}

interface PlayoffsMatchCardProps {
  match: MatchData
  stage: string
}

const PlayoffsMatchCard = ({ match, stage }: PlayoffsMatchCardProps) => {
  const { getById } = useTeamsStore()
  const teamA = match.teams[0].teamid ? getById(match.teams[0].teamid) : null
  const teamB = match.teams[1].teamid ? getById(match.teams[1].teamid) : null

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) {
      return '--'
    }
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getMatchTypeLabel = () => {
    switch (match.matchType) {
      case 'bo1':
        return 'Mejor de 1'
      case 'bo3':
        return 'Mejor de 3'
      case 'bo5':
        return 'Mejor de 5'
      default:
        return match.matchType
    }
  }

  return (
    <div className="bg-[#111111] border border-[#333] rounded-lg overflow-hidden mb-4">
      <div className="bg-black text-white text-sm py-2 px-4 flex justify-between items-center">
        <div>
          <span className="text-gray-400">Tipo:</span>{' '}
          <span className="text-[#ff6046]">{getMatchTypeLabel()}</span>
        </div>
        <div>
          <span className="text-gray-400">Estado:</span>{' '}
          <span
            className={
              match.status === 'live' ? 'text-green-500' : 'text-white'
            }
          >
            {match.status === 'pending'
              ? 'Pendiente'
              : match.status === 'live'
                ? 'En Vivo'
                : 'Finalizado'}
          </span>
        </div>
      </div>

      <div className="p-4 flex items-center justify-between">
        <div className="flex flex-col items-center w-2/5">
          {teamA ? (
            <>
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
            </>
          ) : (
            <span className="text-[#ff6046] text-center font-medium text-sm">
              TBD
            </span>
          )}
        </div>

        <div className="flex flex-col items-center">
          <div className="text-3xl font-black text-white mb-2">
            <span
              className={
                (match.teams[0].score ?? 0) > (match.teams[1].score ?? 0)
                  ? 'text-green-500'
                  : 'text-white'
              }
            >
              {match.teams[0].score ?? 0}
            </span>
            <span className="mx-2">-</span>
            <span
              className={
                (match.teams[1].score ?? 0) > (match.teams[0].score ?? 0)
                  ? 'text-green-500'
                  : 'text-white'
              }
            >
              {match.teams[1].score ?? 0}
            </span>
          </div>
          <span className="text-gray-400 text-xs text-center">
            Marcador Final
          </span>
        </div>

        <div className="flex flex-col items-center w-2/5">
          {teamB ? (
            <>
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
            </>
          ) : (
            <span className="text-[#ff6046] text-center font-medium text-sm">
              TBD
            </span>
          )}
        </div>
      </div>

      <div className="bg-[#0D0D0D] p-4">
        <h4 className="text-white text-sm font-medium mb-2">
          Partidas Individuales
        </h4>
        <div className="space-y-2">
          {match.matches.map((game, index) => (
            <div key={index} className="flex flex-col text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Partida {index + 1}</span>
                <span className="text-gray-400">
                  {formatDate(game.scheduledTime)}
                </span>
              </div>
              {game.winner && (
                <div className="flex justify-end mt-1">
                  <span className="text-green-500">
                    Ganador: {getById(game.winner)?.teamname ?? 'TBD'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const PlayoffsMatchList = () => {
  const playoffsData = useMemo(() => playoffsDataJson, [])

  const allMatches: { match: MatchData; stage: string }[] = [
    ...playoffsData.upperBracket.semifinals.map((match) => ({
      match: { ...match, matchType: match.matchType as 'bo1' | 'bo3' | 'bo5' },
      stage: 'Upper Bracket Semifinals',
    })),
    {
      match: {
        ...playoffsData.upperBracket.final,
        matchType: playoffsData.upperBracket.final.matchType as
          | 'bo1'
          | 'bo3'
          | 'bo5',
      },
      stage: 'Upper Bracket Final',
    },
    ...playoffsData.lowerBracket.quarterfinals.map((match) => ({
      match: { ...match, matchType: match.matchType as 'bo1' | 'bo3' | 'bo5' },
      stage: 'Lower Bracket Quarterfinals',
    })),
    {
      match: {
        ...playoffsData.lowerBracket.semifinal,
        matchType: playoffsData.lowerBracket.semifinal.matchType as
          | 'bo1'
          | 'bo3'
          | 'bo5',
      },
      stage: 'Lower Bracket Semifinal',
    },
    {
      match: {
        ...playoffsData.lowerBracket.final,
        matchType: playoffsData.lowerBracket.final.matchType as
          | 'bo1'
          | 'bo3'
          | 'bo5',
      },
      stage: 'Lower Bracket Final',
    },
    {
      match: {
        ...playoffsData.grandFinal,
        matchType: playoffsData.grandFinal.matchType as 'bo1' | 'bo3' | 'bo5',
      },
      stage: 'Grand Final',
    },
  ]

  // Group matches by stage
  const matchesByStage = useMemo(() => {
    const grouped: Record<string, MatchData[]> = {}
    allMatches.forEach(({ match, stage }) => {
      if (!grouped[stage]) {
        grouped[stage] = []
      }
      grouped[stage].push(match)
    })
    return grouped
  }, [allMatches])

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Upper Bracket Semifinals and Lower Bracket Quarterfinals */}
        <div className="space-y-4 order-4 lg:order-1 bg-[#0D0D0D] rounded-xl p-4">
          <h3 className="text-[#ff6046] text-lg mb-4 font-medium text-center">
            Upper Bracket Semifinals
          </h3>
          {matchesByStage['Upper Bracket Semifinals']?.map((match) => (
            <div className="w-full max-w-[300px] mx-auto">
              <PlayoffsMatchCard
                key={match.id}
                match={match}
                stage="Upper Bracket Semifinals"
              />
            </div>
          ))}
          <h3 className="text-[#ff6046] text-lg mb-4 font-medium mt-8 text-center">
            Lower Bracket Quarterfinals
          </h3>
          {matchesByStage['Lower Bracket Quarterfinals']?.map((match) => (
            <div className="w-full max-w-[300px] mx-auto">
              <PlayoffsMatchCard
                key={match.id}
                match={match}
                stage="Lower Bracket Quarterfinals"
              />
            </div>
          ))}
        </div>

        {/* Lower Bracket Semifinal */}
        <div className="space-y-4 order-3 lg:order-2 bg-[#0D0D0D] rounded-xl p-4">
          <h3 className="text-[#ff6046] text-lg mb-4 font-medium text-center">
            Lower Bracket Semifinal
          </h3>
          {matchesByStage['Lower Bracket Semifinal']?.map((match) => (
            <div className="w-full max-w-[300px] mx-auto">
              <PlayoffsMatchCard
                key={match.id}
                match={match}
                stage="Lower Bracket Semifinal"
              />
            </div>
          ))}
        </div>

        {/* Upper Bracket Final and Lower Bracket Final */}
        <div className="space-y-4 order-2 lg:order-3 bg-[#0D0D0D] rounded-xl p-4">
          <h3 className="text-[#ff6046] text-lg mb-4 font-medium text-center">
            Upper Bracket Final
          </h3>
          {matchesByStage['Upper Bracket Final']?.map((match) => (
            <div className="w-full max-w-[300px] mx-auto">
              <PlayoffsMatchCard
                key={match.id}
                match={match}
                stage="Upper Bracket Final"
              />
            </div>
          ))}
          <h3 className="text-[#ff6046] text-lg mb-4 font-medium mt-8 text-center">
            Lower Bracket Final
          </h3>
          {matchesByStage['Lower Bracket Final']?.map((match) => (
            <div className="w-full max-w-[300px] mx-auto">
              <PlayoffsMatchCard
                key={match.id}
                match={match}
                stage="Lower Bracket Final"
              />
            </div>
          ))}
        </div>

        {/* Grand Final */}
        <div className="space-y-4 order-1 lg:order-4 bg-[#0D0D0D] rounded-xl p-4">
          <h3 className="text-[#ff6046] text-lg mb-4 font-medium text-center">
            Grand Final
          </h3>
          {matchesByStage['Grand Final']?.map((match) => (
            <div className="w-full max-w-[300px] mx-auto">
              <PlayoffsMatchCard
                key={match.id}
                match={match}
                stage="Grand Final"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PlayoffsMatchList
