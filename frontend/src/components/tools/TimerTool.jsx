import React, { useEffect, useRef, useState } from "react";

export default function TimerTool() {
  const [mode, setMode] = useState("stopwatch"); // 'stopwatch' | 'timer'
  const [display, setDisplay] = useState("00:00.0");
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef(null);

  const [min, setMin] = useState(1);
  const [sec, setSec] = useState(0);
  const targetRef = useRef(0);
  const [laps, setLaps] = useState([]);

  useEffect(() => () => rafRef.current && cancelAnimationFrame(rafRef.current), []);

  function formatTime(ms) {
    const tenths = Math.floor(ms / 100) % 10;
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
  }

  function tickStopwatch() {
    const loop = () => {
      const now = performance.now();
      const diff = now - startRef.current;
      setElapsed(diff);
      setDisplay(formatTime(diff));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }

  function tickTimer() {
    const loop = () => {
      const now = performance.now();
      const passed = now - startRef.current;
      const left = Math.max(0, targetRef.current - passed);
      setDisplay(formatTime(left));
      if (left <= 0) {
        setRunning(false);
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    setRunning(true);
    if (mode === "stopwatch") {
      startRef.current = performance.now() - elapsed;
      tickStopwatch();
    } else {
      const mins = Math.max(0, parseInt(min || "0", 10));
      const secs = Math.max(0, Math.min(59, parseInt(sec || "0", 10)));
      targetRef.current = (mins * 60 + secs) * 1000;
      startRef.current = performance.now();
      tickTimer();
    }
  }

  function stop() {
    if (!running) return;
    setRunning(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (mode === "stopwatch") {
      const now = performance.now();
      const diff = now - startRef.current;
      setElapsed(diff);
      setDisplay(formatTime(diff));
    } else {
      setDisplay("00:00.0");
      const el = document.getElementById("timeDisplay");
      if (el) {
        const orig = el.style.backgroundColor;
        el.style.backgroundColor = "rgba(255,90,110,.25)";
        setTimeout(() => (el.style.backgroundColor = orig), 600);
      }
      alert("Timer done!");
    }
  }

  function reset() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setRunning(false);
    setElapsed(0);
    setDisplay("00:00.0");
    setLaps([]);
  }

  function lap() {
    if (mode !== "stopwatch") return;
    const now = running ? performance.now() - startRef.current : elapsed;
    setLaps((ls) => [...ls, now]);
  }

  return (
    <div className="panel tool" id="tool-timer">
      <h3>Stopwatch & Timer</h3>
      <div className="row">
        <button id="modeStopwatch" onClick={() => { reset(); setMode("stopwatch"); }}>
          Stopwatch
        </button>
        <button id="modeTimer" onClick={() => { reset(); setMode("timer"); }}>
          Timer
        </button>
      </div>
      <div className="center kpi" style={{ fontSize: "32px" }} id="timeDisplay">
        {display}
      </div>
      <div className="row" id="timerControls" style={{ display: mode === "timer" ? "" : "none" }}>
        <div>
          <label htmlFor="timerMinutes">Minutes</label>
          <input
            id="timerMinutes"
            type="number"
            min="0"
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="timerSeconds">Seconds</label>
          <input
            id="timerSeconds"
            type="number"
            min="0"
            max="59"
            value={sec}
            onChange={(e) => setSec(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="actions center">
        <button id="startBtn" onClick={start} disabled={running}>
          Start
        </button>
        <button id="lapBtn" onClick={lap} style={{ display: mode === "stopwatch" ? "" : "none" }}>
          Lap
        </button>
        <button
          id="stopBtn"
          onClick={() => {
            if (mode === "timer" && running) {
              stop();
            } else {
              if (rafRef.current) cancelAnimationFrame(rafRef.current);
              setRunning(false);
            }
          }}
        >
          Stop
        </button>
        <button id="resetBtn" onClick={reset}>
          Reset
        </button>
      </div>
      <div id="laps" className="small muted">
        {laps.map((t, i) => (
          <div key={i}>Lap {i + 1}: {formatTime(t)}</div>
        ))}
      </div>
    </div>
  );
}