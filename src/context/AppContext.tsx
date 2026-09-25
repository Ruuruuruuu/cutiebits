import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  PrintJob,
  PrinterStation,
  OwnerCredentials,
  PriceRates,
  PrintJobStatus,
  PaymentStatus,
  SmsMessage,
  PrintSpecifications,
  UploadedFile
} from '../types';
import {
  INITIAL_PRINT_JOBS,
  INITIAL_PRINTERS,
  INITIAL_OWNER_CREDENTIALS,
  DEFAULT_PRICE_RATES
} from '../data/initialData';
import { sounds } from '../utils/sound';

interface AppContextType {
  // Navigation & Modes
  currentMode: 'customer' | 'operator';
  setCurrentMode: (mode: 'customer' | 'operator') => void;
  customerView: 'request' | 'track' | 'rates';
  setCustomerView: (view: 'request' | 'track' | 'rates') => void;

  // Operator Auth
  isOperatorLoggedIn: boolean;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isForgotPasswordModalOpen: boolean;
  setIsForgotPasswordModalOpen: (open: boolean) => void;
  ownerCredentials: OwnerCredentials;
  updateOwnerCredentials: (creds: Partial<OwnerCredentials>) => void;
  loginOperator: (pass: string) => boolean;
  logoutOperator: () => void;
  openOperatorDesk: () => void;

  // SMS Text Password Recovery Simulation
  activeSmsMessage: SmsMessage | null;
  dismissSmsMessage: () => void;
  sendPasswordResetSms: (phone?: string) => { success: boolean; code: string; phone: string };
  resetPasswordWithCode: (code: string, newPass: string) => { success: boolean; message: string };

  // Sound
  soundEnabled: boolean;
  toggleSound: () => void;

  // Print Jobs
  printJobs: PrintJob[];
  submitPrintJob: (
    customerInfo: { name: string; phone: string; email?: string; studentId?: string },
    file: UploadedFile,
    specifications: PrintSpecifications,
    paymentMethod: 'gcash' | 'cash_counter' | 'maya'
  ) => PrintJob;
  updateJobStatus: (
    jobId: string,
    newStatus: PrintJobStatus,
    note?: string,
    notifyCustomerSms?: boolean
  ) => void;
  updateJobPayment: (jobId: string, paymentStatus: PaymentStatus) => void;
  deleteJob: (jobId: string) => void;

  // Tracking
  activeTrackingJob: PrintJob | null;
  setActiveTrackingJob: (job: PrintJob | null) => void;
  searchAndTrackJob: (query: string) => { found: boolean; message?: string };

  // Printers Matrix
  printers: PrinterStation[];
  updatePrinterStatus: (id: string, status: PrinterStation['status']) => void;

  // Rates & Pricing
  priceRates: PriceRates;
  updatePriceRates: (rates: PriceRates) => void;
  calculateJobPrice: (
    specs: PrintSpecifications,
    pageCount: number
  ) => {
    effectivePages: number;
    ratePerPage: number;
    pageTotal: number;
    paperUpcharge: number;
    bindingCost: number;
    rushFee: number;
    subtotal: number;
    discount: number;
    totalAmount: number;
  };

  // Reset Demo
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  JOBS: 'cutiebits_wtp_jobs_v2',
  PRINTERS: 'cutiebits_wtp_printers_v2',
  OWNER: 'cutiebits_wtp_owner_v2',
  AUTH: 'cutiebits_wtp_auth_v2',
  RATES: 'cutiebits_wtp_rates_v2',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Modes
  const [currentMode, setCurrentMode] = useState<'customer' | 'operator'>('customer');
  const [customerView, setCustomerView] = useState<'request' | 'track' | 'rates'>('request');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // SMS Text state
  const [activeSmsMessage, setActiveSmsMessage] = useState<SmsMessage | null>(null);

