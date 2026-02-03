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
  useEffect(() => {
    if (weather?.list?.length > 0) {
      setSelectedDay(new Date(weather.list[0].dt * 1000).toDateString())
    }
  }, [weather])

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
