## IndiaFin Pulse – Mock Situational Awareness UI

A small, static, Dataminr-style dashboard for **Indian financial institutions** (e.g. HDFC Bank, SBI, AU Small Finance Bank, Ujjivan SFB).  
It uses **mock scores and signals** from sources like Twitter/social, national & regional news, court cases, and exchange filings.

### What you get

- **Institution list** (left sidebar): risk score, 7d delta, type and region.
- **Filters**:
  - **Signal type**: News, Social, Legal, Filings.
  - **Importance**: Critical / High / Medium / Low.
  - **Time window**: 1 hour to 7 days (mocked via offsets).
- **Main view**:
  - Aggregate **risk score**, **high‑priority item count**, and **short‑term vs structural** split.
  - **Signal feed** with:
    - Source (news, social, court/legal, filings),
    - Importance and sentiment chips,
    - Tags and signal score,
    - Time‑ago and source name.
- **Side panels**:
  - Breakdown by **source type**.
  - Breakdown by **short‑term vs structural** items.
- **Manual refresh**:
  - `Refresh now` simulates a polling cycle, lightly perturbing risk scores and updating the timestamp.

### Project structure

- `index.html` – Shell layout and containers.
- `styles.css` – Modern, dark, dashboard‑style design.
- `mock-data.js` – Mock institutions + signals (news, social, legal, filings).
- `app.js` – All front‑end logic, filters, and rendering.
- `package.json` – Optional helper scripts to serve the static files.

### How to run it

From the project directory:

#### Option 1 – Simple Python static server (no Node required)

```bash
cd "/Users/harikrishna/dit use case ui"
python3 -m http.server 4173
```

Then open `http://localhost:4173/` in your browser.

#### Option 2 – Using the Node helper script

Requires Node.js installed.

```bash
cd "/Users/harikrishna/dit use case ui"
npm install serve --save-dev
npm run start
```

Then open `http://localhost:4173/` in your browser.

### Notes

- All data is **purely synthetic** and for demo purposes only.
- Update cadences (hourly for news/social vs periodic filings/legal) are mimicked via timestamps and the manual refresh button.
- You can extend `mock-data.js` to plug in your own signals or wire `app.js` to a real backend later.

