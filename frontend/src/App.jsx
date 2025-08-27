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

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>Select Option</h1>

      {view === "menu" && (
        <div className="buttons">
          <button onClick={() => { setSelectedShift(getShiftForDate().shiftNumber); setView("record"); }}>
            Record Tips
          </button>
          <button onClick={() => setView("edit")}>Edit Previous Tips</button>
          <button onClick={() => setView("total")}>Get Weekly Total</button>
        </div>
      )}

      {view === "record" && (
        <RecordConfirm
          suggestedShift={suggested.shiftNumber}
          selectedShift={selectedShift}
          setSelectedShift={setSelectedShift}
          onBack={() => setView("menu")}
          onContinue={() => {
            // Replace this with your actual "Record Tips" form navigation
            alert(`Proceeding with Shift ${selectedShift}`);
          }}
        />
      )}

      {view === "edit" && (
        <SimpleScreen title="Edit Previous Tips (coming soon)" onBack={() => setView("menu")} />
      )}

      {view === "total" && (
        <SimpleScreen title="Weekly Totals (coming soon)" onBack={() => setView("menu")} />
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
