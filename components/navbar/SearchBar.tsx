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
  const [isTyping, setIsTyping] = useState(false)

  const { setWeather, setLoading, loading, setError, setLastCity, error } =
    useWeather()

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY

  // =====================================
  // Auto detect location (NO dropdown)
  // =====================================
  useEffect(() => {
    if (!API_KEY) return

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
              await handleSelect(data[0]) // 👈 مستقیم انتخاب
            } else {
              setError("Could not detect your city.")
            }
          } catch {
            setError("Something went wrong.")
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
  }, [API_KEY])

  // =====================================
  // Debounce typing
  // =====================================
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(cityInput)
    }, 400)

    return () => clearTimeout(handler)
  }, [cityInput])

  // =====================================
  // Fetch suggestions (ONLY when typing)
  // =====================================
  const fetchSuggestions = async (query: string) => {
    if (!query.trim() || !API_KEY) {
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

  useEffect(() => {
    if (debouncedValue && isTyping) {
      fetchSuggestions(debouncedValue)
    } else {
      setResults([])
    }
  }, [debouncedValue, isTyping])

  // =====================================
  // Select city
  // =====================================
  const handleSelect = async (item: any) => {
    if (!API_KEY) return

    setCityInput(item.name)
    setResults([])
    setIsTyping(false)
    setLoading(true)
    setError("")
    setLocalError("")

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${item.lat}&lon=${item.lon}&units=metric&appid=${API_KEY}`
      )
      const data = await res.json()

      if (data.cod !== "200") {
        setError("Weather data not found.")
        setWeather(null)
        return
      }

      setWeather(data)
      setLastCity(item.name)
    } catch {
      setError("Something went wrong while fetching weather.")
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  // =====================================
  // Manual search button
  // =====================================
  const handleSearch = async () => {
    if (!cityInput.trim()) {
      setLocalError("Please enter a city name.")
      return
    }

    if (!API_KEY) {
      setLocalError("API key is missing.")
      return
    }

    setLocalError("")
    setLoading(true)
    setError("")
    setIsTyping(false)

    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=${API_KEY}`
      )
      const data = await res.json()

      if (data.length > 0) {
        await handleSelect(data[0])
      } else {
        setError("City not found.")
        setWeather(null)
      }
    } catch {
      setError("Something went wrong.")
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
        <InputGroup className="sm:min-w-100 max-sm:w-full h-12 max-sm:h-10 flex-1">
          <InputGroupInput
            placeholder="Type city or province"
            value={cityInput}
            onChange={(e) => {
              setCityInput(e.target.value)
              setIsTyping(true)
            }}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>

        <Button
          onClick={handleSearch}
          disabled={loading}
          className="h-11 max-sm:h-9 w-32 max-sm:w-16 max-sm:text-sm text-white text-lg bg-blue-500 hover:bg-blue-400 dark:bg-blue-900 dark:hover:bg-blue-800"
        >
          {loading ? "Loading..." : "Search"}
        </Button>
      </div>

      {/* Dropdown ONLY when typing */}
      {isTyping && results.length > 0 && (
        <ul className="w-full border rounded mt-1 max-h-48 overflow-y-auto shadow-lg bg-white dark:bg-gray-900">
          {results.map((item, i) => (
            <li
              key={i}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleSelect(item)}
            >
              {item.name}
              {item.state ? `, ${item.state}` : ""}
              {`, ${item.country}`}
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
