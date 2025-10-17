// Payment Calculator JS - synced with React version
let currentStep = 1;
let names = [];
let items = [];
let dataLoaded = false;

document.addEventListener('DOMContentLoaded', () => {
  loadData();
  renderStepper();
  renderNames();
  renderItems();
});

function loadData() {
  if (dataLoaded) return;
  const savedData = localStorage.getItem('paymentCalculatorData');
  if (savedData) {
    try {
      const data = JSON.parse(savedData);
      names = data.names || [];
      items = (data.items || []).map(item => ({
        ...item,
        utilizedBy: item.utilizedBy || []
      }));
      currentStep = data.step || 1;
    } catch (error) {
      console.error('Error loading saved data:', error);
      setDefaultData();
    }
  } else {
    setDefaultData();
  }
  dataLoaded = true;
  setStep(currentStep);
}

function setDefaultData() {
  names = ["Marco", "Eunice"];
  items = [{
    id: cryptoRandomId(),
    label: "Item 1",
    cost: 0,
    payerName: "Marco",
    utilizedBy: ["Marco", "Eunice"],
  }];
  currentStep = 1;
}

function saveData() {
  const dataToSave = {
    names,
    items: items.map(item => ({
      ...item,
      utilizedBy: item.utilizedBy
    })),
    step: currentStep
  };
  localStorage.setItem('paymentCalculatorData', JSON.stringify(dataToSave));
}

function clearData() {
  localStorage.removeItem('paymentCalculatorData');
  setDefaultData();
  dataLoaded = true;
  setStep(1);
  renderAll();
}

function renderAll() {
  renderStepper();
  renderNames();
  renderItems();
  if (currentStep === 3) renderUtilizationMatrix();
  if (currentStep === 4) renderCalculationPreview();
  if (currentStep === 5) {
    renderOutputResults();
    renderPerPersonUtilized();
  }
}

// Stepper
function renderStepper() {
  const stepper = document.getElementById('stepper');
  const steps = ["Names", "Items", "Utilization", "Calc", "Output"];
  stepper.innerHTML = steps.map((label, i) => {
    const n = i + 1;
    const active = n === currentStep;
    return `<button onclick="setStep(${n})" style="padding: 6px 10px; border: 1px solid ${active ? '#2563eb' : '#d1d5db'}; border-radius: 999px; background: ${active ? '#dbeafe' : '#f9fafb'}; cursor: pointer; font-size: 14px; ${active ? 'color: #1e40af; font-weight: 600;' : ''}">${n}. ${label}</button>`;
  }).join('');
}

function setStep(step) {
  for (let i = 1; i <= 5; i++) {
    document.getElementById('step' + i).style.display = i === step ? 'block' : 'none';
  }
  currentStep = step;
  renderAll();
}

function nextStep() {
  const next = Math.min(currentStep + 1, 5);
  if (canProceedToStep(next)) {
    setStep(next);
  }
}

function prevStep() {
  if (currentStep > 1) {
    setStep(currentStep - 1);
  }
}

function canProceedToStep(step) {
  if (step === 2) return names.length > 0;
  if (step === 3) return items.length > 0 && items.every(i => i.label && i.payerName && isFinite(i.cost));
  return true;
}

function updateStepButtons() {
  document.getElementById('next1').disabled = !canProceedToStep(2);
  const next2 = document.getElementById('next2');
  if (next2) next2.disabled = !canProceedToStep(3);
}

// Names
function renderNames() {
  const list = document.getElementById('namesList');
  list.innerHTML = '';
  list.innerHTML += names.map((name, idx) => `
    <div style="display: flex; gap: 8px; margin-bottom: 6px;">
      <input value="${name}" placeholder="Name" onchange="updateName(${idx}, this.value)" style="padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; outline: none; flex: 1;" />
      <button onclick="removeName(${idx})" style="padding: 8px 12px; border: 1px solid #ef4444; border-radius: 6px; background: #fee2e2; color: #b91c1c; cursor: pointer;">❌</button>
    </div>
  `).join('');
  list.innerHTML += `
    <div style="display: flex; gap: 8px;">
      <input id="newName" placeholder="Add name" onkeydown="if(event.key === 'Enter') addName()" style="padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; outline: none; flex: 1;" />
      <button onclick="addName()" style="padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: #f3f4f6; cursor: pointer;">Add</button>
    </div>
  `;
  updateStepButtons();
}

