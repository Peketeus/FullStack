const api_key = import.meta.env.VITE_SOME_KEY

import { useEffect, useState } from 'react'
import FindForm from './components/FindForm'
import FilteredCountries from './components/FilteredCountries'
import Country from './components/Country'

function App() {
  const [findCountry, setFindCountry] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [error, setError] = useState(null)
  const [country, setCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    fetch('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch countries')
        }

        console.log(response)

        return response.json()
      })
      .then((data) => {
        console.log('Data: ', data)
        setAllCountries(data)
      })
      .catch((error) => {
        setError(error.message)
      })
  }, [])

  const handleCountryFind = (input) => {
    setFindCountry(input)

    if (input.length > 0) {
      const filtered = allCountries.filter((country) =>
        country.name.common.toLowerCase().includes(input))

      if (filtered.length === 1) {
        setCountry(filtered[0])
        setFilteredCountries([])
        apiCall(filtered[0])  // apikutsu säätiedon hakemiseksi
        setError(null)
      }

      if (filtered.length > 10) {
        setError('Too many matches, specify another filter')
        setFilteredCountries([])
      } else if (filtered.length !== 1 && country === null) {
        setError(null)
        setFilteredCountries(filtered)
      }
    } else {
      setFilteredCountries([])
      setCountry(null)
      setError(null)
    }
  }

  const apiCall = async (param) => {
    const endpoint = `https://api.openweathermap.org/data/2.5/forecast?q=${param.capital}&appid=${api_key}&units=metric`

    try {
      const response = await fetch(endpoint)
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }
      const data = await response.json()
      setWeather(data)
      console.log(data)
    } catch (error) {
      console.error("Fetch error", error)
    }
  }

  const handleButtonClick = (countryName) => {
    const name = countryName.toLowerCase()
    setFindCountry(name)
    handleCountryFind(name)
  }

  return (
    <div>
      <FindForm findCountry={findCountry} handleCountryFind={handleCountryFind} />

      {error && <p>{error}</p>}

      {country && <Country country={country} weather={weather} />}

      <FilteredCountries
        filteredCountries={filteredCountries}
        handleButtonClick={handleButtonClick}
      />
    </div>
  )
}

export default App
