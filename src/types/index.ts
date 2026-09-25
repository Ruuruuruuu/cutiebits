export type PrintType =
  | 'document'
  | 'thesis_binding'
  | 'photo_id'
  | 'sticker_sheet'
  | 'poster_tarp'
  | 'brochure';

export type PaperSize =
  | 'short_letter'
  | 'a4'
  | 'long_legal'
  | 'a3'
  | 'photo_4r'
  | 'sticker_a4';

export type ColorMode = 'bw' | 'colored' | 'photo_hd';

export type PaperWeight =
  | 'regular_70gsm'
  | 'bookpaper_80gsm'
  | 'glossy_photo_200gsm'
  | 'matte_sticker'
  | 'vinyl_waterproof'
  | 'cardstock_250gsm';

export type BindingFinishing =
  | 'none'
  | 'staple'
  | 'ring_bind'
  | 'softbound'
  | 'hardbound_gold'
  | 'laminate';

export type PrintJobStatus =
  | 'in_line'
  | 'pre_flight'
  | 'being_printed'
  | 'finishing'
  | 'ready_pickup'
  | 'claimed'
  | 'cancelled';

export type PaymentMethod = 'gcash' | 'cash_counter' | 'maya';
export type PaymentStatus = 'unpaid' | 'paid';

export interface UploadedFile {
  name: string;
  sizeBytes: number;
  fileType: 'pdf' | 'docx' | 'image' | 'presentation' | 'other';
  pageCount: number;
  previewUrl?: string;
}

export interface PrintSpecifications {
  printType: PrintType;
  paperSize: PaperSize;
  colorMode: ColorMode;
  paperWeight: PaperWeight;
  copies: number;
  pageRange: 'all' | 'custom';
  customPageRange?: string;
  bindingFinishing: BindingFinishing;
  orientation: 'portrait' | 'landscape';
  doubleSided: boolean;
  isRushOrder: boolean;
  customerNotes?: string;
}

export interface PricingBreakdown {
  effectivePages: number;
  ratePerPage: number;
  pageTotal: number;
  paperUpcharge: number;
  bindingCost: number;
  rushFee: number;
  subtotal: number;
  discount: number;
  totalAmount: number;
}

export interface OperatorStatusLog {
  timestamp: string;
  status: PrintJobStatus;
  note?: string;
}

export interface PrintJob {
  id: string;
  trackingCode: string; // e.g. "WTP-4829"
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  studentId?: string; // PHINMA AU / Student ID
  file: UploadedFile;
  specifications: PrintSpecifications;
  pricing: PricingBreakdown;
  status: PrintJobStatus;
  assignedPrinterId?: string;
  estimatedReadyTime: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  statusLogs: OperatorStatusLog[];
  smsAlertsSent: Array<{ timestamp: string; message: string; to: string }>;
}

export interface PrinterStation {
  id: string;
  name: string;
  model: string;
  type: 'inkjet' | 'laser' | 'plotter' | 'photo';
  status: 'idle' | 'printing' | 'paper_low' | 'maintenance';
  currentJobCode?: string;
  inkLevels: { c: number; m: number; y: number; k: number };
  paperLoaded: string;
  queueCount: number;
}

export interface OwnerCredentials {
  email: string;
  phone: string;
  passwordHash: string;
  shopName: string;
  campusBranch: string;
  lastCodeSent?: string;
  lastCodeTime?: number;
}

export interface SmsMessage {
  id: string;
  sender: string;
  phone: string;
  code: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export interface PriceRates {
  bwLetter: number;
  bwLegal: number;
  bwA4: number;
  colorLight: number;
  colorFull: number;
  photoHd: number;
  ringBind: number;
  hardboundGold: number;
  softbound: number;
  laminate: number;
  staple: number;
  rushMultiplier: number;
}
