import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PrintJob, PrintJobStatus } from '../../types';
import {
  Printer,
  FileText,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  Banknote,
  Phone,
  User,
  AlertTriangle,
  Download,
  Filter,
  Check
} from 'lucide-react';
import { sounds } from '../../utils/sound';

export const PrintProductionQueue: React.FC = () => {
  const { printJobs, updateJobStatus, updateJobPayment, deleteJob } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | PrintJobStatus>('all');
  const [search, setSearch] = useState('');
  const [activeSmsModalJob, setActiveSmsModalJob] = useState<PrintJob | null>(null);
  const [customSmsMsg, setCustomSmsMsg] = useState('');

  const filteredJobs = printJobs.filter(j => {
    const matchStatus = statusFilter === 'all' || j.status === statusFilter;
    const matchSearch =
      j.trackingCode.toLowerCase().includes(search.toLowerCase()) ||
      j.customerName.toLowerCase().includes(search.toLowerCase()) ||
      j.file.name.toLowerCase().includes(search.toLowerCase()) ||
      j.customerPhone.includes(search);
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: PrintJobStatus) => {
    switch (status) {
      case 'in_line':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'pre_flight':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'being_printed':
        return 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse';
      case 'finishing':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'ready_pickup':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 animate-pulse';
      case 'claimed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const handleSendCustomSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSmsModalJob || !customSmsMsg.trim()) return;

    sounds.playSmsAlert();
    updateJobStatus(
      activeSmsModalJob.id,
      activeSmsModalJob.status,
      `SMS sent to customer: "${customSmsMsg.trim()}"`,
      true
    );
    setActiveSmsModalJob(null);
    setCustomSmsMsg('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-display">
            Print Production Queue & Job Dispatcher
          </h2>
          <p className="text-xs text-slate-500">
            Advance jobs through stages, inspect incoming files, and send automatic SMS ready-alerts to customers.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search WTP code, name, phone..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400"
          />
        </div>
      </div>

      {/* Filter Tabs: Zero-pill discipline (functional button controls) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {(['all', 'in_line', 'pre_flight', 'being_printed', 'finishing', 'ready_pickup', 'claimed'] as const).map(status => {
          const count = status === 'all'
            ? printJobs.length
            : printJobs.filter(j => j.status === status).length;
          const isActive = statusFilter === status;

          return (
            <button
              key={status}
              onClick={() => {
                sounds.playPop();
                setStatusFilter(status);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
              }`}
            >
              <span>{status === 'all' ? 'All Jobs' : status.replace('_', ' ')}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                isActive ? 'bg-pink-500 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Print Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-600">No print jobs found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredJobs.map(job => (
            <div
              key={job.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between hover:border-pink-300 transition-all ${
                job.specifications.isRushOrder ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-extrabold text-slate-900">
                        {job.trackingCode}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${getStatusBadge(job.status)}`}>
                        {job.status.replace('_', ' ')}
                      </span>
                      {job.specifications.isRushOrder && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white animate-bounce">
                          ⚡ RUSH
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-slate-700 mt-1 flex items-center gap-1.5">
                      <span>{job.customerName}</span>
                      {job.studentId && (
                        <>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="text-[11px] text-slate-500 font-mono">ID: {job.studentId}</span>
                        </>
                      )}
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-[11px] text-pink-600 font-mono flex items-center gap-0.5">
                        <Phone className="w-3 h-3" />
                        {job.customerPhone}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* File & Specs Pill */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 line-clamp-1 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                      {job.file.name}
                    </span>
                    <span className="font-mono font-bold text-slate-700 shrink-0">
                      {job.file.pageCount} pgs × {job.specifications.copies} set(s)
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 font-medium">
                    <span className="capitalize">{job.specifications.paperSize.replace('_', ' ')}</span>
                    <span aria-hidden="true">·</span>
                    <span className="uppercase text-pink-600 font-bold">{job.specifications.colorMode}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{job.specifications.paperWeight.replace('_', ' ')}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize font-bold text-indigo-600">
                      {job.specifications.bindingFinishing.replace('_', ' ')}
                    </span>
                  </div>

                  {job.specifications.customerNotes && (
                    <div className="text-[10px] text-amber-800 italic pt-1 border-t border-slate-200">
                      Note: "{job.specifications.customerNotes}"
                    </div>
                  )}
                </div>

                {/* Price & Payment */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      ₱{job.pricing.totalAmount.toFixed(2)}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      job.paymentStatus === 'paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {job.paymentMethod} · {job.paymentStatus}
                    </span>
                  </div>

                  {job.paymentStatus === 'unpaid' && (
                    <button
                      onClick={() => updateJobPayment(job.id, 'paid')}
                      className="py-1 px-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-[10px] flex items-center gap-1 shadow-2xs transition-colors"
                    >
                      <Banknote className="w-3 h-3" />
                      <span>Collect Cash</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Status Advancement Workflow Buttons */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                {/* Custom SMS trigger */}
                <button
                  onClick={() => {
                    sounds.playPop();
                    setActiveSmsModalJob(job);
                    setCustomSmsMsg(`Cutie Bits & Co: Hi ${job.customerName}, regarding order ${job.trackingCode}...`);
                  }}
                  className="py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Send SMS text update to customer"
                >
                  <Send className="w-3 h-3 text-pink-500" />
                  <span>Send SMS</span>
                </button>

                {/* State Machine Actions */}
                <div className="flex items-center gap-1.5">
                  {job.status === 'in_line' && (
                    <button
                      onClick={() => updateJobStatus(job.id, 'pre_flight', 'File verified by operator')}
                      className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>Pass Pre-Flight</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}

                  {job.status === 'pre_flight' && (
                    <button
                      onClick={() => updateJobStatus(job.id, 'being_printed', 'Dispatched to printer')}
                      className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1 animate-pulse"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Start Printing</span>
                    </button>
                  )}

                  {job.status === 'being_printed' && (
                    <button
                      onClick={() => updateJobStatus(job.id, 'finishing', 'Printing done. Moving to binding/finishing')}
                      className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>Binding / Finishing</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}

                  {job.status === 'finishing' && (
                    <button
                      onClick={() => updateJobStatus(job.id, 'ready_pickup', 'Finished and placed at front counter', true)}
                      className="py-1.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready for Pickup (Auto SMS)</span>
                    </button>
                  )}

                  {job.status === 'ready_pickup' && (
                    <button
                      onClick={() => updateJobStatus(job.id, 'claimed', 'Claimed by student at counter')}
                      className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Claimed / Done</span>
                    </button>
                  )}

                  {job.status === 'claimed' && (
                    <span className="text-[11px] font-semibold text-emerald-600">
                      ✓ Completed & Claimed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Send SMS Modal to Customer */}
      {activeSmsModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900">
              Send SMS Update to Customer
            </h3>

            <p className="text-xs text-slate-500">
              Sending to <span className="font-mono font-bold text-slate-800">{activeSmsModalJob.customerPhone}</span> ({activeSmsModalJob.customerName} · {activeSmsModalJob.trackingCode})
            </p>

            <form onSubmit={handleSendCustomSms} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message Text
                </label>
                <textarea
                  rows={3}
                  required
                  value={customSmsMsg}
                  onChange={(e) => setCustomSmsMsg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveSmsModalJob(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send SMS Alert</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
