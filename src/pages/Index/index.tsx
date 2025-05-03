import React, { memo } from 'react'

import Hero from './components/Hero'
import Layout from '@/components/Layout/Layout'
interface Props {}

const Index: React.FC<Props> = memo(() => {
  return (
    <Layout>
      <Hero />
    </Layout>
  )
})
Index.displayName = 'Index'

export default Index
