import React, {useState} from 'react';
// import Link from 'next/link';
import { HelpData, HelpProps } from '../../utils/fakes/HelpFakes'; // Assuming HelpData is in a file named HelpData.ts or .js
import { GuidesWrapper } from '../../../../public/styled-components/help';

const GuidesSection: React.FC<HelpProps> = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex((prevIndex: number | null) => (prevIndex === index ? null : index));
  };

  return (
    <GuidesWrapper className="max-w-7xl mx-auto">
      <h2>{HelpData.heading}</h2>
      <ul>
        {HelpData.guideData.map((guide, index) => (
          <li key={index} className={expandedIndex === index ? 'expanded' : ''}>
            <h3>{guide.title}</h3>
            <p className={`overflow ${expandedIndex === index ? '' : ''}`}>{guide.description}</p>
            <button onClick={() => toggleExpand(index)}>
              {expandedIndex === index ? 'Show Less' : 'Learn More'}
            </button>
            {expandedIndex === index && guide.details && (
              <div className="details">More details here if needed</div>
            )}
          </li>
        ))}
      </ul>
    </GuidesWrapper>
  );
};

export default GuidesSection;
