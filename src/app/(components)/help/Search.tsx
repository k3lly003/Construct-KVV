import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSearch } from 'react-icons/fi';

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  margin-bottom: 2rem;

  input {
    flex-grow: 1;
    border: none;
    padding: 0.5rem;
    font-size: 1rem;
    outline: none;
  }

  svg {
    color: #999;
    margin-right: 0.5rem;
  }
`;

interface SearchBarProps {
  placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // In a real application, you would trigger a search here
    console.log('Search term:', event.target.value);
  };

  return (
    <SearchContainer className='max-w-7xl mx-auto'>
      <FiSearch />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </SearchContainer>
  );
};

export default SearchBar;