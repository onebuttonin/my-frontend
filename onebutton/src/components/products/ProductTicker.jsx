import React from "react"
import { HorizontalTicker } from "react-infinite-ticker";

const images = [
    "/images/mck1.png",
    "/images/alone.png",
    "/images/Horse.png",
    "/images/Men-face.png",
    "/images/phools.png",

]


export default function ProductTicker () {
    return (

        <div>
            <HorizontalTicker duration={25000} className="w-full overflow-hidden">
  {images.map((imgSrc, index) => (
    <div 
      key={index} 
      className="bg-neutral-50/70 text-lg flex-auto flex items-center justify-center px-4 py-2 whitespace-nowrap"
    >
      {/* Display Different Images */}
      <img 
        src={imgSrc} 
        alt={`New Arrival ${index + 1}`} 
        className="h-8 lg:h-25 w-auto mr-4"
      />
      {/* <span className="text-lg font-semibold">New Arrivals</span> */}
    </div>
  ))}
</HorizontalTicker>

        </div>

    )
}