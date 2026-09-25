import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Smartphone,
  Send,
  X,
  Lock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { sounds } from '../utils/sound';

export const ForgotPasswordModal: React.FC = () => {
  const {
    isForgotPasswordModalOpen,
    setIsForgotPasswordModalOpen,
    setIsLoginModalOpen,
    ownerCredentials,
    sendPasswordResetSms,
    resetPasswordWithCode,
    activeSmsMessage
  } = useApp();

  const [phone, setPhone] = useState(ownerCredentials.phone);
  const [passcode, setPasscode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  if (!isForgotPasswordModalOpen) return null;

  const handleSendSms = () => {
    sounds.playPop();
    setError('');
    const result = sendPasswordResetSms(phone);
    if (result.success) {
      setSmsSent(true);
      setSuccessMsg(`A temporary generated passcode was texted to ${result.phone}! Check the notification at the top.`);
      setCountdown(30);

      const interval = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(interval);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
  };

  const handleAutoPaste = () => {
    if (activeSmsMessage?.code) {
      sounds.playPop();
      setPasscode(activeSmsMessage.code);
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!passcode.trim()) {
      setError('Please enter the temporary passcode sent to your phone.');
      return;
    }
    if (newPassword.length < 4) {
      setError('New password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    const res = resetPasswordWithCode(passcode, newPassword);
    if (!res.success) {
      setError(res.message);
      sounds.playPop();
    } else {
      setSuccessMsg(res.message);
    }
  };

  const handleBackToLogin = () => {
    sounds.playPop();
    setIsForgotPasswordModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleClose = () => {
    sounds.playPop();
    setIsForgotPasswordModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-pink-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 p-6 text-white text-center relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            onClick={handleBackToLogin}
            className="absolute top-4 left-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors flex items-center gap-1 text-xs px-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Login</span>
          </button>

          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
            <Smartphone className="w-7 h-7 text-white" />
          </div>

          <h2 className="text-xl font-bold tracking-tight font-display">Owner SMS Recovery</h2>
          <p className="text-pink-100 text-xs mt-1">
            We will text a temporary generated passcode to your registered phone
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Reset Error</p>
                <p className="mt-0.5 text-rose-600">{error}</p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">SMS Dispatched</p>
                <p className="mt-0.5 text-emerald-700">{successMsg}</p>
              </div>
            </div>
          )}

          {/* Step 1: Send SMS */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px]">1</span>
                Owner Mobile Number
              </span>
              <span className="text-[10px] text-slate-500">SMS Gateway Ready</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+63 917 829 4831"
                className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <button
                type="button"
                onClick={handleSendSms}
                disabled={countdown > 0}
                className="px-3.5 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 disabled:bg-slate-300 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{countdown > 0 ? `Resend (${countdown}s)` : 'Text Code'}</span>
              </button>
            </div>

            {activeSmsMessage && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-pink-600 font-medium">
                  Latest SMS: <code className="font-mono font-bold bg-pink-100 px-1 py-0.5 rounded text-pink-800">{activeSmsMessage.code}</code>
                </span>
                <button
                  type="button"
                  onClick={handleAutoPaste}
                  className="text-[11px] font-semibold text-pink-700 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-pink-500" />
                  Auto-fill Passcode
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Enter code & New Password */}
          <form onSubmit={handleResetSubmit} className="space-y-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <span className="w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px]">2</span>
              Enter Passcode & Set New Password
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Generated Passcode (from SMS)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value.toUpperCase())}
                  placeholder="e.g. CB-849201"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm font-mono uppercase tracking-wider"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 4 chars"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold text-sm shadow-md shadow-pink-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Lock className="w-4 h-4" />
              <span>Change Password & Log In</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
