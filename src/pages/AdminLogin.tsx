/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { loginWithCmml, auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default function AdminLogin() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error('Google Login error:', error);
      alert(`Google login error: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !password) {
      alert('Please enter both ID and Password.');
      return;
    }

    setIsLoggingIn(true);
    try {
      await loginWithCmml(id, password);
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorCode = error.code || 'unknown';
      const errorMessage = error.message;

      if (errorCode === 'auth/operation-not-allowed') {
        alert('Email/password login method is disabled in the Firebase console. Please enable it or use Google Login.');
      } else if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
        alert(`Invalid ID or Password. (Code: ${errorCode})`);
      } else if (errorCode === 'auth/too-many-requests') {
        alert('Too many failed login attempts. Please try again later.');
      } else {
        alert(`Login failed: ${errorMessage || 'Unknown error'}. (Code: ${errorCode})`);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-paper relative">
      {/* Back to Website Button - Matching Sidebar Style */}
      <Link 
        to="/" 
        className="absolute top-10 left-10 flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity"
      >
        <Home className="w-4 h-4" />
        <span className="text-xs font-bold tracking-widest uppercase">Home</span>
      </Link>

      <div className="w-full max-w-sm px-6 flex flex-col items-center">
        <div className="text-center mb-20">
          <h1 className="text-7xl font-serif text-brand-ink tracking-tighter mb-4 italic">CMML</h1>
          <div className="h-[1px] w-12 bg-brand-gold mx-auto mb-4" />
          <p className="text-[10px] font-bold tracking-[0.4em] text-brand-muted uppercase">Admin Portal</p>
        </div>
        
        <form onSubmit={handleLogin} className="w-full space-y-10">
          <div className="space-y-3 relative group">
            <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-gold ml-1">ID</label>
            <input 
              type="text" 
              value={id}
              placeholder="admin@cmml.com"
              onChange={(e) => setId(e.target.value)}
              className="w-full bg-brand-ink/5 border-none rounded-md py-4 px-6 focus:ring-1 focus:ring-brand-gold outline-none transition-all placeholder:text-brand-muted/30"
            />
          </div>
 
          <div className="space-y-3">
            <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-gold ml-1">PASSWORD</label>
            <input 
              type="password" 
              value={password}
              placeholder="••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-ink/5 border-none rounded-md py-4 px-6 focus:ring-1 focus:ring-brand-gold outline-none transition-all placeholder:text-brand-muted/30"
            />
            <div className="flex justify-between items-center px-1">
              <span className="text-[9px] text-brand-muted/40 font-bold tracking-wider italic">Enter authorized credentials</span>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoggingIn}
            className="w-full bg-brand-ink text-brand-paper py-5 rounded-md text-[11px] font-bold tracking-[0.5em] uppercase hover:bg-brand-gold transition-all duration-500 shadow-xl shadow-brand-ink/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? 'LOGGING IN...' : 'SIGN IN'}
          </button>

          <div className="relative flex items-center justify-center">
            <div className="absolute w-full h-[1px] bg-brand-ink/5" />
            <span className="relative bg-brand-paper px-4 text-[9px] font-bold tracking-[0.2em] text-brand-muted/40 uppercase">OR</span>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full bg-white border border-brand-ink/10 text-brand-ink py-4 rounded-md text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-brand-paper transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Continue with Google
          </button>
        </form>
        
        <div className="mt-12 text-center opacity-30">
          <p className="text-[8px] tracking-[0.2em] font-bold uppercase">Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  );
}
