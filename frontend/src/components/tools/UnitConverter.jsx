import React, { useEffect, useMemo, useState } from "react";

export default function UnitConverter() {
  const UNITS = useMemo(
    () => ({
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
    }),
    []
  );

  const [cat, setCat] = useState("temperature");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [val, setVal] = useState("0");
  const [out, setOut] = useState("");

  useEffect(() => {
    const u = UNITS[cat].units;
    setFrom(u[0] || "");
    setTo(u[1] || u[0] || "");
  }, [cat, UNITS]);

  useEffect(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      setOut("");
      return;
    }
    const unit = UNITS[cat];
    const base =
      cat === "length" ? unit.toBase(num, from, unit) : unit.toBase(num, from);
    const res =
      cat === "length" ? unit.fromBase(base, to, unit) : unit.fromBase(base, to);
    setOut(Number.isFinite(res) ? formatNumber(res) : "");
  }, [val, from, to, cat, UNITS]);

  function formatNumber(n) {
    if (Math.abs(n) >= 1e6 || (Math.abs(n) < 1e-3 && n !== 0)) return n.toExponential(6);
    return (Math.round(n * 1e6) / 1e6).toString();
  }

  return (
    <div className="panel tool" id="tool-convert">
      <h3>Unit Converter</h3>
      <div className="row">
        <div>
          <label htmlFor="convCat">Category</label>
          <select id="convCat" value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="temperature">Temperature</option>
            <option value="length">Length</option>
          </select>
        </div>
        <div>
          <label htmlFor="convFrom">From</label>
          <select id="convFrom" value={from} onChange={(e) => setFrom(e.target.value)}>
            {UNITS[cat].units.map((u) => (
              <option key={`from-${u}`} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="convTo">To</label>
          <select id="convTo" value={to} onChange={(e) => setTo(e.target.value)}>
            {UNITS[cat].units.map((u) => (
              <option key={`to-${u}`} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="row">
        <div>
          <label htmlFor="convVal">Value</label>
          <input
            id="convVal"
            type="number"
            step="any"
            value={val}
            onChange={(e) => setVal(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="convOut">Result</label>
          <input id="convOut" type="text" readOnly value={out} />
        </div>
      </div>
    </div>
  );
}