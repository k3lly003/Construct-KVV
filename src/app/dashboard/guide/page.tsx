import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Upload, User, Package, Settings, BarChart } from 'lucide-react'; // Example icons
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from 'next/image';
import { useTranslations } from '@/app/hooks/useTranslations';

const Page = () => {
  const { t } = useTranslations();
  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-left mb-10">
          <h1 className="text-3xl font-semibold ">
            {t('dashboard.guide.welcome')}
          </h1>
          <p className="mt-2 text-gray-600">
            {t('dashboard.guide.description')}
          </p>
        </header>
        <hr className='border-1'/>
        <section className="my-8">
          <h2 className="text-xl font-semibold text-amber-500 mb-4">
            {t('dashboard.guide.gettingStarted.title')}
          </h2>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-green-500 mb-2">
              {t('dashboard.guide.gettingStarted.understandingLayout.title')}
            </h3>
            <div className="rounded-md  overflow-hidden">
              {/* Replace with an actual screenshot of your dashboard layout */}
              <div className="relative aspect-w-16 aspect-h-9">
                {/* You'd replace this with an <Image> component */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 italic">
                  {t('dashboard.guide.gettingStarted.understandingLayout.screenshot')}
                </div>
              </div>
              <div className="p-4">
                <ul className="list-disc pl-5 text-gray-600">
                  <li>
                    <span className="font-semibold">{t('dashboard.guide.gettingStarted.understandingLayout.navigationSidebar')}</span> {t('dashboard.guide.gettingStarted.understandingLayout.navigationSidebarDesc')}
                  </li>
                  <li>
                    <span className="font-semibold">{t('dashboard.guide.gettingStarted.understandingLayout.mainContentArea')}</span> {t('dashboard.guide.gettingStarted.understandingLayout.mainContentAreaDesc')}
                  </li>
                  <li>
                    <span className="font-semibold">{t('dashboard.guide.gettingStarted.understandingLayout.topBar')}</span> {t('dashboard.guide.gettingStarted.understandingLayout.topBarDesc')}
                  </li>
                </ul>
                <p className="mt-2 text-sm text-gray-500">
                  {t('dashboard.guide.gettingStarted.understandingLayout.exploreLayout')}
                </p>
              </div>
            </div>
          </div>

          <div className="my-6">
            <h3 className="text-lg font-medium text-green-500 mb-2">{t('dashboard.guide.gettingStarted.userProfile.title')}</h3>
            <div className="rounded-md  overflow-hidden">
              {/* Replace with a close-up of the user profile section */}
              <div className="relative aspect-w-16 aspect-h-9 ">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 italic">
                  {t('dashboard.guide.gettingStarted.userProfile.screenshot')}
                </div>
              </div>
              <div className="p-4 text-gray-600">
                <ul className="list-disc pl-5">
                  <li>
                    <span className="font-semibold">{t('dashboard.guide.gettingStarted.userProfile.editProfile')}:</span> {t('dashboard.guide.gettingStarted.userProfile.editProfileDesc')}
                  </li>
                  <li>
                    <span className="font-semibold">{t('dashboard.guide.gettingStarted.userProfile.changePassword')}:</span> {t('dashboard.guide.gettingStarted.userProfile.changePasswordDesc')}
                  </li>
                  <li>
                    <span className="font-semibold">{t('dashboard.guide.gettingStarted.userProfile.notifications')}:</span> {t('dashboard.guide.gettingStarted.userProfile.notificationsDesc')}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <hr className='border-1'/>
        <section className="my-10">
          <h2 className="text-xl font-semibold text-amber-500 mb-4">
            {t('dashboard.guide.coreFeatures.title')}
          </h2>

          <div className="my-6">
            <h3 className="text-lg font-medium text-green-500 mb-2">{t('dashboard.guide.coreFeatures.overview.title')}</h3>
            <div className="rounded-md  p-4 text-gray-600">
              <div className="relative aspect-w-16 aspect-h-9  mb-4 rounded-md overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 italic">
                  {t('dashboard.guide.coreFeatures.overview.screenshot')}
                </div>
              </div>
              <p>{t('dashboard.guide.coreFeatures.overview.description')}</p>
              <ul className="list-disc pl-5 mt-2">
                <li>{t('dashboard.guide.coreFeatures.overview.performanceCharts')}</li>
                <li>{t('dashboard.guide.coreFeatures.overview.keyIndicators')}</li>
                <li>{t('dashboard.guide.coreFeatures.overview.quickActions')}</li>
              </ul>
            </div>
          </div>
         
          <div className="my-6">
            <h3 className="text-lg font-medium text-green-500 mb-2">{t('dashboard.guide.coreFeatures.managingUsers.title')}</h3>
            <div className="rounded-md  p-4 text-gray-600">
              <div className="relative aspect-w-16 aspect-h-9  mb-4 rounded-md overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 italic">
                  {t('dashboard.guide.coreFeatures.managingUsers.screenshot')}
                </div>
              </div>
              <p>{t('dashboard.guide.coreFeatures.managingUsers.description')}</p>
              <ul className="list-disc pl-5 mt-2">
                <li>{t('dashboard.guide.coreFeatures.managingUsers.viewUsers')}</li>
                <li>{t('dashboard.guide.coreFeatures.managingUsers.addNewUsers')}</li>
                <li>{t('dashboard.guide.coreFeatures.managingUsers.editUsers')}</li>
                <li>{t('dashboard.guide.coreFeatures.managingUsers.deactivateActivateUsers')}</li>
              </ul>
              <h4 className="text-md font-semibold mt-4">{t('dashboard.guide.coreFeatures.managingUsers.howToEdit.title')}</h4>
              <ol className="list-decimal pl-5 mt-2">
                <li>{t('dashboard.guide.coreFeatures.managingUsers.howToEdit.step1')}</li>
                <li>{t('dashboard.guide.coreFeatures.managingUsers.howToEdit.step2')}</li>
                <li>{t('dashboard.guide.coreFeatures.managingUsers.howToEdit.step3')}</li>
                <li>{t('dashboard.guide.coreFeatures.managingUsers.howToEdit.step4')}</li>
                <li>{t('dashboard.guide.coreFeatures.managingUsers.howToEdit.step5')}</li>
              </ol>
            </div>
          </div>

          {/* Add more sections for other core features like Products, Orders, etc. */}
        </section>
        <hr className='border-1'/>

        <section className="my-10">
          <h2 className="text-xl font-semibold text-amber-500 mb-4">{t('dashboard.guide.settings.title')}</h2>
          <div className="rounded-md  p-4 text-gray-600">
            <div className="relative aspect-w-16 aspect-h-9  mb-4 rounded-md overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 italic">
                {t('dashboard.guide.settings.screenshot')}
              </div>
            </div>
            <p>{t('dashboard.guide.settings.description')}</p>
            <ul className="list-disc pl-5 mt-2">
              <li>{t('dashboard.guide.settings.generalSettings')}</li>
              <li>{t('dashboard.guide.settings.notificationSettings')}</li>
              <li>{t('dashboard.guide.settings.userManagementSettings')}</li>
            </ul>
            <h4 className="text-md font-semibold mt-4">{t('dashboard.guide.settings.changingNotificationPreferences.title')}</h4>
            <ol className="list-decimal pl-5 mt-2">
              <li>{t('dashboard.guide.settings.changingNotificationPreferences.step1')}</li>
              <li>{t('dashboard.guide.settings.changingNotificationPreferences.step2')}</li>
              <li>{t('dashboard.guide.settings.changingNotificationPreferences.step3')}</li>
              <li>{t('dashboard.guide.settings.changingNotificationPreferences.step4')}</li>
            </ol>
          </div>
        </section>
        <hr className='border-1'/>

        <section className="my-10">
          <h2 className="text-xl font-semibold text-amber-500 mb-4">
            {t('dashboard.guide.troubleshooting.title')}
          </h2>
          <div className="rounded-md  p-4 text-gray-600">
            <h3 className="text-lg font-medium text-green-500 mb-2">{t('dashboard.guide.troubleshooting.commonIssues.title')}</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>
                <span className="font-semibold">{t('dashboard.guide.troubleshooting.commonIssues.cantFindUser.title')}:</span> {t('dashboard.guide.troubleshooting.commonIssues.cantFindUser.solution')}
              </li>
              <li>
                <span className="font-semibold">{t('dashboard.guide.troubleshooting.commonIssues.changesNotSaving.title')}:</span> {t('dashboard.guide.troubleshooting.commonIssues.changesNotSaving.solution')}
              </li>
            </ul>

            <h3 className="text-lg font-medium text-green-500 mb-2">{t('dashboard.guide.troubleshooting.faq.title')}</h3>
            <ul className="list-disc pl-5">
              <li>
                <span className="font-semibold">{t('dashboard.guide.troubleshooting.faq.addNewAdminUser.question')}</span> {t('dashboard.guide.troubleshooting.faq.addNewAdminUser.answer')}
              </li>
              <li>
                <span className="font-semibold">{t('dashboard.guide.troubleshooting.faq.exportData.question')}</span> {t('dashboard.guide.troubleshooting.faq.exportData.answer')}
              </li>
              <li>
                <span className="font-semibold">{t('dashboard.guide.troubleshooting.faq.userRoles.question')}</span> {t('dashboard.guide.troubleshooting.faq.userRoles.answer')}
              </li>
            </ul>
          </div>
        </section>
        <hr className='border-1'/>
        <section className="text-center text-gray-600 my-6">
          <h2 className="text-xl font-semibold text-amber-500 mb-4">{t('dashboard.guide.needMoreHelp.title')}</h2>
          <p className="mb-2">
            {t('dashboard.guide.needMoreHelp.description')}{' '}
            <a href="mailto:ntirukelly@gmail.com" className="text-green-500 hover:underline">
              ntirukelly@gmail.com
            </a>{' '}
            {t('dashboard.guide.needMoreHelp.orVisit')}{' '}
            <a href="/support" className="text-green-500 hover:underline">
              {t('dashboard.guide.needMoreHelp.supportPortal')}
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Page;