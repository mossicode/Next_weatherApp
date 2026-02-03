"use client"

import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useWeather } from "@/context/WeatherContext"

export default function Setting() {
  const {
    unit,
    setUnit,
    lang,
    setLang,
    windUnit,
    setWindUnit,
    precipUnit,
    setPrecipUnit,
  } = useWeather()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Settings className="h-4 w-6" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-52">
        {/* Temperature */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>Temperature</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setUnit("metric")}>
            Celsius {unit === "metric" && "✓"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setUnit("imperial")}>
            Fahrenheit {unit === "imperial" && "✓"}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Language */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>Language</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setLang("en")}>
            English {lang === "en" && "✓"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLang("fa")}>
            Persian {lang === "fa" && "✓"}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Wind unit */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>Wind</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setWindUnit("mph")}>
            mph {windUnit === "mph" && "✓"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setWindUnit("kmh")}>
            km/h {windUnit === "kmh" && "✓"}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Precipitation unit */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>Precipitation</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setPrecipUnit("in")}>
            in {precipUnit === "in" && "✓"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPrecipUnit("mm")}>
            mm {precipUnit === "mm" && "✓"}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
