"use client"

import { useWeather } from "@/context/WeatherContext"
import Weeks from "../weeks"

function Hourly() {
  const { weather, selectedDay, unit, windUnit, precipUnit } = useWeather()

  if (!weather || !weather.list || !selectedDay) return null

  const now = new Date()
  const nowTime = now.getTime()

  // همه آیتم‌هایی که بعد از الان هستند
  let futureItems = weather.list.filter((item: any) => {
    const itemTime = new Date(item.dt * 1000).getTime()
    return itemTime >= nowTime
  })

  // حداکثر 8 آیتم = 24 ساعت آینده
  const hourlyData = futureItems.slice(0, 10)

  return (
    <div className="bg-accent px-2 pt-3 rounded-2xl lg:max-h-112  ">
      <div className="flex justify-between items-center w-full  lg:flex-row max-sm:flex ">
        <span className="text-3xl max-lg:text-base">Hourly <span className="max-sm:hidden ">Forecast</span></span>
        <Weeks />
      </div>

      <div className="overflow-y-auto h-116 mt-3 no-scrollbar max-lg:max-h-100 ">
        {hourlyData.length === 0 ? (
          <div className="text-center text-gray-400">----</div>
        ) : (
          hourlyData.map((item: any) => {
            let temp: number | string = item.main.temp
            if (unit === "imperial") temp = Math.round(temp * 9 / 5 + 32)
            else temp = Math.round(temp)

            let windSpeed: number | string = item.wind?.speed || 0
            if (windUnit === "kmh") windSpeed = Math.round(windSpeed * 3.6)
            else if (windUnit === "mph") windSpeed = Math.round(windSpeed * 2.237)

            let precip: number | string = item.rain?.["3h"] || 0
            if (precipUnit === "in") precip = (Number(precip) / 25.4).toFixed(2)

            return (
              <div
                key={item.dt}
                className="flex justify-between items-center rounded-lg bg-sidebar-ring p-3 mb-2"
              >  <div className="flex gap-x-2 items-center ">
                    <div>
                       {item.weather[0]?.icon && (
                        <img
                          src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                          alt="icon"
                          className="w-10 h-10"
                        />
                      )}
                    </div>
                  <div>{new Date(item.dt * 1000).getHours()}:00</div>
                  </div>
                
                <div>{temp}°</div>
               
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Hourly
