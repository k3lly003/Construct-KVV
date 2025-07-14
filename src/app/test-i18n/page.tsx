'use client';

import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { useEffect, useState } from 'react';

export default function TestI18nPage() {
  const { t, i18n, ready } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fallback text for when translations aren't ready
  const getText = (key: string, fallback: string) => {
    if (isClient && ready) {
      return t(key);
    }
    return fallback;
  };

  if (!isClient || !ready) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Language Test Page
              </h1>
              <LanguageSwitcher />
            </div>
            <div className="text-center py-8">
              <p className="text-gray-600">Loading translations...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {getText('common.language', 'Language')} Test Page
            </h1>
            <LanguageSwitcher />
          </div>

          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-4">Current Language: {i18n.language}</h2>
              <p className="text-gray-600">
                This page demonstrates the multilingual functionality of the application.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Navigation</h3>
                <div className="space-y-2">
                  <p><strong>Home:</strong> {getText('navigation.home', 'Home')}</p>
                  <p><strong>Products:</strong> {getText('navigation.products', 'Products')}</p>
                  <p><strong>Services:</strong> {getText('navigation.services', 'Services')}</p>
                  <p><strong>Deals:</strong> {getText('navigation.deals', 'Deals')}</p>
                  <p><strong>Help:</strong> {getText('navigation.help', 'Help')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Common Actions</h3>
                <div className="space-y-2">
                  <p><strong>Save:</strong> {getText('common.save', 'Save')}</p>
                  <p><strong>Cancel:</strong> {getText('common.cancel', 'Cancel')}</p>
                  <p><strong>Edit:</strong> {getText('common.edit', 'Edit')}</p>
                  <p><strong>Delete:</strong> {getText('common.delete', 'Delete')}</p>
                  <p><strong>Search:</strong> {getText('common.search', 'Search')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Home Page</h3>
                <div className="space-y-2">
                  <p><strong>Hero Title:</strong> {getText('home.hero.title', 'Your One-Stop Solution for Construction Needs')}</p>
                  <p><strong>Hero Subtitle:</strong> {getText('home.hero.subtitle', 'Find the best materials, services, and professionals for your construction projects')}</p>
                  <p><strong>CTA Button:</strong> {getText('home.hero.cta', 'Get Started')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Authentication</h3>
                <div className="space-y-2">
                  <p><strong>Sign In:</strong> {getText('auth.signin.title', 'Sign In')}</p>
                  <p><strong>Email:</strong> {getText('auth.signin.email', 'Email')}</p>
                  <p><strong>Password:</strong> {getText('auth.signin.password', 'Password')}</p>
                  <p><strong>Sign In Button:</strong> {getText('auth.signin.signInButton', 'Sign In')}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Language Information</h3>
              <p><strong>Current Language:</strong> {i18n.language}</p>
              <p><strong>Available Languages:</strong> {i18n.languages.join(', ')}</p>
              <p><strong>Is Initialized:</strong> {i18n.isInitialized ? 'Yes' : 'No'}</p>
              <p><strong>Is Ready:</strong> {ready ? 'Yes' : 'No'}</p>
              <p><strong>Is Client:</strong> {isClient ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 