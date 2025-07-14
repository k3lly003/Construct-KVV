import React from 'react';
import styled from 'styled-components';
import { FiMail, FiPhone } from 'react-icons/fi';

const ContactWrapper = styled.div`
  background-color: #e9ecef;
  padding: 3rem 2rem;
  border-radius: 8px;
  text-align: center;

  h2 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 1.5rem;
  }

  p {
    color: #666;
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1rem;

    svg {
      font-size: 1.5rem;
      color: #007bff;
      margin-bottom: 0.5rem;
    }

    a {
      color: #007bff;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

interface ContactSectionProps {
  heading: string;
  description: string;
  email: string;
  phone: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({ heading, description, email, phone }) => {
  return (
    <ContactWrapper>
      <h2>{heading}</h2>
      <p>{description}</p>
      <div>
        <FiMail />
        <a href={`mailto:${email}`}>{email}</a>
      </div>
      <div>
        <FiPhone />
        <a href={`tel:${phone}`}>{phone}</a>
      </div>
    </ContactWrapper>
  );
};

export default ContactSection;