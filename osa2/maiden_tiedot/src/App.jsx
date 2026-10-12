import weatherModule from './weatherModule'

import { useEffect, useState } from 'react'
import maaModule from './maaModule'

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const [weatherError, setWeatherError] = useState('')

  const capital = country.capital?.[0]

  useEffect(() => {
    if (!capital) {
      return
    }

    let cancelled = false

    weatherModule
      .getWeather(capital)
      .then(data => {
        if (!cancelled) {
          setWeather(data)
          setWeatherError('')
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('Weather API error:', error)
          console.error('Response data:', error.response?.data)
          setWeatherError('Weather information unavailable')
        }
      })

    return () => {
      cancelled = true
    }
  }, [capital])

  const languages = Object.values(country.languages || {})

  return (
    <div>
      <h2>{country.name.common}</h2>

      <p>Capital {country.capital?.join(', ')}</p>
      <p>Area {country.area}</p>

      <h3>Languages:</h3>
      <ul>
        {languages.map(language =>
          <li key={language}>{language}</li>
        )}
      </ul>

      <img
        src={country.flags.png}
        alt={country.flags.alt || `Flag of ${country.name.common}`}
        width="200"
      />

      <h3>Weather in {capital}</h3>

      {weatherError && <p>{weatherError}</p>}

      {!weather && !weatherError && <p>Loading weather...</p>}

      {weather && (
        <div>
          <p>Temperature {weather.main.temp} Celsius</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>Wind {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>

  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    maaModule
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
      .catch(() => {
        setError('Maiden tietojen hakeminen epäonnistui')
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const matchingCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  const showCountry = (country) => {
    setSearch(country.name.common)
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div>
      <h2>Find countries</h2>

      <div>
        find countries:
        <input value={search} onChange={handleSearchChange} />
      </div>

      {search !== '' && matchingCountries.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}

      {matchingCountries.length > 1 &&
        matchingCountries.length <= 10 && (
          <div>
            {matchingCountries.map(country =>
              <div key={country.cca3}>
                {country.name.common}
                <button onClick={() => showCountry(country)}>
                  show
                </button>
              </div>
            )}
          </div>
        )}

      {matchingCountries.length === 1 && (
        <Country country={matchingCountries[0]} />
      )}

      {search !== '' && matchingCountries.length === 0 && (
        <p>No countries found</p>
      )}
    </div>

  )
}

export default App