function addName() {
  const newNameInput = document.getElementById('newName');
  const name = newNameInput.value.trim();
  if (name && !names.includes(name)) {
    names.push(name);
    saveData();
    renderNames();
    newNameInput.value = '';
  }
}

function updateName(idx, value) {
  names[idx] = value.trim();
  saveData();
}

function removeName(idx) {
  names.splice(idx, 1);
  saveData();
  renderNames();
}

// Items
function renderItems() {
  const list = document.getElementById('itemsList');
  list.innerHTML = '';
  list.style.display = 'flex';
  list.style.flexDirection = 'column';
  list.style.gap = '8px';
  list.innerHTML = items.map((it, idx) => `
    <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px; background: rgba(255,255,255,0);">
      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <input placeholder="Item label" value="${it.label}" onchange="updateItem(${idx}, 'label', this.value)" style="padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; outline: none; flex: 1; min-width: 140px;" />
        <input type="number" min="0" step="0.01" placeholder="Cost" value="${isFinite(it.cost) ? it.cost : ''}" onchange="updateItem(${idx}, 'cost', this.value)" style="padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; outline: none; max-width: 140px;" />
        <select onchange="updateItem(${idx}, 'payerName', this.value)" style="padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; outline: none; max-width: 160px;">
          <option value="" disabled>Select payer</option>
          ${names.map(n => `<option value="${n}" ${n === it.payerName ? 'selected' : ''}>${n}</option>`).join('')}
        </select>
        <button onclick="removeItem('${it.id}')" style="padding: 8px 12px; border: 1px solid #ef4444; border-radius: 6px; background: #fee2e2; color: #b91c1c; cursor: pointer;">❌</button>
      </div>
      <div style="margin-top: 4px; font-size: 12px; opacity: 0.8;">Utilization will be set in step 3.</div>
    </div>
  `).join('');
  updateStepButtons();
}

function addItem() {
  items.push({
    id: cryptoRandomId(),
    label: "",
    cost: 0,
    payerName: names.length > 0 ? names[0] : "",
    utilizedBy: [...names],
  });
  saveData();
  renderItems();
}

function updateItem(idx, field, value) {
  const item = items[idx];
  if (field === 'cost') {
    item.cost = parseFloat(value) || 0;
  } else {
    item[field] = value;
  }
  saveData();
  updateStepButtons();
}

function removeItem(id) {
  items = items.filter(it => it.id !== id);
  saveData();
  renderItems();
}

