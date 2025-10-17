// Tools JS
const UNITS = {
  temperature: {
    units: ["Celsius", "Fahrenheit", "Kelvin"],
    toBase: (v, u) => {
      if (u === "Celsius") return v;
      if (u === "Fahrenheit") return ((v - 32) * 5) / 9;
      if (u === "Kelvin") return v - 273.15;
      return v;
    },
    fromBase: (v, u) => {
      if (u === "Celsius") return v;
      if (u === "Fahrenheit") return v * (9 / 5) + 32;
      if (u === "Kelvin") return v + 273.15;
      return v;
    },
  },
  length: {
    units: ["mm", "cm", "m", "km", "in", "ft", "yd", "mi"],
    factors: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 },
    toBase: (v, u, self) => v * self.factors[u],
    fromBase: (v, u, self) => v / self.factors[u],
  },
  weight: {
    units: ["kg", "lbs"],
    factors: { kg: 1, lbs: 0.453592 },
    toBase: (v, u, self) => v * self.factors[u],
    fromBase: (v, u, self) => v / self.factors[u],
  },
};

let currentCategory = 'temperature';
let currentFrom = 'Celsius';
let currentTo = 'Fahrenheit';

// Timer
let timerMode = 'stopwatch';
let display = '00:00.0';
let running = false;
let elapsed = 0;
let startTime = 0;
let rafRef = null;
let targetTime = 0;
let laps = [];

document.addEventListener('DOMContentLoaded', () => {
  // Unit converter
  changeCategory();

  // Timer
  setMode('stopwatch');
});

function setMode(mode) {
  timerMode = mode;
  if (rafRef) cancelAnimationFrame(rafRef);
  display = '00:00.0';
  running = false;
  elapsed = 0;
  laps = [];
  document.getElementById('timeDisplay').textContent = display;
  document.getElementById('timerControls').style.display = mode === 'timer' ? 'block' : 'none';
  document.getElementById('lapBtn').style.display = mode === 'stopwatch' ? 'inline-block' : 'none';
  document.getElementById('laps').innerHTML = '';
}

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
    const diff = now - startTime;
    elapsed = diff;
    display = formatTime(diff);
    document.getElementById('timeDisplay').textContent = display;
    rafRef = requestAnimationFrame(loop);
  };
  rafRef = requestAnimationFrame(loop);
}

function tickTimer() {
  const loop = () => {
    const now = performance.now();
    const passed = now - startTime;
    const left = Math.max(0, targetTime - passed);
    display = formatTime(left);
    document.getElementById('timeDisplay').textContent = display;
    if (left <= 0) {
      stopTimer();
      // Flash and alert
      const el = document.getElementById('timeDisplay');
      const origBg = el.style.backgroundColor;
      el.style.backgroundColor = "rgba(255,90,110,.25)";
      setTimeout(() => (el.style.backgroundColor = origBg), 600);
      alert("Timer done!");
      return;
    }
    rafRef = requestAnimationFrame(loop);
  };
  rafRef = requestAnimationFrame(loop);
}

function startTimer() {
  if (running) return;
  running = true;
  if (timerMode === 'stopwatch') {
    startTime = performance.now() - elapsed;
    tickStopwatch();
  } else {
    const min = Math.max(0, parseInt(document.getElementById('timerMinutes').value) || 0);
    const sec = Math.max(0, Math.min(59, parseInt(document.getElementById('timerSeconds').value) || 0));
    targetTime = (min * 60 + sec) * 1000;
    startTime = performance.now();
    tickTimer();
  }
  document.getElementById('startBtn').disabled = true;
}

function stopTimer() {
  if (!running) return;
  running = false;
  if (rafRef) cancelAnimationFrame(rafRef);
  if (timerMode === 'timer') {
    // Nothing special
  }
  document.getElementById('startBtn').disabled = false;
}

function resetTimer() {
  if (rafRef) cancelAnimationFrame(rafRef);
  running = false;
  elapsed = 0;
  display = '00:00.0';
  laps = [];
  document.getElementById('timeDisplay').textContent = display;
  document.getElementById('laps').innerHTML = '';
  document.getElementById('startBtn').disabled = false;
}

function lapTimer() {
  if (timerMode !== 'stopwatch') return;
  const now = running ? performance.now() - startTime : elapsed;
  laps.push(now);
  const lapsDiv = document.getElementById('laps');
  lapsDiv.innerHTML = laps.map((t, i) => `<div>Lap ${i + 1}: ${formatTime(t)}</div>`).join('');
}

// Unit Converter
function changeCategory() {
  const catSelect = document.getElementById('convCat');
  currentCategory = catSelect.value;
  const fromSelect = document.getElementById('convFrom');
  const toSelect = document.getElementById('convTo');
  const units = UNITS[currentCategory].units;
  fromSelect.innerHTML = '';
  toSelect.innerHTML = '';
  units.forEach(unit => {
    const opt = document.createElement('option');
    opt.value = unit;
    opt.textContent = unit;
    fromSelect.appendChild(opt);
    const opt2 = opt.cloneNode(true);
    toSelect.appendChild(opt2);
  });
  currentFrom = units[0] || '';
  currentTo = units[1] || units[0] || '';
  fromSelect.value = currentFrom;
  toSelect.value = currentTo;
  convertUnits();
}

function convertUnits() {
  const catSelect = document.getElementById('convCat');
  currentCategory = catSelect.value;
  const fromSelect = document.getElementById('convFrom');
  const toSelect = document.getElementById('convTo');
  currentFrom = fromSelect.value;
  currentTo = toSelect.value;
  const valInput = document.getElementById('convVal');
  const num = parseFloat(valInput.value);
  if (isNaN(num)) {
    document.getElementById('convOut').value = '';
    return;
  }
  const unit = UNITS[currentCategory];
  const base = unit.toBase(num, currentFrom, unit);
  const res = unit.fromBase(base, currentTo, unit);
  document.getElementById('convOut').value = isFinite(res) ? formatNumber(res) : '';
}

function formatNumber(n) {
  if (Math.abs(n) >= 1e6 || (Math.abs(n) < 1e-3 && n !== 0)) return n.toExponential(6);
  return (Math.round(n * 1e6) / 1e6).toString();
}

function swapUnits() {
  const temp = currentFrom;
  currentFrom = currentTo;
  currentTo = temp;
  document.getElementById('convFrom').value = currentFrom;
  document.getElementById('convTo').value = currentTo;
  convertUnits();
}

// Expose to global
window.setMode = setMode;
window.startTimer = startTimer;
window.stopTimer = stopTimer;
window.resetTimer = resetTimer;
window.lapTimer = lapTimer;

// Password Generator already in main.js
