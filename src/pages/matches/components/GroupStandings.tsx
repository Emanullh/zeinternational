import { useState, useMemo } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMatchesStore, TeamStanding } from '../../../stores/useMatchesStore'

interface GroupStandingsProps {
  groupId: number
}

const columnHelper = createColumnHelper<TeamStanding>()

const columns = [
  columnHelper.accessor('teamId', {
    header: () => '',
    cell: (info) => {
      const rowIndex = info.row.index
      const statusClass =
        rowIndex < 2
          ? 'bg-green-600'
          : rowIndex > 5
            ? 'bg-red-600'
            : 'bg-gray-500'

      return (
        <div
          className={`${statusClass} w-5 sm:w-6 font-bold text-white px-1 py-1 text-center text-xs sm:text-sm`}
        >
          {rowIndex + 1}.
        </div>
      )
    },
  }),
  columnHelper.accessor('teamName', {
    header: () => 'Equipo',
    cell: (info) => {
      const team = info.row.original
      return (
        <div className="flex items-center pl-2 w-[80px] sm:w-[160px]">
          <img
            src={`/images/teams/${team.teamLogo}`}
            alt={team.teamName}
            className="h-8 w-8 sm:h-12 sm:w-12 mr-1 sm:mr-3"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src =
                '/images/teams/team_logo.webp'
            }}
          />
          <span className="hidden sm:inline font-medium font-notosans truncate">
            {team.teamName}
          </span>
        </div>
      )
    },
  }),
  columnHelper.accessor((row) => `${row.won}-${row.draw}-${row.lost}`, {
    id: 'matches',
    header: () => 'Partidos',
    cell: (info) => (
      <div className="font-bold whitespace-pre w-[60px] sm:w-[70px] text-center font-notosans text-xs sm:text-sm">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor((row) => `${row.gamesWon}-${row.gamesLost}`, {
    id: 'games',
    header: () => 'Juegos',
    cell: (info) => (
      <div className="whitespace-pre w-[60px] sm:w-[70px] text-center font-notosans text-xs sm:text-sm">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('points', {
    header: () => 'Puntos',
    cell: (info) => (
      <div className="font-bold whitespace-pre w-[60px] sm:w-[70px] text-center font-notosans text-xs sm:text-sm">
        {info.getValue()}
      </div>
    ),
  }),
]

const GroupStandings = ({ groupId }: GroupStandingsProps) => {
  const { getGroupStandings, getGroupById } = useMatchesStore()

  // Use useMemo to prevent recalculations on every render
  const standings = useMemo(
    () => getGroupStandings(groupId),
    [groupId, getGroupStandings],
  )
  const group = useMemo(() => getGroupById(groupId), [groupId, getGroupById])

  // Memoize the table configuration
  const table = useReactTable({
    data: standings,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (standings.length === 0) {
    return (
      <div className="w-[420px] max-w-full border border-[#333] rounded-xl overflow-hidden bg-[#111111] shadow-lg p-4 text-center text-gray-400 text-xs sm:text-sm">
        No hay datos disponibles para {group?.name || 'este grupo'}
      </div>
    )
  }

  return (
    <div className="max-w-full border border-[#333] rounded-xl overflow-hidden bg-[#111111] shadow-lg">
      <div className="overflow-x-auto">
        <div className="min-w-[320px] sm:min-w-[420px]">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="bg-black text-white">
                <th colSpan={5} className="text-center py-2 sm:py-3">
                  <span className="font-black uppercase tracking-wider text-[#ff6046] font-reaver text-sm sm:text-base">
                    {group?.name || 'Tabla de Posiciones'}
                  </span>
                </th>
              </tr>
              <tr className="border-b border-[#333] bg-[#181818]">
                {table.getFlatHeaders().map((header) => (
                  <th
                    key={header.id}
                    className="px-1 sm:px-2 py-1 sm:py-2 text-left text-gray-400 font-notosans uppercase text-[10px] sm:text-xs"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[#222] hover:bg-[#1a1a1a] text-white"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-1 py-1 sm:py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default GroupStandings
