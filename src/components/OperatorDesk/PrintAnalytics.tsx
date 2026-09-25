import React from 'react';
import { useApp } from '../../context/AppContext';
import { Download, TrendingUp, Printer, FileText, CheckCircle2, Banknote } from 'lucide-react';
import { sounds } from '../../utils/sound';

export const PrintAnalytics: React.FC = () => {
  const { printJobs } = useApp();

  const totalRevenue = printJobs.reduce((sum, j) => sum + j.pricing.totalAmount, 0);
  const paidRevenue = printJobs
    .filter(j => j.paymentStatus === 'paid')
    .reduce((sum, j) => sum + j.pricing.totalAmount, 0);

  const totalPages = printJobs.reduce(
    (sum, j) => sum + j.file.pageCount * j.specifications.copies,
    0
  );

  const completedCount = printJobs.filter(
    j => j.status === 'ready_pickup' || j.status === 'claimed'
  ).length;

  const exportCSV = () => {
    sounds.playPop();
    const rows = [
      ['WTP Code', 'Customer', 'Student ID', 'Phone', 'File', 'Pages', 'Copies', 'Color', 'Binding', 'Total', 'Payment', 'Status', 'Date'],
      ...printJobs.map(j => [
        j.trackingCode,
        j.customerName,
        j.studentId || 'N/A',
        j.customerPhone,
        j.file.name,
        j.file.pageCount,
        j.specifications.copies,
        j.specifications.colorMode,
        j.specifications.bindingFinishing,
        `₱${j.pricing.totalAmount.toFixed(2)}`,
        `${j.paymentMethod} (${j.paymentStatus})`,
        j.status,
        new Date(j.createdAt).toLocaleString()
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cutie_bits_wtp_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-display">
            Print Production & Revenue Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Real-time daily print job metrics, total page volume, and payment collections.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Production CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Gross Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            ₱{totalRevenue.toFixed(2)}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            ₱{paidRevenue.toFixed(2)} Collected
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Pages Printed</span>
            <FileText className="w-4 h-4 text-pink-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {totalPages.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">
            Across {printJobs.length} submitted jobs
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Ready / Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {completedCount}
          </div>
          <span className="text-[11px] text-slate-500">
            {printJobs.length - completedCount} in progress
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>GCash Digital Share</span>
            <Banknote className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {Math.round((printJobs.filter(j => j.paymentMethod === 'gcash').length / Math.max(1, printJobs.length)) * 100)}%
          </div>
          <span className="text-[11px] text-slate-500">
            Direct cashless pickups
          </span>
        </div>
      </div>

      {/* Full Transaction History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-display font-bold text-sm text-slate-900">
            Print Order Ledger & Tracking Codes
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {printJobs.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Tracking Code</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">File Name</th>
                <th className="py-3 px-4">Specs</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {printJobs.map(j => (
                <tr key={j.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {j.trackingCode}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {j.customerName}
                  </td>
                  <td className="py-3 px-4 text-slate-600 truncate max-w-xs">
                    {j.file.name}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {j.file.pageCount} pgs · {j.specifications.colorMode.toUpperCase()}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-pink-600">
                    ₱{j.pricing.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 uppercase text-[10px] font-semibold">
                    <span className={`px-2 py-0.5 rounded ${
                      j.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {j.paymentMethod} · {j.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 capitalize font-semibold text-slate-700">
                    {j.status.replace('_', ' ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
