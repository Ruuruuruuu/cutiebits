import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Tag, Save, CheckCircle2 } from 'lucide-react';
import { PriceRates } from '../../types';
import { sounds } from '../../utils/sound';

export const PricingManager: React.FC = () => {
  const { priceRates, updatePriceRates } = useApp();
  const [rates, setRates] = useState<PriceRates>(priceRates);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playPop();
    updatePriceRates(rates);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-2 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 font-display">
          Print Pricing & Service Rates Engine
        </h2>
        <p className="text-xs text-slate-500">
          Modify per-page rates and binding options. Changes apply immediately to new online print requests.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Price configuration saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
        {/* Document Printing Rates */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-sm text-slate-900">
            Per-Page Base Printing Rates (₱)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                B&W Short / A4
              </label>
              <input
                type="number"
                step="0.25"
                value={rates.bwLetter}
                onChange={(e) => setRates({ ...rates, bwLetter: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                B&W Long Legal
              </label>
              <input
                type="number"
                step="0.25"
                value={rates.bwLegal}
                onChange={(e) => setRates({ ...rates, bwLegal: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Colored Text / Highlights
              </label>
              <input
                type="number"
                step="0.50"
                value={rates.colorLight}
                onChange={(e) => setRates({ ...rates, colorLight: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Page Color / Graphics
              </label>
              <input
                type="number"
                step="0.50"
                value={rates.colorFull}
                onChange={(e) => setRates({ ...rates, colorFull: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                HD Photo (4R / Glossy Sheet)
              </label>
              <input
                type="number"
                step="1.00"
                value={rates.photoHd}
                onChange={(e) => setRates({ ...rates, photoHd: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>
        </div>

        {/* Binding & Finishing */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h3 className="font-display font-bold text-sm text-slate-900">
            Binding & Finishing Flat Fees (₱)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Coil Ring Binding
              </label>
              <input
                type="number"
                value={rates.ringBind}
                onChange={(e) => setRates({ ...rates, ringBind: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Softbound (Clear Spine)
              </label>
              <input
                type="number"
                value={rates.softbound}
                onChange={(e) => setRates({ ...rates, softbound: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hardbound w/ Gold Foil
              </label>
              <input
                type="number"
                value={rates.hardboundGold}
                onChange={(e) => setRates({ ...rates, hardboundGold: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Plastic Lamination / Sheet
              </label>
              <input
                type="number"
                value={rates.laminate}
                onChange={(e) => setRates({ ...rates, laminate: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Rate Matrix</span>
          </button>
        </div>
      </form>
    </div>
  );
};
