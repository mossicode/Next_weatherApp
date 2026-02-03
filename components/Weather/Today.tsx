// "use client"
// import Image from "next/image"

// function Today() {
//   return (
//     <div className="w-full">
//         <div className="w-full flex justify-between rounded-2xl items-center backImage bg-no-repeat bg-cover sm:min-h-60 max-sm:h-40  px-6 max-sm:px-3 max-sm:pe-4">
//         <div className="flex flex-col">
//             <div className="font-bold text-nowrap">Berlin, Germany</div>
//             <div className="text-nowrap max-sm:text-xs">Thuesday, Aug 5, 2045</div>
//         </div>
//         <div className="flex items-center gap-x-2">
//             <div>
//                 <Image src="/logo.svg" height={23} width={123} alt="hhehe" />
//             </div>
//             <div className="relative">
//                 <span className="text-4xl max-sm:text-xl max-sm:text-2xl">68</span>
//                  <span className="absolute font-bold">O</span>
//             </div>
//         </div>
//     </div>
//     <div className="w-full min-h-16 mt-5 flex gap-3 flex-wrap">
//         <div className="flex-1 bg-sidebar-accent rounded-lg px-3 py-4 flex-nowrap">
//                 <div className="flex-nowrap text-nowrap">Feels LIke</div>
//                  <div className="relative flex-nowrap text-nowrap">
//                     <span className="text-4xl max-sm:text-xl flex-nowrap text-nowrap">68</span>
//                     <span className="absolute font-bold">O</span>
//                  </div>
//         </div>
//         <div className="flex-1 bg-sidebar-accent rounded-lg px-3 py-4">
//                 <div className="flex-nowrap text-nowrap">Humidity</div>
//                  <div className="text-4xl max-sm:text-xl flex-nowrap text-nowrap" >68% </div>
//         </div>
//         <div className="flex-1 bg-sidebar-accent rounded-lg px-3 py-4">
//                 <div className="">Wind</div>
//                  <div className="text-4xl max-sm:text-xl flex-nowrap text-nowrap">9 mph </div>
//         </div>
//         <div className="flex-1 bg-sidebar-accent rounded-lg px-3 py-4">
//                 <div className="flex-nowrap text-nowrap">precipitaion</div>
//                  <div className="text-4xl max-sm:text-xl flex-nowrap text-nowrap">0 in</div>
//         </div>
//     </div>
//     </div>
//   )
// }

// export default Today
"use client"

import { useWeather } from "@/context/WeatherContext"
import Image from "next/image"

function Today() {
  const { weather, windUnit, precipUnit } = useWeather()

  // ✅ guards (VERY IMPORTANT)
  if (!weather) return null
  if (!weather.list || weather.list.length === 0) return null

  const todayData = weather.list[0]

  // icon
  const iconCode = todayData.weather[0].icon
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  // Temperature
  const temp = Math.round(todayData.main.temp)
  const feelsLike = Math.round(todayData.main.feels_like)

  // Wind
  let windSpeed = todayData.wind?.speed || 0
  if (windUnit === "kmh") windSpeed = Math.round(windSpeed * 1.609)

  // Precipitation (OpenWeather gives mm)
  let precip: number | string = todayData.rain?.["3h"] || 0
  if (precipUnit === "in") precip = (Number(precip) / 25.4).toFixed(2)

  // Humidity
  const humidity = todayData.main.humidity

  const dateStr = new Date(todayData.dt * 1000).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  })

  return (
    <div className="w-full">
      <div className="w-full flex justify-between rounded-2xl items-center backImage bg-no-repeat bg-cover sm:min-h-60 max-sm:h-40 px-6 max-sm:px-3 max-sm:pe-4">
        <div className="flex flex-col">
          <div className="font-bold">
            dd
            {weather.city.name}, {weather.city.country}
          </div>
          <div className="text-nowrap max-sm:text-xs">{dateStr}</div>
        </div>

        <div className="flex items-center gap-x-2">
          <div>
            {/* weather icon */}
             <img
                src={iconUrl}
                alt="icon"
              />
          </div>
          <div className="relative">
            <span className="text-4xl max-sm:text-xl">{temp}</span>
            <span className="absolute font-bold">°</span>
          </div>
        </div>
      </div>

      <div className="w-full min-h-16 mt-5 flex gap-3 flex-wrap">
        <div className="flex-1 bg-sidebar-accent rounded-lg px-3 py-4 flex-nowrap">
          <div className="text-nowrap flex-nowrap">Feels Like</div>
          <div className="relative text-4xl max-sm:text-xl text-nowrap flex-nowrap">
            {feelsLike}
            <span className="absolute font-bold">°</span>
          </div>
        </div>

        <div className="flex-1 bg-sidebar-accent rounded-lg px-3 py-4">
          <div className="text-nowrap flex-nowrap">Humidity</div>
          <div className="text-4xl max-sm:text-xl text-nowrap flex-nowrap">{humidity}%</div>
        </div>

        <div className="flex-1 bg-sidebar-accent rounded-lg px-3 py-4">
          <div className="text-nowrap flex-nowrap">Wind</div>
          <div className="text-4xl max-sm:text-xl text-nowrap flex-nowrap">
            {windSpeed} {windUnit}
          </div>
        </div>

        <div className="flex-1 bg-sidebar-accent rounded-lg px-3 py-4">
          <div className="text-nowrap flex-nowrap">Precipitation</div>
          <div className="text-4xl max-sm:text-xl text-nowrap flex-nowrap">
            {precip} {precipUnit}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Today
