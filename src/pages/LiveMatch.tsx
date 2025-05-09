import React, { useState } from 'react'
import { useLiveMatch } from '../hooks/useLiveMatch'
import { DOTA_IMAGE_CDN } from '../config'
import heroes from '../data/heroes.json'

type Hero = {
  id: number
  name: string
  primary_attr: string
  attack_type: string
  roles: string[]
  img: string
  icon: string
  localized_name: string
}

type Heroes = {
  [key: string]: Hero
}

type StatType = 'KDA' | 'LH/DN' | 'LVL' | 'Gold' | 'NW' | 'GPM'

function getGradient(heroId: number, isRadiant: boolean) {
  const radiantGradients = [
    'from-cyan-200/15 to-cyan-900/15',
    'from-pink-200/15 to-pink-900/15',
    'from-green-200/15 to-green-900/15',
    'from-blue-200/15 to-blue-900/15',
    'from-indigo-200/15 to-indigo-900/15',
  ]
  const direGradients = [
    'from-yellow-200/15 to-yellow-900/15',
    'from-red-200/15 to-red-900/15',
    'from-purple-200/15 to-purple-900/15',
    'from-orange-200/15 to-orange-900/15',
    'from-fuchsia-200/15 to-fuchsia-900/15',
  ]
  return isRadiant
    ? `bg-gradient-to-br ${radiantGradients[heroId % radiantGradients.length]}`
    : `bg-gradient-to-br ${direGradients[heroId % direGradients.length]}`
}

function getPlayerStat(player: any, stat: StatType): number {
  switch (stat) {
    case 'KDA':
      return player.numKills + player.numAssists
    case 'LH/DN':
      return player.numLastHits + player.numDenies
    case 'LVL':
      return player.level
    case 'Gold':
      return player.gold
    case 'NW':
      return player.networth
    case 'GPM':
      return player.goldPerMinute
    default:
      return 0
  }
}

