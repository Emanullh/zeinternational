import React, { useState } from 'react'
import logo_nav from '@/assets/images/logo_nav.webp'
const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 mx-auto flex h-20 w-full select-none items-center text-white sm:h-screen sm:overflow-hidden md:h-20">
      <div className="flex justify-between px-6 py-4 md:w-full">
        {/* Mobile logo */}
        <a
          href="/"
          className="cursor-pointer transition duration-300 hover:scale-110 md:hidden"
        >
          <img src={logo_nav} alt="logo" className="h-auto w-7" />
        </a>

        {/* Mobile menu button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={`${menuOpen ? 'Close' : 'Open'} menu`}
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* Overlay */}
        <div
          id="overlay-menu"
          className={`bg-theme-raisin-black/50 fixed inset-0 ${menuOpen ? 'block' : 'hidden'} h-screen md:hidden`}
        />

        {/* Navigation */}
        <nav
          id="navContent"
          className={`bg-theme-french-mauve/90 fixed right-0 top-0 mx-auto h-screen max-w-6xl transform transition-transform duration-300 ease-out
            ${menuOpen ? 'visible translate-x-0' : 'invisible translate-x-full'}
            items-center justify-between space-y-2 px-6 pt-14 text-xs font-light backdrop-blur-2xl
            md:visible md:relative md:flex md:!h-fit md:w-full md:translate-x-0 md:space-y-0 md:bg-transparent md:py-4 md:backdrop-blur-none lg:text-sm
          `}
        >
          <div className="flex flex-col justify-start space-y-2 md:flex-row md:gap-8 md:space-y-0 md:flex-grow">
            {/* Desktop logo as nav item */}
            <a
              href="/"
              className="hidden md:inline-block cursor-pointer transition duration-300 hover:scale-110 w-fit"
            >
              <img src={logo_nav} alt="logo" className="h-auto w-10" />
            </a>

            {/* Partidas link */}
            <a
              href="#"
              className="group inline-flex items-center relative py-1 tracking-wider "
            >
              <span
                className="
                  font-goudytrajan
                  font-bold
                  relative
                  after:content-['']
                  after:absolute
                  after:-bottom-0.5
                  after:left-0
                  after:w-full
                  after:h-[2px]
                  after:bg-[#ff6046]
                  after:origin-center
                  after:scale-x-0
                  after:transition-transform
                  after:duration-300
                  after:ease-out
                  group-hover:after:scale-x-100
                "
              >
                PARTIDAS
              </span>
            </a>

            {/* Estadisticas link */}
            <a
              href="#"
              className="group inline-flex items-center relative py-1 tracking-wider"
            >
              <span
                className="
                  font-goudytrajan
                  font-bold
                  relative
                  after:content-['']
                  after:absolute
                  after:-bottom-0.5
                  after:left-0
                  after:w-full
                  after:h-[2px]
                  after:bg-[#ff6046]
                  after:origin-center
                  after:scale-x-0
                  after:transition-transform
                  after:duration-300
                  after:ease-out
                  group-hover:after:scale-x-100
                "
              >
                ESTADÍSTICAS
              </span>
            </a>
          </div>

          {/* Buy tickets */}
          <div>
            <a
              href="#"
              className="w-full group relative flex-col items-end py-1 leading-relaxed tracking-wider md:text-right md:flex-grow"
              rel="noopener noreferrer"
              target="_blank"
              title="Comprar entradas para Zeinternacional"
            >
              <span
                id="buy-tickets"
                className="font-goudytrajan neon-text relative inline-block font-bold"
              >
                COMPRA LAS ENTRADAS
                <span className="absolute  inset-0 top-3.5 mt-1 text-left text-[10px] leading-normal tracking-wide text-yellow-500 md:text-center">
                  PROXIMAMENTE
                </span>
              </span>
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
