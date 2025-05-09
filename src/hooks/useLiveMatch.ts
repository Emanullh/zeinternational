import { useState, useEffect } from 'react'

interface Hero {
  id: number
  name: string
  displayName: string
}

interface SteamAccount {
  name: string
}

interface Player {
  steamAccountId: number
  steamAccount: SteamAccount
  heroId: number
  hero: Hero
  isRadiant: boolean
  numKills: number
  numDeaths: number
  numAssists: number
  numLastHits: number
  numDenies: number
  gold: number
  networth: number
  goldPerMinute: number
  experiencePerMinute: number | null
  level: number
}

interface PickBan {
  isPick: boolean
  heroId: number
  order: number
}

interface PlaybackData {
  pickBans: PickBan[]
}

interface LiveMatch {
  matchId: number
  gameMinute: number
  radiantScore: number
  direScore: number
  leagueId: number | null
  league: any | null
  delay: number
  spectators: number
  averageRank: number
  radiantLead: number
  lobbyType: string
  gameTime: number
  completed: boolean
  radiantTeam: any | null
  direTeam: any | null
  gameMode: string
  gameState: string
  playbackData: PlaybackData
  players: Player[]
}

interface LiveMatchData {
  data: {
    live: {
      match: LiveMatch
    }
  }
}

export function useLiveMatch() {
  const [data, setData] = useState<LiveMatch | null>(null)
  useEffect(() => {
    import('../mocks/liveMatch.json').then((mod) => {
      setData(mod.data.live.match)
    })
  }, [])
  return data
} 