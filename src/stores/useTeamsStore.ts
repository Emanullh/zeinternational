import { create } from 'zustand'
import teamsData from '../data/teams.json'

export interface Team {
  teamid: number
  teamlogo: string
  integrateIds: number[]
  teamleaderid: number
  teamname: string
}

interface TeamsState {
  teams: Team[]
  getById: (teamid: number) => Team | undefined
}

export const useTeamsStore = create<TeamsState>(() => ({
  teams: teamsData,
  getById: (teamid) => teamsData.find((t) => t.teamid === teamid),
}))
