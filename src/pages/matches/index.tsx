import React, { memo } from 'react'

import TournamentView from './TournamentView'
interface Props {}

const MatchesPage: React.FC<Props> = memo(() => {
  return <TournamentView />
})
MatchesPage.displayName = 'MatchesPage'

export default MatchesPage
