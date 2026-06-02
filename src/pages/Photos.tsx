/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { parseItalicText, parseFormattedText } from '../lib/textUtils';

export default function Photos() {
  const { gallery, siteSettings } = useData();

  return (
    <div className="bg-brand-paper min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col justify-center relative px-6 md:px-20 overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src={siteSettings.photosHeroImg} 
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
              <span className="text-[12px] font-bold tracking-[0.4em] uppercase text-brand-gold leading-none pb-[1px]">
                {parseFormattedText(siteSettings.photosHeroSub ?? "CMML · GALLERY")}
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-serif leading-[1.1] mb-10 font-medium tracking-tight">
              {siteSettings.photosHeroTitle ? (
                siteSettings.photosHeroTitle.includes("Gallery") ? (
                  <>
                    {parseFormattedText(siteSettings.photosHeroTitle.replace("Gallery", "").trim())}{" "}
                    <span className="text-brand-gold italic font-normal">Gallery</span>
                  </>
                ) : (
                  parseFormattedText(siteSettings.photosHeroTitle)
                )
              ) : (
                <>
                  Lab <span className="text-brand-gold italic font-normal">Gallery</span>
                </>
              )}
            </h1>

            <p className="max-w-2xl text-brand-paper/70 font-light leading-relaxed text-lg md:text-xl tracking-tight">
              {parseFormattedText(siteSettings.photosHeroDesc ?? "Moments from our laboratory — research, conferences, outings and celebrations.")}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom pt-32">

        {/* Photos Grid */}
        <div className="mb-60">
          {gallery.length === 0 ? (
            <div className="text-center py-20 opacity-30">
              <p className="font-serif italic text-xl">No photos available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8 auto-rows-[210px] grid-flow-row-dense">
              {gallery.map((photo, idx) => {
                const blockIdx = idx % 5;
                const photosLeft = gallery.length - idx;
                const isLarge = blockIdx === 0 && photosLeft > 1;
                
                return (
                  <motion.div 
                    key={photo.id || idx}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx % 20) * 0.05, duration: 0.8 }}
                    className={`${isLarge ? 'col-span-2 row-span-2' : 'col-span-1'} bg-brand-ink/[0.03] overflow-hidden group relative shadow-md ring-1 ring-brand-ink/5 rounded-2xl flex items-center justify-center`}
                  >
                    <img 
                      src={photo.url} 
                      alt={`Lab photo ${idx}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000 object-center" 
                      referrerPolicy="no-referrer" 
                    />
                    <div className="absolute inset-0 bg-brand-ink/5 group-hover:bg-transparent transition-colors duration-700 pointer-events-none" />
                    <div className="absolute inset-0 border border-brand-ink/5 pointer-events-none" />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
