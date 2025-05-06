import { create } from 'zustand'
import tournamentData from '../data/matches.json'
import { useTeamsStore } from './useTeamsStore'

export interface Group {
  id: number
  name: string
  teamIds: number[]
}

export interface Match {
  id: number
  groupId: number
  date: string // ISO format: "YYYY-MM-DD"
  teamAId: number
  teamBId: number
  scoreA: number
  scoreB: number
}

export interface TournamentData {
  groups: Group[]
  matches: Match[]
}

export interface TeamStanding {
  teamId: number
  teamName: string
  teamLogo: string
  played: number
  won: number
  lost: number
  gamesWon: number
  gamesLost: number
  points: number
}

// Cache for storing standings to prevent recalculations
interface StandingsCache {
  [groupId: number]: {
    timestamp: number
    standings: TeamStanding[]
  }
}

interface MatchesState {
  tournamentData: TournamentData
  standingsCache: StandingsCache
  getMatchesByGroupId: (groupId: number) => Match[]
  getGroupById: (groupId: number) => Group | undefined
  getGroupStandings: (groupId: number) => TeamStanding[]
  clearStandingsCache: () => void
}

export const useMatchesStore = create<MatchesState>((set, get) => ({
  tournamentData: tournamentData as TournamentData,
  standingsCache: {},

  getMatchesByGroupId: (groupId: number) => {
    return get().tournamentData.matches.filter(
      (match) => match.groupId === groupId,
    )
  },

  getGroupById: (groupId: number) => {
    return get().tournamentData.groups.find((group) => group.id === groupId)
  },

  getGroupStandings: (groupId: number) => {
    // Check cache first (valid for 5 minutes)
    const cache = get().standingsCache[groupId]
    const now = Date.now()
    if (cache && now - cache.timestamp < 5 * 60 * 1000) {
      return cache.standings
    }

    const group = get().tournamentData.groups.find((g) => g.id === groupId)
    if (!group) return []

    const matches = get().getMatchesByGroupId(groupId)

    // Get teams from the store but avoid re-renders by using getState()
    const teamsState = useTeamsStore.getState()

    // Initialize standings for all teams in the group
    const initialStandings: Record<number, TeamStanding> = {}

    // Process each team in the group
    group.teamIds.forEach((teamId) => {
      const team = teamsState.getById(teamId)
      if (!team) return

      initialStandings[teamId] = {
        teamId,
        teamName: team.teamname,
        teamLogo: team.teamlogo,
        played: 0,
        won: 0,
        lost: 0,
        gamesWon: 0,
        gamesLost: 0,
        points: 0,
      }
    })

    // Calculate standings based on matches
    matches.forEach((match) => {
      const teamA = initialStandings[match.teamAId]
      const teamB = initialStandings[match.teamBId]

      if (!teamA || !teamB) return

      // Update games played
      teamA.played += 1
      teamB.played += 1

      // Update games won/lost
      teamA.gamesWon += match.scoreA
      teamA.gamesLost += match.scoreB
      teamB.gamesWon += match.scoreB
      teamB.gamesLost += match.scoreA

      // Update match results and points
      if (match.scoreA > match.scoreB) {
        teamA.won += 1
        teamB.lost += 1
        teamA.points += 3
      } else if (match.scoreB > match.scoreA) {
        teamB.won += 1
        teamA.lost += 1
        teamB.points += 3
      } else {
        // In case of a draw, both teams get 1 point
        teamA.points += 1
        teamB.points += 1
      }
    })

    // Convert to array and sort by points, then by games won
    const sortedStandings = Object.values(initialStandings).sort((a, b) => {
      if (a.points !== b.points) return b.points - a.points
      if (b.gamesWon - b.gamesLost !== a.gamesWon - a.gamesLost)
        return b.gamesWon - b.gamesLost - (a.gamesWon - a.gamesLost)
      return b.gamesWon - a.gamesWon
    })

    // Update cache
    set((state) => ({
      standingsCache: {
        ...state.standingsCache,
        [groupId]: {
          timestamp: now,
          standings: sortedStandings,
        },
      },
    }))

    return sortedStandings
  },

  // Method to clear the cache if needed (e.g., after updates)
  clearStandingsCache: () => {
    set({ standingsCache: {} })
  },
}))
