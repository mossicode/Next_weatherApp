"use client"

import { useState, useEffect } from "react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Search } from "lucide-react"
import { Button } from "../ui/button"
import { useWeather } from "@/context/WeatherContext"

export default function SearchBar() {
  const [cityInput, setCityInput] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [debouncedValue, setDebouncedValue] = useState("")
  const [localError, setLocalError] = useState("")

  const { setWeather, setLoading, setError, setLastCity, error } = useWeather()

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY

  // ===============================
  // Auto get current location on mount
  // ===============================
  useEffect(() => {
    const getCurrentLocation = () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser.")
        return
      }

      setLoading(true)
      setError("")

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            const res = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
            )
            const data = await res.json()
            if (data.length > 0) {
              await handleSelect(data[0])
            } else {
              setError("Could not find your location.")
            }
          } catch {
            setError("Something went wrong!")
          } finally {
            setLoading(false)
          }
        },
        (err) => {
          setError(err.message)
          setLoading(false)
        }
      )
    }

    getCurrentLocation()
  }, [])

  // ===============================
  // Debounce input (500ms delay)
  // ===============================
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(cityInput)
    }, 500)

    return () => clearTimeout(handler)
  }, [cityInput])

  // ===============================
  // Fetch city suggestions
  // ===============================
  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      )
      const data = await res.json()
      setResults(data)
    } catch {
      setResults([])
    }
  }

  // ===============================
  // Call API after debounce
  // ===============================
  useEffect(() => {
    if (debouncedValue) fetchSuggestions(debouncedValue)
    else setResults([])
  }, [debouncedValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCityInput(e.target.value)
  }

  const handleSelect = async (item: any) => {
    setCityInput(item.name)
    setResults([])
    setLoading(true)
    setError("")

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${item.lat}&lon=${item.lon}&units=metric&appid=${API_KEY}`
      )
      const data = await res.json()
      setWeather(data)
      setLastCity(item.name)
    } catch {
      setError("Something went wrong!")
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!cityInput.trim()) {
      setLocalError("Please enter a city name.")
      return
    }

    setLocalError("")
    setLoading(true)
    setError("")

    try {
      if (results.length > 0) {
        await handleSelect(results[0])
      } else {
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=${API_KEY}`
        )
        const data = await res.json()

        if (data.length > 0) {
          await handleSelect(data[0])
        } else {
          setError("City not found!")
          setWeather(null)
        }
      }
    } catch {
      setError("Something went wrong!")
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-sm:w-full flex flex-col justify-center mx-auto mb-8">
      <h1 className="text-center mt-4 mb-6 pb-3 text-3xl max-sm:text-xl">
        How is the sky looking today?
      </h1>

      <div className="flex gap-x-4 items-center flex-wrap relative">
        <InputGroup className="sm:min-w-100 max-sm:w-full h-14 max-sm:h-10 flex-1">
          <InputGroupInput
            placeholder="Type city or province"
            value={cityInput}
            onChange={handleChange}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>

        <Button
          onClick={handleSearch}
          className="h-13 max-sm:h-9 w-32 max-sm:w-16 max-sm:text-sm text-white text-lg bg-blue-500 hover:bg-blue-400 dark:bg-blue-900 dark:hover:bg-blue-800"
        >
          Search
        </Button>
      </div>

      {results.length > 0 && (
        <ul className="w-100 border rounded mt-1 max-h-48 overflow-y-auto shadow-lg">
          {results.map((item, i) => (
            <li
              key={i}
              className="px-3 py-2 cursor-pointer "
              onClick={() => handleSelect(item)}
            >
              {item.name}, {item.state ? item.state + ", " : ""}
              {item.country}
            </li>
          ))}
        </ul>
      )}

      {(localError || error) && (
        <div className="text-red-500 text-center mt-3">
          {localError || error}
        </div>
      )}
    </div>
  )
}
