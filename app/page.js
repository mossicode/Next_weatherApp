"use client"
import SearchBar from "@/components/navbar/SearchBar";
import Setting from "@/components/navbar/Setting";
import { Theme } from "@/components/navbar/Theme";
import Daily from "@/components/Weather/Daily";
import Hourly from "@/components/Weather/Hourly";
import Today from "@/components/Weather/Today";
import { useWeather } from "@/context/WeatherContext";
// import Error from "next/error";
import Image from "next/image";

export default function Home() {
  const {Error} = useWeather()
  return (
    <div className="px-20 max-sm:px-3 ">

      {/* navbar */}
    <div className="flex justify-between items-center  pt-3 ">
      {/* {Error&& <h1>Error: {Error}</h1>} */}
      {Error&& <h1 className="text-red-500">Error: {Error}</h1>}
      <div>
        <Image height={40} width={140} alt="icon" src="./logo.svg" />
      </div>
      <div className="flex justify-between gap-x-2 items-center">
        <Theme  />
        <Setting />
      </div>
    </div>

    {/* search bar */}
    <div className="flex flex-col justify-center mx-auto ">
      <SearchBar />
    </div>
      <div className="w-full flex gap-x-4 max-md:flex-col mb-10 ">
          <div className="max-md:w-full w-2/3 flex-1">
             <Today />
             <Daily />
          </div>
          <div className=" max-md:w-full w-1/3 flex-1 bg-accent rounded-2xl mt-3 ">
            <Hourly />
          </div>
      </div>
    </div>
  );
}
