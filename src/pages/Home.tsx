/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function Home() {
  const { professor, research, siteSettings } = useData();
  
  // Use first 6 research items for the grid if available
  const displayProjects = research.length > 0 ? research.slice(0, 6) : [
    {
      id: '01',
      title: 'Chlorosulfolipids',
      fullName: 'Membrane Structure of Chlorosulfolipids',
      description: 'Coarse-grained and atomistic MD simulations reveal unique monolayer structures of CSLs in flagellar membranes.',
      imageUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800"
    },
    // ... fallback
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-[85vh] flex flex-col justify-center relative px-6 md:px-20 overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src={siteSettings.homeHeroImg} 
            alt="Chemistry Research" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Darker overlays to improve text readability as requested */}
          <div className="absolute inset-0 bg-brand-ink/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-ink/90 via-brand-ink/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/95 via-transparent to-brand-ink/30" />
        </div>
        
        <div className="container-custom relative z-10 flex-1 flex flex-col justify-center pt-24 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-10 h-6">
              <div className="h-[1px] w-12 bg-brand-gold" />
              <span className="text-[12px] font-bold tracking-[0.4em] uppercase text-brand-gold leading-none pb-[1px]">University of Seoul · Applied Chemistry</span>
            </div>

            <h1 className="text-5xl md:text-[70px] lg:text-[90px] font-serif leading-[0.95] mb-10 font-medium tracking-tight">
              Computational <br />
              <span className="text-brand-gold italic font-normal">Molecular</span> <br />
              Modeling Lab
            </h1>

            <p className="text-[12px] font-bold tracking-[0.4em] mb-14 opacity-60 uppercase text-brand-paper/50">
              Computational Molecular Modeling Lab, University of Seoul
            </p>

            <p className="max-w-2xl text-brand-paper/70 font-light leading-relaxed mb-16 text-lg tracking-tight">
              We explore the physical and biological world through the lens of computation 
              — employing Molecular Dynamics, Monte Carlo, and Brownian Dynamics simulations 
              to reveal phenomena invisible to experiment alone.
            </p>

            <div className="flex flex-wrap gap-6">
              <Link to="/research">
                <button className="bg-brand-gold text-brand-ink px-14 py-5 text-[11px] font-bold tracking-[0.2em] uppercase rounded-full hover:bg-white transition-all duration-500 shadow-xl shadow-black/20">
                  EXPLORE RESEARCH
                </button>
              </Link>
              <Link to="/members">
                <button className="border border-brand-gold text-brand-gold px-14 py-5 text-[11px] font-bold tracking-[0.2em] uppercase rounded-full hover:bg-brand-gold hover:text-brand-ink transition-all duration-500">
                  MEET THE TEAM
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Scroll Indicator - Positioned below the buttons */}
          <motion.div 
            className="flex flex-col items-center gap-4 group cursor-pointer z-20 self-center mt-12 mb-12"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
             <span className="text-[12px] tracking-[0.4em] font-bold text-white/30 group-hover:text-brand-gold uppercase transition-colors duration-500">Scroll</span>
             <div className="w-[1px] group-hover:w-[2px] h-12 bg-gradient-to-b from-brand-gold/50 group-hover:from-brand-gold to-transparent transition-all duration-500" />
          </motion.div>

          {/* Stats Bar - Positioned relative to flex container to ensure no overlap */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 1 }}
            className="w-full grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/10"
          >
            {[
              { label: 'Research Areas', value: '6+' },
              { label: 'Publications', value: '40+' },
              { label: 'Alumni', value: '15+' },
              { label: 'University of Seoul', value: '2021' },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-3xl font-serif text-brand-gold">{stat.value}</p>
                <p className="text-[12px] font-bold tracking-[0.2em] text-white/40 uppercase">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-40 bg-white">
        <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div className="aspect-square bg-white overflow-hidden shadow-2xl relative group max-w-lg mx-auto md:ml-0 p-12 flex items-center justify-center">
              <img 
               src={siteSettings.homeIntroImg} 
               alt="Scientific research" 
               className="max-w-full max-h-full object-contain transition-all duration-1000 group-hover:scale-105"
               referrerPolicy="no-referrer"
             />
            <div className="absolute inset-0 bg-brand-ink/5 pointer-events-none" />
          </div>
          <div className="flex flex-col justify-center py-6">
            <div className="space-y-12">
              <div>
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-[1px] w-8 bg-brand-gold" />
                   <span className="text-[12px] font-bold tracking-[0.4em] uppercase text-brand-gold">About LaB</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-serif leading-tight text-brand-ink">
                  Understanding Nature <br /> <span className="italic font-normal text-brand-gold/80">Through Simulation</span>
                </h2>
              </div>
              
              <div className="space-y-8">
                <p className="text-xl text-brand-ink/90 font-light leading-relaxed max-w-2xl">
                  Welcome to the <strong className="font-bold">Computational Molecular Modeling Laboratory</strong>, supervised by <strong className="font-bold">Prof. Rakwoo Chang</strong> in the <strong className="font-bold">Department of Applied Chemistry</strong>, <strong className="font-bold">University of Seoul</strong>, <strong className="font-bold">Republic of Korea</strong>.
                </p>

                <div className="space-y-4 text-[13px] leading-relaxed text-brand-muted font-normal border-l-2 border-brand-gold/30 pl-6 max-w-2xl">
                  <p>
                    Our laboratory investigates chemical, physical, biological, and materials phenomena using computer-based molecular modeling and simulation approaches. We employ a broad range of computational techniques, including <strong className="font-medium text-brand-ink">Density Functional Theory (DFT)</strong>, <strong className="font-medium text-brand-ink">Molecular Dynamics (MD) simulations</strong>, <strong className="font-medium text-brand-ink">Machine-Learning Interatomic Potentials (MLIP)</strong>, and <strong className="font-medium text-brand-ink">AI-based property prediction</strong>.
                  </p>
                  <p>
                    Our research aims to understand molecular mechanisms, predict physicochemical properties, and design functional materials by connecting atomic-scale structures with macroscopic behavior. Current research topics include <strong className="font-medium text-brand-ink">catalytic and energy materials</strong>, <strong className="font-medium text-brand-ink">biomolecular self-assembly</strong>, <strong className="font-medium text-brand-ink">biological membrane systems</strong>, <strong className="font-medium text-brand-ink">machine-learning-assisted molecular simulations</strong>, and <strong className="font-medium text-brand-ink">data-driven prediction of chemical properties</strong>.
                  </p>
                  <p>
                    Through these studies, we seek to provide molecular-level insight into complex systems and develop computational strategies for materials discovery, environmental chemistry, and biological applications.
                  </p>
                  <p className="pt-2">
                    If you have any questions, please contact <strong className="font-medium text-brand-ink">rchang90@uos.ac.kr</strong>.
                  </p>
                </div>
              </div>

              <div className="flex justify-start pt-4">
                <Link to="/research">
                  <button className="bg-brand-ink text-white px-12 py-5 text-[10px] font-bold tracking-[0.3em] uppercase flex items-center justify-center gap-4 group rounded-full hover:bg-brand-gold hover:text-brand-ink transition-all duration-500 shadow-xl shadow-black/10">
                    <span className="leading-none">EXPLORE RESEARCH</span> 
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid (Restored and Refined) */}
      <section className="py-40 bg-brand-ink">
        <div className="container-custom">
          <div className="flex items-center gap-3 mb-4">
             <div className="h-[1px] w-8 bg-brand-gold" />
             <span className="text-[12px] font-bold tracking-[0.4em] uppercase text-brand-gold">Portfolio</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif mb-2 text-white">Current <span className="italic font-normal text-brand-gold/80">Projects</span></h2>
          <div className="h-[1px] w-24 bg-brand-gold/30 mt-8 mb-24" />
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-r border-b border-white/5">
            {research.slice(0, 6).map((project, idx) => (
              <div 
                key={project.id} 
                className="aspect-square bg-brand-ink overflow-hidden border-t border-l border-white/5 relative group cursor-pointer"
              >
                <div className="absolute inset-0 z-0">
                  {project.imageUrl ? (
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover opacity-20 group-hover:opacity-60 transition-all duration-1000"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-brand-ink/10" />
                  )}
                  <div className="absolute inset-0 bg-brand-ink/40 group-hover:bg-brand-ink/20 transition-all duration-700" />
                </div>

                <div className="relative z-10 p-10 md:p-14 h-full flex flex-col justify-start">
                  <span className="text-white/10 text-6xl md:text-7xl font-serif mb-4 block transition-colors group-hover:text-brand-gold/20 leading-none">
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                  <div className="space-y-4">
                    <h3 className="text-white text-xl md:text-2xl font-serif leading-tight transition-colors group-hover:text-brand-gold">{project.title}</h3>
                    <p className="text-white/40 text-[12px] font-light leading-relaxed max-w-xs transition-colors group-hover:text-white/60">
                      {project.shortDescription}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-24">
            <Link to="/research">
              <button className="bg-brand-gold text-brand-ink px-14 py-4 text-[11px] font-bold tracking-[0.2em] uppercase rounded-full hover:bg-white transition-all duration-500 shadow-xl shadow-black/20">
                EXPLORE RESEARCH <ArrowRight className="inline-block ml-3 w-4 h-4 translate-y-[-1px]" />
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
