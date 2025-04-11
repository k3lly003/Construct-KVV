import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  background?: ReactNode;
  flexDirection?: ReactNode;
  isTopSection?: boolean; 
}

const ReusableSection = ({ children, background, flexDirection, isTopSection }: Props) => {
  const sectionStyles = {
    display: 'flex',
    flexDirection: flexDirection ? flexDirection : 'row', // Default to 'row' if not provided
    background: background,
    // Add other styles based on isTopSection or other props
  };

  return (
    <section style={sectionStyles} className={isTopSection ? 'top-section' : ''}>
      {children}
    </section>
  );
};

export default ReusableSection;