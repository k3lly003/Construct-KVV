import styled from 'styled-components';

export const GuidesWrapper = styled.div`
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
    color: #667;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  a {
    color: #32CD32;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;