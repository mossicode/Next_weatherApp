"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useWeather } from "@/context/WeatherContext"

export default function Weeks() {
  const { weather, selectedDay, setSelectedDay } = useWeather()
  if (!weather) return null

  const days = Array.from(
    new Set(
      weather.list.map((item: any) =>
        new Date(item.dt * 1000).toDateString()
      )
    )
  )

  const selectedLabel = new Date(selectedDay).toLocaleDateString("en-US", {
    weekday: "long",
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-2xl my-3 h-14">
          {selectedLabel} ^
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuGroup>
          {days.map((day) => (
            <DropdownMenuItem
              key={day}
              onClick={() => setSelectedDay(day)}
            >
              {new Date(day).toLocaleDateString("en-US", {
                weekday: "long",
              })}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
