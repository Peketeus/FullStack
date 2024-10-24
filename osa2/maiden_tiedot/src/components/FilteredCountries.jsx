import React from 'react';

const FilteredCountries = ({ filteredCountries, handleButtonClick }) => {
  return (
    <ul>
      {filteredCountries.map((country) => (
        <li key={country.name.common}>
          {country.name.common}{' '}
          <button onClick={() => handleButtonClick(country.name.common)}>
            show
          </button>
        </li>
      ))}
    </ul>
  );
};

export default FilteredCountries;