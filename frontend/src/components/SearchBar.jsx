// frontend/src/components/SearchBar.jsx
import React from 'react';

function SearchBar({ onSearch }) {
  return (
    <input
      type="text"
      placeholder="Search notes..."
      className="search-bar"
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}

export default SearchBar;