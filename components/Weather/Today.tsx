"use client"

import { useWeather } from "@/context/WeatherContext"
type Offline = boolean

function Today() {
  const { weather, windUnit, precipUnit, unit, selectedDay } = useWeather()

  let offline: Offline = false
  if (!weather || !weather.list || weather.list.length === 0) {
    offline = true
  }

  // داده‌های روز انتخاب شده
  const todayData =
    !offline && selectedDay
      ? weather.list.find(
          (item: any) =>
            new Date(item.dt * 1000).toDateString() === selectedDay
        )
      : null

  // icon
  const iconCode = todayData ? todayData.weather[0].icon : null
  const iconUrl = iconCode
    ? `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    : null

  // Temperature
  let temp: number | string = todayData ? todayData.main.temp : "----"
  let feelsLike: number | string = todayData ? todayData.main.feels_like : "----"

  if (todayData) {
    if (unit === "imperial") {
      temp = Math.round(temp * 9 / 5 + 32)
      feelsLike = Math.round(feelsLike * 9 / 5 + 32)
    } else {
      temp = Math.round(temp)
      feelsLike = Math.round(feelsLike)
    }
  }

  // Wind
  let windSpeed: number | string = todayData ? todayData.wind?.speed || 0 : "----"
  if (todayData) {
    if (windUnit === "kmh") windSpeed = Math.round(windSpeed * 3.6)
    else if (windUnit === "mph") windSpeed = Math.round(windSpeed * 2.237)
  }

  // Precipitation
  let precip: number | string = todayData ? todayData.rain?.["3h"] || 0 : "----"
  if (todayData && precipUnit === "in") precip = (Number(precip) / 25.4).toFixed(2)

  // Humidity
  const humidity = todayData ? todayData.main.humidity : "----"

  const dateStr = todayData
    ? new Date(todayData.dt * 1000).toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    : "----"

  return (
    <div className="w-full">
      <div className="w-full flex justify-between rounded-2xl items-center backImage bg-no-repeat bg-cover sm:min-h-60 max-sm:h-40 px-6 max-sm:px-3 max-sm:pe-4">
        <div className="flex flex-col">
          <div className="font-bold">
            {!offline ? `${weather.city.name}, ${weather.city.country}` : "----"}
          </div>
          <div className="text-nowrap max-sm:text-xs">{dateStr}</div>
        </div>

        <div className="flex items-center gap-x-2">
          <div>
            {iconUrl ? (
              <img src={iconUrl} alt="icon" />
            ) : (
              <div className="w-12 h-12 bg-gray-300 rounded"></div>
            )}
          </div>
          <div className="relative">
            <span className="text-4xl max-sm:text-xl">{temp}</span>
            {todayData && <span className="absolute font-bold">°</span>}
          </div>
        </div>
      </div>

      <div className="w-full min-h-16 mt-5 flex gap-3 flex-wrap">
        <div className="flex-1 bg-sidebar-accent rounded-lg px-4 py-3 space-y-5 justify-between flex-nowrap">
          <div className="text-nowrap flex-nowrap">Feels Like</div>
          <div className="relative text-4xl max-sm:text-xl text-nowrap flex-nowrap">
            {feelsLike}
            {todayData && <span className="absolute font-bold">°</span>}
          </div>
        </div>

        <div className="flex-1 bg-sidebar-accent rounded-lg px-4 py-3 space-y-5 justify-between">
          <div className="text-nowrap flex-nowrap">Humidity</div>
          <div className="text-4xl max-sm:text-xl text-nowrap flex-nowrap">{humidity}%</div>
        </div>

        <div className="flex-1 bg-sidebar-accent rounded-lg px-4 py-3 space-y-5 justify-between">
          <div className="text-nowrap flex-nowrap">Wind</div>
          <div className="text-4xl max-sm:text-xl text-nowrap flex-nowrap">
            {windSpeed} {todayData ? windUnit : ""}
          </div>
        </div>

        <div className="flex-1 bg-sidebar-accent rounded-lg px-4 py-3 space-y-5 justify-between">
          <div className="text-nowrap flex-nowrap">Precipitation</div>
          <div className="text-4xl max-sm:text-xl text-nowrap flex-nowrap">
            {precip} {todayData ? precipUnit : ""}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Today
