/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { loginWithCmml } from '../lib/firebase';

export default function AdminLogin() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const idInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !password) {
      setErrorMessage('아이디와 비밀번호를 모두 입력해주세요.');
      setShowError(true);
      return;
    }

    setIsLoggingIn(true);
    try {
      await loginWithCmml(id, password);
      navigate('/admin/dashboard');
    } catch (error: any) {
      const errorCode = error.code || 'unknown';
      const errMsg = error.message;

      if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
        console.warn('Login attempt failed: invalid credentials.');
        setErrorMessage('아이디와 비밀번호를 잘못입력하였습니다.');
        setShowError(true);
      } else {
        console.error('Login error:', error);
        if (errorCode === 'auth/operation-not-allowed') {
          setErrorMessage('Email/password login method is disabled in the Firebase console. Please enable it.');
          setShowError(true);
        } else if (errorCode === 'auth/too-many-requests') {
          setErrorMessage('Too many failed login attempts. Please try again later.');
          setShowError(true);
        } else {
          setErrorMessage(`Login failed: ${errMsg || 'Unknown error'}. (Code: ${errorCode})`);
          setShowError(true);
        }
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCloseError = () => {
    setShowError(false);
    // Clear password input so the user can easily re-type
    setPassword('');
    // Automatically focus back on ID input field
    if (idInputRef.current) {
      idInputRef.current.focus();
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
              ref={idInputRef}
              type="text" 
              value={id}
              placeholder="rchang90"
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
        </form>
        
        <div className="mt-12 text-center opacity-30">
          <p className="text-[8px] tracking-[0.2em] font-bold uppercase">Authorized Personnel Only</p>
        </div>
      </div>

      {/* Beautiful Modal Alert Box for Errors */}
      {showError && (
        <div className="fixed inset-0 bg-brand-ink/50 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-brand-paper border border-brand-ink/10 rounded-md p-8 max-w-sm w-full text-center shadow-2xl relative transition-all duration-300 transform scale-100">
            <div className="h-[2px] w-12 bg-brand-gold mx-auto mb-6" />
            <p className="text-xs font-semibold text-brand-ink tracking-widest uppercase mb-2">Notice</p>
            <p className="text-sm text-brand-ink/80 leading-relaxed mb-8">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={handleCloseError}
              className="w-full bg-brand-ink text-brand-paper hover:bg-brand-gold py-4 px-6 rounded-md text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-300 active:scale-[0.98]"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
