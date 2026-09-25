import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Eye, EyeOff, X, KeyRound, Smartphone, ShieldCheck, AlertCircle } from 'lucide-react';
import { sounds } from '../utils/sound';

export const OperatorLoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    setIsForgotPasswordModalOpen,
    loginOperator,
    ownerCredentials,
    sendPasswordResetSms
  } = useApp();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const ok = loginOperator(password);
      if (!ok) {
        setError('Incorrect operator password. If you forgot your password, click the link below to receive a secure SMS code on the owner phone.');
        sounds.playPop();
      } else {
        setPassword('');
      }
      setIsSubmitting(false);
    }, 250);
  };

  const handleForgotPasswordClick = () => {
    sounds.playPop();
    setIsLoginModalOpen(false);
    setIsForgotPasswordModalOpen(true);
    // Optionally trigger sending the SMS immediately or let them verify phone first
    sendPasswordResetSms(ownerCredentials.phone);
  };

  const handleClose = () => {
    sounds.playPop();
    setIsLoginModalOpen(false);
    setError('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-pink-100 overflow-hidden">
        {/* Cute Top Banner */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 p-6 text-white text-center relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
            <Lock className="w-7 h-7 text-white" />
          </div>

          <h2 className="text-xl font-bold tracking-tight font-display">Operator Desk Login</h2>
          <p className="text-pink-100 text-xs mt-1">
            Restricted zone · Authorized Cutie Bits owner only
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Failed</p>
                <p className="mt-0.5 text-rose-600">{error}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Owner Identifier
            </label>
            <div className="relative">
              <input
                type="text"
                disabled
                value={ownerCredentials.email}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm font-medium cursor-not-allowed"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold tracking-wider uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Verified Owner
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Operator Password
              </label>
              <button
                type="button"
                onClick={handleForgotPasswordClick}
                className="text-xs text-pink-600 hover:text-pink-700 font-semibold hover:underline flex items-center gap-1"
              >
                <Smartphone className="w-3 h-3 text-pink-500" />
                Forgot Password?
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter operator password"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold text-sm shadow-md shadow-pink-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'Verifying...' : 'Access Operator Desk'}</span>
          </button>

          {/* Quick Demo Helper */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-amber-800">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Owner Access Details</span>
            </div>
            <p className="text-[11px] text-amber-700">
              Default password: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold text-amber-900">cutie1234</code>
            </p>
            <p className="text-[11px] text-amber-700">
              Lost password? Click <span className="font-semibold text-pink-600">"Forgot Password?"</span> to have a temporary code texted to the registered owner phone (<code className="font-mono">{ownerCredentials.phone}</code>).
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