  // Owner Auth state
  const [ownerCredentials, setOwnerCredentials] = useState<OwnerCredentials>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OWNER);
      return saved ? JSON.parse(saved) : INITIAL_OWNER_CREDENTIALS;
    } catch {
      return INITIAL_OWNER_CREDENTIALS;
    }
  });

  const [isOperatorLoggedIn, setIsOperatorLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Rates
  const [priceRates, setPriceRates] = useState<PriceRates>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RATES);
      return saved ? JSON.parse(saved) : DEFAULT_PRICE_RATES;
    } catch {
      return DEFAULT_PRICE_RATES;
    }
  });

  // Print Jobs
  const [printJobs, setPrintJobs] = useState<PrintJob[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
      return saved ? JSON.parse(saved) : INITIAL_PRINT_JOBS;
    } catch {
      return INITIAL_PRINT_JOBS;
    }
  });

  // Printers
  const [printers, setPrinters] = useState<PrinterStation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRINTERS);
      return saved ? JSON.parse(saved) : INITIAL_PRINTERS;
    } catch {
      return INITIAL_PRINTERS;
    }
  });

  // Tracking Active Job
  const [activeTrackingJob, setActiveTrackingJob] = useState<PrintJob | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OWNER, JSON.stringify(ownerCredentials));
  }, [ownerCredentials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, isOperatorLoggedIn ? 'true' : 'false');
  }, [isOperatorLoggedIn]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(printJobs));
  }, [printJobs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRINTERS, JSON.stringify(printers));
  }, [printers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RATES, JSON.stringify(priceRates));
  }, [priceRates]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setEnabled(next);
    if (next) sounds.playPop();
  };

  useEffect(() => {
    sounds.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Auth methods
  const openOperatorDesk = () => {
    sounds.playPop();
    if (isOperatorLoggedIn) {
      setCurrentMode('operator');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const loginOperator = (pass: string): boolean => {
    if (pass === ownerCredentials.passwordHash) {
      setIsOperatorLoggedIn(true);
      setIsLoginModalOpen(false);
      setCurrentMode('operator');
      sounds.playChime();
      return true;
    }
    return false;
  };

  const logoutOperator = () => {
    sounds.playPop();
    setIsOperatorLoggedIn(false);
    setCurrentMode('customer');
  };

  const updateOwnerCredentials = (creds: Partial<OwnerCredentials>) => {
    setOwnerCredentials(prev => ({ ...prev, ...creds }));
  };

  // SMS Text Simulation for Forgot Password
  const sendPasswordResetSms = (phoneInput?: string) => {
    const targetPhone = phoneInput?.trim() || ownerCredentials.phone;
    const randomDigits = Math.floor(100000 + Math.random() * 900000).toString();
    const generatedCode = `CB-${randomDigits}`;

    const newSms: SmsMessage = {
      id: `sms-${Date.now()}`,
      sender: 'CUTIE-BITS-WTP',
      phone: targetPhone,
      code: generatedCode,
      message: `Cutie Bits & Co. Security Alert: Your temporary operator desk password is ${generatedCode}. Enter this to verify ownership and change your password.`,
      timestamp: Date.now(),
      read: false,
    };

    setOwnerCredentials(prev => ({
      ...prev,
      phone: targetPhone,
      lastCodeSent: generatedCode,
      lastCodeTime: Date.now(),
    }));

    setActiveSmsMessage(newSms);
    sounds.playSmsAlert();

    return {
      success: true,
      code: generatedCode,
      phone: targetPhone,
    };
  };

  const dismissSmsMessage = () => {
    setActiveSmsMessage(null);
  };

  const resetPasswordWithCode = (code: string, newPass: string) => {
    const cleanedCode = code.trim().toUpperCase();
    const storedCode = ownerCredentials.lastCodeSent?.trim().toUpperCase();

    if (!storedCode || cleanedCode !== storedCode) {
      return {
        success: false,
        message: 'Invalid or expired temporary passcode. Please request a new SMS code.'
      };
    }

    if (!newPass || newPass.length < 4) {
      return {
        success: false,
        message: 'New password must be at least 4 characters.'
      };
    }

    setOwnerCredentials(prev => ({
      ...prev,
      passwordHash: newPass,
      lastCodeSent: undefined,
    }));

    setIsOperatorLoggedIn(true);
    setIsForgotPasswordModalOpen(false);
    setIsLoginModalOpen(false);
    setCurrentMode('operator');
    sounds.playChime();

    return {
      success: true,
      message: 'Password successfully updated! You are now logged in to the Operator Desk.'
    };
  };

  // Price Calculation Engine
  const calculateJobPrice = (specs: PrintSpecifications, pageCount: number) => {
    const effectivePages = Math.max(1, pageCount);
    let ratePerPage = priceRates.bwLetter;

    // Color mode base rate
    if (specs.colorMode === 'bw') {
      ratePerPage = specs.paperSize === 'long_legal' ? priceRates.bwLegal : priceRates.bwA4;
    } else if (specs.colorMode === 'colored') {
      ratePerPage = priceRates.colorLight;
    } else if (specs.colorMode === 'photo_hd') {
      ratePerPage = priceRates.photoHd;
    }

    // A3 surcharge
    if (specs.paperSize === 'a3') {
      ratePerPage *= 2.0;
    }

    // Paper weight upcharge per sheet
    let paperUpchargePerSheet = 0;
    if (specs.paperWeight === 'bookpaper_80gsm') paperUpchargePerSheet = 0.50;
    else if (specs.paperWeight === 'cardstock_250gsm') paperUpchargePerSheet = 5.00;
    else if (specs.paperWeight === 'glossy_photo_200gsm') paperUpchargePerSheet = 10.00;
    else if (specs.paperWeight === 'matte_sticker') paperUpchargePerSheet = 12.00;
    else if (specs.paperWeight === 'vinyl_waterproof') paperUpchargePerSheet = 20.00;

    const paperUpcharge = paperUpchargePerSheet * effectivePages * specs.copies;

    // Binding Finishing
    let bindingCost = 0;
    if (specs.bindingFinishing === 'staple') bindingCost = priceRates.staple * specs.copies;
    else if (specs.bindingFinishing === 'ring_bind') bindingCost = priceRates.ringBind * specs.copies;
    else if (specs.bindingFinishing === 'softbound') bindingCost = priceRates.softbound * specs.copies;
    else if (specs.bindingFinishing === 'hardbound_gold') bindingCost = priceRates.hardboundGold * specs.copies;
    else if (specs.bindingFinishing === 'laminate') bindingCost = priceRates.laminate * effectivePages * specs.copies;

    const pageTotal = ratePerPage * effectivePages * specs.copies;
    let rushFee = 0;
    if (specs.isRushOrder) {
      rushFee = 35.00;
    }

    const subtotal = pageTotal + paperUpcharge + bindingCost + rushFee;
    const discount = 0;
    const totalAmount = Math.max(0, subtotal - discount);

    return {
      effectivePages,
      ratePerPage,
      pageTotal,
      paperUpcharge,
      bindingCost,
      rushFee,
      subtotal,
      discount,
      totalAmount,
    };
  };

  // Submit Print Job
  const submitPrintJob = (
    customerInfo: { name: string; phone: string; email?: string; studentId?: string },
    file: UploadedFile,
    specifications: PrintSpecifications,
    paymentMethod: 'gcash' | 'cash_counter' | 'maya'
  ): PrintJob => {
    const jobNum = 100 + printJobs.length + 1;
    const trackingCode = `WTP-${jobNum}`;
    const pricing = calculateJobPrice(specifications, file.pageCount);

    const newJob: PrintJob = {
      id: `job-${Date.now()}`,
      trackingCode,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      customerEmail: customerInfo.email,
      studentId: customerInfo.studentId,
      file,
      specifications,
      pricing,
      status: 'in_line',
      estimatedReadyTime: specifications.isRushOrder ? 'Approx. 15-20 mins (Rush Priority)' : 'Approx. 30-45 mins',
      paymentMethod,
      paymentStatus: paymentMethod === 'cash_counter' ? 'unpaid' : 'paid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusLogs: [
        {
          timestamp: new Date().toISOString(),
          status: 'in_line',
          note: 'Print request submitted via Web to Print'
        }
      ],
      smsAlertsSent: [
        {
          timestamp: new Date().toISOString(),
          to: customerInfo.phone,
          message: `Cutie Bits & Co: Your print job ${trackingCode} has been received! Track online at anytime.`
        }
      ],
    };

    setPrintJobs(prev => [newJob, ...prev]);
    setActiveTrackingJob(newJob);
    setCustomerView('track');
    sounds.playChime();
    return newJob;
  };

  // Update Status
  const updateJobStatus = (
    jobId: string,
    newStatus: PrintJobStatus,
    note?: string,
    notifyCustomerSms = false
  ) => {
    sounds.playPop();

    setPrintJobs(prev =>
      prev.map(job => {
        if (job.id === jobId) {
          const newLog = {
            timestamp: new Date().toISOString(),
            status: newStatus,
            note: note || `Status changed to ${newStatus.replace('_', ' ').toUpperCase()}`
          };

          const newSmsList = [...job.smsAlertsSent];
          if (notifyCustomerSms && job.customerPhone) {
            let msg = `Cutie Bits & Co: Your print job ${job.trackingCode} is now ${newStatus.replace('_', ' ').toUpperCase()}.`;
            if (newStatus === 'ready_pickup') {
              msg = `Cutie Bits & Co: Good news! Your print job ${job.trackingCode} (${job.file.name}) is FINISHED & READY FOR PICKUP at our campus counter!`;
            }
            newSmsList.push({
              timestamp: new Date().toISOString(),
              to: job.customerPhone,
              message: msg,
            });
            sounds.playSmsAlert();
          }

          let estimatedTime = job.estimatedReadyTime;
          if (newStatus === 'ready_pickup') {
            estimatedTime = 'Ready at Counter for Pickup!';
          } else if (newStatus === 'claimed') {
            estimatedTime = 'Completed & Claimed';
          } else if (newStatus === 'being_printed') {
            estimatedTime = 'Currently printing on machine (5-10 mins)';
          }

          return {
            ...job,
            status: newStatus,
            estimatedReadyTime: estimatedTime,
            updatedAt: new Date().toISOString(),
            statusLogs: [...job.statusLogs, newLog],
            smsAlertsSent: newSmsList,
          };
        }
        return job;
      })
    );
  };

  const updateJobPayment = (jobId: string, paymentStatus: PaymentStatus) => {
    sounds.playCashRegister();
    setPrintJobs(prev =>
      prev.map(j => (j.id === jobId ? { ...j, paymentStatus, updatedAt: new Date().toISOString() } : j))
    );
  };

  const deleteJob = (jobId: string) => {
    sounds.playPop();
    setPrintJobs(prev => prev.filter(j => j.id !== jobId));
  };

  // Tracking search
  const searchAndTrackJob = (query: string) => {
    sounds.playPop();
    const clean = query.trim().toUpperCase();
    if (!clean) return { found: false, message: 'Please enter a tracking code or phone number.' };

    const found = printJobs.find(
      j =>
        j.trackingCode.toUpperCase() === clean ||
        j.customerPhone.replace(/\D/g, '').includes(clean.replace(/\D/g, '')) ||
        (j.studentId && j.studentId.toUpperCase().includes(clean))
    );

    if (found) {
      setActiveTrackingJob(found);
      setCustomerView('track');
      return { found: true };
    }
    return { found: false, message: `No active print job found for "${query}". Check your code (e.g. WTP-101).` };
  };

  // Printers
  const updatePrinterStatus = (id: string, status: PrinterStation['status']) => {
    sounds.playPop();
    setPrinters(prev =>
      prev.map(p => (p.id === id ? { ...p, status } : p))
    );
  };

  const updatePriceRates = (rates: PriceRates) => {
    sounds.playPop();
    setPriceRates(rates);
  };

  // Reset Demo
  const resetAllDemoData = () => {
    setPrintJobs(INITIAL_PRINT_JOBS);
    setPrinters(INITIAL_PRINTERS);
    setOwnerCredentials(INITIAL_OWNER_CREDENTIALS);
    setPriceRates(DEFAULT_PRICE_RATES);
    setIsOperatorLoggedIn(false);
    setCurrentMode('customer');
    setCustomerView('request');
    localStorage.clear();
    sounds.playPop();
  };

  return (
    <AppContext.Provider
      value={{
        currentMode,
        setCurrentMode,
        customerView,
        setCustomerView,

        isOperatorLoggedIn,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isForgotPasswordModalOpen,
        setIsForgotPasswordModalOpen,
        ownerCredentials,
        updateOwnerCredentials,
        loginOperator,
        logoutOperator,
        openOperatorDesk,

        activeSmsMessage,
        dismissSmsMessage,
        sendPasswordResetSms,
        resetPasswordWithCode,

        soundEnabled,
        toggleSound,

        printJobs,
        submitPrintJob,
        updateJobStatus,
        updateJobPayment,
        deleteJob,

        activeTrackingJob,
        setActiveTrackingJob,
        searchAndTrackJob,

        printers,
        updatePrinterStatus,

        priceRates,
        updatePriceRates,
        calculateJobPrice,

        resetAllDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
