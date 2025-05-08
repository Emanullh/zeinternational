import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { casters } from '@/data/casters';
import { useTTS } from '@/hooks/useTTS';

const Casters: React.FC = () => {
  const ref = React.useRef(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { generateTTS } = useTTS();
  const [selectedCaster, setSelectedCaster] = useState<string | null>(null);
  const [ttsText, setTtsText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCasterClick = (casterId: string) => {
    setSelectedCaster(casterId);
    setTtsText('');
    setAudioUrl(null);
    setError(null);
    // Scroll to textarea when clicking on a caster
    if (textareaRef.current) {
      textareaRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    if (words.length <= 30) {
      setTtsText(text);
    }
  };

  const wordCount = ttsText.trim().split(/\s+/).filter(word => word.length > 0).length;

  const handlePlayTTS = async () => {
    if (!selectedCaster || !ttsText) return;

    const caster = casters.find(c => c.id === selectedCaster);
    if (!caster) return;

    setIsLoading(true);
    setAudioUrl(null); // Clear previous audio
    setError(null); // Clear previous error
    try {
      const { audioUrl: url, error: ttsError } = await generateTTS(ttsText, caster.voiceId);
      if (ttsError) {
        setError(ttsError.details.originalError);
      } else {
        setAudioUrl(url);
      }
    } catch (error) {
      console.error('Error generating TTS:', error);
      setError('Ocurrió un error al generar el audio. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

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
    <section className="w-full py-16 md:min-h-[90vh] bg-black/50 md:overflow-y-hidden">
      <div className="container mx-auto px-4 h-full flex flex-col">
        <div className="flex flex-col items-center mb-12">
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white uppercase tracking-[0.2em] font-notosans"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            CASTERS
          </motion.h2>

          <motion.div
            className="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] h-[2px] sm:h-[3px] md:h-[4px] lg:h-[5px] bg-[#ff6046] rounded-[1px] mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>

        <motion.div
          ref={ref}
          className="relative flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-0 max-w-[2000px] mx-auto flex-1"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {casters.map((caster, index) => (
            <motion.div
              key={caster.id}
              className={`relative transition-transform duration-300 ease-out cursor-pointer ${
                selectedCaster === caster.id 
                  ? 'scale-110 z-[100]' 
                  : 'hover:scale-110 hover:z-[100]'
              } ${index !== 0 ? 'lg:-ml-[150px]' : ''}`}
              style={{
                zIndex: selectedCaster === caster.id ? 100 : casters.length - index
              }}
              variants={itemVariants}
              onClick={() => handleCasterClick(caster.id)}
            >
              <div className="relative w-[300px] sm:w-[400px] lg:w-[350px] xl:w-[400px] h-auto">
                {/* Blurred background image */}
                <div className="absolute inset-0 -z-10">
                  <div className="relative w-full h-full scale-105">
                    <img
                      src={caster.image}
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
                    src={caster.image}
                    alt={caster.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute bottom-10 left-0 right-0 text-center">
                  <h3 className="text-2xl font-bold text-white font-reaver bg-black/50 px-4 py-2 inline-block rounded-2xl">
                    {caster.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Dropdown */}
        <div className="lg:hidden my-8">
          <select
            value={selectedCaster || ''}
            onChange={(e) => handleCasterClick(e.target.value)}
            className="w-full bg-black/50 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6046]"
          >
            <option value="">Selecciona un caster</option>
            {casters.map((caster) => (
              <option key={caster.id} value={caster.id}>
                {caster.name}
              </option>
            ))}
          </select>
        </div>

        {/* TTS Section */}
        {selectedCaster && (
          <div className="mt-8 lg:mt-12 w-full">
            <div className="bg-black/30 p-6 rounded-lg flex flex-col items-center">
              <textarea
                ref={textareaRef}
                value={ttsText}
                onChange={handleTextChange}
                placeholder="Escribe lo que quieres que diga el caster... (máximo 30 palabras)"
                className="w-[60%] min-w-[300px] h-[4.5rem] bg-black/50 text-white p-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#ff6046]"
              />
              <div className="text-xs text-gray-400 mt-1 text-right w-[60%] min-w-[300px]">
                {wordCount}/30 palabras
              </div>
              {error && (
                <div className="mt-2 text-red-500 text-sm w-[60%] min-w-[300px]">
                  {error}
                </div>
              )}
              <div className="mt-4 flex justify-end w-[60%] min-w-[300px]">
                <button
                  onClick={handlePlayTTS}
                  disabled={isLoading || !ttsText}
                  className="bg-[#ff6046] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#ff6046]/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="animate-spin">⌛</span>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Generar Audio
                    </>
                  )}
                </button>
              </div>
              {audioUrl && (
                <div className="mt-4">
                  <audio controls className="w-full">
                    <source src={audioUrl} type="audio/mpeg" />
                    Tu navegador no soporta el elemento de audio.
                  </audio>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Casters;
