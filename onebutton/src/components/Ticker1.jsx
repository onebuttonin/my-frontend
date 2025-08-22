// import React from "react";
// import { VerticalTicker, HorizontalTicker } from "react-infinite-ticker";

// export default function Ticker1() {
    
//   return (
//     <div>
// <HorizontalTicker duration={25000} className="w-full overflow-hidden">
//   {Array(5).fill(0).map((_, index) => (
//     <div 
//       key={index} 
//       className="bg-yellow-300 text-lg flex-auto flex items-center justify-center px-4 py-2 whitespace-nowrap"
//     >
//       FIRST10 | 10% OFF FIRST PURCHASE  
//     </div>
//   ))}
// </HorizontalTicker>


//     </div>
//   );
// }



import React from "react";
import { HorizontalTicker } from "react-infinite-ticker";

export default function LuxuryTicker() {
  return (
    <div className="bg-black text-white border-y border-gray-800">
      <HorizontalTicker duration={25000} className="w-full overflow-hidden">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="flex-auto flex items-center justify-center px-4 py-1.5 whitespace-nowrap
                         text-xs sm:text-sm md:text-base tracking-widest font-light
                         bg-black"
            >
              <span className="text-white/90">
                FIRST10 &nbsp;|&nbsp; 10% OFF FIRST PURCHASE
              </span>
            </div>
          ))}
      </HorizontalTicker>
    </div>
  );
}
