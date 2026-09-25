import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Printer,
  Search,
  FileUp,
  Tag,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  LogOut,
  Store,
  Sparkles,
  Clock
} from 'lucide-react';
import { sounds } from '../utils/sound';

export const Navbar: React.FC = () => {
  const {
    currentMode,
    setCurrentMode,
    customerView,
    setCustomerView,
    isOperatorLoggedIn,
    openOperatorDesk,
    logoutOperator,
    printJobs,
    soundEnabled,
    toggleSound
  } = useApp();

  const activeJobsCount = printJobs.filter(
    j => j.status !== 'claimed' && j.status !== 'cancelled'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playPop();
                setCurrentMode('customer');
                setCustomerView('request');
              }}
              className="flex items-center gap-3 text-left group"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-pink-200 group-hover:scale-105 transition-transform">
                <Printer className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
                    Cutie Bits & Co.
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-pink-50 text-pink-700 px-1.5 py-0.5 rounded border border-pink-200">
                    WTP
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-slate-500 tracking-wide flex items-center gap-1.5">
                  <span>Online Web to Print</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-pink-600 font-medium">PHINMA AU IT Solution</span>
                </div>
              </div>
            </button>
          </div>

          {/* Navigation Links for Customer View */}
          {currentMode === 'customer' && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => {
                  sounds.playPop();
                  setCustomerView('request');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  customerView === 'request'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileUp className="w-3.5 h-3.5 text-pink-500" />
                <span>Submit Print Request</span>
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  setCustomerView('track');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  customerView === 'track'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-pink-500" />
                <span>Track Print Job</span>
                {activeJobsCount > 0 && (
                  <span className="text-[10px] bg-pink-500 text-white font-mono font-bold px-1.5 rounded-full">
                    {activeJobsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  setCustomerView('rates');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  customerView === 'rates'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                <span>Price Rates</span>
              </button>
            </nav>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 sm:p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
              aria-label="Toggle sound"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-pink-500" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Operator Desk Controls */}
            {currentMode === 'operator' ? (
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => {
                    sounds.playPop();
                    setCurrentMode('customer');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Customer View</span>
                </button>
                <button
                  onClick={logoutOperator}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                  title="Lock operator desk and logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Lock Desk</span>
                </button>
              </div>
            ) : (
              <button
                onClick={openOperatorDesk}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  isOperatorLoggedIn
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'
                }`}
                title={isOperatorLoggedIn ? 'Open Operator Desk' : 'Restricted to Print Shop Owner'}
              >
                {isOperatorLoggedIn ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Operator Desk</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-pink-300" />
                    <span>Operator Desk</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Submenu Bar */}
      {currentMode === 'customer' && (
        <div className="md:hidden flex items-center justify-around border-t border-slate-100 py-2 px-3 bg-slate-50 text-xs">
          <button
            onClick={() => {
              sounds.playPop();
              setCustomerView('request');
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg font-semibold ${
              customerView === 'request' ? 'bg-pink-500 text-white' : 'text-slate-600'
            }`}
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Request Print</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setCustomerView('track');
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg font-semibold ${
              customerView === 'track' ? 'bg-pink-500 text-white' : 'text-slate-600'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Track Status</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setCustomerView('rates');
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg font-semibold ${
              customerView === 'rates' ? 'bg-pink-500 text-white' : 'text-slate-600'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Rates</span>
          </button>
        </div>
      )}
    </header>
  );
};
