# 7VEN CLUB // LN4 MOTORSPORT EDITION

> **Sovereign Esports & Entertainment Portal** — Re-imagining [7ven.club](https://7ven.club) in the high-velocity, precision aesthetic of [Lando Norris's Official Website](https://landonorris.com) by OFF+BRAND.

---

## ⚡ Overview

This project scrapes the core identity, roster, tournament data, and philosophy of **Club 7VEN** and reconstructs it from the ground up utilizing the visual and interactive design language of Formula 1 driver **Lando Norris (LN4)**.

### Key Aesthetic Pillars:
- **High-Impact Condensed Typography**: Massive display scale, tight kerning, and aggressive tracking inspired by motorsport telemetry and podium liveries.
- **Electric Neon Lime Palette**: Signature `#D2FF00` accenting against ultra-dark obsidian carbon (`#0C0E0A`) and deep racing olive (`#202617`).
- **Tactile Micro-Interactions**: Button text-rolling animations (`.btn-roll-text`), interactive 3D perspective tilt on equipment cards, and Web Audio API synthesizer clicks.
- **Dual-Stage Switcher**: Interactive pill toggle between **ON STAGE** (championship tournament brackets, match pursing, team statistics) and **OFF STAGE** (streetwear apparel drops, athlete crossovers, lifestyle lounge).

---

## 🏆 Scraped & Integrated Content from 7ven.club

- **Team Accolades**: FNCS Champions, MLB World Series Winners, NFL Pros, and film icons.
- **Roster & Career Earnings**:
  - `7VEN Avivv` ($226,860 Career Earnings)
  - `7VEN GMONEY` ($57,550 Career Earnings)
  - `7VEN CRINGE` ($86,565 Career Earnings)
  - `7VEN SEVEN` ($13,990 Career Earnings)
  - `7VEN Tyler Zuber` (MLB Pitcher / 7VEN Athlete)
  - `7VEN Blake Sciortino` (Film & Creative Lead)
  - `7VEN CECE` (Twitch Partner • Zero Build Champion • 60K+ TikTok)
  - Full leadership team (7VEN Jeff, 7VEN 60k60, 7VEN EMO, 7VEN CECXI, 7VEN ANXIOUS, 7VEN MORPH3US).
- **Divisions**: Competitive Fortnite, VALORANT Stars, Rainbow Six Siege, Pokémon Unite, and Creators.

---

## 🗂️ Project Structure

```
7ven-club/
├── index.html              # Core semantic HTML5 application
├── css/
│   ├── variables.css       # LN4 color system, fluid clamps, timing curves
│   ├── main.css            # Base resets, typography scale, buttons, overlays
│   └── components.css      # Nav, Hero, Vault, Roster, Fixtures, Store, Cart, Footer
├── js/
│   └── main.js             # Web Audio SFX, dual-stage switcher, filters, cart logic
└── assets/
    └── images/             # Scraped 7VEN logos + bespoke 3D gear renders
```

---

## 🚀 Running Locally

You can serve this project with any static file server:

### Option 1: Node.js
```bash
npx serve .
# or
node -e "require('http').createServer((req,res)=>{let p=require('path').join(__dirname,req.url=='/'?'index.html':req.url.split('?')[0]);if(!require('fs').existsSync(p)){res.writeHead(404);return res.end('Not Found');}require('fs').createReadStream(p).pipe(res);}).listen(4477,()=>console.log('Running on http://localhost:4477'));"
```

### Option 2: Python
```bash
python -m http.server 4477
```

Visit `http://localhost:4477` in your browser.

---

## 📄 License

MIT License. Designed for demonstration and aesthetic comparison.
