import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Upload, User, Package, Settings, BarChart } from 'lucide-react'; // Example icons
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from 'next/image';

const Page = () => {
  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-left mb-10">
          <h1 className="text-3xl font-semibold ">
            Hey 👋, Special welcome to the Help Center!
          </h1>
          <p className="mt-2 text-gray-600">
            This guide will help you navigate and use all the features effectively.
          </p>
        </header>
        <hr className='border-1'/>
        <section className="my-8">
          <h2 className="text-xl font-semibold text-amber-500 mb-4">
            1. Getting Started: Your First Steps
          </h2>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-green-500 mb-2">
              1.1 Understanding the Layout
            </h3>
            <div className="rounded-md  overflow-hidden">
              {/* Replace with an actual screenshot of your dashboard layout */}
              <div className="relative aspect-w-16 aspect-h-9">
                {/* You'd replace this with an <Image> component */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 italic">
                  [Dashboard Layout Screenshot Here]
                </div>
              </div>
              <div className="p-4">
                <ul className="list-disc pl-5 text-gray-600">
                  <li>
                    <span className="font-semibold">Navigation Sidebar (Left):</span> Access different
                    sections.
                  </li>
                  <li>
                    <span className="font-semibold">Main Content Area:</span> Displays information for
                    the selected section.
                  </li>
                  <li>
                    <span className="font-semibold">Top Bar:</span> Quick actions, user profile,
                    notifications.
                  </li>
                </ul>
                <p className="mt-2 text-sm text-gray-500">
                  Take a moment to explore the layout.
                </p>
              </div>
            </div>
          </div>

          <div className="my-6">
            <h3 className="text-lg font-medium text-green-500 mb-2">1.2 Your User Profile</h3>
            <div className="rounded-md  overflow-hidden">
              {/* Replace with a close-up of the user profile section */}
              <div className="relative aspect-w-16 aspect-h-9 ">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 italic">
                  [User Profile Section Screenshot Here]
                </div>
              </div>
              <div className="p-4 text-gray-600">
                <ul className="list-disc pl-5">
                  <li>
                    <span className="font-semibold">Edit Profile:</span> Update your details.
                  </li>
                  <li>
                    <span className="font-semibold">Change Password:</span> Secure your account.
                  </li>
                  <li>
                    <span className="font-semibold">Notifications:</span> View important updates.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <hr className='border-1'/>
        <section className="my-10">
          <h2 className="text-xl font-semibold text-amber-500 mb-4">
            2. Core Features: Managing Your Data
          </h2>

          <div className="my-6">
            <h3 className="text-lg font-medium text-green-500 mb-2">2.1 Overview</h3>
            <div className="rounded-md  p-4 text-gray-600">
              <div className="relative aspect-w-16 aspect-h-9  mb-4 rounded-md overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 italic">
                  [Overview Widgets/Charts Screenshot Here]
                </div>
              </div>
              <p>The Overview page provides a summary of key metrics:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Performance Charts</li>
                <li>Key Indicators</li>
                <li>Quick Actions</li>
              </ul>
            </div>
          </div>
         
          <div className="my-6">
            <h3 className="text-lg font-medium text-green-500 mb-2">2.2 Managing Users</h3>
            <div className="rounded-md  p-4 text-gray-600">
              <div className="relative aspect-w-16 aspect-h-9  mb-4 rounded-md overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 italic">
                  [Users Table/List Screenshot Here]
                </div>
              </div>
              <p>The Users section allows you to manage user accounts:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>View Users</li>
                <li>Add New Users (if applicable)</li>
                <li>Edit Users</li>
                <li>Deactivate/Activate Users</li>
              </ul>
              <h4 className="text-md font-semibold mt-4">How to Edit a User:</h4>
              <ol className="list-decimal pl-5 mt-2">
                <li>Go to the &apos;Users&apos; section in the sidebar.</li>
                <li>Find the user you want to edit.</li>
                <li>Click the &apos;Edit&apos; button.</li>
                <li>Make changes in the form.</li>
                <li>Click &apos;Save.&apos;</li>
              </ol>
            </div>
          </div>

          {/* Add more sections for other core features like Products, Orders, etc. */}
        </section>
        <hr className='border-1'/>

        <section className="my-10">
          <h2 className="text-xl font-semibold text-amber-500 mb-4">3. Settings</h2>
          <div className="rounded-md  p-4 text-gray-600">
            <div className="relative aspect-w-16 aspect-h-9  mb-4 rounded-md overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 italic">
                [Settings Page Screenshot Here]
              </div>
            </div>
            <p>The Settings section allows you to configure various aspects:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>General Settings</li>
              <li>Notification Settings</li>
              <li>User Management Settings</li>
            </ul>
            <h4 className="text-md font-semibold mt-4">Changing Notification Preferences:</h4>
            <ol className="list-decimal pl-5 mt-2">
              <li>Go to the &apos;Settings&apos; section.</li>
              <li>Click on &apos;Notification Settings.&apos;</li>
              <li>Adjust your preferences.</li>
              <li>Click &quot;Save Changes.&quot;</li>
            </ol>
          </div>
        </section>
        <hr className='border-1'/>

        <section className="my-10">
          <h2 className="text-xl font-semibold text-amber-500 mb-4">
            4. Troubleshooting & FAQs
          </h2>
          <div className="rounded-md  p-4 text-gray-600">
            <h3 className="text-lg font-medium text-green-500 mb-2">4.1 Common Issues</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>
                <span className="font-semibold">&apos;I can&apos;t find a specific user&apos;:</span> Use the search
                bar in the &apos;Users&apos; section.
              </li>
              <li>
                <span className="font-semibold">&quot;My changes aren&apos;t saving&apos;:</span> Ensure you click
                &quot;Save&quot; and check your internet connection.
              </li>
            </ul>

            <h3 className="text-lg font-medium text-green-500 mb-2">4.2 Frequently Asked Questions</h3>
            <ul className="list-disc pl-5">
              <li>
                <span className="font-semibold">How do I add a new admin user?</span> (Provide steps
                here)
              </li>
              <li>
                <span className="font-semibold">Can I export data?</span> (Explain which sections)
              </li>
              <li>
                <span className="font-semibold">What are the user roles?</span> (Brief explanation)
              </li>
            </ul>
          </div>
        </section>
        <hr className='border-1'/>
        <section className="text-center text-gray-600 my-6">
          <h2 className="text-xl font-semibold text-amber-500 mb-4">Need More Help?</h2>
          <p className="mb-2">
            If you can&apos;t find what you&apos;re looking for, please contact your support team at{' '}
            <a href="mailto:ntirukelly@gmail.com" className="text-green-500 hover:underline">
              ntirukelly@gmail.com
            </a>{' '}
            or visit our{' '}
            <a href="/support" className="text-green-500 hover:underline">
              support portal
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Page;