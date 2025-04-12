"use client"

import React from 'react';
import styled from 'styled-components';

// Placeholder image URLs - replace with your actual image paths
const pipesImageUrl = 'https://via.placeholder.com/600/cccccc/808080?Text=Pipes';
// const servicesImageUrl = 'https://via.placeholder.com/600/eeeeee/333333?Text=Services';
const buyImageUrl = 'https://via.placeholder.com/300/cceeff/000000?Text=Buy';
const sellImageUrl = 'https://via.placeholder.com/300/ffddaa/000000?Text=Sell';
const employmentImageUrl = 'https://via.placeholder.com/300/ddeeff/000000?Text=Employment';
const connectImageUrl = 'https://via.placeholder.com/300/eeddff/000000?Text=Connect';
const avatarPlaceholder = 'https://via.placeholder.com/50/aaaaaa/ffffff?Text=User';


const Section = styled.div`
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: 768px) {
    padding: 60px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
`;

const StoryContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StoryImage = styled.img`
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StoryText = styled.div`
  color: #555;
  line-height: 1.6;
`;

const VisionMissionContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 50px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const VmBox = styled.div`
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
`;

const VmTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
`;

const VmList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const VmItem = styled.li`
  color: #777;
  margin-bottom: 5px;
`;

const ServicesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, auto));
  gap: 20px;
  margin-top: 50px;
`;

const ServiceCard = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const ServiceImage = styled.img`
  width: 100%;
  display: block;
  height: auto;
`;

const ServiceOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;

  ${ServiceCard}:hover & {
    opacity: 1;
  }
`;

const TestimonialsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, auto));
  gap: 20px;
  margin-top: 50px;
`;

const TestimonialCard = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Rating = styled.div`
  color: #ffc107;
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const Quote = styled.p`
  color: #555;
  line-height: 1.6;
  margin-bottom: 15px;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const AuthorName = styled.p`
  font-weight: bold;
  color: #333;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationDot = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ddd;
  border: none;
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &.active {
    background-color: #333;
  }
`;

interface Testimonial {
  rating: number;
  quote: string;
  picture: string;
  author: string;
}

const App: React.FC = () => {
  const testimonials: Testimonial[] = [
    { rating: 4.0, quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ligula porta felis euismod semper.', picture:'', author: 'Ethan Miller' },
    { rating: 4.5, quote: 'Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.', picture:'', author: 'Olivia White' },
    { rating: 4.2, quote: 'Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo.', picture:'', author: 'Noah Green' },
  ];

  return (
    <>
      <Section>
        <SectionTitle>Our Story</SectionTitle>
        <StoryContainer>
          <StoryImage src={pipesImageUrl} alt="Pipes" />
          <StoryText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Maecenas faucibus mollis interdum. Cras mattis consectetur purus sit amet fermentum.
            <br /><br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere consectetur est at lobortis. Donec id elit non mi porta gravida at eget metus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.
          </StoryText>
        </StoryContainer>
      </Section>

      <Section>
        <VisionMissionContainer>
          <VmBox>
            <VmTitle>Our Vision</VmTitle>
            <VmList>
              <VmItem>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</VmItem>
              <VmItem>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</VmItem>
            </VmList>
          </VmBox>
          <VmBox>
            <VmTitle>Our Mission</VmTitle>
            <VmList>
              <VmItem>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</VmItem>
              <VmItem>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</VmItem>
            </VmList>
          </VmBox>
        </VisionMissionContainer>
      </Section>

      <Section>
        <SectionTitle>Services</SectionTitle>
        <ServicesContainer>
          <ServiceCard>
            <ServiceImage src={buyImageUrl} alt="Buy" />
            <ServiceOverlay>Buy</ServiceOverlay>
          </ServiceCard>
          <ServiceCard>
            <ServiceImage src={sellImageUrl} alt="Sell" />
            <ServiceOverlay>Sell</ServiceOverlay>
          </ServiceCard>
          <ServiceCard>
            <ServiceImage src={employmentImageUrl} alt="Employment" />
            <ServiceOverlay>Employment</ServiceOverlay>
          </ServiceCard>
          <ServiceCard>
            <ServiceImage src={connectImageUrl} alt="Connect" />
            <ServiceOverlay>Connect</ServiceOverlay>
          </ServiceCard>
        </ServicesContainer>
      </Section>

      <Section>
        <SectionTitle>What our customers say !</SectionTitle>
        <TestimonialsContainer>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index}>
              <Rating>{testimonial.rating.toFixed(1)} ⭐</Rating>
              <Quote>{testimonial.quote}</Quote>
              <AuthorInfo>
                <Avatar src={avatarPlaceholder} alt={testimonial.author} />
                <AuthorName>{testimonial.author}</AuthorName>
              </AuthorInfo>
            </TestimonialCard>
          ))}
        </TestimonialsContainer>
        <Pagination>
          <PaginationDot className="active" />
          <PaginationDot />
          <PaginationDot />
        </Pagination>
      </Section>
    </>
  );
};

export default App;