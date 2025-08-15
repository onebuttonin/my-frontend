// import React from "react";
// import Ticker1 from "../Ticker1";
// import Navbar from "../Navbar";
// import Nbottom from "../Nbottom";
// import Ticker2 from "../Ticker2";
// import Footer from "../Footer";
// import Collections from "/src/components/products/Collections"
// import Minimal from "/src/components/products/Minimal"
// import Homep from "/src/components/products/Homep"
// import ProductTicker from "../products/ProductTicker";

// export default function HomePages()  {

//     return (
        
//         <div>
           
//             <Nbottom></Nbottom>
           
//             <Homep></Homep>

//             <Minimal></Minimal>

//             <Collections></Collections>

//         </div>


//     )

// }







import React, {memo} from "react";
import Navbar from "../Navbar";
import Nbottom from "../Nbottom";
import Homep from "/src/components/products/Homep";
import Minimal from "/src/components/products/Minimal";
import Collections from "/src/components/products/Collections";
import Ticker3 from "../Ticker3";
import Sale from "../HomePage/Sale"

// Memoize static components to prevent unnecessary re-renders
const MemoizedNbottom = React.memo(Nbottom);
const MemoizedMinimal = React.memo(Minimal);
const MemoizedCollections = React.memo(Collections);

export default memo (function HomePages() {
  return (
    <div>
      <MemoizedNbottom />
      <Ticker3/>
      <Sale></Sale>
      <Homep />
      <MemoizedMinimal />
      <MemoizedCollections />
    </div>
  );
});
