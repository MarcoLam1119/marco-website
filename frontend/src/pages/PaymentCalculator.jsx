import React, { useMemo, useState } from "react";

// Payment Calculator Page
export default function PaymentCalculator() {
  const [step, setStep] = useState(1);

  // Names state - initialize with empty array, will be populated from localStorage
  const [names, setNames] = useState([]);

  // Items state - initialize with empty array, will be populated from localStorage
  // item: { id, label, cost, payerName, utilizedBy: Set<string> }
  const [items, setItems] = useState([]);

  // Use ref to track if data has been loaded to prevent duplicate loading
  const dataLoadedRef = React.useRef(false);

  // State for set data popup
  const [showSetDataPopup, setShowSetDataPopup] = useState(false);
  const [jsonInput, setJsonInput] = useState("");

  // Load data from localStorage on component mount
  React.useEffect(() => {
    if (dataLoadedRef.current) {
      console.log('Data already loaded, skipping...');
      return;
    }

    const savedData = localStorage.getItem('paymentCalculatorData');
    console.log('Loading from localStorage:', savedData);
    
    setData(savedData)
  }, []);

  // Save data to localStorage whenever state changes
  React.useEffect(() => {
    const dataToSave = {
      names,
      items: items.map(item => ({
        ...item,
        utilizedBy: Array.from(item.utilizedBy) // Convert Set to Array for JSON
      })),
      step
    };
    localStorage.setItem('paymentCalculatorData', JSON.stringify(dataToSave));
  }, [names, items, step]);

  // Derived calculations
  const results = useMemo(() => calculateBalances(names, items), [names, items]);

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const clearData = () => {
    localStorage.removeItem('paymentCalculatorData');
    setNames(["Marco", "Eunice"]);
    setItems([
      {
        id: cryptoRandomId(),
        label: "Item 1",
        cost: 0,
        payerName: "Marco",
        utilizedBy: new Set(["Marco", "Eunice"]),
      },
    ]);
    setStep(1);
  };

  const setData = (savedData) => {
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        console.log('Parsed data:', data);
        
        if (data.names && data.names.length > 0) {
          console.log('Setting names:', data.names);
          setNames(data.names);
        } else {
          console.log('No valid names, using default');
          setNames(["Marco", "Eunice"]);
        }
        
        if (data.items && data.items.length > 0) {
          // Convert Set objects back from arrays
          const restoredItems = data.items.map(item => ({
            ...item,
            utilizedBy: new Set(item.utilizedBy || [])
          }));
          console.log('Setting items:', restoredItems);
          setItems(restoredItems);
        } else {
          console.log('No valid items, using default');
          setItems([
            {
              id: cryptoRandomId(),
              label: "Item 1",
              cost: 0,
              payerName: "Marco",
              utilizedBy: new Set(["Marco", "Eunice"]),
            },
          ]);
        }
        
        if (data.step) {
          console.log('Setting step:', data.step);
          setStep(data.step);
        }

        dataLoadedRef.current = true;
      } catch (error) {
        console.error('Error loading saved data:', error);
        // Fallback to default values if loading fails
        setNames(["Marco", "Eunice"]);
        setItems([
          {
            id: cryptoRandomId(),
            label: "Item 1",
            cost: 0,
            payerName: "Marco",
            utilizedBy: new Set(["Marco", "Eunice"]),
          },
        ]);
        dataLoadedRef.current = true;
      }
    } else {
      console.log('No saved data found, using defaults');
      // No saved data, use default values
      setNames(["Marco", "Eunice"]);
      setItems([
        {
          id: cryptoRandomId(),
          label: "Item 1",
          cost: 0,
          payerName: "Marco",
          utilizedBy: new Set(["Marco", "Eunice"]),
        },
      ]);
      dataLoadedRef.current = true;
    }
  }

  const setDataPopUp = () => {
    setShowSetDataPopup(true);
  };

  const handleJsonSubmit = () => {
    try {
      const data = JSON.parse(jsonInput);
      setData(JSON.stringify(data));
      setShowSetDataPopup(false);
      setJsonInput("");
    } catch (error) {
      alert("Invalid JSON format. Please check your input.");
      console.error("JSON parse error:", error);
    }
  };

  const closePopup = () => {
    setShowSetDataPopup(false);
    setJsonInput("");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>Payment Calculator</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <button style={styles.btn} onClick={clearData}>
          Clear Data
        </button>
        <button style={styles.btn} onClick={setDataPopUp}>
          Set Data
        </button>
        <span style={{ fontSize: 12, opacity: 0.7, alignSelf: 'center' }}>
          Data is automatically saved to browser storage
        </span>
      </div>

      {/* Set Data Popup */}
      {showSetDataPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <div style={styles.popupHeader}>
              <h3 style={styles.popupTitle}>Set Data from JSON</h3>
              <button style={styles.closeButton} onClick={closePopup}>×</button>
            </div>
            <div style={styles.popupContent}>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste your JSON data here..."
                style={styles.textarea}
                rows={10}
              />
              <div style={styles.popupButtons}>
                <button style={styles.btn} onClick={closePopup}>Cancel</button>
                <button style={styles.btnPrimary} onClick={handleJsonSubmit}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Stepper step={step} setStep={setStep} />

      {step === 1 && (
        <section style={styles.card}>
          <h2 style={styles.h2}>1) Collect Names</h2>
          <NameList names={names} setNames={setNames} />
          <div style={styles.navRow}>
            <button style={styles.btnPrimary} onClick={next} disabled={names.length === 0}>
              Next
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section style={styles.card}>
          <h2 style={styles.h2}>2) Collect Payment Items</h2>
          <ItemsEditor
            names={names}
            items={items}
            setItems={setItems}
          />
          <div style={styles.navRow}>
            <button style={styles.btn} onClick={prev}>Back</button>
            <button
              style={styles.btnPrimary}
              onClick={next}
              disabled={items.length === 0 || items.some(i => !i.label || !i.payerName || !isFinite(i.cost))}
            >
              Next
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section style={styles.card}>
          <h2 style={styles.h2}>3) Link Utilization</h2>
          <UtilizationMatrix
            names={names}
            items={items}
            setItems={setItems}
          />
          <div style={styles.navRow}>
            <button style={styles.btn} onClick={prev}>Back</button>
            <button style={styles.btnPrimary} onClick={next}>Next</button>
          </div>
        </section>
      )}

      {step === 4 && (
        <section style={styles.card}>
          <h2 style={styles.h2}>4) Calculation</h2>
          <CalculationPreview results={results} />
          <div style={styles.navRow}>
            <button style={styles.btn} onClick={prev}>Back</button>
            <button style={styles.btnPrimary} onClick={next}>Next</button>
          </div>
        </section>
      )}

      {step === 5 && (
        <section style={styles.card}>
          <h2 style={styles.h2}>5) Output</h2>
          <ResultsTable results={results} />
          <PerPersonUtilized items={items} names={names}/>
          <div style={styles.navRow}>
            <button style={styles.btn} onClick={prev}>Back</button>
            <button style={styles.btn} onClick={() => setStep(1)}>Start Over</button>
          </div>
        </section>
      )}
    </div>
  );
}

