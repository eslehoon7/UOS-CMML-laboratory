/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Menu, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { label: 'HOME', path: '/' },
  { label: 'RESEARCH', path: '/research' },
  { label: 'MEMBERS', path: '/members' },
  { label: 'PUBLICATIONS', path: '/publications' },
  { label: 'PHOTOS', path: '/photos' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isDarkHeroPage = ['/', '/research', '/members', '/publications', '/photos'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col selection:bg-brand-gold/20">
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-brand-paper/60 backdrop-blur-md border-b border-brand-ink/5 py-4 shadow-sm' 
            : 'bg-transparent py-10'
        }`}
      >
        <div className="container-custom flex justify-between items-center">
          <Link 
            to="/" 
            className={`text-2xl font-serif tracking-[0.1em] font-medium transition-colors duration-500 ${
              isDarkHeroPage && !scrolled ? 'text-white' : 'text-brand-gold'
            }`}
          >
            CMML
          </Link>
 
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-[12px] font-bold tracking-[0.2em] transition-all duration-500 relative py-1 ${
                    isActive 
                      ? 'text-brand-gold' 
                      : (isDarkHeroPage && !scrolled ? 'text-white/70 hover:text-white' : 'text-brand-muted hover:text-brand-ink')
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-gold"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
 
          {/* Mobile Toggle */}
          <button 
            className={`md:hidden ${isDarkHeroPage && !scrolled ? 'text-white' : 'text-brand-ink'}`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <motion.div
        initial={false}
        animate={isMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: '100%' }}
        className="fixed inset-0 z-40 bg-brand-paper md:hidden flex flex-col items-center justify-center gap-8"
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="text-2xl font-serif tracking-widest"
            onClick={() => setIsMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </motion.div>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      {!location.pathname.startsWith('/admin') && (
        <footer className="bg-brand-ink py-32 text-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
              <div className="col-span-1 md:col-span-2">
                <h4 className="text-2xl font-serif tracking-normal mb-8 leading-tight">
                  Computational <span className="text-brand-gold">Molecular</span> Modeling Lab
                </h4>
                <p className="text-[12px] tracking-[0.4em] font-bold text-white/30 uppercase mb-12">THE UNIVERSITY OF SEOUL</p>
                
                <div className="space-y-4 max-w-sm">
                  <p className="text-[12px] font-light text-white/50 leading-relaxed tracking-wide">
                    We explore the physical and biological world through computational lenses, 
                    revealing phenomena invisible to experiment alone.
                  </p>
                </div>
              </div>
              
              <div>
                <h5 className="text-[12px] font-bold tracking-[0.3em] uppercase mb-10 text-brand-gold">Directory</h5>
                <ul className="space-y-5 text-[12px] tracking-[0.25em] text-white/40 uppercase font-medium">
                  {NAV_ITEMS.map(item => (
                    <li key={item.path}>
                      <Link to={item.path} className="hover:text-white transition-colors duration-300">{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-[12px] font-bold tracking-[0.3em] uppercase mb-10 text-brand-gold">Office</h5>
                <div className="space-y-6 text-[12px] font-light text-white/50 leading-relaxed tracking-wide">
                  <p>
                    Natural Science Building, R424<br />
                    163 Seoulsirip-daero, Seoul 02504
                  </p>
                  <p className="pt-4 border-t border-white/5">
                    <span className="text-brand-gold font-bold">Lab.</span> R213<br />
                    <span className="text-brand-gold font-bold">Tel.</span> +82 2 6490 2623
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
              <p className="text-[12px] tracking-widest text-white/20 uppercase">© 2026 UOS CMML · ALL RIGHTS RESERVED</p>
              <div className="flex gap-10">
                <Link to="/admin" className="text-[12px] font-bold tracking-[0.3em] uppercase text-white/30 hover:text-brand-gold transition-colors">Admin Login</Link>
                <Link to="#" className="text-[12px] font-bold tracking-[0.3em] uppercase text-white/30 hover:text-brand-gold transition-colors">Privacy</Link>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
