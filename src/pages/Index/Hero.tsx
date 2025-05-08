import React from 'react'
import hero from '../../assets/images/hero.avif'
import logo from '../../assets/images/logo.webp'
import CardSelector from './components/CardSelector'
import { useSelectedParticipantStore } from '@/stores/useSelectedParticipantStore'
import { useParticipantsStore } from '@/stores/useParticipantsStore'
import { useTeamsStore } from '@/stores/useTeamsStore'
import { TeamMembersCards } from './components/TeamMembersCards'
import { motion } from 'motion/react'
import { useIntegrates } from '@/hooks/useIntegrates'

interface HeroProps {
  backgroundImageUrl?: string
  logoUrl?: string
  dateText?: string
  locationLink?: string
  locationText?: string
  twitchUrl?: string
  twitchText?: string
  castersText?: string
}

// Custom CSS for screen range visibility
const customStyles = `
  @media (min-width: 768px) and (max-width: 1440px) {
    .hide-between-md-xl {
      display: none !important;
    }
    .only-twitch-visible {
      display: block !important;
    }
  }
`

const Hero: React.FC<HeroProps> = ({
  backgroundImageUrl = hero,
  logoUrl = logo,
  dateText = '10 DE MAYO',
  locationLink = 'https://maps.app.goo.gl/JcyQCJghuztPJ9HV7',
  locationText = 'FINAL PRESENCIAL',
  castersText = 'CASTERS INTERNACIONALES',
  twitchUrl = 'https://kick.com/elzeein',
  twitchText = 'KICK.COM ELZEEIN',
}) => {
  const { isLoading, error } = useIntegrates();
  const selectedId = useSelectedParticipantStore((s) => s.selectedId)
  const participant = useParticipantsStore((s) =>
    selectedId != null ? s.getById(selectedId) : undefined,
  )
  const teamData = useTeamsStore((s) =>
    participant ? s.getById(participant.teamId) : undefined,
  )

  // Define animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  }

  return (
    <section className="relative flex min-h-screen w-full">
      {/* Add custom styles */}
      <style>{customStyles}</style>

      {/* Background image and overlay */}
      <div
        className="mask-fade-bottom absolute inset-0 w-full bg-cover bg-center"
        style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
      />
      <div className="mask-fade-bottom absolute inset-0 w-full bg-black opacity-10" />
      {/* Content container */}
      <div className="relative flex w-full flex-col items-center p-8 text-center">
        {selectedId ? (
          <div
            id="landing"
            className="absolute 2xl:top-30 top-0 flex w-full flex-col items-center py-16"
          >
            <TeamMembersCards />
          </div>
        ) : (
          <div
            id="landing"
            className="absolute top-0 flex w-full flex-col items-center py-16"
          >
            <motion.h3
              className="tracking mt-4 font-black leading-[100%] text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-radiance text-white hide-between-md-xl"
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeInUp}
            >
              {dateText}
            </motion.h3>

            <motion.figure
              className="relative"
              initial="hidden"
              animate="visible"
              custom={1}
              variants={fadeInUp}
            >
              <img
                className="relative z-20 h-auto w-40 xs:w-48 sm:w-64 md:w-80 lg:w-96"
                src={logoUrl}
                alt="Event Logo"
              />
              {
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-pink-400/60 blur-2xl" />
              }
            </motion.figure>

            <div className="relative z-10 mt-4 flex flex-col items-center space-y-4">
              <motion.h2
                initial="hidden"
                animate="visible"
                custom={2}
                variants={fadeInUp}
                className="hide-between-md-xl"
              >
                <a
                  href={locationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-notosans tracking-wider text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-[900] leading-tight text-white"
                >
                  {locationText.split(',')[0]}
                  <br />
                  {locationText.split(',')[1]}
                </a>
              </motion.h2>

              {/* Separator */}
              <motion.div
                className="w-[40px] sm:w-[50px] md:w-[60px] h-[1px] sm:h-[2px] md:h-[3px] bg-[#ff6046] rounded-[1px] hide-between-md-xl"
                initial="hidden"
                animate="visible"
                custom={3}
                variants={fadeInUp}
              />

              <motion.h2
                initial="hidden"
                animate="visible"
                custom={4}
                variants={fadeInUp}
                className="hide-between-md-xl"
              >
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-notosans tracking-wider text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-[900] leading-tight text-white"
                >
                  {castersText}
                </a>
              </motion.h2>

              {/* Separator */}
              <motion.div
                className="w-[40px] sm:w-[50px] md:w-[60px] h-[1px] sm:h-[2px] md:h-[3px] bg-[#ff6046] rounded-[1px] hide-between-md-xl"
                initial="hidden"
                animate="visible"
                custom={5}
                variants={fadeInUp}
              />

              <motion.a
                href={twitchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-notosans tracking-wider text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-[900] leading-tight text-white only-twitch-visible"
                initial="hidden"
                animate="visible"
                custom={6}
                variants={fadeInUp}
              >
                {twitchText.split(' ')[0]}
                <br />
                {twitchText.split(' ')[1]}
              </motion.a>
            </div>

            <motion.div
              className="text-center mt-8 sm:mt-10 md:mt-12 lg:mt-16 hide-between-md-xl"
              initial="hidden"
              animate="visible"
              custom={7}
              variants={fadeInUp}
            >
              <h2 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold font-reaver text-white">
                <span className="text-[#ff6046]">10 000</span> dolares de prize
                pool
              </h2>
            </motion.div>
          </div>
        )}
        {/* ←–– Card selector always lives here */}
        <div className="relative flex h-full w-full max-w-6xl flex-col items-center justify-end gap-8 sm:p-4">
          <CardSelector />
        </div>
      </div>
    </section>
  )
}

export default Hero
