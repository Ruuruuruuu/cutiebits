import React from 'react';
import { useApp } from '../../context/AppContext';
import { PrinterStation } from '../../types';
import { Printer, AlertCircle, CheckCircle2, RotateCcw, Droplets, Layers } from 'lucide-react';
import { sounds } from '../../utils/sound';

export const PrintersMonitor: React.FC = () => {
  const { printers, updatePrinterStatus } = useApp();

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 font-display">
          Hardware Print Engines & Station Status
        </h2>
        <p className="text-xs text-slate-500">
          Monitor physical printer stations, remaining ink supply levels, and paper tray allocations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {printers.map(printer => (
          <div
            key={printer.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-pink-200 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  printer.status === 'printing'
                    ? 'bg-blue-50 text-blue-600 animate-pulse'
                    : printer.status === 'idle'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-amber-50 text-amber-600'
                }`}>
                  <Printer className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900">
                    {printer.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {printer.model}
                  </p>
                </div>
              </div>

              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                printer.status === 'printing'
                  ? 'bg-blue-100 text-blue-800'
                  : printer.status === 'idle'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {printer.status}
              </span>
            </div>

            {/* Paper & Job Info */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Loaded Paper:</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {printer.paperLoaded}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Active Job:</span>
                <span className="font-semibold text-pink-600 font-mono">
                  {printer.currentJobCode || 'None (Ready)'}
                </span>
              </div>
            </div>

            {/* Ink Levels Meter (CMYK) */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-pink-500" />
                <span>Ink Reservoir Levels</span>
              </span>

              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                {/* Cyan */}
                <div className="space-y-1">
                  <div className="h-14 bg-slate-100 rounded-lg p-1 flex flex-col justify-end">
                    <div
                      className="bg-cyan-500 rounded transition-all"
                      style={{ height: `${printer.inkLevels.c}%` }}
                    />
                  </div>
                  <span className="font-bold text-cyan-600">C: {printer.inkLevels.c}%</span>
                </div>

                {/* Magenta */}
                <div className="space-y-1">
                  <div className="h-14 bg-slate-100 rounded-lg p-1 flex flex-col justify-end">
                    <div
                      className="bg-pink-500 rounded transition-all"
                      style={{ height: `${printer.inkLevels.m}%` }}
                    />
                  </div>
                  <span className="font-bold text-pink-600">M: {printer.inkLevels.m}%</span>
                </div>

                {/* Yellow */}
                <div className="space-y-1">
                  <div className="h-14 bg-slate-100 rounded-lg p-1 flex flex-col justify-end">
                    <div
                      className="bg-yellow-400 rounded transition-all"
                      style={{ height: `${printer.inkLevels.y}%` }}
                    />
                  </div>
                  <span className="font-bold text-yellow-600">Y: {printer.inkLevels.y}%</span>
                </div>

                {/* Black */}
                <div className="space-y-1">
                  <div className="h-14 bg-slate-100 rounded-lg p-1 flex flex-col justify-end">
                    <div
                      className="bg-slate-800 rounded transition-all"
                      style={{ height: `${printer.inkLevels.k}%` }}
                    />
                  </div>
                  <span className="font-bold text-slate-800">K: {printer.inkLevels.k}%</span>
                </div>
              </div>
            </div>

            {/* Quick Status Control */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Override State:</span>
              <div className="flex gap-1">
                {(['idle', 'printing', 'paper_low', 'maintenance'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => updatePrinterStatus(printer.id, st)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize transition-colors ${
                      printer.status === st
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
