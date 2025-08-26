import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

export default function App() { 

//   const addTips = () => {
//     // Function to add tips
//     console.log("Adding tips...");
//   };

//   const editTips = () => {
//     // Function to edit previous tips
//     console.log("Editing previous tips...");
//   };

//   const getWeeklyTotal = () => {
//     // Function to get weekly total of tips
//     console.log("Getting weekly total...");
//   };

// // This is the main component of the application.
//   return (
//     <>
//       <h1>Select Option</h1>

//       <div className="buttons">
//         <button onClick={addTips}> Record Tips</button>
    
//         <button onClick = {editTips}> Edit Previous Tips</button>

//         <button onClick = {getWeeklyTotal}> Get Weekly Total</button>
//       </div>

//     </>
//   );

  const [view, setView] = useState("menu"); // menu | record
  const [shiftType, setShiftType] = useState(() => {
    const hour = new Date().getHours();
    return hour < 15 ? "AM" : "PM"; // AM if before 3 PM, else PM
  });

  return (
    <div style={{ padding: 20 }}>
      {view === "menu" && (
        <div className = "buttons">
          <button onClick={() => setView("record")}> Record Tips</button>
          <button onClick={() => setView("edit")}> Edit Previous Tips</button>
          <button onClick={() => setView("total")}> Get Weekly Total</button>
        </div>
    )}

    {view === "record" && (
      <div>
        <h2> Is this for the {shiftType} shift? </h2>
        <div className="buttons">
          <button onClick={() => alert('Confirmed ${shiftType} shift')}>
            Yes
          </button>
          <button
            onClick={() =>
              setShiftType((prev) => (prev === "AM" ? "PM" : "AM"))
            }
          >
            No, change shift
          </button>
          <button onClick={() => setView("menu")}> Back</button>
        </div>
      </div>
    )}
    </div>
  );
}