export default function LiveMatch() {
  const match = useLiveMatch()
  const [selectedStat, setSelectedStat] = useState<StatType>('KDA')
  
  if (!match) return <div className="text-white">Cargando...</div>
  
  const radiant = match.players.filter((p) => p.isRadiant)
  const dire = match.players.filter((p) => !p.isRadiant)

  // Sort players by selected stat
  const sortedPlayers = [...match.players].sort((a, b) => 
    getPlayerStat(b, selectedStat) - getPlayerStat(a, selectedStat)
  )

  const stats: StatType[] = ['KDA', 'LH/DN', 'LVL', 'Gold', 'NW', 'GPM']

  const getHeroImage = (heroId: number) => {
    const hero = (heroes as Heroes)[heroId.toString()]
    return hero ? `${DOTA_IMAGE_CDN}${hero.img}` : ''
  }

  return (
    <div className="min-h-screen text-white pb-8 pt-24">
      <div className="container mx-auto">
        <h1 className="text-3xl font-black text-center mb-8 text-[#ff6046] uppercase tracking-wide font-reaver">
          Partida en vivo
        </h1>
      
        {/* Match Info */}
        <div className="bg-black/60 rounded-lg p-4 mb-8 border border-[#222]">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Modo: {match.gameMode}</span>
            <span>Estado: {match.gameState}</span>
            <span>Espectadores: {match.spectators}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Rango promedio: {match.averageRank}</span>
            <span>Delay: {match.delay}s</span>
            <span>Ventaja Radiant: {match.radiantLead.toLocaleString()}</span>
          </div>
        </div>

        {/* Score */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="flex flex-col items-center">
            <span className="text-green-400 font-bold text-lg md:text-xl font-goudytrajan">Radiant</span>
            <span className="text-3xl md:text-5xl font-black text-white drop-shadow-lg">{match.radiantScore}</span>
          </div>
          <div className="bg-black/60 rounded-lg px-4 py-2 flex flex-col items-center border border-[#222]">
            <span className="text-xs text-gray-400 font-notosans">Minuto</span>
            <span className="text-xl font-bold text-white font-reaver">{match.gameMinute}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-red-400 font-bold text-lg md:text-xl font-goudytrajan">Dire</span>
            <span className="text-3xl md:text-5xl font-black text-white drop-shadow-lg">{match.direScore}</span>
          </div>
        </div>

        {/* Players */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-row gap-4 justify-center">
            {radiant.map((player) => (
              <div
                key={player.steamAccountId}
                className={`relative flex flex-col items-center w-44 rounded-xl border border-[#333] shadow-lg p-3 ${getGradient(player.heroId, true)} backdrop-blur-md`}
              >
                <img
                  className="w-20 h-14 object-contain rounded mb-2 border border-[#222] bg-black/40"
                  src={getHeroImage(player.heroId)}
                  alt={player.hero.displayName}
                />
                <div className="text-xs text-gray-300 font-notosans mb-1">{player.hero.displayName}</div>
                <div className="text-base font-bold text-white font-reaver mb-1 truncate w-full text-center">{player.steamAccount.name}</div>
                <div className="flex flex-row items-center justify-center gap-2 text-xs text-gray-400 font-notosans mb-1">
                  <span className="text-green-400 font-bold">{player.numKills}</span>
                  <span>/</span>
                  <span className="text-red-400 font-bold">{player.numDeaths}</span>
                  <span>/</span>
                  <span className="text-blue-400 font-bold">{player.numAssists}</span>
                </div>
                <div className="flex flex-row items-center justify-center gap-2 text-xs text-yellow-300 font-bold font-reaver">
                  <img src="/images/dota2/gold.png" alt="gold" className="w-4 h-4 inline-block mr-1" />
                  {player.networth.toLocaleString()}
                  <span className="ml-2 text-white">Lvl {player.level}</span>
                </div>
                <div className="flex flex-row items-center justify-center gap-2 text-xs text-gray-400 font-notosans mt-1">
                  <span>LH: {player.numLastHits}</span>
                  <span>DN: {player.numDenies}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-row gap-4 justify-center">
            {dire.map((player) => (
              <div
                key={player.steamAccountId}
                className={`relative flex flex-col items-center w-44 rounded-xl border border-[#333] shadow-lg p-3 ${getGradient(player.heroId, false)} backdrop-blur-md`}
              >
                <img
                  className="w-20 h-14 object-contain rounded mb-2 border border-[#222] bg-black/40"
                  src={getHeroImage(player.heroId)}
                  alt={player.hero.displayName}
                />
                <div className="text-xs text-gray-300 font-notosans mb-1">{player.hero.displayName}</div>
                <div className="text-base font-bold text-white font-reaver mb-1 truncate w-full text-center">{player.steamAccount.name}</div>
                <div className="flex flex-row items-center justify-center gap-2 text-xs text-gray-400 font-notosans mb-1">
                  <span className="text-green-400 font-bold">{player.numKills}</span>
                  <span>/</span>
                  <span className="text-red-400 font-bold">{player.numDeaths}</span>
                  <span>/</span>
                  <span className="text-blue-400 font-bold">{player.numAssists}</span>
                </div>
                <div className="flex flex-row items-center justify-center gap-2 text-xs text-yellow-300 font-bold font-reaver">
                  <img src="/images/dota2/gold.png" alt="gold" className="w-4 h-4 inline-block mr-1" />
                  {player.networth.toLocaleString()}
                  <span className="ml-2 text-white">Lvl {player.level}</span>
                </div>
                <div className="flex flex-row items-center justify-center gap-2 text-xs text-gray-400 font-notosans mt-1">
                  <span>LH: {player.numLastHits}</span>
                  <span>DN: {player.numDenies}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Table */}
        <div className="bg-black/60 rounded-lg p-4 border border-[#222]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">
                {match.radiantLead > 0 ? 'Ventaja Radiant' : 'Ventaja Dire'}
              </span>
              <span className="text-[#ff6046] font-bold">{Math.abs(match.radiantLead).toLocaleString()}</span>
            </div>
          </div>

          {/* Stats Menu */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {stats.map((stat) => (
              <button
                key={stat}
                onClick={() => setSelectedStat(stat)}
                className={`px-3 py-1 rounded text-sm font-bold flex items-center gap-2 ${
                  selectedStat === stat 
                    ? 'bg-[#ff6046] text-white' 
                    : 'bg-black/40 text-gray-400 hover:text-white'
                }`}
              >
                <span>{stat}</span>
                <kbd className="text-xs bg-black/20 px-1 rounded">{stat === 'KDA' ? 'Q' : 
                  stat === 'LH/DN' ? 'W' : 
                  stat === 'LVL' ? 'E' : 
                  stat === 'Gold' ? 'T' : 
                  stat === 'NW' ? 'Y' : 'U'}</kbd>
              </button>
            ))}
          </div>
          
          <div className="space-y-2">
            {sortedPlayers.map((player) => {
              const statValue = getPlayerStat(player, selectedStat)
              const maxStat = getPlayerStat(sortedPlayers[0], selectedStat)
              const percentage = (statValue / maxStat) * 100

              return (
                <div key={player.steamAccountId} className="flex items-center gap-4 p-2 rounded bg-black/40">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img src={getHeroImage(player.heroId)} alt={player.hero.displayName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold">{player.steamAccount.name}</span>
                      <span className="text-[#ff6046] font-bold">
                        {selectedStat === 'KDA' ? `${player.numKills}/${player.numDeaths}/${player.numAssists}` :
                         selectedStat === 'LH/DN' ? `${player.numLastHits}/${player.numDenies}` :
                         statValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 h-1 rounded-full mt-1">
                      <div 
                        className="bg-[#ff6046] h-full rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
} 