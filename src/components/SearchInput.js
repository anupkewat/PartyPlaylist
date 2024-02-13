import React from 'react';

const SearchInput = ({ placeholder, value, onChange }) => {
  return (
    <input
      type="text"
      className="input centered"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchInput;
