import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'motion/react'

const Footer: React.FC = () => {
  const createdByText = 'Created by eMxnu'
  const discordText = 'Discord: eMxnu'
  const footerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When footer comes into view
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Once triggered, no need to observe anymore
          if (footerRef.current) observer.unobserve(footerRef.current)
        }
      },
      {
        threshold: 0.1, // Trigger when at least 10% of the footer is visible
        rootMargin: '0px', // No margin
      },
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => {
      if (footerRef.current) observer.unobserve(footerRef.current)
    }
  }, [])

  // Animation configuration
  const letterAnimation = {
    hidden: { y: 0, opacity: 0 },
    visible: (i: number) => ({
      y: [0, -10, 0],
      opacity: 1,
      transition: {
        y: {
          duration: 0.5,
          ease: 'easeOut',
        },
        opacity: {
          duration: 0.1,
        },
        delay: i * 0.05,
      },
    }),
  }

  return (
    <footer ref={footerRef} className="w-full text-white py-4">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-center sm:justify-between items-center text-xs md:text-sm">
        <div className="mb-2 sm:mb-0">
          {createdByText.split('').map((char, index) => (
            <motion.span
              key={`created-${index}`}
              custom={index}
              initial="hidden"
              animate={isVisible ? 'visible' : 'hidden'}
              variants={letterAnimation}
              className="inline-block"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </div>
        <a
          href="http://discordapp.com/users/451437580127305739"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center relative py-1 tracking-wider"
        >
          <span
            className="
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
            {discordText.split('').map((char, index) => (
              <motion.span
                key={`discord-${index}`}
                custom={index + createdByText.length} // Continue sequence from the first text
                initial="hidden"
                animate={isVisible ? 'visible' : 'hidden'}
                variants={letterAnimation}
                className="inline-block"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </span>
        </a>
      </div>
    </footer>
  )
}

export default Footer
