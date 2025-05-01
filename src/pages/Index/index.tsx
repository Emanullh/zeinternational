import React, { memo, Suspense } from 'react'

import Box from '../../components/Box'
import Spinner from '../../components/Spinner'
import logo from '../../logo.svg'

import Counter from './Counter'
import DocList from './DocList'
import styles from './index.module.css'
import Hero from '../../components/Hero/Hero'
interface Props {}

const Index: React.FC<Props> = memo(() => {
  return (
    <>
      <Hero />
    </>
  )
})
Index.displayName = 'Index'

export default Index
