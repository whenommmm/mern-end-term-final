// frontend/src/components/SearchBar.jsx
import React from 'react';

function SearchBar({ searchQuery, setSearchQuery, onSearch }) {
  const handleChange = (e) => {
    const value = e.target.value;
    if (typeof setSearchQuery === 'function') setSearchQuery(value);
    if (typeof onSearch === 'function') onSearch(value);
  };

  return (
    <input
      type="text"
      placeholder="Search notes..."
      className="search-bar"
      value={searchQuery || ''}
      onChange={handleChange}
    />
  );
}

export default SearchBar;