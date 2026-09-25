import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  AlertCircle,
  MessageSquare,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Phone,
  User,
  PackageCheck
} from 'lucide-react';
import { PrintJobStatus } from '../types';
import { sounds } from '../utils/sound';

export const OrderTracker: React.FC = () => {
  const {
    printJobs,
    activeTrackingJob,
    setActiveTrackingJob,
    searchAndTrackJob,
    setCustomerView
  } = useApp();

  const [searchInput, setSearchInput] = useState('');
  const [searchError, setSearchError] = useState('');

  // Default to activeTrackingJob, or fallback to first job
  const currentJob = activeTrackingJob || printJobs[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const res = searchAndTrackJob(searchInput);
    if (!res.found) {
      setSearchError(res.message || 'No job found');
    }
  };

  const stages: { key: PrintJobStatus; label: string; desc: string }[] = [
    { key: 'in_line', label: '1. In Line', desc: 'Job received in queue' },
    { key: 'pre_flight', label: '2. Pre-Flight', desc: 'File verified & prepped' },
    { key: 'being_printed', label: '3. Being Printed', desc: 'Active on printer' },
    { key: 'finishing', label: '4. Finishing', desc: 'Binding & trimming' },
    { key: 'ready_pickup', label: '5. Ready for Pickup', desc: 'Finished at counter' },
  ];

  const getStageIndex = (status: PrintJobStatus) => {
    switch (status) {
      case 'in_line': return 0;
      case 'pre_flight': return 1;
      case 'being_printed': return 2;
      case 'finishing': return 3;
      case 'ready_pickup':
      case 'claimed': return 4;
      default: return 0;
    }
  };

  const currentStageIdx = currentJob ? getStageIndex(currentJob.status) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Search Bar & Title */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
            Live Print Job Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track your printing orders in real time. Know immediately when your document is in line, being printed, or finished for counter pickup without texting the owner!
          </p>
        </div>

        {/* Search input form */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter your Tracking Code (e.g. WTP-101, WTP-102) or Mobile #..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
          <button
            type="submit"
            className="py-2.5 px-6 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-pink-500/20"
          >
            <Search className="w-4 h-4" />
            <span>Search Job</span>
          </button>
        </form>

        {searchError && (
          <p className="text-xs text-rose-600 font-medium">{searchError}</p>
        )}

        {/* Quick Demo Switcher Chips */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400">Quick Track Samples:</span>
          {printJobs.map(job => (
            <button
              key={job.id}
              onClick={() => {
                sounds.playPop();
                setActiveTrackingJob(job);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold transition-all ${
                currentJob?.id === job.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {job.trackingCode} ({job.status.replace('_', ' ')})
            </button>
          ))}
        </div>
      </div>

      {/* Main Track Display Card */}
      {currentJob ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md shadow-slate-100 overflow-hidden space-y-6">
          {/* Top Banner with Tracking Code & Current Status */}
          <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xl font-extrabold tracking-wider text-pink-400">
                  {currentJob.trackingCode}
                </span>
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    currentJob.status === 'ready_pickup'
                      ? 'bg-emerald-500 text-white animate-pulse'
                      : currentJob.status === 'being_printed'
                      ? 'bg-blue-500 text-white'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {currentJob.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Customer: <span className="text-white font-bold">{currentJob.customerName}</span>
                {currentJob.studentId && ` · ID: ${currentJob.studentId}`}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
                Current Estimated Status
              </span>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">
                {currentJob.estimatedReadyTime}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Updated {new Date(currentJob.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* 5-Stage Visual Progress Stepper */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {stages.map((stage, idx) => {
                const isComplete = idx < currentStageIdx || currentJob.status === 'ready_pickup' || currentJob.status === 'claimed';
                const isCurrent = idx === currentStageIdx && currentJob.status !== 'ready_pickup' && currentJob.status !== 'claimed';

                return (
                  <div
                    key={stage.key}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isComplete
                        ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900'
                        : isCurrent
                        ? 'bg-pink-50 border-pink-500 text-pink-900 ring-2 ring-pink-400/50'
                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      {isComplete ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCurrent ? 'bg-pink-500 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-xs font-display">{stage.label}</div>
                    <div className="text-[10px] mt-0.5 font-medium leading-tight line-clamp-1">{stage.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Specifications & Document Details Grid */}
          <div className="px-6 grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 pb-6 border-t border-slate-100">
            {/* File & Print specs */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-pink-500" />
                <span>Job Specifications</span>
              </h4>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">File Name:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                    {currentJob.file.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pages & Copies:</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {currentJob.file.pageCount} pages × {currentJob.specifications.copies} set(s)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Paper & Size:</span>
                  <span className="font-semibold text-slate-800 capitalize">
                    {currentJob.specifications.paperSize.replace('_', ' ')} · {currentJob.specifications.paperWeight.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Color Mode:</span>
                  <span className="font-semibold text-pink-600 uppercase font-mono">
                    {currentJob.specifications.colorMode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Binding / Finishing:</span>
                  <span className="font-semibold text-slate-800 capitalize">
                    {currentJob.specifications.bindingFinishing.replace('_', ' ')}
                  </span>
                </div>
                {currentJob.specifications.customerNotes && (
                  <div className="pt-2 border-t border-slate-200 text-slate-600 italic text-[11px]">
                    Note: "{currentJob.specifications.customerNotes}"
                  </div>
                )}
              </div>
            </div>

            {/* Financial & SMS Status History */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-pink-500" />
                <span>Payment & Status Audit Log</span>
              </h4>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-800">Total Price:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-pink-600 font-mono">
                      ₱{currentJob.pricing.totalAmount.toFixed(2)}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      currentJob.paymentStatus === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {currentJob.paymentMethod} · {currentJob.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Audit trail logs */}
                <div className="pt-1 space-y-1.5 max-h-40 overflow-y-auto">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                    Real-time Timeline:
                  </span>
                  {currentJob.statusLogs.map((log, idx) => (
                    <div key={idx} className="text-[11px] flex items-start gap-2">
                      <span className="text-slate-400 font-mono text-[10px] shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-slate-700">
                        {log.note || `Status: ${log.status.replace('_', ' ')}`}
                      </span>
                    </div>
                  ))}
                </div>

                {/* SMS alert record */}
                {currentJob.smsAlertsSent.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-pink-600 tracking-wider block">
                      SMS Dispatched to {currentJob.customerPhone}:
                    </span>
                    {currentJob.smsAlertsSent.map((sms, i) => (
                      <p key={i} className="text-[10px] text-slate-600 font-sans mt-0.5">
                        "{sms.message}"
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 font-medium">
              Pick up at: Cutie Bits & Co. Campus Print Desk · PHINMA Araullo University
            </span>

            <button
              onClick={() => setCustomerView('request')}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer"
            >
              + Submit Another Print Request
            </button>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <p className="font-semibold text-slate-600">No print job selected.</p>
        </div>
      )}
    </div>
  );
};
