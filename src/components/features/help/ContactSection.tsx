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

const ContactSection: React.FC = () => {
  return (
    <ContactWrapper>
      <h2>Need Further Assistance?</h2>
      <p>Our dedicated support team is here to help with any questions or issues you may have regarding our construction materials and services.</p>
      <div>
        <FiMail />
        <a href="supportkvvstore@gmail.com">support@kvvstore.com</a>
      </div>
      <div>
        <FiPhone />
        <a href="tel:+1234567890">+250 (888) 888-888</a>
      </div>
      {/* Potentially add a contact form here for more direct inquiries */}
    </ContactWrapper>
  );
};

export default ContactSection;