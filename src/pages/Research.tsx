/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useData } from '../context/DataContext';
import { parseItalicText, parseFormattedText } from '../lib/textUtils';

export default function Research() {
  const { research, siteSettings } = useData();

  return (
    <div className="bg-brand-paper min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[50vh] flex flex-col justify-center relative px-6 md:px-20 overflow-hidden text-white">
        <div className="absolute inset-0 z-0 bg-brand-ink">
          <img 
            src={siteSettings.researchHeroImg} 
            alt="Research background" 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-ink/40" />
        </div>

        <div className="container-custom relative z-10 pt-32 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-8 h-6">
              <div className="h-[1px] w-12 bg-brand-gold" />
              <span className="text-[12px] font-bold tracking-[0.4em] uppercase text-brand-gold leading-none pb-[1px]">
                {parseFormattedText(siteSettings.researchHeroSub ?? "Research Areas")}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif leading-tight mb-8 font-medium tracking-tight">
              {siteSettings.researchHeroTitle ? (
                siteSettings.researchHeroTitle.includes("Molecular") ? (
                  <>
                    {parseFormattedText(siteSettings.researchHeroTitle.split("Molecular")[0])}
                    <span className="text-brand-gold italic font-normal">Molecular</span>
                    {parseFormattedText(siteSettings.researchHeroTitle.split("Molecular")[1])}
                  </>
                ) : (
                  parseFormattedText(siteSettings.researchHeroTitle)
                )
              ) : (
                <>
                  Exploring the <span className="text-brand-gold italic font-normal">Molecular</span> Frontier
                </>
              )}
            </h1>

            <p className="max-w-2xl text-brand-paper/60 font-light leading-relaxed text-lg tracking-tight">
              {parseFormattedText(siteSettings.researchHeroDesc ?? "We employ high-performance computing to reveal the underlying physics of complex biological systems and advanced materials.")}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom">
        {/* Research Items */}
        <div className="space-y-48 mb-60 mt-32">
          {research.map((item, index) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 md:gap-32 items-center`}
            >
              <div className="flex-1 space-y-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-bold tracking-[0.4em] uppercase text-brand-gold">{item.subtitle}</span>
                  </div>
                  
                  <Link to={`/research/${item.id}`} className="group block">
                    <h2 className="text-3xl md:text-4xl font-serif group-hover:text-brand-gold transition-colors duration-500 leading-tight text-brand-ink">
                      {item.title}
                    </h2>
                  </Link>
                  
                  <p className="text-base text-brand-muted font-light leading-relaxed opacity-80 line-clamp-2">
                    {item.shortDescription}
                  </p>
                </div>

                <div className="pt-8 border-t border-brand-ink/5 flex items-center justify-end">
                  <Link 
                    to={`/research/${item.id}`}
                    className="inline-flex items-center gap-3 text-[12px] font-bold tracking-[0.3em] uppercase text-brand-ink group"
                  >
                    <span className="border-b border-brand-gold/30 pb-1 group-hover:border-brand-gold group-hover:text-brand-gold transition-all">Details</span>
                    <Plus size={14} className="text-brand-gold transition-transform group-hover:rotate-90" />
                  </Link>
                </div>
              </div>

              <div className="md:w-[448px] w-full shrink-0">
                <Link to={`/research/${item.id}`} className="block relative aspect-video overflow-hidden group border border-brand-ink/5 bg-white">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-contain transition-all duration-1000 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-brand-ink/5 flex items-center justify-center">
                      <span className="text-[10px] text-brand-muted opacity-40">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-brand-ink/5 group-hover:opacity-0 transition-opacity" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
