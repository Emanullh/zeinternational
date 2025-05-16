import React, { useEffect, useRef, useMemo } from 'react'
import * as d3 from 'd3'
// Asegúrate de que las rutas a tus archivos JSON sean correctas
import playoffsDataJson from '../../../data/playoffs.json'
import teamsDataJson from '../../../data/teams.json'

interface Team {
  teamid: number
  teamname: string
  teamlogo: string
  integrateIds: number[]
  teamleaderid: number
}

interface TeamDetails {
  name: string
  logo: string
}

interface MatchTeam {
  teamid: number | null
  score: number | null // Podrías usarlo en el futuro
}

interface MatchData {
  teams: MatchTeam[]
  originalId: string // Para referencia si es necesario
  id: string // ID del partido
  status: string // Estado del partido
}

interface Node {
  data: MatchData
  x: number
  y: number
}

interface Title {
  text: string
  x: number
  y: number
}

interface Link {
  source: string // id del nodo fuente
  target: string // id del nodo destino
  type: 'winner' | 'loser' // Indica si el link es para el ganador o perdedor del source
  sourcePort?: 'top' | 'bottom' | 'center' // De dónde sale la línea en el nodo source
  targetPort?: 'top' | 'bottom' | 'center' // Dónde entra la línea en el nodo target
}

interface Point {
  // Para el generador de líneas D3
  x: number
  y: number
}

const getTeamDetails = (
  teamid: number | null | undefined,
  allTeams: Team[],
): TeamDetails => {
  if (teamid === null || teamid === undefined) return { name: 'TBD', logo: '' }
  const team = allTeams.find((t) => t.teamid === teamid)
  return team
    ? { name: team.teamname, logo: team.teamlogo }
    : { name: 'TBD', logo: '' }
}

