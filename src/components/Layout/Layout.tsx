import type { PropsWithChildren } from 'react'
import React from 'react'
import Header from '../Header'

const Layout: React.FC<PropsWithChildren> = ({ children, ...rest }) => {
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
    </>
  )
}

export default Layout
