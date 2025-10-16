import React, { useEffect, useState } from "react";

// Words Spelling Page
export default function WordsSpelling() {
  // State for word list
  const [wordList, setWordList] = useState([]);
  // State for current word in practice
  const [currentWord, setCurrentWord] = useState("");
  // State for shuffled letters
  const [shuffledLetters, setShuffledLetters] = useState([]);
  // State for available letters (not yet used)
  const [availableLetters, setAvailableLetters] = useState([]);
  // State for user input (built from clicked letters)
  const [userInput, setUserInput] = useState("");
  // State for practice status
  const [isCorrect, setIsCorrect] = useState(null);
  // State for practice progress
  const [practiceCount, setPracticeCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  // State for text area input
  const [textInput, setTextInput] = useState("");
  // State to track if practice is active (to hide word list)
  const [isPracticeActive, setIsPracticeActive] = useState(false);
  // State to track initial loading to prevent saving during initial load
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  // State to track used words to avoid repeating correct answers
  const [usedWords, setUsedWords] = useState([]);

  // Load word list from localStorage on component mount (only to part 1)
  useEffect(() => {
    const savedWordList = localStorage.getItem('wordsSpellingData');
    console.log('Loading from localStorage:', savedWordList); // Debug log
    if (savedWordList) {
      try {
        const data = JSON.parse(savedWordList);
        console.log('Parsed data:', data); // Debug log
        // First set the text input from saved data or reconstruct from word list
        setTextInput(data.textInput || (data.wordList ? data.wordList.join('\n') : ""));
        // Then set the word list
        setWordList(data.wordList || []);
        // Load progress stats
        setPracticeCount(data.practiceCount || 0);
        setCorrectCount(data.correctCount || 0);
        // Reset practice states to ensure we only load to part 1
        setCurrentWord("");
        setShuffledLetters([]);
        setAvailableLetters([]);
        setUserInput("");
        setIsCorrect(null);
        setIsPracticeActive(false);
      } catch (error) {
        console.error('Error loading saved word list:', error);
      }
    }
    // Mark initial load as complete after a short delay
    setTimeout(() => {
      setIsInitialLoad(false);
    }, 100);
  }, []);

  // Save word list to localStorage whenever it changes
  useEffect(() => {
    // Don't save during initial load to prevent overwriting
    if (isInitialLoad) {
      return;
    }
    
    const dataToSave = {
      wordList: wordList,
      textInput: textInput,
      practiceCount: practiceCount,
      correctCount: correctCount
    };
    localStorage.setItem('wordsSpellingData', JSON.stringify(dataToSave));
  }, [wordList, textInput, practiceCount, correctCount, isInitialLoad]);

  // Function to shuffle letters using Fisher-Yates algorithm
  const shuffleLetters = (word) => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters;
  };

  // Function to speak the word using TTS
  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-UK';
      utterance.rate = 0.5;
      speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  };

  // Function to speak the word slowly using TTS with auto-detection
  const speakWordSlow = (word) => {
    if ('speechSynthesis' in window) {
      // Check if the word contains spaces (multiple words)
      if (word.includes(' ')) {
        // It's a sentence - speak with pauses between words
        const words = word.split(/\s+/);
        
        // Speak each word with a pause
        words.forEach((singleWord, index) => {
          setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(singleWord);
            utterance.lang = 'en-UK';
            utterance.rate = 0.5;
            speechSynthesis.speak(utterance);
          }, index * 1000); // 1 second pause between words
        });
      } else {
        // It's a single word - speak slowly
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-UK';
        utterance.rate = 0.3;
        speechSynthesis.speak(utterance);
      }
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  };

  // Function to get a random word that hasn't been used recently
  const getRandomWord = () => {
    if (wordList.length === 0) return null;
    
    // Filter out words that have been used recently
    const availableWords = wordList.filter(word => !usedWords.includes(word));
    
    // If no available words, return null to show part 1
    if (availableWords.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const word = availableWords[randomIndex];
    
    // Add the word to used words list
    setUsedWords(prev => [...prev, word]);
    
    return word;
  };

  // Function to start practice with a random word
  const startPractice = () => {
    if (wordList.length === 0) {
      alert('Please add some words to the list first.');
      return;
    }

    const word = getRandomWord();
    if (!word) {
      // If no available words, show part 1 (word list)
      setIsPracticeActive(false);
      return;
    }

    setCurrentWord(word);
    const shuffled = shuffleLetters(word);
    setShuffledLetters(shuffled);
    setAvailableLetters([...shuffled]); // Initialize available letters
    setUserInput("");
    setIsCorrect(null);
    setPracticeCount(prev => prev + 1);
    setIsPracticeActive(true); // Hide word list

    // Speak the word after a short delay
    setTimeout(() => {
      speakWord(word);
    }, 500);
  };

  // Function to handle letter click
  const handleLetterClick = (letter, index) => {
    // Add letter to user input
    const newUserInput = userInput + letter;
    setUserInput(newUserInput);
    
    // Remove the clicked letter from available letters
    const newAvailableLetters = [...availableLetters];
    newAvailableLetters.splice(index, 1);
    setAvailableLetters(newAvailableLetters);

    // Auto-submit when all letters are used AND user input length matches current word length
    if (newAvailableLetters.length === 0 && newUserInput.length === currentWord.length) {
      setTimeout(() => {
        checkSpelling(newUserInput);
      }, 100);
    }
  };

  // Function to reset practice and show word list again
  const resetPractice = () => {
    setCurrentWord("");
    setShuffledLetters([]);
    setAvailableLetters([]);
    setUserInput("");
    setIsCorrect(null);
    setIsPracticeActive(false); // Show word list again
    setUsedWords([]); // Reset used words when returning to word list
  };

  // Function to check user's spelling
  const checkSpelling = (inputToCheck = userInput) => {
    if (inputToCheck.trim().toLowerCase() === currentWord.toLowerCase()) {
      setIsCorrect(true);
      setCorrectCount(prev => prev + 1);
      
      // Auto generate new question when correct
      setTimeout(() => {
        startPractice();
      }, 1500); // 1.5 second delay before next word
    } else {
      setIsCorrect(false);
      
      // Auto reset letters when wrong
      setTimeout(() => {
        setUserInput("");
        setAvailableLetters([...shuffledLetters]);
      }, 1000); // 1 second delay before reset
    }
  };

  // Function to handle text area input and update word list
  const handleTextInputChange = (e) => {
    const text = e.target.value;
    setTextInput(text);
    
    // Update word list by splitting text by new lines and filtering empty strings
    const words = text.split('\n')
      .map(word => word.trim())
      .filter(word => word.length > 0);
    
    setWordList(words);
  };

  // Function to clear all data
  const clearData = () => {
    setWordList([]);
    setTextInput("");
    setCurrentWord("");
    setShuffledLetters([]);
    setUserInput("");
    setIsCorrect(null);
    setPracticeCount(0);
    setCorrectCount(0);
    setUsedWords([]); // Reset used words when clearing data
    localStorage.removeItem('wordsSpellingData');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>Words Spelling Practice</h1>
      
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button style={styles.btn} onClick={clearData}>
          Clear All Data
        </button>
        <span style={{ fontSize: 12, opacity: 0.7, alignSelf: 'center' }}>
          Data is automatically saved to browser storage
        </span>
      </div>

      <div style={styles.twoColumnLayout}>
        {/* Left Column - Word List Management (hidden during practice) */}
        {!isPracticeActive && (
          <div style={styles.column}>
            <section style={styles.card}>
              <h2 style={styles.h2}>1) Word List</h2>
              <p style={styles.description}>
                Enter your words below (one word per line):
              </p>
              <textarea
                value={textInput}
                onChange={handleTextInputChange}
                placeholder="apple
banana
computer
elephant
..."
                style={styles.textarea}
                rows={12}
              />
              <div style={styles.stats}>
                <span style={styles.small}>
                  {wordList.length} words in list
                </span>
              </div>
            </section>
          </div>
        )}

        {/* Right Column - Spelling Practice (expands during practice) */}
        <div style={{
          ...styles.column,
          gridColumn: isPracticeActive ? '1 / -1' : 'auto'
        }}>
          <section style={styles.card}>
            <h2 style={styles.h2}>2) Spelling Practice</h2>
            
            {currentWord ? (
              <div style={styles.practiceArea}>
                <div style={styles.wordInfo}>
                  <h3 style={styles.h3}>Listen and Spell:</h3>
                  <div style={styles.actions}>
                    <button 
                      style={styles.btnPrimary} 
                      onClick={() => speakWord(currentWord)}
                    >
                      🔊 Play Again
                    </button>
                    <button 
                      style={styles.btnSlow} 
                      onClick={() => speakWordSlow(currentWord)}
                    >
                      🐌 慢速播放
                    </button>
                    <button 
                      style={styles.btn} 
                      onClick={startPractice}
                    >
                      🔄 Next Word
                    </button>
                    <button 
                      style={styles.btn} 
                      onClick={resetPractice}
                    >
                      ← Back to Word List
                    </button>
                  </div>
                </div>

                <div style={styles.shuffledLetters}>
                  <p style={styles.label}>Available Letters (Click to use):</p>
                  <div style={styles.lettersContainer}>
                    {availableLetters.map((letter, index) => (
                      <button
                        key={index}
                        onClick={() => handleLetterClick(letter, index)}
                        style={styles.clickableLetter}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={styles.inputSection}>
                  <label style={styles.label}>
                    Your spelling:
                  </label>
                  <div style={styles.userInputDisplay}>
                    {userInput || <span style={styles.placeholder}>Click letters above to spell the word</span>}
                  </div>
                  
                  {isCorrect !== null && (
                    <div style={styles.feedback}>
                      {isCorrect ? (
                        <span style={styles.correct}>✓ Correct! Well done!</span>
                      ) : (
                        <span style={styles.wrong}>✗ Incorrect.</span>
                      )}
                    </div>
                  )}

                  <div style={styles.actionButtons}>
                    <button 
                      style={styles.btnPrimary} 
                      onClick={checkSpelling}
                      disabled={!userInput.trim() || userInput.length !== currentWord.length}
                    >
                      Check Spelling
                    </button>
                    <button 
                      style={styles.btn} 
                      onClick={() => {
                        setUserInput("");
                        setAvailableLetters([...shuffledLetters]);
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={styles.startPractice}>
                <p style={styles.description}>
                  Ready to practice spelling? Click the button below to start with a random word from your list.
                </p>
                <button 
                  style={styles.btnPrimary} 
                  onClick={startPractice}
                  disabled={wordList.length === 0}
                >
                  Start Practice
                </button>
                {wordList.length === 0 && (
                  <p style={styles.warning}>
                    Please add some words to the list first.
                  </p>
                )}
              </div>
            )}

            {/* Progress Stats */}
            <div style={styles.progress}>
              <h3 style={styles.h3}>Progress</h3>
              <div style={styles.statsGrid}>
                <div style={styles.stat}>
                  <span style={styles.statNumber}>{practiceCount}</span>
                  <span style={styles.statLabel}>Words Practiced</span>
                </div>
                <div style={styles.stat}>
                  <span style={styles.statNumber}>{correctCount}</span>
                  <span style={styles.statLabel}>Correct Answers</span>
                </div>
                <div style={styles.stat}>
                  <span style={styles.statNumber}>
                    {practiceCount > 0 ? Math.round((correctCount / practiceCount) * 100) : 0}%
                  </span>
                  <span style={styles.statLabel}>Accuracy</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// Styles (following the existing design pattern)
const styles = {
  container: {
    margin: "20px auto",
    padding: 16,
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    maxWidth: "1200px",
  },
  h1: { 
    margin: "0 0 12px",
    fontSize: "clamp(28px, 4vw, 36px)",
  },
  h2: { 
    margin: "0 0 12px",
    fontSize: "clamp(20px, 3vw, 24px)",
  },
  h3: { 
    margin: "12px 0 8px",
    fontSize: "16px",
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 20,
    background: "var(--bg)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    height: "fit-content",
  },
  twoColumnLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    alignItems: "start",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  description: {
    margin: "0 0 12px",
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: "1.4",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    border: "1px solid var(--text)",
    borderRadius: 6,
    fontSize: "14px",
    fontFamily: "monospace",
    resize: "vertical",
    outline: "none",
    minHeight: "200px",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid var(--text)",
    borderRadius: 6,
    fontSize: "16px",
    outline: "none",
    marginBottom: "12px",
  },
  inputCorrect: {
    borderColor: "#10b981",
    backgroundColor: "#ecfdf5",
  },
  inputWrong: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  btn: {
    padding: "10px 16px",
    border: "1px solid var(--text)",
    borderRadius: 6,
    background: "var(--bg)",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s",
  },
  btnPrimary: {
    padding: "10px 16px",
    border: "1px solid #2563eb",
    borderRadius: 6,
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s",
  },
  btnSlow: {
    padding: "10px 16px",
    border: "1px solid #059669",
    borderRadius: 6,
    background: "#059669",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s",
  },
  practiceArea: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  wordInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px",
  },
  actions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  shuffledLetters: {
    textAlign: "center",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: "500",
  },
  lettersContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  letter: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    border: "2px solid #2563eb",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: "bold",
    background: "#dbeafe",
    color: "#1e40af",
  },
  clickableLetter: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    border: "2px solid #2563eb",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: "bold",
    background: "#dbeafe",
    color: "#1e40af",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  userInputDisplay: {
    padding: "12px",
    border: "1px solid var(--text)",
    borderRadius: "6px",
    fontSize: "16px",
    minHeight: "44px",
    background: "#f9fafb",
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
  },
  placeholder: {
    color: "#9ca3af",
    fontStyle: "italic",
  },
  actionButtons: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  inputSection: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  feedback: {
    padding: "8px 12px",
    borderRadius: "6px",
    fontSize: "14px",
  },
  correct: {
    color: "#065f46",
    backgroundColor: "#d1fae5",
  },
  wrong: {
    color: "#991b1b",
    backgroundColor: "#fee2e2",
  },
  startPractice: {
    textAlign: "center",
    padding: "20px 0",
  },
  warning: {
    color: "#ef4444",
    fontSize: "14px",
    marginTop: "8px",
  },
  progress: {
    marginTop: "20px",
    paddingTop: "16px",
    borderTop: "1px solid var(--bg)",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
  },
  stat: {
    textAlign: "center",
    padding: "12px",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    background: "#f9fafb",
  },
  statNumber: {
    display: "block",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#2563eb",
  },
  statLabel: {
    display: "block",
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "4px",
  },
  stats: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "8px",
  },
  small: {
    fontSize: "12px",
    color: "#6b7280",
  },
};

// Responsive design for mobile
const mobileStyles = `
  @media (max-width: 768px) {
    .twoColumnLayout {
      grid-template-columns: 1fr;
    }
    .lettersContainer {
      gap: 6px;
    }
    .letter {
      width: 35px;
      height: 35px;
      font-size: 16px;
    }
    .statsGrid {
      grid-template-columns: 1fr;
    }
  }
`;

// Add responsive styles to document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = mobileStyles;
  document.head.appendChild(style);
}
