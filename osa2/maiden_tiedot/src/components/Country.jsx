import React from 'react';

const Country = ({ country, weather }) => {
  if (!country || !weather) return null;

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area} km²</p>

      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
      />

      <h3>Weather in {country.capital}</h3>
      <p>temperature {weather.list[0].main.temp}°C</p>

      <img
        src={`https://openweathermap.org/img/wn/${weather.list[0].weather[0].icon}@2x.png`}
        alt={`weather in ${country.capital}`}
      />

      <p>wind: {weather.list[0].wind.speed} m/s</p>
    </div>
  );
};

export default Country;