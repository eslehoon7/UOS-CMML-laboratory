/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Publications() {
  const { publications } = useData();
  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>({});

  const toggleYear = (year: number) => {
    setExpandedYears(prev => ({
      ...prev,
      [year]: !prev[year]
    }));
  };
  // Group publications by year
  const groupedPublications = publications.reduce((acc, pub) => {
    const year = pub.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(pub);
    return acc;
  }, {} as Record<number, typeof publications>);

  // Sort years in descending order
  const sortedYears = Object.keys(groupedPublications)
    .map(Number)
    .sort((a, b) => b - a);

  // Sort publications within each year by numericId in descending order
  sortedYears.forEach(year => {
    groupedPublications[year].sort((a, b) => {
      if (b.numericId !== undefined && a.numericId !== undefined) {
        return b.numericId - a.numericId;
      }
      return b.id.localeCompare(a.id);
    });
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col justify-center relative px-6 md:px-20 overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2670" 
            alt="Publications background" 
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
              <span className="text-[12px] font-bold tracking-[0.4em] uppercase text-brand-gold leading-none pb-[1px]">CMML · SCHOLARSHIP</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-serif leading-[1.1] mb-10 font-medium tracking-tight">
              Our <span className="text-brand-gold italic font-normal">Publications</span>
            </h1>

            <div className="flex flex-wrap gap-8 items-center mb-10">
              <p className="max-w-2xl text-brand-paper/70 font-light leading-relaxed text-lg tracking-tight">
                Peer-reviewed research across molecular simulation, 
                biophysics, soft matter, and energy materials.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container-custom pt-32">
        <div className="space-y-40 mb-40">
          {sortedYears.map((year) => (
            <motion.section 
              key={year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-serif mb-1 border-b border-brand-ink/10 pb-4">{year}</h2>
              <div className="space-y-12 pt-12">
                {(expandedYears[year] ? groupedPublications[year] : groupedPublications[year].slice(0, 3)).map((pub, idx) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={pub.id} 
                    className="grid grid-cols-[40px_1fr] gap-8 group"
                  >
                    <span className="text-sm font-bold opacity-30 mt-1 cursor-default select-none">
                      {pub.numericId || groupedPublications[year].length - idx}
                    </span>
                    <div>
                      <h3 className="text-lg font-medium leading-relaxed mb-1 cursor-pointer hover:text-brand-gold transition-colors">
                        {pub.title} 
                        {pub.tags?.map(tag => (
                          <span key={tag} className="text-[9px] text-brand-muted font-light uppercase tracking-widest ml-2 bg-brand-ink/5 px-1.5 py-0.5 rounded-sm">
                            {tag}
                          </span>
                        ))}
                      </h3>
                      <p className="text-sm font-bold text-brand-ink italic">
                        {pub.authors.split('R. Chang').map((part, index, array) => (
                          <span key={index}>
                            {part}
                            {index < array.length - 1 && <span className="text-brand-gold">R. Chang</span>}
                          </span>
                        ))}
                      </p>
                      <p className="text-[12px] text-brand-muted font-light mt-2 italic opacity-60">
                        {pub.journal}{pub.details ? `, ${pub.details}` : ''}, {pub.year}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {groupedPublications[year].length > 3 && (
                  <motion.div layout className="flex justify-center pt-8">
                    <button 
                      onClick={() => toggleYear(year)}
                      className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.3em] text-brand-ink/40 hover:text-brand-gold transition-colors group px-6 py-3 border border-brand-ink/5 hover:border-brand-gold/30 rounded-full"
                    >
                      {expandedYears[year] ? (
                        <>
                          <ChevronUp className="w-3 h-3 transition-transform group-hover:-translate-y-0.5" />
                          Close
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3 transition-transform group-hover:translate-y-0.5" />
                          See More ({groupedPublications[year].length - 3} more)
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
}
