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
- **Roster & Career Earnings**: 41 verified athletes, creators, and leaders including:
  - `7VEN Avivv` ($226,860 Career Earnings)
  - `7VEN GMONEY` ($57,550 Career Earnings)
  - `7VEN CRINGE` ($86,565 Career Earnings)
  - `7VEN SEVEN` ($13,990 Career Earnings)
  - `7VEN Tyler Zuber` (MLB Pitcher / 7VEN Athlete)
  - `7VEN Blake Sciortino` (Film & Creative Lead)
  - `7VEN CECE` (Twitch Partner • Zero Build Champion • 60K+ TikTok)
  - `7VEN Thorik` (FNCS Global Finalist & LAN Champion)
  - `7VEN Sxhool` (FNCS Major 2 NA Champion • $54,400 Earnings)
  - Full leadership team (7VEN Jeff, 7VEN 60k60, 7VEN EMO, 7VEN CECXI, 7VEN ANXIOUS, 7VEN MORPH3US).
- **Divisions**: Competitive Fortnite, VALORANT Stars, Rainbow Six Siege, Athletes & Sports, and Creators.

---

## 🗂️ Project Structure

```
7ven-club/
├── index.html              # Main landing page with LN4 hero, vault, drop store, and roster preview
├── athletes.html           # Dedicated Athletes & Players page with LN4 fan-out card deck & dossier modal
├── css/
│   ├── variables.css       # LN4 color system, fluid clamps, timing curves
│   ├── main.css            # Base resets, typography scale, buttons, overlays
│   ├── components.css      # Nav, Hero, Vault, Roster preview, Fixtures, Store, Cart, Footer
│   └── athletes.css        # Fan-out arc deck, squircle cards, expansion, and dossier modal styles
├── js/
│   ├── main.js             # Web Audio SFX, dual-stage switcher, filters, cart logic
│   └── athletes.js         # Fan-out deck hover pusher, directory filter, search, dossier modal
└── assets/
    ├── roster_data.json    # Complete 41-member verified structured database
    └── images/
        ├── roster/         # 41 verified high-resolution portraits for each athlete
        └── ...             # Brand assets, merch gear, and UI iconography
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
