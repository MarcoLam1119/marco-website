// Words Spelling JS
let wordList = ['apple', 'banana', 'computer', 'elephant'];
let practiceWords = [];
let currentWord = '';
let practiceCount = 0;
let correctCount = 0;
let shuffledLetters = [];
let availableLetters = [];
let userInput = '';
let usedWords = [];
let textInput = '';
let isPracticeActive = false;

document.addEventListener('DOMContentLoaded', () => {
  loadWordsData();
  updateWordCount();
  updateProgress();
});

function loadWordsData() {
  const savedData = localStorage.getItem('wordsSpellingData');
  if (savedData) {
    const data = JSON.parse(savedData);
    wordList = data.wordList || ['apple', 'banana', 'computer', 'elephant'];
    textInput = data.textInput || wordList.join('\n');
    practiceCount = data.practiceCount || 0;
    correctCount = data.correctCount || 0;
    usedWords = data.usedWords || [];
  }
  document.getElementById('wordText').value = textInput;
  updateProgress();
  practiceWords = [...wordList];
  updateWordCount();
}

function saveWordsData() {
  const data = {
    wordList: wordList,
    textInput: textInput,
    practiceCount,
    correctCount,
    usedWords
  };
  localStorage.setItem('wordsSpellingData', JSON.stringify(data));
}

function updateWordCount() {
  const text = document.getElementById('wordText').value;
  textInput = text;
  wordList = text.split('\n').map(w => w.trim()).filter(w => w.length > 0);
  document.getElementById('wordCount').textContent = `${wordList.length} words in list`;
  saveWordsData();
  toggleStartButton();
}

function clearWordsData() {
  localStorage.removeItem('wordsSpellingData');
  wordList = ['apple', 'banana', 'computer', 'elephant'];
  textInput = wordList.join('\n');
  practiceCount = 0;
  correctCount = 0;
  usedWords = [];
  isPracticeActive = false;
  document.getElementById('wordText').value = textInput;
  updateWordCount();
  updateProgress();
  resetPractices();
}

function toggleStartButton() {
  const btn = document.getElementById('start-practice-btn');
  const warning = document.getElementById('empty-list-warning');
  if (wordList.length === 0) {
    btn.disabled = true;
    warning.style.display = 'block';
  } else {
    btn.disabled = false;
    warning.style.display = 'none';
  }
}

function resetPractices() {
  const layout = document.getElementById('main-layout');
  layout.classList.remove('practice-mode');
  document.getElementById('start-practice-area').style.display = 'block';
  document.getElementById('practice-area').style.display = 'none';
}

// Fisher-Yates shuffle
function shuffleLetters(word) {
  const letters = word.split('');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters;
}

function getRandomWord() {
  if (wordList.length === 0) return null;

  // Filter out words that have been used recently
  const availableWords = wordList;

  // If no available words, show part 1 (word list)
  if (availableWords.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableWords.length);
  const word = availableWords[randomIndex];

  // Add the word to used words list
  usedWords.push(word);

  return word;
}

function startPractice() {
  if (wordList.length === 0) {
    alert('Please add some words to the list first.');
    return;
  }

  const word = getRandomWord();
  if (!word) {
    // If no available words, show part 1 (word list)
    resetPractices();
    return;
  }

  currentWord = word;
  shuffledLetters = shuffleLetters(word);
  availableLetters = [...shuffledLetters];
  userInput = '';
  practiceCount++;
  isPracticeActive = true;

  // Update UI
  const layout = document.getElementById('main-layout');
  layout.classList.add('practice-mode');
  document.getElementById('start-practice-area').style.display = 'none';
  document.getElementById('practice-area').style.display = 'block';

  updateLettersDisplay();
  updateUserInputDisplay();
  updateFeedback();
  updateCheckButton();
  updateProgress();

  // Auto speak after delay
  setTimeout(() => {
    speakWord(currentWord);
  }, 500);
}

function nextWord() {
  const word = getRandomWord();
  if (!word) {
    // If no available words, return to word list
    resetPractices();
    return;
  }

  currentWord = word;
  shuffledLetters = shuffleLetters(word);
  availableLetters = [...shuffledLetters];
  userInput = '';
  practiceCount++;
  isPracticeActive = true;

  updateLettersDisplay();
  updateUserInputDisplay();
  updateFeedback();
  updateCheckButton();
  updateProgress();

  // Auto speak after delay
  setTimeout(() => {
    speakWord(currentWord);
  }, 500);
}

