import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, X, Copy, Check, Smartphone, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../utils/sound';

export const SmsSimulatorBanner: React.FC = () => {
  const { activeSmsMessage, dismissSmsMessage, setIsForgotPasswordModalOpen } = useApp();
  const [copied, setCopied] = useState(false);

  if (!activeSmsMessage) return null;

  const handleCopy = () => {
    sounds.playPop();
    navigator.clipboard.writeText(activeSmsMessage.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenReset = () => {
    sounds.playPop();
    setIsForgotPasswordModalOpen(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -80, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -80, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="fixed top-4 right-4 z-50 max-w-md w-[calc(100vw-2rem)]"
      >
        <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-pink-500/30 overflow-hidden ring-1 ring-white/10">
          {/* Top header resembling a mobile lockscreen notification */}
          <div className="px-4 py-2.5 bg-gradient-to-r from-pink-900/40 via-purple-900/40 to-slate-900 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/30">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold tracking-wide text-pink-200">
                MESSAGES · SMS GATEWAY
              </span>
              <span className="text-[10px] text-slate-400 font-mono">now</span>
            </div>

            <button
              onClick={dismissSmsMessage}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-md"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* SMS Body */}
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-pink-400" />
                  To Owner: <span className="font-mono text-pink-300">{activeSmsMessage.phone}</span>
                </p>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-sans">
                  Cutie Bits Security: Your temporary access passcode is{' '}
                  <span className="inline-block bg-pink-500/20 text-pink-300 font-mono font-bold px-2 py-0.5 rounded border border-pink-500/40 text-sm">
                    {activeSmsMessage.code}
                  </span>
                  . Use this to verify ownership and change your password.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex items-center gap-2 border-t border-white/10">
              <button
                onClick={handleCopy}
                className="flex-1 py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-300" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <button
                onClick={handleOpenReset}
                className="flex-1 py-1.5 px-3 rounded-lg bg-pink-500 hover:bg-pink-600 text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/20 transition-colors"
              >
                <span>Enter Passcode</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
