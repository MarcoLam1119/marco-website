# Frontend Rewrite Progress

This document tracks the progress of rewriting the React frontend to a vanilla HTML/JS/CSS frontend. Each page is being rewritten one by one, based on the existing React pages in `frontend/src/pages/`.

## Pages to Rewrite

- [x] Landing Page (`frontend/src/pages/Landing.jsx` -> `vanilla-frontend/index.html`)
- [x] About Page (`frontend/src/pages/About.jsx` -> `vanilla-frontend/about.html`)
- [x] Calendar Page (`frontend/src/pages/Calendar.jsx` -> `vanilla-frontend/calendar.html`)
- [x] Creator Panel (`frontend/src/pages/CreatorPanel.jsx` -> `vanilla-frontend/creator-panel.html`)
- [x] Payment Calculator (`frontend/src/pages/PaymentCalculator.jsx` -> `vanilla-frontend/payment-calculator.html`)
- [x] Photo Library (`frontend/src/pages/PhotoLibrary.jsx` -> `vanilla-frontend/photo-library.html`)
- [x] Tools Page (`frontend/src/pages/Tools.jsx` -> `vanilla-frontend/tools.html`)
- [x] Words Spelling (`frontend/src/pages/WordsSpelling.jsx` -> `vanilla-frontend/words-spelling.html`)

## Shared Components

- [x] Header Component (`frontend/src/components/Header.jsx` -> included in index.html)
- [x] Footer Component (`frontend/src/components/Footer.jsx` -> included in index.html)
- [ ] Social Icons (`frontend/src/components/SocialIcon.jsx` -> included as needed)
- [ ] Other shared components (Timeline, Filedropzone, etc. - integrated as vanilla equivalents)

## Assets and Styles

- [x] CSS Styles (port from SCSS, create global and page-specific stylesheets)
- [x] JavaScript (implement vanilla JS equivalents for React functionality)
- [x] Assets (copy and adapt icons, images from `frontend/src/assets/`)

## General Setup

- [x] Created PROGRESS.md for tracking
- [x] Set up basic vanilla-frontend structure (directories, base HTML template, etc.)
