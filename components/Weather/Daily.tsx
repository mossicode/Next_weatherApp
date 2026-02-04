"use client"

import { useWeather } from "@/context/WeatherContext"

function Daily() {
  const { weather, unit } = useWeather()

  if (!weather || !weather.list || weather.list.length === 0) return null

  // group by date
  const days: Record<string, any[]> = {}

  weather.list.forEach((item: any) => {
    const day = new Date(item.dt * 1000).toDateString()
    if (!days[day]) days[day] = []
    days[day].push(item)
  })

  // map to daily min/max
  const dailyArray = Object.keys(days).map((day) => {
    const temps = days[day].map((i) => i.main.temp)

    // min/max با توجه به unit
    let min = Math.min(...temps)
    let max = Math.max(...temps)

    if (unit === "imperial") { // Fahrenheit
      min = Math.round(min * 9 / 5 + 32)
      max = Math.round(max * 9 / 5 + 32)
    } else { // Celsius
      min = Math.round(min)
      max = Math.round(max)
    }

    const icon = days[day][0].weather[0].icon

    return { day, min, max, icon }
  })

  const getWeekday = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" })

  return (
    <div className="w-full mt-5">
      <h1>Daily Forecast</h1>

      <div className="flex gap-x-3 flex-nowrap max-lg:overflow-y-auto">
        {dailyArray.map((item, index) => (
          <div
            key={index}
            className="bg-sidebar-accent gap-y-1 min-w-32 min-h-32 rounded-lg mt-2 p-2 flex flex-col flex-1 max-sm:mb-3"
          >
            <div className="mx-auto">{getWeekday(item.day)}</div>

            <div className="mx-auto">
              <img
                src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                alt="icon"
              />
            </div>

            <div className="flex justify-between items-center sm:px-3">
              <div>{item.max}°</div>
              <div>{item.min}°</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Daily
