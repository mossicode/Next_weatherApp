"use client"

import { useWeather } from "@/context/WeatherContext"
import Weeks from "../weeks"

function Hourly() {
  const { weather, selectedDay } = useWeather()

  if (!weather || !weather.list || !selectedDay) return null

  const now = new Date() 
  const hourlyData = weather.list.filter((item: any) => {
    const itemDate = new Date(item.dt * 1000)
    return itemDate > now 
  }).slice(0, 24) 

  return (
    <div className="bg-accent px-2 pt-3 rounded-2xl">
      <div className="flex justify-between items-center w-full">
        <span className="text-3xl">Hourly Forecast</span>
        <Weeks />
      </div>

      <div className="overflow-y-auto h-116">
        {hourlyData.map((item: any, i: number) => (
          <div
            key={i}
            className="flex justify-between items-center rounded-lg bg-sidebar-ring p-3 mb-2"
          >
            <div>{new Date(item.dt * 1000).getHours()}:00</div>
            <div>{Math.round(item.main.temp)}°</div>
            {item.weather[0].icon && (
              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt="icon"
                className="w-6 h-6"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Hourly
