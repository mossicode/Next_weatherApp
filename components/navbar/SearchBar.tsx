"use client"

import { useState } from "react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Search } from "lucide-react"
import { Button } from "../ui/button"
import { useWeather } from "@/context/WeatherContext"

// debounce helper
function debounce(func: Function, delay: number) {
  let timer: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => func(...args), delay)
  }
}

export default function SearchBar() {
  const [cityInput, setCityInput] = useState("")
  const [results, setResults] = useState<any[]>([])
  const { setWeather, setLoading, setError, error } = useWeather()
  const [localError, setLocalError] = useState("")

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY

  if (!API_KEY) {
    console.error("Missing OpenWeather API key")
  }

  // fetch city suggestions
  const fetchSuggestions = async (query: string) => {
    if (!query || !API_KEY) {
      setResults([])
      return
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      )
      const data = await res.json()
      setResults(Array.isArray(data) ? data : [])
    } catch {
      setResults([])
    }
  }

  const debouncedFetch = debounce(fetchSuggestions, 300)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCityInput(value)
    debouncedFetch(value)
  }

  const handleSelect = async (item: any) => {
    if (!API_KEY) return

    setCityInput(`${item.name}, ${item.country}`)
    setResults([])
    setLocalError("")
    setError("")
    setLoading(true)

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${item.lat}&lon=${item.lon}&units=metric&appid=${API_KEY}`
      )
      const data = await res.json()

      if (data.cod === "200") {
        setWeather(data)
      } else {
        setError(data.message || "City not found")
        setWeather(null)
      }
    } catch {
      setError("Something went wrong!")
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!cityInput.trim() || !API_KEY) {
      setLocalError("Please enter a city")
      return
    }

    setLocalError("")
    setError("")
    setLoading(true)

    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=${API_KEY}`
      )
      const data = await res.json()

      if (Array.isArray(data) && data.length > 0) {
        await handleSelect(data[0])
      } else {
        setError("City not found!")
        setWeather(null)
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
      <h1 className="text-center mt-4 mb-6 pb-3 text-3xl max-sm:text-xl max-sm:mb-3">
        How is the sky looking today?
      </h1>

      <div className="flex gap-x-4 items-center flex-wrap relative">
        <InputGroup className="w-sm max-sm:w-full h-16 max-sm:h-10 flex-1">
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
          className="h-16 max-sm:h-9 w-32 max-sm:w-16 max-sm:text-sm text-white text-lg bg-blue-500 hover:bg-blue-400"
        >
          Search
        </Button>

        {results.length > 0 && (
          <ul className="absolute top-full left-0 w-full border rounded mt-1 max-h-48 overflow-y-auto shadow-lg z-50 bg-white">
            {results.map((item, i) => (
              <li
                key={`${item.lat}-${item.lon}-${i}`}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelect(item)}
              >
                {item.name}
                {item.state ? `, ${item.state}` : ""}, {item.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      {(localError || error) && (
        <div className="text-red-500 text-center mt-3">
          {localError || error}
        </div>
      )}
    </div>
  )
}