// Stepper
function Stepper({ step, setStep }) {
  const steps = ["Names", "Items", "Utilization", "Calc", "Output"];
  return (
    <div style={styles.stepper}>
      {steps.map((label, i) => {
        const n = i + 1;
        const active = n === step;
        return (
          <button
            key={label}
            onClick={() => setStep(n)}
            style={{
              ...styles.step,
              ...(active ? styles.stepActive : {}),
            }}
          >
            {n}. {label}
          </button>
        );
      })}
    </div>
  );
}

// Names Editor
function NameList({
  names,
  setNames,
}) {
  const [newName, setNewName] = useState("");

  const addName = () => {
    const n = newName.trim();
    if (!n) return;
    if (names.includes(n)) return;
    setNames([...names, n]);
    setNewName("");
  };

  const updateName = (idx, value) => {
    const clean = value.trimStart();
    const copy = [...names];
    copy[idx] = clean;
    setNames(copy);
  };

  const removeName = (idx) => {
    const filtered = names.filter((_, i) => i !== idx);
    setNames(filtered);
  };

  return (
    <div>
      <div style={styles.list}>
        {names.map((name, idx) => (
          <div key={idx} style={styles.row}>
            <input
              value={name}
              onChange={(e) => updateName(idx, e.target.value)}
              placeholder="Name"
              style={styles.input}
            />
            <button
              className="remove btn"
              style={styles.btnDanger}
              onClick={() => removeName(idx)}
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      <div style={styles.row}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Add name"
          onKeyDown={(e) => e.key === "Enter" && addName()}
          style={styles.input}
        />
        <button style={styles.btn} onClick={addName}>Add</button>
      </div>
    </div>
  );
}

// Items Editor
function ItemsEditor({
  names,
  items,
  setItems,
}) {
  const addItem = () => {
    setItems([
      ...items,
      {
        id: cryptoRandomId(),
        label: "",
        cost: 0,
        payerName: names.length > 0 ? names[0] : "",
        utilizedBy: new Set(names),
      },
    ]);
  };

  const updateItem = (id, patch) => {
    setItems(
      items.map((it) => (it.id === id ? { ...it, ...patch } : it))
    );
  };

  const removeItem = (id) => {
    setItems(items.filter((it) => it.id !== id));
  };

  return (
    <div>
      <div style={{ ...styles.list, gap: 8 }}>
        {items.map((it) => (
          <div key={it.id} style={styles.itemCard}>
            <div style={styles.rowWrap}>
              <input
                style={styles.input}
                placeholder="Item label"
                value={it.label}
                onChange={(e) => updateItem(it.id, { label: e.target.value })}
              />
              <input
                style={{ ...styles.input, maxWidth: 140 }}
                type="number"
                min="0"
                step="0.01"
                placeholder="Cost"
                value={Number.isFinite(it.cost) ? it.cost : ""}
                onChange={(e) =>
                  updateItem(it.id, { cost: parseFloat(e.target.value) || 0 })
                }
              />
              <select
                style={{ ...styles.input, maxWidth: 160 }}
                value={it.payerName}
                onChange={(e) => updateItem(it.id, { payerName: e.target.value })}
              >
                <option value="" disabled>
                  Select payer
                </option>
                {names.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <button style={styles.btnDanger} onClick={() => removeItem(it.id)}>
                ❌
              </button>
            </div>
            <div style={styles.utilSmall}>
              <span style={{ fontSize: 12, opacity: 0.8 }}>Utilized by will be set in step 3.</span>
            </div>
          </div>
        ))}
      </div>

      <button style={styles.btn} onClick={addItem}>Add Item</button>
    </div>
  );
}

// Utilization Matrix (checkbox table)
function UtilizationMatrix({
  names,
  items,
  setItems,
}) {
  const toggleUtil = (itemId, person) => {
    setItems(
      items.map((it) => {
        if (it.id !== itemId) return it;
        const next = new Set(it.utilizedBy);
        if (next.has(person)) next.delete(person);
        else next.add(person);
        return { ...it, utilizedBy: next };
      })
    );
  };

  if (items.length === 0) {
    return <p>No items. Go back to step 2 to add some.</p>;
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Item</th>
            <th style={styles.th}>Payer</th>
            <th style={styles.th}>Cost</th>
            <th style={styles.th}>Head Count</th>
            <th style={styles.th}>Avg.</th>
            <th style={styles.tdLine}></th>
            {names.map((n) => (
              <th key={n} style={styles.th}>{n}</th>
            ))}            
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id}>
              <td style={styles.td}>{it.label || <em>Item</em>}</td>
              <td style={styles.td}>{it.payerName || "-"}</td>
              <td style={styles.td}>{formatMoney(it.cost)}</td>
              <td style={styles.td}>/ {it.utilizedBy.size}</td>
              <td style={styles.td}>{formatMoney(it.cost / it.utilizedBy.size)}</td>
              <td style={styles.tdLine}></td>
              {names.map((n) => (
                <td key={n} style={styles.tdCenter}>
                  <input
                    type="checkbox"
                    checked={it.utilizedBy.has(n)}
                    onChange={() => toggleUtil(it.id, n)}
                  />
                </td>
              ))}
              
              
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: 12, opacity: 0.8, marginTop: 8 }}>
        Tip: If an item is utilized by nobody, it will be ignored in the calculation.
      </p>
    </div>
  );
}

// Calculation Preview
function CalculationPreview({
  results,
}) {
  if (results.names.length === 0) return <p>No names.</p>;

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Pay</th>
              <th style={styles.th}>Paid</th>
              <th style={styles.th}>Final result  <br/> [ - ] means no payment required</th>
            </tr>
          </thead>
          <tbody>
            {results.names.map((n) => (
              <tr key={n}>
                <td style={styles.td}>{n}</td>
                <td style={styles.td}>{formatMoney(results.owes[n] || 0)}</td>
                <td style={styles.td}>{formatMoney(results.paid[n] || 0)}</td>
                <td style={{ ...styles.td, fontWeight: 600 }}>
                  {formatMoney(results.net[n] || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* {results.settlements.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <h3 style={styles.h3}>Suggested Settlements</h3>
          <ul>
            {results.settlements.map((s, idx) => (
              <li key={idx}>
                {s.to} pays {s.from} {formatMoney(s.amount)}
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
}

// Final Output
function ResultsTable({
  results,
}) {
  console.log("results",results)
  return (
    <div>
      <h3 style={styles.h3}>Balances</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Pay</th>
              <th style={styles.th}>Paid</th>
              <th style={styles.th}>Final result  <br/> [ - ] means no payment required</th>
            </tr>
          </thead>
          <tbody>
            {results.names.map((n) => (
              <tr key={n}>
                <td style={styles.td}>{n}</td>
                <td style={styles.td}>{formatMoney(results.owes[n] || 0)}</td>
                <td style={styles.td}>{formatMoney(results.paid[n] || 0)}</td>
                <td style={{ ...styles.td, fontWeight: 600 }}>
                  {formatMoney(results.net[n] || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PerPersonUtilized({
  items,
  names,
}) {
  const byName = {};
  names.forEach((n) => (byName[n] = { items: [] }));
  items.forEach((it) => {
    names.forEach((n) => {
      if (it.utilizedBy.has(n)) {
        byName[n].items.push({ label: it.label || "Item", cost: it.cost/it.utilizedBy.size });
      }
    });
    names.forEach((n) => {
      if (it.payerName == n) {
        byName[n].items.push({ label: it.label || "Item", cost: (it.cost*-1) });
      }
    });
  });

  const exportToPDF = () => {
    // Create a new window for PDF content
    const printWindow = window.open('', '_blank');
    
    // Generate HTML content with page break prevention
    const content = names.map((n) => {
      const total = byName[n].items.reduce((sum, item) => sum + item.cost, 0);
      const itemsHtml = byName[n].items.length === 0 
        ? '<p style="margin: 6px 0 0 0; opacity: 0.8;">No utilized items.</p>'
        : `<ul style="margin: 6px 0 0 0; padding-left: 20px;">
             ${byName[n].items.map((it, idx) => 
               `<li key="${idx}" style="${it.cost < 0 ? 'color: green;' : 'color: red;'} margin-bottom: 4px;">
                  ${it.label} — ${formatMoney(it.cost)}
                </li>`
             ).join('')}
           </ul>`;
      
      return `<div class="person-card" style="page-break-inside: avoid; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                <strong style="display: block; margin-bottom: 8px; font-size: 16px;">
                  ${n} - Total : ${formatMoney(total)}
                </strong>
                ${itemsHtml}
              </div>`;
    }).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Utilized Items by Person</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            line-height: 1.4;
          }
          main{
            display:flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-around;
          }
          h3 { 
            color: #333; 
            border-bottom: 2px solid #2563eb; 
            padding-bottom: 8px; 
            margin-bottom: 16px;
          }
          .person-card { 
            page-break-inside: avoid;
            break-inside: avoid;
            width:fit-content;
          }
          @media print {
            .person-card {
              page-break-inside: avoid;
              break-inside: avoid-page;
            }
          }
        </style>
      </head>
      <body>
        <h3>Utilized Items by Person <a href="/payment">❌</a></h3>
        <main>
        ${content}
        </main>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div style={{ marginTop: 16 }} className="utilized-person">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={styles.h3}>Utilized Items by Person</h3>
        <button style={styles.btnPrimary} onClick={exportToPDF}>
          Export to PDF
        </button>
      </div>
      <div style={{display: 'flex',flexDirection: 'row',flexWrap: 'wrap',justifyContent: 'space-around' }}>
        {names.map((n) => (
          <div key={n} style={styles.personCard}>
            <strong>{n} - Total : {formatMoney(byName[n].items.reduce((sum, item) => sum + item.cost, 0))} </strong>
            {byName[n].items.length === 0 ? (
              <p style={{ margin: "6px 0 0 0", opacity: 0.8 }}>No utilized items.</p>
            ) : (
              <ul style={{ margin: "6px 0 0 0" }}>
                {byName[n].items.map((it, idx) => (
                  <li key={idx} style={it.cost < 0 ? {color:"green"} : {color:"red"} }>
                    {it.label} — {formatMoney(it.cost)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Calculation logic
function calculateBalances(names, items) {
  const paid = {};
  const owes = {};
  const net = {};

  names.forEach((n) => {
    paid[n] = 0;
    owes[n] = 0;
    net[n] = 0;
  });

  for (const it of items) {
    if (!it.payerName || !isFinite(it.cost) || it.cost <= 0) continue;
    const users = names.filter((n) => it.utilizedBy.has(n));
    if (users.length === 0) continue;

    const share = it.cost / users.length;

    // credit payer
    paid[it.payerName] = (paid[it.payerName] || 0) + it.cost;
    // each user owes share
    for (const u of users) {
      owes[u] = (owes[u] || 0) + share;
    }
  }

  names.forEach((n) => {
    net[n] = round2(owes[n] - paid[n]);
  });

  const settlements = settleNetBalances(net);

  return {
    names,
    paid,
    owes,
    net,
    settlements,
  };
}

// Greedy settlement: match debtors to creditors
function settleNetBalances(net) {
  const debtors = [];
  const creditors = [];
  for (const [name, amt] of Object.entries(net)) {
    if (amt < -0.004) debtors.push({ name, amount: -amt }); // owes
    else if (amt > 0.004) creditors.push({ name, amount: amt }); // to receive
  }
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transfers = [];
  let i = 0, j = 0;

  while (i < debtors.length && j < creditors.length) {
    const d = debtors[i];
    const c = creditors[j];
    const amt = round2(Math.min(d.amount, c.amount));
    if (amt > 0) {
      transfers.push({ from: d.name, to: c.name, amount: amt });
      d.amount = round2(d.amount - amt);
      c.amount = round2(c.amount - amt);
    }
    if (d.amount <= 0.004) i++;
    if (c.amount <= 0.004) j++;
  }
  return transfers;
}

// Utilities
function round2(n) {
  return Math.round(n * 100) / 100;
}

function formatMoney(n) {
  if (!isFinite(n)) return "-";
  return n.toLocaleString(undefined, { style: "currency", currency: "HKD", minimumFractionDigits: 2 });
}

function cryptoRandomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}

// Styles (inline for simplicity)
const styles = {
  container: {
    margin: "20px auto",
    padding: 16,
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
  },
  h1: { margin: "0 0 12px" },
  h2: { margin: "0 0 12px" },
  h3: { margin: "12px 0 8px" },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 12,
    background: "#00000000",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  },
  list: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 },
  row: { display: "flex", gap: 8, alignItems: "center" },
  rowWrap: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" },
  input: {
    padding: "8px 10px",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    outline: "none",
  },
  btn: {
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    background: "#f3f4f600",
    cursor: "pointer",
  },
  btnPrimary: {
    padding: "8px 12px",
    border: "1px solid #2563eb",
    borderRadius: 6,
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  },
  btnDanger: {
    padding: "8px 12px",
    border: "1px solid #ef4444",
    borderRadius: 6,
    background: "#fee2e2",
    color: "#b91c1c",
    cursor: "pointer",
  },
  navRow: { display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 },
  stepper: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  step: {
    padding: "6px 10px",
    border: "1px solid #d1d5db",
    borderRadius: 999,
    background: "#f9fafb00",
    cursor: "pointer",
    fontSize: 14,
  },
  stepActive: {
    border: "1px solid #2563eb",
    background: "#dbeafe00",
    color: "#1e40af",
    fontWeight: 600,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "8px",
    borderBottom: "1px solid #e5e7eb",
    background: "#f9fafb00",
    position: "sticky",
    top: 0,
  },
  td: {
    padding: "8px",
    borderBottom: "1px solid #f1f5f9",
  },
  tdLine: {
    padding: "8px",
    borderBottom: "1px solid #f1f5f9",
    borderLeft: "1px solid #f1f5f9",
  },
  tdCenter: {
    padding: "8px",
    borderBottom: "1px solid #f1f5f9",
    textAlign: "center",
  },
  itemCard: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 8,
    background: "#ffffff00",
  },
  utilSmall: {
    marginTop: 4,
  },
  personCard: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 8,
    background: "#ffffff00",
    marginBottom: 8,
    width: 'fit-content',
  },
  // Popup styles
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popup: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 0,
    width: "90%",
    maxWidth: 600,
    maxHeight: "80vh",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
  },
  popupHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
  },
  popupTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "600",
    color: "#1f2937",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#6b7280",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  popupContent: {
    padding: "20px",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    fontFamily: "monospace",
    resize: "vertical",
    outline: "none",
    minHeight: "200px",
  },
  popupButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    marginTop: "16px",
  },
};
