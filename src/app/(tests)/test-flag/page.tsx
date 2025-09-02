'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import FlagToggle from '@/app/(components)/Navbar/ToggleFlag';

export default function TestFlagPage() {
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Flag Toggle Language Test
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Current Language:</span>
              <FlagToggle />
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-4">
                Language: {i18n.language} | Ready: {ready ? 'Yes' : 'No'} | Client: {isClient ? 'Yes' : 'No'}
              </h2>
              <p className="text-gray-600">
                Click the flag toggle above to switch between English, French, and Kinyarwanda. 
                The content below should update immediately.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Navigation Test</h3>
                <div className="space-y-2">
                  <p><strong>Home:</strong> {getText('navigation.home', 'Home')}</p>
                  <p><strong>Products:</strong> {getText('navigation.products', 'Products')}</p>
                  <p><strong>Services:</strong> {getText('navigation.services', 'Services')}</p>
                  <p><strong>Help:</strong> {getText('navigation.help', 'Help')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Common Actions Test</h3>
                <div className="space-y-2">
                  <p><strong>Save:</strong> {getText('common.save', 'Save')}</p>
                  <p><strong>Cancel:</strong> {getText('common.cancel', 'Cancel')}</p>
                  <p><strong>Edit:</strong> {getText('common.edit', 'Edit')}</p>
                  <p><strong>Delete:</strong> {getText('common.delete', 'Delete')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Home Page Test</h3>
                <div className="space-y-2">
                  <p><strong>Hero Title:</strong> {getText('home.hero.title', 'Your One-Stop Solution for Construction Needs')}</p>
                  <p><strong>CTA Button:</strong> {getText('home.hero.cta', 'Get Started')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Authentication Test</h3>
                <div className="space-y-2">
                  <p><strong>Sign In:</strong> {getText('auth.signin.title', 'Sign In')}</p>
                  <p><strong>Email:</strong> {getText('auth.signin.email', 'Email')}</p>
                  <p><strong>Password:</strong> {getText('auth.signin.password', 'Password')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Kinyarwanda Test</h3>
                <div className="space-y-2">
                  <p><strong>Language:</strong> {getText('common.language', 'Language')}</p>
                  <p><strong>Kinyarwanda:</strong> {getText('common.kinyarwanda', 'Kinyarwanda')}</p>
                  <p><strong>Welcome:</strong> {getText('defaultBanner.defaultTitle', 'Welcome')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 