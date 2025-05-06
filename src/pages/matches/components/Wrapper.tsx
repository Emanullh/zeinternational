import React from 'react'
import hero from '../../../assets/images/hero.avif'

interface HeroProps {
  backgroundImageUrl?: string
}

const Wrapper: React.FC<HeroProps> = ({ backgroundImageUrl = hero }) => {
  return (
    <section className="relative flex min-h-screen w-full">
      {/* Background image and overlay */}
      <div
        className="mask-fade-bottom absolute inset-0 w-full bg-cover bg-center"
        style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
      />
      <div className="mask-fade-bottom absolute inset-0 w-full bg-black opacity-10" />
    </section>
  )
}

export default Wrapper
