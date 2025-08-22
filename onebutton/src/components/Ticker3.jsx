import React from "react";
import { VerticalTicker, HorizontalTicker } from "react-infinite-ticker";

export default function Ticker3() {
    
  return (
    <div>
<HorizontalTicker duration={25000} className="w-full overflow-hidden">
  {Array(5).fill(0).map((_, index) => (
    <div 
      key={index} 
      className="bg-neutral-100 text-lg sm:text-base flex-auto flex items-center justify-center px-4 py-2 whitespace-nowrap font-extralight"
    >
     ADDITIONAL 5% OFF ON PREPAID ORDERS  
    </div>
  ))}
</HorizontalTicker>


    </div>
  );
}