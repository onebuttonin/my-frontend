import React from "react";
import { VerticalTicker, HorizontalTicker } from "react-infinite-ticker";

export default function Ticker2() {
    
  return (
    <div>
<HorizontalTicker duration={25000} className="w-full overflow-hidden">
  {Array(5).fill(0).map((_, index) => (
    <div 
      key={index} 
      className="bg-neutral-50/70 text-lg flex-auto flex items-center justify-center px-4 py-0 whitespace-nowrap"
    >
      New Arrivals Fresh Like a Bread  
    </div>
  ))}
</HorizontalTicker>


    </div>
  );
}