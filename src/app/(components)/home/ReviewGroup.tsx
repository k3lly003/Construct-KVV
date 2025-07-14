"use client"

import React from 'react';
import styled from 'styled-components';
import { FaStar } from 'react-icons/fa';

const ReviewsSection = styled.div`
  background-color: #fff;
  padding: 40px 20px;
  text-align: center;

  @media (min-width: 768px) {
    padding: 60px;
  }
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 30px;
  font-size: 1.8rem;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ReviewsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ReviewCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: left;
  border-top: 4px solid #FFC107; /* Example accent color */
`;

const Rating = styled.div`
  color: #FFC107;
  font-size: 1.2rem;
  margin-bottom: 10px;
  display: flex;
  align-items: center;

  svg {
    margin-right: 5px;
  }
`;

const ReviewTitle = styled.h3`
  font-size: 1rem;
  color: #333;
  margin-bottom: 8px;
`;

const ReviewText = styled.p`
  color: #555;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 12px;
`;

const ReviewerInfo = styled.p`
  color: #777;
  font-size: 0.8rem;
`;

interface Review {
  rating: number;
  title: string;
  text: string;
  author: string;
  date: string;
  id?: string; // Added id to the interface
}

const TrustpilotSection: React.FC = () => {
  const reviewsData: Review[] = [
    {
      rating: 5,
      title: 'Start to finish amazing',
      text: 'Start to finish amazing! Truly free samples and good sized? The "fee in room"...',
      author: 'Suzi Stepanovich',
      date: 'April 5',
      id: 'review1', // Added id for the first review
    },
    {
      rating: 5,
      title: 'Quick resolution to my issue!',
      text: 'Had an issue with my flooring being damaged and BuildDirect and Mark in the Cust...',
      author: 'David S.',
      date: 'October 15',
      id: 'review2', // Added id for the second review
    },
    {
      rating: 5,
      title: 'Great customer service',
      text: 'I received a shipment of flooring today from BuildDirect. When it arrived there...',
      author: 'Mike G.',
      date: 'March 8',
      id: 'review3', // Added id for the third review
    },
    {
      rating: 5,
      title: 'Mark Stansfield is terrific',
      text: 'Mark Stansfield was unbelievably helpful. He went over and above and beyond to s...',
      author: 'J. Jang',
      date: 'February 16',
      id: 'review4', // Added id for the fourth review
    },
  ];

  return (
    <ReviewsSection>
      <Title>Why Buy From Kvv Ltd</Title>
      <ReviewsContainer>
        <div>
            <h1>Great</h1>
            <span>⭐⭐⭐⭐⭐</span>
            <p>Based on 500 reviews</p>
        </div>
        {reviewsData.map((review) => (
          <ReviewCard key={review.id || (review.author + review.date)}>
            <Rating>
              {Array.from({ length: review.rating }).map((_, i) => (
                <FaStar key={i} />
              ))}
            </Rating>
            <ReviewTitle>{review.title}</ReviewTitle>
            <ReviewText>{review.text}</ReviewText>
            <ReviewerInfo>{review.author}, {review.date}</ReviewerInfo>
          </ReviewCard>
        ))}
      </ReviewsContainer>
    </ReviewsSection>
  );
};

export default TrustpilotSection;