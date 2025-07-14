import React, {useState} from 'react';
import { GuidesWrapper } from '@/styles/help';

interface GuideSectionProps {
  guideData: Array<{
    details: boolean; title: string; description: string; link: string 
}>;
  title: string;
  backgroundImage: string;
}

const GuidesSection: React.FC<GuideSectionProps> = ({ guideData, title, backgroundImage }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex((prevIndex: number | null) => (prevIndex === index ? null : index));
  };

  return (
    <GuidesWrapper className="max-w-7xl mx-auto">
      <h2>{title}</h2>
      <ul>
        {guideData.map((guide, index) => (
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