const PlayoffsBracketD3 = () => {
  const d3Container = useRef<SVGSVGElement>(null)
  const playoffsData = useMemo(() => playoffsDataJson, [])
  const teamsData = useMemo(() => teamsDataJson as Team[], []) // Asegura el tipo

  const { nodes, links, titles, svgDimensions, nodeStyle } = useMemo(() => {
    const allMatchesInput: Record<string, MatchData> = {
      'ub-sf-1': {
        ...playoffsData.upperBracket.semifinals[0],
        originalId: 'ub-sf-1',
      },
      'ub-sf-2': {
        ...playoffsData.upperBracket.semifinals[1],
        originalId: 'ub-sf-2',
      },
      'lb-qf-1': {
        ...playoffsData.lowerBracket.quarterfinals[0],
        originalId: 'lb-qf-1',
      },
      'lb-qf-2': {
        ...playoffsData.lowerBracket.quarterfinals[1],
        originalId: 'lb-qf-2',
      },
      'ub-final': {
        ...playoffsData.upperBracket.final,
        originalId: 'ub-final',
      },
      'lb-sf': { ...playoffsData.lowerBracket.semifinal, originalId: 'lb-sf' },
      'lb-final': {
        ...playoffsData.lowerBracket.final,
        originalId: 'lb-final',
      },
      'grand-final': { ...playoffsData.grandFinal, originalId: 'grand-final' },
    }

    const calculatedNodes: Record<string, Node> = {}
    const calculatedLinks: Link[] = []
    const calculatedTitles: Title[] = []

    const conf = {
      nodeWidth: 180, // Ajustado para parecerse más a la imagen
      nodeHeight: 60, // Ajustado
      horizontalGap: 60, // Espacio horizontal entre el final de un nodo y el inicio del siguiente
      verticalGapNodes: 25, // Espacio vertical entre nodos en la misma columna
      verticalGapSections: 40, // Espacio vertical entre secciones (ej: UB Semis y LB Quarters)
      titleAreaHeight: 20,
      columnTopPadding: 10,
      svgPadding: { top: 20, right: 20, bottom: 20, left: 20 },
    }
    const currentStyle = { width: conf.nodeWidth, height: conf.nodeHeight }

    let currentY: number

    // --- Columna 0: Upper Bracket Semifinals & Lower Bracket Quarterfinals ---
    const col0X = 0
    currentY = conf.columnTopPadding

    calculatedTitles.push({
      text: 'Upper Bracket Semifinals',
      x: col0X + conf.nodeWidth / 2,
      y: currentY,
    })
    currentY += conf.titleAreaHeight
    calculatedNodes['ub-sf-1'] = {
      data: allMatchesInput['ub-sf-1'],
      x: col0X,
      y: currentY,
    }
    currentY += conf.nodeHeight + conf.verticalGapNodes
    calculatedNodes['ub-sf-2'] = {
      data: allMatchesInput['ub-sf-2'],
      x: col0X,
      y: currentY,
    }
    currentY += conf.nodeHeight + conf.verticalGapSections

    calculatedTitles.push({
      text: 'Lower Bracket',
      x: col0X + conf.nodeWidth / 2,
      y: currentY,
    })
    currentY += conf.titleAreaHeight
    calculatedNodes['lb-qf-1'] = {
      data: allMatchesInput['lb-qf-1'],
      x: col0X,
      y: currentY,
    }
    currentY += conf.nodeHeight + conf.verticalGapNodes
    calculatedNodes['lb-qf-2'] = {
      data: allMatchesInput['lb-qf-2'],
      x: col0X,
      y: currentY,
    }

    // --- Columna 1: Lower Bracket Semifinal ---
    const col1X = col0X + conf.nodeWidth + conf.horizontalGap
    currentY = conf.columnTopPadding // Reiniciar Y para la nueva columna (o alinear con algo específico)

    // LBSF se alimenta de LBQF, así que su Y debe estar centrado respecto a ellos
    const lbsfTargetY =
      (calculatedNodes['lb-qf-1'].y +
        conf.nodeHeight / 2 +
        calculatedNodes['lb-qf-2'].y +
        conf.nodeHeight / 2) /
        2 -
      conf.nodeHeight / 2
    calculatedTitles.push({
      text: 'Lower Bracket Semifinal',
      x: col1X + conf.nodeWidth / 2,
      y: lbsfTargetY - conf.titleAreaHeight - 5,
    }) // -5 para pequeño ajuste visual
    calculatedNodes['lb-sf'] = {
      data: allMatchesInput['lb-sf'],
      x: col1X,
      y: lbsfTargetY,
    }

    // --- Columna 2: Upper Bracket Final & Lower Bracket Final ---
    const col2X = col1X + conf.nodeWidth + conf.horizontalGap
    currentY = conf.columnTopPadding

    // UBF se alimenta de UBSF
    const ubfTargetY =
      (calculatedNodes['ub-sf-1'].y +
        conf.nodeHeight / 2 +
        calculatedNodes['ub-sf-2'].y +
        conf.nodeHeight / 2) /
        2 -
      conf.nodeHeight / 2
    calculatedTitles.push({
      text: 'Upper Bracket Final',
      x: col2X + conf.nodeWidth / 2,
      y: ubfTargetY - conf.titleAreaHeight - 5,
    })
    calculatedNodes['ub-final'] = {
      data: allMatchesInput['ub-final'],
      x: col2X,
      y: ubfTargetY,
    }

    // LBF se alimenta del perdedor de UBF y ganador de LBSF
    // Su Y debería estar entre la salida del perdedor de UBF y la salida del ganador de LBSF
    const lbfSource1Y = calculatedNodes['ub-final'].y + conf.nodeHeight / 2 // Punto de salida del perdedor de UBF
    const lbfSource2Y = calculatedNodes['lb-sf'].y + conf.nodeHeight / 2 // Punto de salida del ganador de LBSF
    const lbfTargetY = (lbfSource1Y + lbfSource2Y) / 2 - conf.nodeHeight / 2
    // Asegurarse que LBF esté debajo de UBF en la misma columna con suficiente espacio
    const minLbfY =
      calculatedNodes['ub-final'].y + conf.nodeHeight + conf.verticalGapSections
    calculatedNodes['lb-final'] = {
      data: allMatchesInput['lb-final'],
      x: col2X,
      y: Math.max(lbfTargetY, minLbfY),
    }
    calculatedTitles.push({
      text: 'Lower Bracket Final',
      x: col2X + conf.nodeWidth / 2,
      y: calculatedNodes['lb-final'].y - conf.titleAreaHeight - 5,
    })

    // --- Columna 3: Grand Final ---
    const col3X = col2X + conf.nodeWidth + conf.horizontalGap
    // GF se alimenta del ganador de UBF y ganador de LBF
    const gfSource1Y = calculatedNodes['ub-final'].y + conf.nodeHeight / 2 // Salida ganador UBF
    const gfSource2Y = calculatedNodes['lb-final'].y + conf.nodeHeight / 2 // Salida ganador LBF
    const gfTargetY = (gfSource1Y + gfSource2Y) / 2 - conf.nodeHeight / 2

    calculatedTitles.push({
      text: 'Grand Final',
      x: col3X + conf.nodeWidth / 2,
      y: gfTargetY - conf.titleAreaHeight - 5,
    })
    calculatedNodes['grand-final'] = {
      data: allMatchesInput['grand-final'],
      x: col3X,
      y: gfTargetY,
    }

    // --- Definición de Links ---
    // UBSF -> UBF
    calculatedLinks.push({
      source: 'ub-sf-1',
      target: 'ub-final',
      type: 'winner',
      sourcePort: 'center',
      targetPort: 'top',
    })
    calculatedLinks.push({
      source: 'ub-sf-2',
      target: 'ub-final',
      type: 'winner',
      sourcePort: 'center',
      targetPort: 'bottom',
    })
    // LBQF -> LBSF
    calculatedLinks.push({
      source: 'lb-qf-1',
      target: 'lb-sf',
      type: 'winner',
      sourcePort: 'center',
      targetPort: 'top',
    })
    calculatedLinks.push({
      source: 'lb-qf-2',
      target: 'lb-sf',
      type: 'winner',
      sourcePort: 'center',
      targetPort: 'bottom',
    })

    // UBF (Winner) -> GF
    calculatedLinks.push({
      source: 'ub-final',
      target: 'grand-final',
      type: 'winner',
      sourcePort: 'center',
      targetPort: 'top',
    })
    // UBF (Loser) -> LBF
    calculatedLinks.push({
      source: 'ub-final',
      target: 'lb-final',
      type: 'loser',
      sourcePort: 'center',
      targetPort: 'top',
    })

    // LBSF (Winner) -> LBF
    calculatedLinks.push({
      source: 'lb-sf',
      target: 'lb-final',
      type: 'winner',
      sourcePort: 'center',
      targetPort: 'bottom',
    })
    // LBF (Winner) -> GF
    calculatedLinks.push({
      source: 'lb-final',
      target: 'grand-final',
      type: 'winner',
      sourcePort: 'center',
      targetPort: 'bottom',
    })

    const allNodeX = Object.values(calculatedNodes).map(
      (n: Node) => n.x + conf.nodeWidth,
    )
    const allNodeY = Object.values(calculatedNodes).map(
      (n: Node) => n.y + conf.nodeHeight,
    )
    const allTitleY = calculatedTitles.map((t) => t.y)

    const contentWidth = Math.max(...allNodeX, 0) // Asegurar que no sea negativo si no hay nodos
    const contentHeight = Math.max(
      ...allNodeY,
      ...allTitleY.map((y) => y + conf.titleAreaHeight),
      0,
    )

    return {
      nodes: calculatedNodes,
      links: calculatedLinks,
      titles: calculatedTitles,
      svgDimensions: {
        width: contentWidth + conf.svgPadding.left + conf.svgPadding.right,
        height: contentHeight + conf.svgPadding.top + conf.svgPadding.bottom,
        padding: conf.svgPadding,
      },
      nodeStyle: currentStyle,
    }
  }, [playoffsData])

  useEffect(() => {
    if (
      !d3Container.current ||
      !nodes ||
      !links ||
      !titles ||
      Object.keys(nodes).length === 0
    )
      return

    const svg = d3
      .select(d3Container.current)
      .attr('width', svgDimensions.width)
      .attr('height', svgDimensions.height)
      .style('background-color', 'transparent') // Removed gray background
      .style('border-radius', '8px')

    svg.selectAll('*').remove()

    const g = svg
      .append('g')
      .attr(
        'transform',
        `translate(${svgDimensions.padding.left}, ${svgDimensions.padding.top})`,
      )

    g.selectAll('.column-title')
      .data(titles)
      .enter()
      .append('text')
      .attr('class', 'column-title')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'text-before-edge')
      .style('fill', '#ff6046')
      .style('font-size', '14px') // Increased font size
      .style('font-weight', '900') // Made font weight bolder
      .style('text-transform', 'uppercase')
      .style('font-family', 'Reaver, sans-serif')
      .text((d) => d.text)

    const linkPathGenerator = d3
      .line<Point>()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(d3.curveBumpX)

    g.selectAll('.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', (d) => {
        const sourceNode = nodes[d.source]
        const targetNode = nodes[d.target]
        if (!sourceNode || !targetNode) return ''

        const sx = sourceNode.x + nodeStyle.width
        let sy = sourceNode.y
        // Ajustar sy basado en el sourcePort (si se define más granularmente)
        if (d.sourcePort === 'top') sy += nodeStyle.height * 0.25
        else if (d.sourcePort === 'bottom') sy += nodeStyle.height * 0.75
        else sy += nodeStyle.height / 2 // Centro por defecto

        const tx = targetNode.x
        let ty = targetNode.y
        if (d.targetPort === 'top') ty += nodeStyle.height * 0.25
        else if (d.targetPort === 'bottom') ty += nodeStyle.height * 0.75
        else ty += nodeStyle.height / 2 // Centro por defecto

        // Para líneas rectas de codo como en la imagen:
        const midX = sx + (tx - sx) / 2
        // Usar d3.curveLinear o generar manualmente los puntos para un path recto
        const points: Point[] = [
          { x: sx, y: sy },
          { x: midX, y: sy }, // Punto horizontal intermedio
          { x: midX, y: ty }, // Punto vertical intermedio
          { x: tx, y: ty },
        ]
        return linkPathGenerator(points) // linkPathGenerator con curveLinear daría casi esto
        // Para un control exacto de codo, se puede construir el string de path 'M sx sy L midX sy L midX ty L tx ty'
      })
      .attr('fill', 'none')
      .attr('stroke', '#ff6046') // Updated to match the accent color
      .attr('stroke-width', 2)
      .attr('opacity', 0.5) // Added opacity for a softer look

    const nodeGroups = g
      .selectAll('.node')
      .data(Object.entries(nodes))
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr(
        'transform',
        ([, node]: [string, Node]) => `translate(${node.x}, ${node.y})`,
      )

    nodeGroups
      .append('rect')
      .attr('width', nodeStyle.width)
      .attr('height', nodeStyle.height)
      .attr('fill', 'rgba(30, 30, 33, 0.5)') // Semi-transparent background
      .attr('stroke', '#ff6046')
      .attr('rx', 4)
      .attr('ry', 4)

    nodeGroups.each(function ([id, node]: [string, Node]) {
      const group = d3.select(this)
      const teamA = getTeamDetails(node.data.teams[0]?.teamid, teamsData)
      const teamB = getTeamDetails(node.data.teams[1]?.teamid, teamsData)

      const itemPadding = {
        x: 8,
        y_top_center: nodeStyle.height * 0.25,
        y_bottom_center: nodeStyle.height * 0.75,
      }
      const logoSize = 16
      const textOffsetY = 1
      const iconSize = 12

      // Equipo A
      const teamAGroup = group
        .append('g')
        .attr(
          'transform',
          `translate(${itemPadding.x}, ${itemPadding.y_top_center})`,
        )
      if (teamA.logo && teamA.name !== 'TBD') {
        teamAGroup
          .append('image')
          .attr('href', `/images/teams/${teamA.logo}`)
          .attr('x', 0)
          .attr('y', -logoSize / 2)
          .attr('width', logoSize)
          .attr('height', logoSize)
          .attr('clip-path', `circle(${logoSize / 2}px at center)`)
      }
      teamAGroup
        .append('text')
        .attr('x', teamA.logo && teamA.name !== 'TBD' ? logoSize + 5 : 0)
        .attr('y', textOffsetY)
        .attr('dominant-baseline', 'middle')
        .style('fill', teamA.name === 'TBD' ? '#ff6046' : 'white')
        .style('font-size', '14px') // Increased font size
        .style('font-weight', '600') // Added font weight
        .style('font-family', 'Reaver, sans-serif')
        .text(teamA.name)

      // Equipo B
      const teamBGroup = group
        .append('g')
        .attr(
          'transform',
          `translate(${itemPadding.x}, ${itemPadding.y_bottom_center})`,
        )
      if (teamB.logo && teamB.name !== 'TBD') {
        teamBGroup
          .append('image')
          .attr('href', `/images/teams/${teamB.logo}`)
          .attr('x', 0)
          .attr('y', -logoSize / 2)
          .attr('width', logoSize)
          .attr('height', logoSize)
          .attr('clip-path', `circle(${logoSize / 2}px at center)`)
      }
      teamBGroup
        .append('text')
        .attr('x', teamB.logo && teamB.name !== 'TBD' ? logoSize + 5 : 0)
        .attr('y', textOffsetY)
        .attr('dominant-baseline', 'middle')
        .style('fill', teamB.name === 'TBD' ? '#ff6046' : 'white')
        .style('font-size', '14px') // Increased font size
        .style('font-weight', '600') // Added font weight
        .style('font-family', 'Reaver, sans-serif')
        .text(teamB.name)

      // Línea separadora interna
      group
        .append('line')
        .attr('x1', 0)
        .attr('y1', nodeStyle.height / 2)
        .attr('x2', nodeStyle.width)
        .attr('y2', nodeStyle.height / 2)
        .attr('stroke', '#ff6046')
        .attr('opacity', 0.3)
    })
  }, [nodes, links, titles, svgDimensions, nodeStyle, teamsData])

  if (!nodes || Object.keys(nodes).length === 0) {
    return <div className="p-4 text-white">Cargando datos del bracket...</div>
  }

  return (
    <div className="flex flex-col items-center py-8 text-white">
      <div className="w-full max-w-[1024px] overflow-x-auto">
        <div className="min-w-[1024px]">
          <svg ref={d3Container}></svg>
        </div>
      </div>
    </div>
  )
}

export default PlayoffsBracketD3
