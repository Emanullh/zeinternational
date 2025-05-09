import React, { useState, useEffect } from 'react'
import logo_nav from '@/assets/images/logo_nav.webp'
const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header
      className={`fixed top-0 z-50 mx-auto flex h-20 w-full select-none items-center text-white md:h-20 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-md shadow-lg' : ''
      }`}
    >
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
          className={`fixed inset-0 bg-[#2b2836]/50 ${menuOpen ? 'block' : 'hidden'} md:hidden`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Navigation */}
        <nav
          id="navContent"
          className={`
    /* ---------- MÓVIL (slide) ---------- */
    fixed top-0 right-0 z-40
    h-screen w-64
    bg-black
    transform transition-transform duration-300 ease-out
    ${
      menuOpen
        ? 'translate-x-0 pointer-events-auto'
        : 'translate-x-full pointer-events-none'
    }

    /* ---------- ESCRITORIO ---------- */
    md:static
    md:top-auto md:right-auto
    md:h-auto md:w-full
    md:bg-transparent
    md:transform-none md:translate-x-0 md:pointer-events-auto
    md:flex md:items-center md:justify-between
    md:px-6 md:py-4
    md:space-y-0
    lg:text-sm
    md:max-w-6xl md:mx-auto
    /* ---------- Contenido ---------- */
    items-center justify-between space-y-2
    px-6 pt-14 text-xs font-light
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
              href="/matches"
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

            {/* Partida en vivo link */}
            <a
              href="/live-match"
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
                PARTIDA EN VIVO
              </span>
            </a>

            {/* Estadisticas link 
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
            </a>*/}
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
                <span className="absolute inset-0 top-3.5 mt-1 text-left text-[10px] leading-normal tracking-wide text-yellow-500 md:text-center">
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
