import React from 'react';
import { useApp } from '../context/AppContext';
import { Tag, Check, Sparkles, Printer, BookOpen, Layers } from 'lucide-react';
import { sounds } from '../utils/sound';

export const PriceRatesView: React.FC = () => {
  const { priceRates, setCustomerView } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200 text-xs font-semibold">
          <Tag className="w-3.5 h-3.5" />
          <span>Cutie Bits & Co. Print Services</span>
        </div>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
          Standard Student & Campus Print Rates
        </h2>
        <p className="text-xs text-slate-500">
          Affordable, transparent pricing tailored for university handouts, reports, thesis binding, and photo printing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Document Printing Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-pink-300 transition-colors">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
              📄
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">Document Printing</h3>
              <p className="text-[11px] text-slate-400">Handouts, Assignments, Exams</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600">B&W Short / A4 (70gsm)</span>
              <span className="font-mono font-bold text-slate-900">₱{priceRates.bwLetter.toFixed(2)} / page</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600">B&W Long Legal</span>
              <span className="font-mono font-bold text-slate-900">₱{priceRates.bwLegal.toFixed(2)} / page</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600">Colored Text & Highlights</span>
              <span className="font-mono font-bold text-pink-600">₱{priceRates.colorLight.toFixed(2)} / page</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600">Full Colored Graphics</span>
              <span className="font-mono font-bold text-pink-600">₱{priceRates.colorFull.toFixed(2)} / page</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600">Bookpaper 80gsm upgrade</span>
              <span className="font-mono text-slate-500">+₱0.50 / page</span>
            </div>
          </div>
        </div>

        {/* Thesis & Bookbinding Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-pink-300 transition-colors">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              📚
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">Thesis & Bookbinding</h3>
              <p className="text-[11px] text-slate-400">CapStone, Manuals, Projects</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600">Corner Stapled</span>
              <span className="font-mono font-bold text-slate-900">₱{priceRates.staple.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600">Ring Binding (Coil + Acetate)</span>
              <span className="font-mono font-bold text-indigo-600">₱{priceRates.ringBind.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600">Softbound Book (Clear Spine)</span>
              <span className="font-mono font-bold text-indigo-600">₱{priceRates.softbound.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600">Hardbound w/ Gold Foil</span>
              <span className="font-mono font-bold text-indigo-600">₱{priceRates.hardboundGold.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600">ID / Document Lamination</span>
              <span className="font-mono text-slate-500">₱{priceRates.laminate.toFixed(2)} / page</span>
            </div>
          </div>
        </div>

        {/* Photo & Specialty Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-pink-300 transition-colors">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              🖼️
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">Specialty & Photos</h3>
              <p className="text-[11px] text-slate-400">ID Photos, Decals, A3 Diagrams</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600">2x2 ID Photo Set (6 pcs)</span>
              <span className="font-mono font-bold text-amber-700">₱35.00 / set</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600">Photo HD Glossy (4R / 5R)</span>
              <span className="font-mono font-bold text-slate-900">₱{priceRates.photoHd.toFixed(2)} / sheet</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600">Matte Sticker Sheet (A4)</span>
              <span className="font-mono font-bold text-slate-900">₱25.00 / sheet</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600">Waterproof Vinyl Decal</span>
              <span className="font-mono font-bold text-slate-900">₱45.00 / sheet</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600">A3 Architectural Layout</span>
              <span className="font-mono text-slate-500">₱40.00 / sheet</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => {
            sounds.playPop();
            setCustomerView('request');
          }}
          className="py-3 px-8 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-md shadow-pink-500/25 transition-all cursor-pointer"
        >
          Submit a Print Request Online Now →
        </button>
      </div>
    </div>
  );
};
