"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Unit = "metric" | "imperial"
type WindUnit = "mph" | "kmh"
type PrecipUnit = "in" | "mm"

type WeatherContextType = {
  weather: any
  loading: boolean
  error: string
  unit: Unit
  lang: string
  lastCity: string
  selectedDay: string
  windUnit: WindUnit
  precipUnit: PrecipUnit
  setWeather: (v: any) => void
  setLoading: (v: boolean) => void
  setError: (v: string) => void
  setUnit: (v: Unit) => void
  setLang: (v: string) => void
  setLastCity: (v: string) => void
  setSelectedDay: (v: string) => void
  setWindUnit: (v: WindUnit) => void
  setPrecipUnit: (v: PrecipUnit) => void
}

const WeatherContext = createContext<WeatherContextType | null>(null)

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [unit, setUnit] = useState<Unit>("metric")
  const [lang, setLang] = useState("en")
  const [lastCity, setLastCity] = useState("")
  const [selectedDay, setSelectedDay] = useState("")
  const [windUnit, setWindUnit] = useState<WindUnit>("mph")
  const [precipUnit, setPrecipUnit] = useState<PrecipUnit>("in")

  // load settings
  useEffect(() => {
    const u = localStorage.getItem("unit")
    const l = localStorage.getItem("lang")
    const c = localStorage.getItem("lastCity")
    const w = localStorage.getItem("windUnit")
    const p = localStorage.getItem("precipUnit")

    if (u) setUnit(u as Unit)
    if (l) setLang(l)
    if (c) setLastCity(c)
    if (w) setWindUnit(w as WindUnit)
    if (p) setPrecipUnit(p as PrecipUnit)
  }, [])

  // save settings
  useEffect(() => {
    localStorage.setItem("unit", unit)
    localStorage.setItem("lang", lang)
    localStorage.setItem("lastCity", lastCity)
    localStorage.setItem("windUnit", windUnit)
    localStorage.setItem("precipUnit", precipUnit)
  }, [unit, lang, lastCity, windUnit, precipUnit])

  // refetch when unit/lang changes
  useEffect(() => {
    if (!lastCity) return

    const fetchWeather = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${lastCity}&units=${unit}&lang=${lang}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
        )
        const data = await res.json()

        if (data.cod === "200") {
          setWeather(data)
          setSelectedDay(new Date(data.list[0].dt * 1000).toDateString())
        } else {
          setError(data.message)
        }
      } catch {
        setError("Failed to fetch weather")
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [unit, lang, lastCity])

  return (
    <WeatherContext.Provider
      value={{
        weather,
        loading,
        error,
        unit,
        lang,
        lastCity,
        selectedDay,
        windUnit,
        precipUnit,
        setWeather,
        setLoading,
        setError,
        setUnit,
        setLang,
        setLastCity,
        setSelectedDay,
        setWindUnit,
        setPrecipUnit,
      }}
    >
      {children}
    </WeatherContext.Provider>
  )
}

export function useWeather() {
  const ctx = useContext(WeatherContext)
  if (!ctx) throw new Error("useWeather must be used inside WeatherProvider")
  return ctx
}
