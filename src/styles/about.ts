import styled from 'styled-components';

export const Section = styled.div`
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: 768px) {
    padding: 60px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
`;

export const StoryContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const StoryImage = styled.img`
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const StoryText = styled.div`
  color: #555;
  line-height: 1.6;
`;

export const VisionMissionContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 50px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const VmBox = styled.div`
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
`;

export const VmTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
`;

export const VmList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const VmItem = styled.li`
  color: #777;
  margin-bottom: 5px;
`;

export const ServicesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, auto));
  gap: 20px;
  margin-top: 50px;
`;

export const ServiceCard = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

export const ServiceImage = styled.img`
  width: 100%;
  display: block;
  height: auto;
`;

export const ServiceOverlay = styled.div`
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

export const TestimonialsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, auto));
  gap: 20px;
  margin-top: 50px;
`;

export const TestimonialCard = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Rating = styled.div`
  color: #ffc107;
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

export const Quote = styled.p`
  color: #555;
  line-height: 1.6;
  margin-bottom: 15px;
`;

export const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
`;

export const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

export const AuthorName = styled.p`
  font-weight: bold;
  color: #333;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export const PaginationDot = styled.button`
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
