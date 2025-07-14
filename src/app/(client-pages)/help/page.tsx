"use client"

import React from 'react';
import styled from 'styled-components';
import FaqSection from '@/app/(components)/help/FaqSection';
import ContactSection from '@/app/(components)/help/ContactSection';
import GuidesSection from '@/app/(components)/help/GuideSection';
import SearchBar from '@/app/(components)/help/Search';
import { NextPage } from 'next';
import DefaultPageBanner from '@/app/(components)/DefaultPageBanner';
import { useTranslations } from '@/app/hooks/useTranslations';


const HelpPageContainer = styled.div`
  /* Base styles for the entire page */
  padding: 2rem;
  @media (min-width: 768px) {
    padding: 3rem 4rem;
  }
`;

interface HelpCenterMessages {
  pageTitle: string;
  bannerTitle: string;
  bannerBackground: string;
  guidesHeading: string;
  guides: Array<{ title: string; description: string; link: string }>;
  faqHeading: string;
  faq: Array<{ question: string; answer: string }>;
  faqNotFound: string;
  faqContactButton: string;
  contactHeading: string;
  contactDescription: string;
  contactEmail: string;
  contactPhone: string;
  searchPlaceholder: string;
}

const page: NextPage = () => {
  const { t } = useTranslations();
  const helpCenter = t('helpCenter', { returnObjects: true }) as HelpCenterMessages;
  const guidesWithDetails = Array.isArray(helpCenter.guides)
    ? helpCenter.guides.map(g => ({ details: false, ...g }))
    : [];
  return (
    <>
      <DefaultPageBanner title={helpCenter.bannerTitle} backgroundImage={helpCenter.bannerBackground} />
      <HelpPageContainer>
        <SearchBar placeholder={helpCenter.searchPlaceholder} />
        <GuidesSection backgroundImage={helpCenter.bannerBackground} title={helpCenter.guidesHeading} guideData={guidesWithDetails} />
        <FaqSection
          faqHeading={helpCenter.faqHeading}
          faqData={Array.isArray(helpCenter.faq) ? helpCenter.faq : []}
          notFoundText={helpCenter.faqNotFound}
          contactButton={helpCenter.faqContactButton}
        />
        <ContactSection heading={helpCenter.contactHeading} description={helpCenter.contactDescription} email={helpCenter.contactEmail} phone={helpCenter.contactPhone} />
      </HelpPageContainer>
    </>
  );
};

export default page;