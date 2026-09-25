import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Smartphone,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Send,
  ShieldCheck,
  Building
} from 'lucide-react';
import { sounds } from '../../utils/sound';

export const OperatorSettings: React.FC = () => {
  const {
    ownerCredentials,
    updateOwnerCredentials,
    sendPasswordResetSms,
    resetAllDemoData
  } = useApp();

  const [phone, setPhone] = useState(ownerCredentials.phone);
  const [email, setEmail] = useState(ownerCredentials.email);
  const [shopName, setShopName] = useState(ownerCredentials.shopName);
  const [campusBranch, setCampusBranch] = useState(ownerCredentials.campusBranch);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playPop();

    updateOwnerCredentials({
      phone: phone.trim(),
      email: email.trim(),
      shopName: shopName.trim(),
      campusBranch: campusBranch.trim(),
    });

    setFeedback({
      type: 'success',
      message: 'Operator security settings updated successfully!'
    });

    setTimeout(() => setFeedback(null), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playPop();

    if (currentPassword !== ownerCredentials.passwordHash) {
      setFeedback({
        type: 'error',
        message: 'Current password does not match.'
      });
      return;
    }

    if (newPassword.length < 4) {
      setFeedback({
        type: 'error',
        message: 'New password must be at least 4 characters.'
      });
      return;
    }

    updateOwnerCredentials({ passwordHash: newPassword });
    setCurrentPassword('');
    setNewPassword('');

    setFeedback({
      type: 'success',
      message: 'Operator password changed successfully!'
    });

    setTimeout(() => setFeedback(null), 3000);
  };

  const handleTestSms = () => {
    sounds.playPop();
    const res = sendPasswordResetSms(phone);
    setFeedback({
      type: 'success',
      message: `Test security SMS sent to ${res.phone}! Passcode: ${res.code}`
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="pb-2 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 font-display">
          Print Operator Security & SMS Gateway Settings
        </h2>
        <p className="text-xs text-slate-500">
          Manage the owner recovery phone number for SMS resets, login credentials, and print shop campus info.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-2xl text-xs flex items-start gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span className="font-semibold">{feedback.message}</span>
        </div>
      )}

      {/* Owner Phone & SMS Verification */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-slate-900">
              Registered Owner Mobile & SMS Gateway
            </h3>
            <p className="text-[11px] text-slate-500">
              When Forgot Password is clicked, the system texts the generated passcode to this mobile number.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveContact} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Owner Mobile Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-pink-400"
                />
                <button
                  type="button"
                  onClick={handleTestSms}
                  className="px-3 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 font-semibold text-xs transition-colors flex items-center gap-1 shrink-0"
                >
                  <Send className="w-3 h-3" />
                  <span>Test SMS</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Owner Email Identifier
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Shop Name
              </label>
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Campus Branch
              </label>
              <input
                type="text"
                required
                value={campusBranch}
                onChange={(e) => setCampusBranch(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="py-2 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Contact Info</span>
            </button>
          </div>
        </form>
      </div>

      {/* Password Change */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-slate-900">
              Change Operator Password
            </h3>
            <p className="text-[11px] text-slate-500">
              Update the security password used to access the Operator Desk.
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 4 characters"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="py-2 px-5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>

      {/* Reset Demo Data */}
      <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-200/80 flex items-center justify-between gap-4">
        <div>
          <h4 className="font-display font-bold text-xs text-rose-900">
            Reset Demo Prototype Data
          </h4>
          <p className="text-[11px] text-rose-700 mt-0.5">
            Restores initial sample student print jobs (Arcilla, Cambe, Palafox) and default owner password (<code className="font-mono">cutie1234</code>).
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset all Cutie Bits Web to Print demo data?')) {
              resetAllDemoData();
            }
          }}
          className="py-2 px-4 rounded-xl bg-white border border-rose-300 hover:bg-rose-100 text-rose-700 font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo</span>
        </button>
      </div>
    </div>
  );
};
