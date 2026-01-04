import React from 'react';
import { CheckCircle, Mail, Calendar } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  technicianName: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  technicianName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full transform animate-in slide-in-from-bottom duration-500">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center animate-in zoom-in duration-700 delay-200">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          
          <div>
            <h2 className="text-mid font-bold text-slate-800 mb-2">
              Welcome aboard, {technicianName}! 🎉
            </h2>
            <p className="text-slate-600">
              Your technician registration has been submitted successfully.
            </p>
          </div>

          <div className="space-y-4 text-left">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800">Check your email</h4>
                <p className="text-small text-blue-700">We've sent a confirmation link to verify your account.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-amber-50 rounded-xl">
              <Calendar className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800">Review in progress</h4>
                <p className="text-small text-amber-700">Our team will review your application within 24-48 hours.</p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};