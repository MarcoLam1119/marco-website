// Set footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Keys for localStorage
const KEYS = {
  PHOTOS: 'photos',
  NOTES: 'notes',
  CREATER: 'creater',
  THEME: 'theme'
};

// Theme toggle
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.dataset.theme;
  const newTheme = currentTheme === 'light' ? '' : 'light';
  html.dataset.theme = newTheme;
  localStorage.setItem(KEYS.THEME, newTheme);
}

// Initialize theme from localStorage
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem(KEYS.THEME);
  if (savedTheme) {
    document.documentElement.dataset.theme = savedTheme;
  }

  // Hamburger menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navlinks = document.getElementById('navlinks');
  hamburger?.addEventListener('click', () => {
    navlinks.classList.toggle('open');
  });

  // Notes char count
  const notesCount = document.querySelector('.kpi');
  if (notesCount) {
    const storedNotes = localStorage.getItem(KEYS.NOTES) || '';
    notesCount.textContent = storedNotes.length;
  }

  // Tools functionality
  initTools();
});

function initTools() {
  // Notes tool - autosave implementation
  const notes = document.getElementById('notesArea');
  if (notes) {
    // Load saved notes
    notes.value = localStorage.getItem(KEYS.NOTES) || '';

    // Initialize char count
    updateNotesCount();

    // Autosave with debounce
    let timeoutId;
    const debouncedSave = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        saveNotes();
      }, 200);
    };

    notes.addEventListener('input', () => {
      updateNotesCount();
      debouncedSave();
    });
  }
}

function updateNotesCount() {
  const notes = document.getElementById('notesArea');
  const notesCount = document.getElementById('notesCount');
  if (notes && notesCount) {
    notesCount.textContent = notes.value.length + ' chars';
  }
}

// Tools functions
function saveNotes() {
  const notes = document.getElementById('notesArea') || document.getElementById('notes');
  if (notes) {
    localStorage.setItem(KEYS.NOTES, notes.value);
    // Update global count if on landing
    const globalCount = document.querySelector('.kpi');
    if (globalCount) {
      globalCount.textContent = notes.value.length;
    }
  }
}

function autoSaveNotes() {
  // Alias for saveNotes for HTML backward compatibility
  saveNotes();
  updateNotesCount();
}

function updateLen() {
  const slider = document.getElementById('passLen');
  const label = document.getElementById('passLenLabel');
  label.textContent = slider.value;
  generatePassword();
}

function generatePassword() {
  const lengthSlider = document.getElementById('passLen');
  const output = document.getElementById('generatedPass');
  const upperCheckbox = document.getElementById('incUpper');
  const lowerCheckbox = document.getElementById('incLower');
  const numsCheckbox = document.getElementById('incNums');
  const symsCheckbox = document.getElementById('incSyms');

  const length = parseInt(lengthSlider.value) || 16;
  const sets = [];
  if (upperCheckbox.checked) sets.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  if (lowerCheckbox.checked) sets.push("abcdefghijklmnopqrstuvwxyz");
  if (numsCheckbox.checked) sets.push("0123456789");
  if (symsCheckbox.checked) sets.push("!@#$%^&*()-_=+[]{};:,.<>?");
  if (sets.length === 0) {
    output.value = "";
    return;
  }
  const all = sets.join("");
  // Simple randomization for now
  const arr = new Uint8Array(length);
  for (let i = 0; i < length; i++) arr[i] = Math.floor(Math.random() * 256);
  // Ensure at least one from each set
  let out = "";
  for (let i = 0; i < sets.length; i++) {
    out += sets[i][arr[i] % sets[i].length];
  }
  for (let i = sets.length; i < length; i++) {
    out += all[arr[i] % all.length];
  }
  // Shuffle
  const a = out.split("");
  for (let i = a.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * i);
    [a[i], a[r]] = [a[r], a[i]];
  }
  output.value = a.join("");
}

async function copyPassword() {
  const output = document.getElementById('generatedPass');
  const copyBtn = document.getElementById('copyPass');
  if (output && output.value) {
    try {
      await navigator.clipboard.writeText(output.value);
      copyBtn.classList.add('show');
      setTimeout(() => copyBtn.classList.remove('show'), 600);
    } catch {
      alert('Failed to copy');
    }
  }
}

let currentExchangeRate = null;
let currencyLoading = false;

async function convertCurrency() {
  const amountInput = document.getElementById('currencyAmount');
  const fromSelect = document.getElementById('fromCurrency');
  const toSelect = document.getElementById('toCurrency');
  const convertedInput = document.getElementById('convertedAmount');
  const rateDisplay = document.getElementById('exchangeRate');
  const errorDisplay = document.getElementById('currencyError');

  const amount = parseFloat(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (!from || !to || isNaN(amount)) {
    convertedInput.value = '';
    rateDisplay.textContent = '';
    return;
  }

  if (from === to) {
    convertedInput.value = amount.toFixed(2);
    rateDisplay.textContent = 'Exchange Rate: 1 ' + from + ' = 1.0000 ' + to;
    return;
  }

  errorDisplay.textContent = '';
  convertedInput.value = 'Loading...';

  if (currencyLoading) return;

  currencyLoading = true;

  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
    if (!response.ok) throw new Error('Failed to fetch rates');
    const data = await response.json();
    const rate = data.rates[to];
    if (!rate) throw new Error('Rate not available');
    currentExchangeRate = rate;
    const converted = amount * rate;
    convertedInput.value = converted.toFixed(2);
    rateDisplay.textContent = `Exchange Rate: 1 ${from} = ${rate.toFixed(4)} ${to}`;
  } catch (err) {
    errorDisplay.textContent = err.message;
    convertedInput.value = '';
    rateDisplay.textContent = '';
  } finally {
    currencyLoading = false;
  }
}

function swapCurrencies() {
  const fromSelect = document.getElementById('fromCurrency');
  const toSelect = document.getElementById('toCurrency');
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;
  convertCurrency();
}
