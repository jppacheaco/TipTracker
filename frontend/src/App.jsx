import { useState } from "react";
import './App.css';

// ---- helpers: week/shift math ----

// 0=Sun ... 3=Wed ... 6=Sat; find most recent Wednesday 00:00
function getWeekStart(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0..6, Wed=3
  const delta = (day - 3 + 7) % 7; // days since last Wed
  d.setDate(d.getDate() - delta);
  return d; // start of the tip week (Wed 00:00)
}


// Decide AM vs PM. Adjust cutoff if your store uses a different time.
const SHIFT_CUTOFF_HOUR = 15; // 3:00 PM => PM
function isAM(date) {
  return date.getHours() < SHIFT_CUTOFF_HOUR;
}

// Given a Date, return { shiftNumber: 1..14, label: "Wed AM" }
function getShiftForDate(date = new Date()) {
  const weekStart = getWeekStart(date); // Wed 00:00
  const msPerDay = 24 * 60 * 60 * 1000;
  //get day in current jimmy week
  const dayIndex = Math.floor((date.setHours(0,0,0,0) - weekStart.getTime()) / msPerDay);
  //get t/f for if we are currently in am shift
  const am = isAM(new Date());
  //get proper shift number Wed AM=1, Wed PM=2, Thu AM=3, ...
  const shiftNumber = dayIndex * 2 + (am ? 1 : 2); 
  //return the shift number
  return { shiftNumber, dayIndex, am };
}

/* ---------------------- UI ----------------------- */

export default function App() {
  const [view, setView] = useState("menu"); // "menu" | "record" | "edit" | "total"

  // Suggested shift based on "now"
  const suggested = getShiftForDate();
  const [selectedShift, setSelectedShift] = useState(suggested.shiftNumber);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [shiftTotal, setShiftTotal] = useState(0);
  const [AMTotal, setAMTotal] = useState(0);



  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>Select Option</h1>

      {/* main menu view */}
      {view === "menu" && (
        <div className="buttons">
          <button onClick={() => { setSelectedShift(getShiftForDate().shiftNumber); setView("record"); }}>
            Record Tips
          </button>
          <button onClick={() => setView("edit")}>Edit Previous Tips</button>
          <button onClick={() => setView("total")}>Get Weekly Total</button>
        </div>
      )}

      {/* when Record Tips is selected */}
      {view === "record" && (
        <RecordConfirm
          suggestedShift={suggested.shiftNumber}
          selectedShift={selectedShift}
          setSelectedShift={setSelectedShift}
          onBack={() => setView("menu")}
          //once the shift is confirmed, go to daily total screen
          onContinue={() => setView("dailyTotal")}
        />
      )}

      {/* to edit previous shift tips */}
      {view === "edit" && (
        <SimpleScreen title="Edit Previous Tips (coming soon)" onBack={() => setView("menu")} />
      )}

      {/* to get weekly total */}
      {view === "total" && (
        <SimpleScreen title="Weekly Totals (coming soon)" onBack={() => setView("menu")} />
      )}

      {/* get daily total */}
      {view === "dailyTotal" && (
        <div>
          <h2>Please enter your daily total</h2>

          <div className="buttons">
          <input
            // type="number"
            value={dailyTotal}
            onChange={(e) => {
              const value = Number(e.target.value); // convert string -> number
              setDailyTotal(value);

              //set the correct tips per shift
              if (selectedShift % 2 === 1) {
                // AM shift
                setShiftTotal(value);
                setAMTotal(value);
              } else {
                const pmPortion = Math.max(0, value - AMTotal);
                setShiftTotal(pmPortion);
              }
            }}
            placeholder="Enter total tips"
            style={{ width: "100%", maxWidth: "300px", padding: "10px", fontSize: "16px" }}
            // alert("Value recorder is ${dailyTotal}");
          />

            <button onClick={() => setView("selectEmployee")}>Continue</button>
            <button onClick={() => setView("record")}>Back</button>
          </div>
        </div>
      )}

      
      {/* select employees to record tips for */}
      {view === "selectEmployee" && (
        <SimpleScreen title={`Select Employees for Shift ${selectedShift} to allocate $${shiftTotal} (coming soon)`} onBack={() => setView("record")} />
      )}
    </div>
  );
}

function RecordConfirm({ suggestedShift, selectedShift, setSelectedShift, onBack, onContinue }) {
  // Build numeric options: 1..currentShift
  // const currentShift = suggestedShift;
  const options = Array.from({ length: suggestedShift }, (_, i) => i + 1);

  return (
    <div>
      <h2>Select Shift</h2>

      <div className="buttons">
        <select
          value={selectedShift}
          onChange={(e) => setSelectedShift(Number(e.target.value))}
        >

        {options.map((n) => (
          <option key={n} value={n}>Shift {n}</option>
        ))}

        </select>
        <button onClick={onContinue}>Confirm</button>
        <button onClick={onBack}>Back</button>
      </div>
    </div>
  );
}

function SimpleScreen({ title, onBack }) {
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={onBack}>Back</button>
    </div>
  );
}
