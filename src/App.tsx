/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { PrintRequestForm } from './components/PrintRequestForm';
import { OrderTracker } from './components/OrderTracker';
import { PriceRatesView } from './components/PriceRatesView';
import { OperatorDesk } from './components/OperatorDesk/OperatorDesk';
import { OperatorLoginModal } from './components/OperatorLoginModal';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { SmsSimulatorBanner } from './components/SmsSimulatorBanner';

function AppContent() {
  const { currentMode, customerView, isOperatorLoggedIn } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {currentMode === 'operator' && isOperatorLoggedIn ? (
          <OperatorDesk />
        ) : (
          <>
            {customerView === 'request' && <PrintRequestForm />}
            {customerView === 'track' && <OrderTracker />}
            {customerView === 'rates' && <PriceRatesView />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 font-display text-slate-700 font-bold">
            <span>Cutie Bits & Co. Online Web to Print (WTP)</span>
            <span aria-hidden="true">·</span>
            <span className="text-[11px] font-sans font-normal text-slate-400">
              PHINMA Araullo University · College of Information Technology
            </span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-3">
            <span>Aced Solution & Co.</span>
            <span aria-hidden="true">·</span>
            <span>ITE 381: IT Business Solution</span>
          </div>
        </div>
      </footer>

      {/* Security & SMS Modals */}
      <OperatorLoginModal />
      <ForgotPasswordModal />
      <SmsSimulatorBanner />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
