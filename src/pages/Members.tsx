/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useData } from '../context/DataContext';

export default function Members() {
  const { professor, members, alumni } = useData();

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col justify-center relative px-6 md:px-20 overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2670" 
            alt="Team background" 
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
              <span className="text-[12px] font-bold tracking-[0.4em] uppercase text-brand-gold leading-none pb-[1px]">CMML · PEOPLE</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-serif leading-[1.1] mb-10 font-medium tracking-tight">
              Our <span className="text-brand-gold italic font-normal">Team</span>
            </h1>

            <p className="max-w-2xl text-brand-paper/70 font-light leading-relaxed text-lg md:text-xl tracking-tight">
              Meet the researchers driving our work — from the principal 
              investigator to current graduate students and distinguished alumni.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom pt-32">
        {/* Professor Section */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-24 mb-60">
           <div className="aspect-[8/9] bg-brand-paper overflow-hidden border border-brand-ink/5">
              {professor.img ? (
                <img 
                  src={professor.img} 
                  alt={professor.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className = "w-full h-full flex items-center justify-center bg-brand-paper text-brand-ink/20";
                      fallback.innerText = "No Image";
                      parent.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-brand-paper text-brand-ink/20">
                  No Image
                </div>
              )}
           </div>
           <div>
              <h2 className="text-4xl font-serif mb-1">{professor.name}</h2>
              <div className="text-[12px] tracking-widest text-brand-muted mb-12 uppercase leading-relaxed">
                <p>{professor.affiliation}</p>
                <p className="lowercase">{professor.email}</p>
              </div>

              <div className="space-y-12">
                {professor.degrees.length > 0 && (
                  <div>
                    <h3 className="text-[14px] font-bold tracking-[0.3em] uppercase mb-4 opacity-40">Academic Degrees</h3>
                    <ul className="text-sm font-light space-y-2 text-brand-muted">
                      {professor.degrees.map((d, i) => (
                        <li key={i}>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {professor.career.length > 0 && (
                  <div>
                    <h3 className="text-[14px] font-bold tracking-[0.3em] uppercase mb-4 opacity-40">Academic Career</h3>
                    <ul className="text-sm font-light space-y-2 text-brand-muted">
                      {professor.career.map((c, i) => (
                        <li key={i}>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {professor.awards.length > 0 && (
                  <div>
                    <h3 className="text-[14px] font-bold tracking-[0.3em] uppercase mb-4 opacity-40">Fellowships, Honors & Awards</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                      {professor.awards.map((a, i) => (
                        <div key={i} className="text-sm font-light">
                          <p className="font-medium text-brand-ink">{a.title}</p>
                          <p className="text-[12px] opacity-60 leading-relaxed">{a.subtitle}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
           </div>
        </div>

        {/* Members Grid */}
        <div className="mb-40">
           <h2 className="text-3xl font-serif mb-12">Current Members</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {members.map((m, i) => (
                <div key={i} className="text-center group">
                  <div className="aspect-square bg-brand-paper overflow-hidden mb-4 border border-brand-ink/5">
                     {m.img ? (
                       <img 
                        src={m.img} 
                        alt={m.name} 
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback = document.createElement('div');
                            fallback.className = "w-full h-full flex items-center justify-center bg-brand-paper text-brand-ink/10";
                            fallback.innerHTML = '<span class="text-[12px] uppercase tracking-widest font-bold">No Photo</span>';
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center bg-brand-paper text-brand-ink/10">
                         <span className="text-[12px] uppercase tracking-widest font-bold">No Photo</span>
                       </div>
                     )}
                  </div>
                  <h4 className="text-[13px] font-medium font-sans tracking-[0.02em]">{m.name}</h4>
                  <p className="text-[11px] font-sans text-brand-muted mt-1 opacity-40 tracking-wider font-semibold">{m.role}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Alumni Section */}
        <div className="pb-40">
          <h2 className="text-3xl font-serif mb-12">Alumni</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
            {alumni.map((a, i) => (
              <div key={i} className="group">
                <div className="aspect-square bg-brand-paper overflow-hidden mb-4 border border-brand-ink/5">
                   {a.img ? (
                     <img 
                      src={a.img} 
                      alt={a.name} 
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = "w-full h-full flex items-center justify-center bg-brand-paper text-brand-ink/10";
                          fallback.innerHTML = '<span class="text-[12px] uppercase tracking-widest font-bold">No Photo</span>';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-brand-paper text-brand-ink/10">
                       <span className="text-[12px] uppercase tracking-widest font-bold">No Photo</span>
                     </div>
                   )}
                </div>
                <h4 className="text-[13px] font-medium font-sans tracking-[0.02em] leading-tight">
                  {a.name.replace(/[()]/g, '')}
                </h4>
                {a.company && (
                  <p className="text-[11px] font-sans text-brand-muted mt-1 leading-tight opacity-40 tracking-wider font-semibold">{a.company.replace(/[()]/g, '')}</p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
