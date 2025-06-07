"use client"

import React from 'react';
import styled from 'styled-components';
import FaqSection from '@/app/(components)/help/FaqSection';
import ContactSection from '@/app/(components)/help/ContactSection';
import GuidesSection from '@/app/(components)/help/GuideSection';
import SearchBar from '@/app/(components)/help/Search';
import { NextPage } from 'next';
import DefaultPageBanner from '@/app/(components)/DefaultPageBanner';
import { HelpData } from '@/app/utils/fakes/HelpFakes';


const HelpPageContainer = styled.div`
  /* Base styles for the entire page */
  padding: 2rem;
  @media (min-width: 768px) {
    padding: 3rem 4rem;
  }
`;

const page: NextPage = () => {
  const {title, backgroundImage} = HelpData;
  return (
    <>
      <DefaultPageBanner title={title} backgroundImage={backgroundImage} />
      <HelpPageContainer>
        <SearchBar />
        <GuidesSection backgroundImage={HelpData.backgroundImage} title={HelpData.title} guideData={[]} />
        <FaqSection />
        <ContactSection />
        {/* POTTENTIALLY ADD A "A QUICK LINK TO VISUAL GUIDE" */}
      </HelpPageContainer>
    </>
  );
};

export default page;