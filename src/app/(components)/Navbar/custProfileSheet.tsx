'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Mail,
  Phone,
  Edit3,
  Store,
  ArrowRight,
  LogOut
} from 'lucide-react';
import EditProfileDialog from "./EditProfileDialog";
import Image from 'next/image';
import Link from 'next/link';
// import { useCustomerRequest } from '@/app/hooks/useCustomerRequest';

interface CustomerProfileSheetProps {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profilePic?: string;
  initials: string;
}

export function CustomerProfileSheet({ firstName, lastName, email, phone, profilePic, initials }: CustomerProfileSheetProps) {

  const [openEdit, setOpenEdit] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    email: email || "",
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    taxId: '',
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setForm((prev) => ({ ...prev, email: email || "" }));
  }, [email]);

  // Handler to open file dialog
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const fullName = `${firstName} ${lastName}`.trim();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  return (
    <>
      {/* Edit Profile Dialog */}
      <EditProfileDialog
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        userData={{
          firstName,
          lastName,
          email,
          phone,
          profilePic
        }}
      />
      {/* Change Password Dialog (skeleton) */}
      {openChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 min-w-[320px]">
            <h2 className="text-lg font-bold mb-4">Change Password</h2>
            {/* TODO: Implement change password form using customerProfileService */}
            <p>Change password form goes here.</p>
            <button className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded" onClick={() => setOpenChangePassword(false)}>Close</button>
          </div>
        </div>
      )}
      <div className="lg:col-span-1">
        <div className="bg-white backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8 mb-6">
          <div className="text-center">
            <div className="relative inline-block mb-6">
              {profilePic ? (
                <Image
                  src={profilePic}
                  alt={fullName}
                  width={34}
                  height={34}
                  className="w-24 h-24 rounded-full object-cover shadow-lg cursor-pointer"
                  onClick={handleAvatarClick}
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg cursor-pointer" onClick={handleAvatarClick}>
                  {initials}
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={() => setOpenEdit(true)}
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{fullName}</h2>
            <p className="text-gray-600 mb-4">{email}</p>
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-400">{phone || 'Not set'}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="flex justify-center items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2.5 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg" onClick={() => setOpenEdit(true)}>
                <Edit3 className="w-3 h-3 inline mr-2" />
                <p className="text-sm">Edit Profile</p>
              </button>
              <button className="px-4 py-2.5 border border-amber-200 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setOpenChangePassword(true)}>
                <p className="text-sm text-amber-500">Change Password</p>
              </button>
            </div>
          </div>
        </div>

        {/* Become a Pro Card */}
        <div className="bg-gradient-to-r from-amber-700 to-amber-200 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Become a Proffessional</h3>
              <p className="text-white/80 text-sm">Start your business journey</p>
            </div>
          </div>
          <p className="text-white/90 text-sm mb-4">
            Join thousands of successful Proffessional and start earning by selling your products and services on our platform.
          </p>
          <Link
            className="w-full bg-white text-orange-600 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            href="/join-as-pro"
          >
            become a Proffessional
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="p-6 flex justify-center items-center">
          <button className="w-[50%] bg-white text-orange-600 py-3 px-4 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer" onClick={() => {
            localStorage.clear();
            window.location.href = '/signin';
          }}>
            Logout
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}