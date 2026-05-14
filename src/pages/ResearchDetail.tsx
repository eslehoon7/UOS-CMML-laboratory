/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

export default function ResearchDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { research } = useData();
  const item = research.find((r) => r.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!item) {
    return (
      <div className="pt-48 container-custom min-h-screen text-center">
        <h1 className="text-4xl font-serif mb-8 text-brand-ink">Research area not found</h1>
        <Link 
          to="/research" 
          className="text-[12px] font-bold tracking-[0.3em] uppercase text-brand-gold border-b border-brand-gold/30 pb-1"
        >
          Return to Research
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-paper min-h-screen">
      {/* Header Image */}
      <div className="h-[60vh] w-full relative overflow-hidden border-b border-brand-ink/5 bg-brand-ink">
        {(item.detailImageUrl || item.imageUrl) ? (
          <img 
            src={item.detailImageUrl || item.imageUrl} 
            alt={item.title} 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-brand-paper flex items-center justify-center">
             <span className="text-brand-muted opacity-40 uppercase tracking-widest text-[10px] font-bold">Project Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-brand-ink/20" />
      </div>

      <div className="container-custom -mt-24 relative z-10 pb-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white p-8 md:p-20 shadow-2xl border border-brand-ink/5"
        >
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-[12px] font-bold tracking-[0.4em] uppercase mb-16 text-brand-muted hover:text-brand-gold transition-colors group"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> 
            Back to Research
          </button>

          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-brand-gold" />
              <span className="text-brand-gold text-[12px] font-bold tracking-[0.4em] uppercase">
                {item.subtitle}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif mb-20 leading-[1.1] text-brand-ink tracking-tight">
              {item.title}
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
              <div className="lg:col-span-2 space-y-12">
                <div className="space-y-10 text-xl text-brand-muted font-light leading-relaxed">
                  {item.fullDescription.map((p, i) => (
                    <p key={i} className="opacity-90">{p}</p>
                  ))}
                </div>

                {/* Additional Detailed Image */}
                <div className="aspect-video w-full overflow-hidden border border-brand-ink/5 bg-white">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt="Research Visualization" 
                      className="w-full h-full object-contain opacity-100"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-brand-muted opacity-20 uppercase tracking-widest text-[10px] font-bold">No Visualization</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-40 space-y-16">
                  {item.references && item.references.length > 0 && (
                    <div className="pt-10 border-t-2 border-brand-gold/20">
                      <h3 className="text-[13px] font-bold tracking-[0.3em] uppercase mb-10 text-brand-ink">
                        RESEARCH HIGHLIGHTS
                      </h3>
                      <div className="space-y-6">
                        {item.references.map((ref, i) => (
                          <div key={i} className="flex gap-4 items-start">
                            <span className="text-[12px] font-serif italic text-brand-gold shrink-0">{i + 1}.</span>
                            <p className="text-[13px] text-brand-muted font-light leading-relaxed">
                              {ref}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
