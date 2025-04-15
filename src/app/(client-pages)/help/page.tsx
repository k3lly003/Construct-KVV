"use client"

import React from 'react';
import styled from 'styled-components';
import FaqSection from '../../(components)/help/FaqSection';
import ContactSection from '../../(components)/help/ContactSection';
import GuidesSection from '../../(components)/help/GuideSection';
import SearchBar from '../../(components)/help/Search';
import { NextPage } from 'next';
import DefaultPageBanner from '../../(components)/DefaultPageBanner';

const HelpPageContainer = styled.div`
  /* Base styles for the entire page */
  padding: 2rem;
  @media (min-width: 768px) {
    padding: 3rem 4rem;
  }
`;

const page: NextPage = () => {
  return (
    <>
      <DefaultPageBanner title="Help Center" backgroundImage={''} />
      <HelpPageContainer>
        <SearchBar />
        <GuidesSection />
        <FaqSection />
        <ContactSection />
        {/* POTTENTIALLY ADD A "A QUICK LINK TO VISUAL GUIDE" */}
      </HelpPageContainer>
    </>
  );
};

export default page;