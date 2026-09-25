import React, { useState, useId } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileUp,
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
  Printer,
  Layers,
  Palette,
  CreditCard,
  QrCode,
  Banknote,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  PrintType,
  PaperSize,
  ColorMode,
  PaperWeight,
  BindingFinishing,
  PrintSpecifications,
  UploadedFile
} from '../types';
import { sounds } from '../utils/sound';

export const PrintRequestForm: React.FC = () => {
  const { submitPrintJob, calculateJobPrice, setCustomerView, searchAndTrackJob } = useApp();

  // File state
  const [uploadedFile, setUploadedFile] = useState<UploadedFile>({
    name: 'ITE_381_IT_Business_Solution_Project_CheckIn.pdf',
    sizeBytes: 1850000,
    fileType: 'pdf',
    pageCount: 4,
  });

  // Specifications
  const [printType, setPrintType] = useState<PrintType>('document');
  const [paperSize, setPaperSize] = useState<PaperSize>('a4');
  const [colorMode, setColorMode] = useState<ColorMode>('bw');
  const [paperWeight, setPaperWeight] = useState<PaperWeight>('regular_70gsm');
  const [copies, setCopies] = useState<number>(1);
  const [bindingFinishing, setBindingFinishing] = useState<BindingFinishing>('staple');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [doubleSided, setDoubleSided] = useState<boolean>(false);
  const [isRushOrder, setIsRushOrder] = useState<boolean>(false);
  const [customerNotes, setCustomerNotes] = useState<string>('');

  // Customer Contact
  const [customerName, setCustomerName] = useState<string>('Ace DC Arcilla');
  const [customerPhone, setCustomerPhone] = useState<string>('0917-523-9081');
  const [studentId, setStudentId] = useState<string>('01-1617-05710');
  const [customerEmail, setCustomerEmail] = useState<string>('ace.arcilla@phinmaed.com');
  const [paymentMethod, setPaymentMethod] = useState<'gcash' | 'cash_counter' | 'maya'>('gcash');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackQuery, setTrackQuery] = useState('');
  const [trackError, setTrackError] = useState('');

  const currentSpecs: PrintSpecifications = {
    printType,
    paperSize,
    colorMode,
    paperWeight,
    copies,
    pageRange: 'all',
    bindingFinishing,
    orientation,
    doubleSided,
    isRushOrder,
    customerNotes,
  };

  const pricing = calculateJobPrice(currentSpecs, uploadedFile.pageCount);

  // File selection mock/real
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sounds.playPop();
      let guessedPages = 1;
      let fType: UploadedFile['fileType'] = 'other';

      if (file.name.endsWith('.pdf')) {
        guessedPages = Math.max(1, Math.round(file.size / 350000));
        fType = 'pdf';
      } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        guessedPages = Math.max(1, Math.round(file.size / 150000));
        fType = 'docx';
      } else if (file.type.startsWith('image/')) {
        guessedPages = 1;
        fType = 'image';
      }

      setUploadedFile({
        name: file.name,
        sizeBytes: file.size,
        fileType: fType,
        pageCount: guessedPages,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please provide your name and phone number for SMS tracking updates.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitPrintJob(
        {
          name: customerName.trim(),
          phone: customerPhone.trim(),
          email: customerEmail.trim() || undefined,
          studentId: studentId.trim() || undefined,
        },
        uploadedFile,
        currentSpecs,
        paymentMethod
      );

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      setIsSubmitting(false);
    }, 400);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError('');
    const res = searchAndTrackJob(trackQuery);
    if (!res.found) {
      setTrackError(res.message || 'No job found');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Problem & Solution Header Banner (Directly aligned with PHINMA AU Project Check-in) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PHINMA Araullo University · College of IT Business Solution</span>
          </div>

          <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight">
            Cutie Bits & Co. <span className="text-pink-400">Online Web to Print (WTP)</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Eliminating on-site waiting queues and repetitive inquiry texts! Upload your handouts, reports, thesis, or photo IDs directly with complete print specifications, and track production progress in real time.
          </p>

          {/* Quick Track Input Bar directly in Hero */}
          <form onSubmit={handleTrackSubmit} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-lg">
            <input
              type="text"
              value={trackQuery}
              onChange={(e) => setTrackQuery(e.target.value)}
              placeholder="Already submitted? Enter WTP Code (e.g. WTP-101)..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-pink-500/25 cursor-pointer"
            >
              <span>Track My Print</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
          {trackError && <p className="text-[11px] text-rose-300 font-medium">{trackError}</p>}
        </div>

        {/* Background glow circle */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-pink-500/10 blur-3xl pointer-events-none"></div>
      </div>

      {/* Main Request Form & Real-time Calculator Split */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: File Upload & Specifications Form (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: File Upload */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Upload Document or File
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                PDF, Word (.docx), JPG, PNG, PPT
              </span>
            </div>

            {/* Drag & Drop Upload Container */}
            <div className="relative border-2 border-dashed border-pink-200 hover:border-pink-400 bg-pink-50/20 rounded-2xl p-6 text-center transition-colors">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.ppt,.pptx"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                <div className="w-12 h-12 rounded-2xl bg-white text-pink-500 flex items-center justify-center shadow-xs border border-pink-100">
                  <FileUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Click to browse or drop your document here
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Fast upload up to 50MB · Automatic page calculation
                  </p>
                </div>
              </div>
            </div>

            {/* Uploaded File Details Pill & Page Count Modifier */}
            {uploadedFile && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                    {uploadedFile.fileType}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">
                      {uploadedFile.name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {(uploadedFile.sizeBytes / 1024 / 1024).toFixed(2)} MB · Detected format
                    </p>
                  </div>
                </div>

                {/* Page count adjuster */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs text-slate-600 font-semibold">Total Pages:</span>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={uploadedFile.pageCount}
                    onChange={(e) => setUploadedFile({ ...uploadedFile, pageCount: Math.max(1, Number(e.target.value)) })}
                    className="w-16 px-2 py-1 rounded-lg border border-slate-300 text-xs font-mono font-bold text-center bg-white focus:ring-2 focus:ring-pink-400"
                  />
                  <span className="text-xs text-slate-400">pages</span>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Print Specifications */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Print Specifications
              </h3>
            </div>

            {/* Print Type Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Document / Project Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'document', label: 'Handouts & Report', icon: '📄' },
                  { id: 'thesis_binding', label: 'Thesis & Capstone', icon: '📚' },
                  { id: 'photo_id', label: '2x2 ID Photo Print', icon: '🖼️' },
                  { id: 'sticker_sheet', label: 'Sticker & Decal Sheet', icon: '✨' },
                  { id: 'poster_tarp', label: 'Poster / Diagram', icon: '📐' },
                  { id: 'brochure', label: 'Flyer / Brochure', icon: '📰' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setPrintType(item.id as PrintType);
                      if (item.id === 'thesis_binding') setBindingFinishing('softbound');
                      if (item.id === 'photo_id') {
                        setColorMode('photo_hd');
                        setPaperWeight('glossy_photo_200gsm');
                      }
                    }}
                    className={`p-3 rounded-2xl border text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                      printType === item.id
                        ? 'border-pink-500 bg-pink-50 text-pink-900 shadow-xs ring-1 ring-pink-400'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Paper Size & Color Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Paper Size */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Paper Size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'short_letter', label: 'Short (Letter 8.5x11)' },
                    { id: 'a4', label: 'A4 Standard (8.27x11.69)' },
                    { id: 'long_legal', label: 'Long (Legal 8.5x13)' },
                    { id: 'a3', label: 'A3 (Large Diagram)' },
                  ].map(size => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        setPaperSize(size.id as PaperSize);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        paperSize === size.id
                          ? 'border-pink-500 bg-pink-50 text-pink-800'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Mode */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Print Color
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'bw', label: 'B&W (Mono)', sub: '₱2/page' },
                    { id: 'colored', label: 'Color', sub: '₱6/page' },
                    { id: 'photo_hd', label: 'HD Photo', sub: '₱25/page' },
                  ].map(color => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        setColorMode(color.id as ColorMode);
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        colorMode === color.id
                          ? 'border-pink-500 bg-pink-50 text-pink-800 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="text-xs font-semibold">{color.label}</div>
                      <div className="text-[10px] text-pink-600 font-mono mt-0.5">{color.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Paper Stock & Binding */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Paper Weight */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Paper Stock Type
                </label>
                <select
                  value={paperWeight}
                  onChange={(e) => setPaperWeight(e.target.value as PaperWeight)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option value="regular_70gsm">Regular Copy Paper 70gsm (Standard)</option>
                  <option value="bookpaper_80gsm">Bookpaper 80gsm (Thesis & High Quality +₱0.50/pg)</option>
                  <option value="cardstock_250gsm">Heavy Cardstock 250gsm (Cover/Cert +₱5/pg)</option>
                  <option value="glossy_photo_200gsm">Glossy Photo Paper 200gsm (+₱10/pg)</option>
                  <option value="matte_sticker">Matte Sticker Paper (+₱12/pg)</option>
                  <option value="vinyl_waterproof">Waterproof Vinyl Sticker (+₱20/pg)</option>
                </select>
              </div>

              {/* Binding Finishing */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Binding & Finishing
                </label>
                <select
                  value={bindingFinishing}
                  onChange={(e) => setBindingFinishing(e.target.value as BindingFinishing)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option value="none">No Binding (Loose Sheets)</option>
                  <option value="staple">Corner Stapled (+₱5.00)</option>
                  <option value="ring_bind">Coil Ring Bound with Acetate (+₱45.00)</option>
                  <option value="softbound">Softbound Book with Clear Spine (+₱75.00)</option>
                  <option value="hardbound_gold">Hardbound with Gold Stamping (+₱260.00)</option>
                  <option value="laminate">Plastic Lamination (+₱25.00/pg)</option>
                </select>
              </div>
            </div>

            {/* Copies, Orientation & Rush Order Toggle */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-700">Number of Sets / Copies:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setCopies(c => Math.max(1, c - 1));
                    }}
                    className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-sm text-slate-900 w-6 text-center">{copies}</span>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setCopies(c => c + 1);
                    }}
                    className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Rush Order Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-amber-900 font-semibold">
                <input
                  type="checkbox"
                  checked={isRushOrder}
                  onChange={(e) => setIsRushOrder(e.target.checked)}
                  className="rounded text-pink-600 focus:ring-pink-500"
                />
                <span className="flex items-center gap-1">
                  ⚡ Rush Order (+₱35 priority queue)
                </span>
              </label>
            </div>

            {/* Customer Special Notes */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Special Instructions for Operator
              </label>
              <textarea
                rows={2}
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="e.g. Please print page 1 in colored, the rest in B&W. Front acetate cover in clear frosted."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          {/* Step 3: Contact & SMS Notification Details */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Customer & SMS Notification Details
                </h3>
              </div>
              <span className="text-[10px] text-pink-600 font-semibold bg-pink-50 px-2 py-0.5 rounded">
                Automatic SMS on Ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ace Arcilla"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number (Receives SMS Text When Ready)
                </label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0917-XXX-XXXX"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student ID Number (Optional)
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. 01-1617-05710 (PHINMA AU)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="student@phinmaed.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Payment Option
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setPaymentMethod('gcash');
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'gcash'
                      ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5 text-blue-600" />
                  <span>GCash / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setPaymentMethod('cash_counter');
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'cash_counter'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cash on Pickup</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setPaymentMethod('maya');
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'maya'
                      ? 'bg-purple-50 border-purple-500 text-purple-800 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                  <span>Maya / Card</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Instant Real-time Price Quotation Card (4 Cols Sticky) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg shadow-slate-100 space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-2 py-0.5 rounded">
                Live Cost Breakdown
              </span>
              <h3 className="font-display font-bold text-lg text-slate-900 mt-1">
                Order Summary
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Transparent student pricing · Zero surprise fees
              </p>
            </div>

            {/* Line items */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">
                  Printing ({uploadedFile.pageCount} pgs × {copies} {copies > 1 ? 'sets' : 'set'} · {colorMode.toUpperCase()}):
                </span>
                <span className="font-mono font-bold text-slate-900">
                  ₱{pricing.pageTotal.toFixed(2)}
                </span>
              </div>

              {pricing.paperUpcharge > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Special Paper Stock:</span>
                  <span className="font-mono font-bold text-slate-900">
                    +₱{pricing.paperUpcharge.toFixed(2)}
                  </span>
                </div>
              )}

              {pricing.bindingCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    Binding ({bindingFinishing.replace('_', ' ')}):
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    +₱{pricing.bindingCost.toFixed(2)}
                  </span>
                </div>
              )}

              {pricing.rushFee > 0 && (
                <div className="flex justify-between text-amber-700 font-semibold">
                  <span>⚡ Priority Rush Queue:</span>
                  <span className="font-mono">+₱{pricing.rushFee.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-slate-900 text-sm">TOTAL AMOUNT</span>
                  <p className="text-[10px] text-slate-400">VAT & Student Discount included</p>
                </div>
                <div className="text-2xl font-extrabold text-pink-600 font-mono">
                  ₱{pricing.totalAmount.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Expected Turnaround */}
            <div className="p-3 bg-pink-50/60 rounded-2xl border border-pink-100 flex items-center gap-2.5 text-xs text-slate-700">
              <Clock className="w-4 h-4 text-pink-500 shrink-0" />
              <div>
                <span className="font-bold text-slate-800">
                  {isRushOrder ? 'Ready in approx. 15-20 mins' : 'Ready in approx. 30-45 mins'}
                </span>
                <p className="text-[10px] text-slate-500">
                  Track progress in real time via your personal tracking code!
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              <Printer className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting Print Job...' : 'Submit Print Request Now'}</span>
            </button>

            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              Upon submission, you will receive a unique tracking code (e.g. WTP-105). You can check status anytime without messaging the owner!
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
