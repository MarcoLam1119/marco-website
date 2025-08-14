import React, { useEffect, useState } from "react";
import { randomIntInclusive, rngFill } from "../../utils/id.js";

export default function PasswordGenerator() {
  const [len, setLen] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [nums, setNums] = useState(true);
  const [syms, setSyms] = useState(false);
  const [pwd, setPwd] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    gen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function gen() {
    const sets = [];
    if (upper) sets.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    if (lower) sets.push("abcdefghijklmnopqrstuvwxyz");
    if (nums) sets.push("0123456789");
    if (syms) sets.push("!@#$%^&*()-_=+[]{};:,.<>?");
    const L = parseInt(len, 10) || 16;
    if (sets.length === 0) {
      setPwd("");
      return;
    }
    const all = sets.join("");
    const arr = new Uint8Array(L + sets.length);
    rngFill(arr);
    let out = "";
    sets.forEach((set, idx) => {
      out += set[arr[idx] % set.length];
    });
    for (let i = sets.length; i < L + sets.length; i++) {
      out += all[arr[i] % all.length];
    }
    const a = out.split("");
    for (let i = a.length - 1; i > 0; i--) {
      const r = randomIntInclusive(i);
      [a[i], a[r]] = [a[r], a[i]];
    }
    setPwd(a.join("").slice(0, L));
  }

  async function copy() {
    if (!pwd) return;
    try {
      await navigator.clipboard.writeText(pwd);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 600);
  }

  return (
    <div className="panel tool" id="tool-pass">
      <h3>Password Generator</h3>
      <div className="row">
        <div>
          <label htmlFor="passLen">
            Length: <span id="passLenLabel">{len}</span>
          </label>
          <input
            id="passLen"
            type="range"
            min="6"
            max="64"
            value={len}
            onChange={(e) => {
              setLen(Number(e.target.value));
              gen();
            }}
          />
        </div>
        <div>
          <label htmlFor="passOut">Password</label>
          <div className="row">
            <input id="passOut" type="text" readOnly value={pwd} />
            <button id="copyPass" className={`tooltip${copied ? " show" : ""}`} onClick={copy}>
              Copy
              <span className="tip" role="status" aria-live="polite">
                Copied!
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        <label>
          <input type="checkbox" id="incUpper" checked={upper} onChange={(e) => { setUpper(e.target.checked); gen(); }} /> Uppercase
        </label>
        <label>
          <input type="checkbox" id="incLower" checked={lower} onChange={(e) => { setLower(e.target.checked); gen(); }} /> Lowercase
        </label>
        <label>
          <input type="checkbox" id="incNums" checked={nums} onChange={(e) => { setNums(e.target.checked); gen(); }} /> Numbers
        </label>
        <label>
          <input type="checkbox" id="incSyms" checked={syms} onChange={(e) => { setSyms(e.target.checked); gen(); }} /> Symbols
        </label>
      </div>
      <div className="actions">
        <button id="genPass" onClick={gen}>
          Generate
        </button>
      </div>
    </div>
  );
}