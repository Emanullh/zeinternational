import React from 'react';
import { motion } from 'motion/react';
import { useInView } from 'motion/react';

const Sponsors: React.FC = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="w-full py-16 bg-black/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <motion.h2 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-center text-white uppercase tracking-wider font-notosans"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            AUSPICIADORES
          </motion.h2>

          <motion.div
            className="w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[350px] h-[1px] sm:h-[2px] md:h-[3px] bg-[#ff6046] rounded-[1px] mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>

        <motion.div
          ref={ref}
          className="relative flex justify-center items-center max-w-[2000px] mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div
            className="relative transition-transform duration-300 ease-out"
            variants={itemVariants}
          >
            <div className="relative w-[300px] sm:w-[400px] lg:w-[450px] h-[320px] sm:h-[460px] lg:h-[330px]">
              {/* Blurred background image */}
              <div className="absolute inset-0 -z-10">
                <div className="relative w-full h-full scale-105">
                  <img
                    src="/images/auspiciadores/micasino.webp"
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-center opacity-70 blur-xl brightness-75"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              {/* Main image */}
              <div className="relative w-full h-full mask-fade-bottom">
                <img
                  src="/images/auspiciadores/micasino.webp"
                  alt="MiCasino"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Sponsors; 