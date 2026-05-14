/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useData } from '../context/DataContext';

export default function Photos() {
  const { gallery } = useData();

  // Group gallery items by year and month
  const albums = gallery.reduce((acc, photo) => {
    const key = `${photo.year}-${photo.month}`;
    if (!acc[key]) {
      acc[key] = {
        id: key,
        year: photo.year,
        month: photo.month,
        photos: []
      };
    }
    acc[key].photos.push({
      url: photo.url,
      alt: `Lab photo ${photo.year}-${photo.month}`
    });
    return acc;
  }, {} as Record<string, { id: string; year: number; month: number; photos: { url: string; alt: string }[] }>);

  const sortedAlbums = (Object.values(albums) as { id: string; year: number; month: number; photos: { url: string; alt: string }[] }[]).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  return (
    <div className="bg-brand-paper min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col justify-center relative px-6 md:px-20 overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=2670" 
            alt="Gallery background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-ink/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-ink/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/90 via-transparent to-brand-ink/20" />
        </div>

        <div className="container-custom relative z-10 pt-40 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-10 h-6">
              <div className="h-[1px] w-12 bg-brand-gold" />
              <span className="text-[12px] font-bold tracking-[0.4em] uppercase text-brand-gold leading-none pb-[1px]">CMML · GALLERY</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-serif leading-[1.1] mb-10 font-medium tracking-tight">
              Lab <span className="text-brand-gold italic font-normal">Gallery</span>
            </h1>

            <p className="max-w-2xl text-brand-paper/70 font-light leading-relaxed text-lg md:text-xl tracking-tight">
              Moments from our laboratory — research, conferences, 
              outings and celebrations.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom pt-32">

        {/* Albums Grid */}
        <div className="space-y-60 mb-60">
          {sortedAlbums.length === 0 ? (
            <div className="text-center py-20 opacity-30">
              <p className="font-serif italic text-xl">No photos available yet.</p>
            </div>
          ) : (
            sortedAlbums.map((album) => (
              <motion.section 
                key={album.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                {/* Date Header */}
                <div className="flex flex-col mb-16">
                  <div className="flex items-end gap-6">
                    <span className="text-7xl font-serif text-brand-ink leading-none">{album.year}</span>
                    <div className="h-[1px] flex-grow bg-brand-ink/10 mb-2" />
                    <span className="text-[13px] font-bold tracking-[0.5em] uppercase text-brand-gold pb-1">{album.month}월</span>
                  </div>
                </div>

                {/* Dynamic Grid: 1 Large + 4 Small Pattern with dense flow to fill gaps */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8 auto-rows-[210px] grid-flow-row-dense">
                  {album.photos.map((photo, idx) => {
                    const blockIdx = idx % 5;
                    const photosLeft = album.photos.length - idx;
                    const isLarge = blockIdx === 0 && photosLeft > 1;
                    
                    return (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: (idx % 5) * 0.1 }}
                        className={`${isLarge ? 'col-span-2 row-span-2' : 'col-span-1'} bg-brand-ink/5 overflow-hidden group relative shadow-md ring-1 ring-brand-ink/5 rounded-2xl`}
                      >
                        <img 
                          src={photo.url} 
                          alt={photo.alt} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000 object-center" 
                          referrerPolicy="no-referrer" 
                        />
                        <div className="absolute inset-0 bg-brand-ink/5 group-hover:bg-transparent transition-colors duration-700" />
                        <div className="absolute inset-0 border border-brand-ink/5 pointer-events-none" />
                      </motion.div>
                    );
                  })}
                </div>
              </motion.section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
