import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const GuidesWrapper = styled.div`

  margin-bottom: 3rem;

  h2 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 1.5rem;
  }

  ul {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  li {
    background-color: white;
    border: 1px solid #eee;
    border-radius: 6px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  h3 {
    font-size: 1.2rem;
    color: #333;
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  a {
    color: #007bff;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

interface GuideItem {
  title: string;
  description: string;
  link: string;
}

const guideData: GuideItem[] = [
  {
    title: 'Placing Your Order',
    description: 'Learn how to easily browse our catalog and complete your construction material order.',
    link: '/help/ordering',
  },
  {
    title: 'Delivery & Shipping',
    description: 'Find information about our delivery options, shipping costs, and estimated timelines for construction sites.',
    link: '/help/delivery',
  },
  {
    title: 'Payment Options',
    description: 'Explore the various secure payment methods we accept for your construction supply purchases.',
    link: '/help/payment',
  },
  {
    title: 'Returns & Exchanges',
    description: 'Understand our policy on returns and exchanges for construction materials that don\'t meet your needs.',
    link: '/help/returns',
  },
  {
    title: 'Account Management',
    description: 'Manage your profile, track your orders, and update your information on our platform.',
    link: '/help/account',
  },
  {
    title: 'Product Information',
    description: 'Get detailed specifications and usage guides for our range of construction products.',
    link: '/help/products',
  },
];

const GuidesSection: React.FC = () => {
  return (
    <GuidesWrapper className='max-w-7xl mx-auto'>
      <h2>Helpful Guides & Resources</h2>
      <ul>
        {guideData.map((guide, index) => (
          <li key={index}>
            <h3>{guide.title}</h3>
            <p>{guide.description}</p>
            <Link href={guide.link}>Learn More</Link>
          </li>
        ))}
      </ul>
    </GuidesWrapper>
  );
};

export default GuidesSection;