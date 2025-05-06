import React, { useMemo } from 'react'
import { useMatchesStore, Group, Match } from '../../../stores/useMatchesStore'
import { useTeamsStore } from '../../../stores/useTeamsStore'

interface CrosstableProps {
  groupId: number
}

interface MatchResultData {
  date: string
  scoreA: number
  scoreB: number
  isPlayed: boolean
}

type CrosstableData = Record<string, Record<string, MatchResultData>>

const Crosstable: React.FC<CrosstableProps> = ({ groupId }) => {
  const { getGroupById, getMatchesByGroupId } = useMatchesStore()
  const { getById } = useTeamsStore()

  const group = useMemo(() => getGroupById(groupId), [groupId, getGroupById])
  const matches = useMemo(
    () => getMatchesByGroupId(groupId),
    [groupId, getMatchesByGroupId],
  )

  // Build the crosstable data
  const crosstableData = useMemo(() => {
    if (!group) return {}

    const data: CrosstableData = {}

    // Initialize data structure
    group.teamIds.forEach((teamIdA) => {
      data[teamIdA] = {}
      group.teamIds.forEach((teamIdB) => {
        if (teamIdA !== teamIdB) {
          data[teamIdA][teamIdB] = {
            date: '',
            scoreA: 0,
            scoreB: 0,
            isPlayed: false,
          }
        }
      })
    })

    // Populate with match data
    matches.forEach((match) => {
      const { teamAId, teamBId, scoreA, scoreB, date } = match

      // Ensure both teams are in the group
      if (group.teamIds.includes(teamAId) && group.teamIds.includes(teamBId)) {
        // Convert to Date object to check if match is in the past
        const matchDate = new Date(date)
        const now = new Date()
        const isPlayed = matchDate <= now

        // Save match result in the data - for both directions
        // When team A plays against team B
        data[teamAId][teamBId] = {
          date,
          scoreA,
          scoreB,
          isPlayed,
        }

        // Need to reverse scores for when viewed from team B's perspective
        if (!data[teamBId]) data[teamBId] = {}
        data[teamBId][teamAId] = {
          date,
          scoreA: scoreB, // Reversed!
          scoreB: scoreA, // Reversed!
          isPlayed,
        }
      }
    })

    return data
  }, [group, matches])
  console.log(crosstableData)
  if (!group || group.teamIds.length === 0) {
    return (
      <div className="w-full border border-[#333] rounded-xl overflow-hidden bg-[#111111] shadow-lg p-4 text-center text-gray-400">
        No hay datos disponibles para este grupo
      </div>
    )
  }

  // Format date to display in the format "MMM DD"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const month = date.toLocaleString('es-ES', { month: 'short' })
    const day = date.getDate()
    return `${month} ${day}`
  }

  return (
    <div className="w-full border border-[#333] rounded-xl overflow-hidden bg-[#111111] shadow-lg mb-8">
      <h3 className="text-xl font-black text-center py-3 bg-black text-[#ff6046] uppercase tracking-wide font-reaver">
        Tabla Cruzada
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-white border-collapse">
          <tbody>
            {/* Team rows */}
            {group.teamIds.map((teamId) => (
              <tr
                key={teamId}
                className="border-b border-[#222] hover:bg-[#1a1a1a]"
                style={{ height: '60px' }}
              >
                {/* Team name/logo cell */}
                <th className="px-2 py-2 min-w-[120px]">
                  <div className="flex items-center">
                    <img
                      src={`/images/teams/${getById(teamId)?.teamlogo}`}
                      alt={getById(teamId)?.teamname}
                      className="h-10 w-10 mr-2"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src =
                          '/images/teams/team_logo.webp'
                      }}
                    />
                    <span className="font-medium font-notosans text-sm truncate">
                      {getById(teamId)?.teamname}
                    </span>
                  </div>
                </th>

                {/* Match result cells */}
                {group.teamIds.map((opponentId) => {
                  if (teamId === opponentId) {
                    // Diagonal cell (same team)
                    return (
                      <td
                        key={`${teamId}-${opponentId}`}
                        className="bg-[#1a1a1a]"
                      ></td>
                    )
                  }

                  // Get the match data between these teams
                  const matchData = crosstableData[teamId]?.[opponentId]

                  const cellClass =
                    !matchData || !matchData.isPlayed
                      ? 'bg-[#222]'
                      : matchData.scoreA > matchData.scoreB
                        ? 'bg-[rgba(76,175,80,0.2)]'
                        : matchData.scoreA < matchData.scoreB
                          ? 'bg-[rgba(244,67,54,0.2)]'
                          : 'bg-[rgba(255,152,0,0.2)]'

                  return (
                    <td
                      key={`${teamId}-${opponentId}`}
                      className={`${cellClass} text-center min-w-[60px] p-2`}
                    >
                      {matchData && matchData.date ? (
                        <>
                          <span className="block font-bold text-base">
                            {matchData.isPlayed
                              ? `${matchData.scoreA}-${matchData.scoreB}`
                              : 'TBD'}
                          </span>
                          <span className="block text-xs text-gray-400 mt-1">
                            {formatDate(matchData.date)}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-500">-</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}

            {/* Bottom row with team logos */}
            <tr className="bg-black">
              <th></th>
              {group.teamIds.map((teamId) => (
                <th key={teamId} className="p-2">
                  <img
                    src={`/images/teams/${getById(teamId)?.teamlogo}`}
                    alt={getById(teamId)?.teamname}
                    className="h-10 w-10 mx-auto"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src =
                        '/images/teams/team_logo.webp'
                    }}
                  />
                </th>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Crosstable
