import type { PropsWithChildren } from 'react'
import React from 'react'
import Header from '../Header'
import Footer from '../Footer'
const Layout: React.FC<PropsWithChildren> = ({ children, ...rest }) => {
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  )
}

export default Layout
