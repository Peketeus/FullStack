import React from 'react';

const FindForm = ({ findCountry, handleCountryFind }) => {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div>
        find countries{' '}
        <input
          value={findCountry}
          onChange={(e) => handleCountryFind(e.target.value)}
        />
      </div>
    </form>
  );
};

export default FindForm;