// Utilization Matrix
function renderUtilizationMatrix() {
  const container = document.getElementById('utilizationMatrix');
  if (items.length === 0) {
    container.innerHTML = '<p>No items. Go back to step 2 to add some.</p>';
    return;
  }
  container.innerHTML = `
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; background: rgba(249,250,251,0); position: sticky; top: 0;">Item</th>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; background: rgba(249,250,251,0); position: sticky; top: 0;">Payer</th>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; background: rgba(249,250,251,0); position: sticky; top: 0;">Cost</th>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; background: rgba(249,250,251,0); position: sticky; top: 0;">Head Count</th>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; background: rgba(249,250,251,0); position: sticky; top: 0;">Avg.</th>
            <th style="padding: 8px; border-bottom: 1px solid #e5e7eb; background: rgba(249,250,251,0); position: sticky; top: 0;"></th>
            ${names.map(n => `<th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; background: rgba(249,250,251,0); position: sticky; top: 0;">${n}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${items.map(it => `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${it.label || '<em>Item</em>'}</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${it.payerName || "-"}</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${formatMoney(it.cost)}</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">/ ${it.utilizedBy.length}</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${formatMoney(it.cost / it.utilizedBy.length)}</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; border-left: 1px solid #f1f5f9;"></td>
              ${names.map(n => `
                <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; text-align: center;">
                  <input type="checkbox" ${it.utilizedBy.includes(n) ? 'checked' : ''} onchange="toggleUtil(${it.id}, '${n}')" />
                </td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <p style="font-size: 12px; opacity: 0.8; margin-top: 8px;">Tip: If an item is utilized by nobody, it will be ignored in the calculation.</p>
  `;
}

function toggleUtil(itemId, person) {
  const item = items.find(it => it.id === itemId);
  if (!item) return;
  const index = item.utilizedBy.indexOf(person);
  if (index > -1) {
    item.utilizedBy.splice(index, 1);
  } else {
    item.utilizedBy.push(person);
  }
  saveData();
  renderUtilizationMatrix();
}

// Calculation
function renderCalculationPreview() {
  const results = calculateBalances(names, items);
  const container = document.getElementById('calculationPreview');
  if (results.names.length === 0) {
    container.innerHTML = '<p>No names.</p>';
    return;
  }
  container.innerHTML = `
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; background: rgba(249,250,251,0); position: sticky; top: 0;">Name</th>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; background: rgba(249,250,251,0); position: sticky; top: 0;">Pay</th>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; background: rgba(249,250,251,0); position: sticky; top: 0;">Paid</th>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; background: rgba(249,250,251,0); position: sticky; top: 0;">Final result <br/> [ - ] means no payment required</th>
          </tr>
        </thead>
        <tbody>
          ${results.names.map(n => `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${n}</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${formatMoney(results.owes[n] || 0)}</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${formatMoney(results.paid[n] || 0)}</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: 600;">${formatMoney(results.net[n] || 0)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// Output
function renderOutputResults() {
  const results = calculateBalances(names, items);
  const container = document.getElementById('outputResults');
  container.innerHTML = `
    <h3 style="margin: 12px 0 8px;">Balances</h3>
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; background: rgba(249,250,251,0); position: sticky; top: 0;">Name</th>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; background: rgba(249,250,251,0); position: sticky; top: 0;">Pay</th>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; background: rgba(249,250,251,0); position: sticky; top: 0;">Paid</th>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; background: rgba(249,250,251,0); position: sticky; top: 0;">Final result <br/> [ - ] means no payment required</th>
          </tr>
        </thead>
        <tbody>
          ${results.names.map(n => `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${n}</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${formatMoney(results.owes[n] || 0)}</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${formatMoney(results.paid[n] || 0)}</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: 600;">${formatMoney(results.net[n] || 0)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderPerPersonUtilized() {
  const container = document.getElementById('perPersonUtilized');
  const byName = {};
  names.forEach(n => byName[n] = { items: [] });
  items.forEach(it => {
    names.forEach(n => {
      if (it.utilizedBy.includes(n)) {
        byName[n].items.push({ label: it.label || "Item", cost: it.cost / it.utilizedBy.length });
      }
    });
    names.forEach(n => {
      if (it.payerName === n) {
        byName[n].items.push({ label: it.label || "Item", cost: -it.cost });
      }
    });
  });

  container.innerHTML = `
    <h3 style="margin: 12px 0 8px;">Utilized Items by Person</h3>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
      <h4 style="margin: 0;"></h4>
      <button onclick="exportToPDF()" style="padding: 8px 12px; border: 1px solid #2563eb; border-radius: 6px; background: #2563eb; color: white; cursor: pointer;">Export to PDF</button>
    </div>
    <div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: space-around;">
      ${names.map(n => `
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px; background: rgba(255,255,255,0); margin-bottom: 8px; width: fit-content;">
          <strong>${n} - Total : ${formatMoney(byName[n].items.reduce((sum, item) => sum + item.cost, 0))}</strong>
          ${byName[n].items.length === 0 ? '<p style="margin: 6px 0 0 0; opacity: 0.8;">No utilized items.</p>' : `
            <ul style="margin: 6px 0 0 0;">
              ${byName[n].items.map(it => `<li style="color: ${it.cost < 0 ? 'green' : 'red'};">${it.label} — ${formatMoney(it.cost)}</li>`).join('')}
            </ul>
          `}
        </div>
      `).join('')}
    </div>
  `;
}

function exportToPDF() {
  const byName = {};
  names.forEach(n => byName[n] = { items: [] });
  items.forEach(it => {
    names.forEach(n => {
      if (it.utilizedBy.includes(n)) {
        byName[n].items.push({ label: it.label || "Item", cost: it.cost / it.utilizedBy.length });
      }
    });
    names.forEach(n => {
      if (it.payerName === n) {
        byName[n].items.push({ label: it.label || "Item", cost: -it.cost });
      }
    });
  });

  const content = names.map(n => {
    const total = byName[n].items.reduce((sum, item) => sum + item.cost, 0);
    const itemsHtml = byName[n].items.length === 0
      ? '<p style="margin: 6px 0 0 0; opacity: 0.8;">No utilized items.</p>'
      : `<ul style="margin: 6px 0 0 0; padding-left: 20px;">
           ${byName[n].items.map((it) =>
             `<li style="${it.cost < 0 ? 'color: green;' : 'color: red;'} margin-bottom: 4px;">
                ${it.label} — ${formatMoney(it.cost)}
              </li>`
           ).join('')}
         </ul>`;
    return `<div style="page-break-inside: avoid; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
              <strong style="display: block; margin-bottom: 8px; font-size: 16px;">
                ${n} - Total : ${formatMoney(total)}
              </strong>
              ${itemsHtml}
            </div>`;
  }).join('');

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Utilized Items by Person</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
        main { display: flex; flex-direction: row; flex-wrap: wrap; justify-content: space-around; }
        h3 { color: #333; border-bottom: 2px solid #2563eb; padding-bottom: 8px; margin-bottom: 16px; }
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <h3>Utilized Items by Person <a href="${window.location.href}" style="float: right; text-decoration: none;">❌</a></h3>
      <main>
      ${content}
      </main>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

// Set Data Popup
function setDataPopUp() {
  document.getElementById('setDataPopup').style.display = 'flex';
}

function closePopup() {
  document.getElementById('setDataPopup').style.display = 'none';
  document.getElementById('jsonInput').value = '';
}

function handleJsonSubmit() {
  const jsonInput = document.getElementById('jsonInput');
  try {
    const data = JSON.parse(jsonInput.value);
    names = data.names || [];
    items = (data.items || []).map(item => ({
      ...item,
      utilizedBy: item.utilizedBy || []
    }));
    saveData();
    dataLoaded = false;
    loadData();
    closePopup();
  } catch (error) {
    alert("Invalid JSON format. Please check your input.");
    console.error("JSON parse error:", error);
  }
}

// Calculation logic
function calculateBalances(names, items) {
  const paid = {};
  const owes = {};
  const net = {};

  names.forEach(n => {
    paid[n] = 0;
    owes[n] = 0;
    net[n] = 0;
  });

  for (const it of items) {
    if (!it.payerName || !isFinite(it.cost) || it.cost <= 0) continue;
    const users = it.utilizedBy.filter(u => names.includes(u));
    if (users.length === 0) continue;

    const share = it.cost / users.length;

    paid[it.payerName] += it.cost;
    users.forEach(u => owes[u] += share);
  }

  names.forEach(n => net[n] = round2(owes[n] - paid[n]));

  const settlements = settleNetBalances(net);

  return { names, paid, owes, net, settlements };
}

function settleNetBalances(net) {
  const debtors = [];
  const creditors = [];
  for (const [name, amt] of Object.entries(net)) {
    if (amt < -0.004) debtors.push({ name, amount: -amt });
    else if (amt > 0.004) creditors.push({ name, amount: amt });
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

function round2(n) {
  return Math.round(n * 100) / 100;
}

function formatMoney(n) {
  if (!isFinite(n)) return "-";
  return n.toLocaleString(undefined, { style: "currency", currency: "HKD", minimumFractionDigits: 2 });
}

function cryptoRandomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}

// Expose functions to global scope
window.clearData = clearData;
window.setDataPopUp = setDataPopUp;
window.closePopup = closePopup;
window.handleJsonSubmit = handleJsonSubmit;
window.setStep = setStep;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.addName = addName;
window.updateName = updateName;
window.removeName = removeName;
window.addItem = addItem;
window.updateItem = updateItem;
window.removeItem = removeItem;
window.toggleUtil = toggleUtil;
window.exportToPDF = exportToPDF;
