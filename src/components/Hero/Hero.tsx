import React from 'react'
import hero from '../../hero.avif'
import logo_zeinternational from '../../logo.webp'
interface HeroProps {
  backgroundImageUrl?: string
  logoUrl?: string
  dateText?: string
  locationLink?: string
  locationText?: string
  twitchUrl?: string
  twitchText?: string
}

const Hero: React.FC<HeroProps> = ({
  backgroundImageUrl = hero,
  logoUrl = logo_zeinternational,
  dateText = '24 DE MAYO',
  locationLink = 'https://maps.app.goo.gl/JcyQCJghuztPJ9HV7',
  locationText = 'FINAL PRESENCIAL',
  twitchUrl = 'https://kick.com/elzeein',
  twitchText = 'KICK.COM ELZEEIN',
}) => (
  <section className="relative flex min-h-screen w-full">
    {/* Background image and overlay */}
    <div
      className="mask-fade-bottom animate-fade-in absolute inset-0 w-full bg-cover bg-center"
      style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
    />
    <div className="mask-fade-bottom absolute inset-0 w-full bg-black opacity-10" />

    {/* Content container */}
    <div className="relative flex w-full flex-col items-center p-8 text-center">
      <div
        id="landing"
        className="absolute top-0 flex w-full flex-col items-center py-16"
      >
        <h3 className="animate-fade-in animate-delay-300 tracking mt-4 font-black leading-[100%] sm:text-xl font-radiance text-white">
          {dateText}
        </h3>

        <figure className="animate-fade-in relative">
          <img
            className="relative z-20 h-auto w-60 sm:w-80 md:w-96 lg:w-[30rem]"
            src={logoUrl}
            alt="Event Logo"
          />
          {
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-pink-400/60 blur-2xl" />
          }
        </figure>

        <div className="relative z-10 mt-4 flex flex-col items-center space-y-4">
          <h2 className="animate-fade-in animate-delay-500">
            <a
              href={locationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-notosans tracking-wider text-xl sm:text-2xl md:text-3xl font-[900] leading-tight text-white"
            >
              {locationText.split(',')[0]}
              <br />
              {locationText.split(',')[1]}
            </a>
          </h2>

          {/* Separator */}
          <div className="w-[80px] h-[3px] bg-[#ff6046] rounded-[1px]" />

          <a
            href={twitchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-notosans tracking-wider text-xl sm:text-2xl md:text-3xl font-[900] leading-tight text-white"
          >
            {twitchText.split(' ')[0]}
            <br />
            {twitchText.split(' ')[1]}
          </a>
        </div>
      </div>
    </div>
  </section>
)

export default Hero
