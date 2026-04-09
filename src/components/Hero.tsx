import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_BANNERS } from '@/src/constants';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % HERO_BANNERS.length);
  const prev = () => setCurrent((prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length);

  if (!HERO_BANNERS || HERO_BANNERS.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full h-[180px] sm:h-[220px] md:h-[300px] lg:h-[360px] overflow-hidden bg-gray-100 mb-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img 
            src={HERO_BANNERS[current].image || '/default-hero.png'} 
            alt={HERO_BANNERS[current].title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => (e.currentTarget.src = '/default-hero.png')}
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 w-full text-center">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl mx-auto text-white space-y-2 md:space-y-3"
              >
                <h2 className="text-xl md:text-3xl lg:text-4xl font-bold leading-tight drop-shadow-md">
                  {HERO_BANNERS[current].title}
                </h2>
                <p className="text-[10px] md:text-sm text-gray-100 drop-shadow-sm max-w-md mx-auto">
                  {HERO_BANNERS[current].subtitle}
                </p>
                <Link 
                  to={HERO_BANNERS[current].ctaLink}
                  className="inline-block bg-[#f85606] text-white px-5 py-1.5 md:px-8 md:py-2.5 rounded-full text-xs md:text-sm font-bold hover:bg-[#d94800] transition-all transform hover:scale-105 shadow-lg"
                >
                  {HERO_BANNERS[current].ctaText}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button 
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 p-1.5 rounded-full text-white transition-all hidden md:block"
      >
        <ChevronLeft size={20} />
      </button>
      <button 
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 p-1.5 rounded-full text-white transition-all hidden md:block"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {HERO_BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300",
              current === i ? "bg-[#f85606] w-4 md:w-6" : "bg-white/60"
            )}
          />
        ))}
      </div>
    </section>
  );
}
