import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PrintProductionQueue } from './PrintProductionQueue';
import { PrintersMonitor } from './PrintersMonitor';
import { PricingManager } from './PricingManager';
import { PrintAnalytics } from './PrintAnalytics';
import { OperatorSettings } from './OperatorSettings';
import {
  Printer,
  ClipboardList,
  Tag,
  TrendingUp,
  Settings,
  Shield,
  LogOut,
  Store,
  Smartphone,
  Sparkles
} from 'lucide-react';
import { sounds } from '../../utils/sound';

type OperatorTab = 'queue' | 'printers' | 'pricing' | 'analytics' | 'settings';

export const OperatorDesk: React.FC = () => {
  const {
    ownerCredentials,
    logoutOperator,
    setCurrentMode,
    printJobs,
    printers,
    sendPasswordResetSms
  } = useApp();

  const [activeTab, setActiveTab] = useState<OperatorTab>('queue');

  const pendingQueueCount = printJobs.filter(
    j => j.status !== 'claimed' && j.status !== 'cancelled'
  ).length;

  const tabs = [
    { id: 'queue' as const, label: 'Production Queue', icon: ClipboardList, badge: pendingQueueCount > 0 ? `${pendingQueueCount}` : undefined },
    { id: 'printers' as const, label: 'Printers & Engines', icon: Printer, badge: `${printers.filter(p => p.status === 'printing').length} Printing` },
    { id: 'pricing' as const, label: 'Pricing & Rates', icon: Tag },
    { id: 'analytics' as const, label: 'Analytics & Revenue', icon: TrendingUp },
    { id: 'settings' as const, label: 'Owner & Security', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Operator Top Header Bar */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 lg:px-8 py-3.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm tracking-wide">
                  Cutie Bits & Co. · Print Operator Desk
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/30">
                  AUTHORIZED OWNER
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Operator: {ownerCredentials.email} · Registered Phone: {ownerCredentials.phone}
              </p>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playPop();
                sendPasswordResetSms();
              }}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Test sending password reset SMS to owner phone"
            >
              <Smartphone className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden md:inline">Test Owner SMS Text</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setCurrentMode('customer');
              }}
              className="px-3 py-1.5 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Customer Portal</span>
            </button>

            <button
              onClick={logoutOperator}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Desk</span>
            </button>
          </div>
        </div>
      </div>

      {/* Operator Sub-Tabs Bar: Zero-pill discipline (functional button controls with clean segmented look) */}
      <div className="bg-white border-b border-slate-200 sticky top-16 sm:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sounds.playPop();
                    setActiveTab(tab.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-pink-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        isActive
                          ? 'bg-pink-500 text-white'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'queue' && <PrintProductionQueue />}
        {activeTab === 'printers' && <PrintersMonitor />}
        {activeTab === 'pricing' && <PricingManager />}
        {activeTab === 'analytics' && <PrintAnalytics />}
        {activeTab === 'settings' && <OperatorSettings />}
      </main>
    </div>
  );
};
