import React, { memo } from 'react'

import Hero from './Hero'
import Casters from './Casters'
import Sponsors from './Sponsors'

interface Props {}

const Index: React.FC<Props> = memo(() => {
  return (
    <>
      <Hero />
      <Casters />
    </>
  )
})
Index.displayName = 'Index'

export default Index