function playWord() {
  speakWord(currentWord);
}

function speakWordSlow(word) {
  speakWordSlowHelper(currentWord);
}

function speakWordSlowHelper(word) {
  const isSentence = word.includes(' ');
  if ('speechSynthesis' in window) {
    if (isSentence) {
      const singleWords = word.split(/\s+/);
      singleWords.forEach((w, index) => {
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(w);
          utterance.lang = 'en-US';
          utterance.rate = 0.3;
          speechSynthesis.speak(utterance);
        }, index * 1000);
      });
    } else {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.3;
      speechSynthesis.speak(utterance);
    }
  } else {
    alert('Speech synthesis not supported');
  }
}

function speakWord(word) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.7;
    speechSynthesis.speak(utterance);
  } else {
    alert('Speech synthesis not supported');
  }
}

function updateLettersDisplay() {
  const container = document.getElementById('lettersContainer');
  container.innerHTML = '';
  availableLetters.forEach((letter) => {
    const button = document.createElement('button');
    button.className = 'clickable-letter';
    button.textContent = letter;
    button.onclick = () => handleLetterClick(letter);
    container.appendChild(button);
  });
}

function handleLetterClick(letter) {
  userInput += letter;
  const index = availableLetters.indexOf(letter);
  availableLetters.splice(index, 1);
  updateLettersDisplay();
  updateUserInputDisplay();

  // Auto-submit when all letters are used AND user input length matches current word length
  if (availableLetters.length === 0 && userInput.length === currentWord.length) {
    setTimeout(() => {
      checkSpelling();
    }, 100);
  }
}

function updateUserInputDisplay() {
  const display = document.getElementById('userInputDisplay');
  if (userInput.trim()) {
    display.innerHTML = userInput;
  } else {
    display.innerHTML = '<span class="placeholder">Click letters above to spell the word</span>';
  }
}

function updateFeedback(message = '', isCorrect = null) {
  const feedback = document.getElementById('feedback');
  feedback.className = 'feedback';
  feedback.style.display = 'none';

  if (message) {
    feedback.style.display = 'block';
    feedback.innerHTML = message;
    if (isCorrect === true) {
      feedback.classList.add('feedback-correct');
    } else if (isCorrect === false) {
      feedback.classList.add('feedback-wrong');
    }
  }
}

function updateCheckButton() {
  const btn = document.getElementById('check-btn');
  const canCheck = userInput.trim() && userInput.length === currentWord.length;
  btn.disabled = !canCheck;
}

function checkSpelling() {
  if (!userInput.trim() || userInput.length !== currentWord.length) {
    return;
  }

  if (userInput.toLowerCase() === currentWord.toLowerCase()) {
    correctCount++;
    updateFeedback('✓ Correct! Well done!', true);
    updateProgress();
    setTimeout(() => nextWord(), 1500);
  } else {
    updateFeedback('✗ Incorrect.', false);
    // Auto reset letters when wrong
    setTimeout(() => {
      userInput = '';
      availableLetters = [...shuffledLetters];
      updateLettersDisplay();
      updateUserInputDisplay();
      updateFeedback();
      updateCheckButton();
    }, 1000);
  }
  saveWordsData();
}

function clearInput() {
  userInput = '';
  availableLetters = [...shuffledLetters];
  updateLettersDisplay();
  updateUserInputDisplay();
  updateFeedback();
  updateCheckButton();
}

function backToManagement() {
  isPracticeActive = false;
  usedWords = []; // Reset used words when returning to word list
  resetPractices();
}

function updateProgress() {
  document.getElementById('practice-count').textContent = practiceCount;
  document.getElementById('correct-count').textContent = correctCount;
  const accuracy = practiceCount > 0 ? Math.round((correctCount / practiceCount) * 100) : 0;
  document.getElementById('accuracy').textContent = `${accuracy}%`;
}

document.getElementById('wordText').addEventListener('input', updateWordCount);

window.clearWordsData = clearWordsData;
window.startPractice = startPractice;
window.playWord = playWord;
window.speakWordSlow = speakWordSlow;
window.nextWord = nextWord;
window.backToManagement = backToManagement;
window.checkSpelling = checkSpelling;
window.clearInput = clearInput;
