import type { PropsWithChildren } from 'react'
import React from 'react'
import Header from '../Header'
import hero from '../../assets/images/hero.avif'
const Layout: React.FC<PropsWithChildren> = ({ children, ...rest }) => {
  return (
    <>
      <Header />
      {/* Background image and overlay */}
      <div
        className="mask-fade-bottom absolute inset-0 w-full bg-cover bg-center"
        style={{ backgroundImage: `url('${hero}')` }}
      />
      <div className="mask-fade-bottom absolute inset-0 w-full bg-black opacity-10" />
      <main className="relative z-10">{children}</main>
    </>
  )
}

export default Layout
