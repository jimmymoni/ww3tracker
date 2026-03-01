# WAR MARKET & POLYMARKET FIXES NEEDED

## Current Issues (Screenshots: 220829.png, 220932.png)

### Issue 1: War Market Component Sizing/Layout
**Problem:** The War Market widget is collapsed or not displaying content properly. Only the header/footer shows but no stock rows.

**Files to check:**
- `src/components/SpicyMeter.jsx` - The War Market component
- `src/App.jsx` - How it's positioned in the layout (around line 327)

**Current code in App.jsx:**
```jsx
{/* ROW 3: Spicy Meter - Compact Progress Bar Style */}
<motion.section
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
  className="mb-6"
  style={{ minHeight: '350px' }}  // Added but not working
>
  <SpicyMeter 
    tension={gameState.tension} 
    usHP={gameState.usHP}
    iranHP={gameState.iranHP}
  />
</motion.section>
```

**What needs fixing:**
- Component should display 4 market rows (Oil, Gold, Defense, Iran Rial) + WW3.RISK row
- Currently shows empty/collapsed
- Check the API `/api/markets` IS working (returns data)
- Check rendering logic - stocks array might not be mapping properly

---

### Issue 2: Polymarket Widget Broken Links
**Problem:** Clicking "BET ON POLYMARKET" button goes to broken URLs that show "Oops...we didn't forecast this" error.

**File:** `src/components/PolymarketWidget.jsx`

**Current broken URLs in DEFAULT_POLYMARKET_DATA:**
- `https://polymarket.com/event/will-ww3-break-out-before-2030` ❌
- `https://polymarket.com/event/will-iran-conduct-a-nuclear-weapons-test-by-2026` ❌
- `https://polymarket.com/event/will-there-be-direct-us-iran-military-conflict-in-2025` ❌
- `https://polymarket.com/event/will-the-middle-east-war-escalate-to-regional-conflict` ❌

**These events are CLOSED/RESOLVED on Polymarket.**

**Fix options:**
1. Replace with CURRENT active Polymarket events about Iran/US
2. Just link to `https://polymarket.com` homepage (safest)
3. Search for active markets via API and use real URLs

**Current betOnPolymarket function:**
```javascript
const betOnPolymarket = () => {
  if (market?.url) {
    window.open(market.url + '?r=thestandoff', '_blank');
  } else {
    window.open('https://polymarket.com', '_blank');
  }
};
```

---

### Issue 3: War Market Data Display
**Expected display:**
```
📉 WAR MARKET ● LIVE

OIL.WAR        $75.42    ▲ +1.23%  (red)
SAFE.HAVEN     $2,350.00 ▲ +0.50%  (yellow)
WAR.STOCKS     $450.20   ▲ +2.10%  (red)
USD/IRR        42K IRR   ▼ LIVE    (red)
WW3.RISK       37%       ▼         (green/red based on value)

🔄 Updated 22:08          Real market data
```

**API is working:** `GET /api/markets` returns:
```json
{
  "stocks": [
    {"label": "OIL.WAR", "price": "$75.42", "change": "+1.23%", "direction": "up", "meaning": "bad"},
    {"label": "SAFE.HAVEN", "price": "$2,350.00", "change": "+0.50%", "direction": "up", "meaning": "warning"},
    {"label": "WAR.STOCKS", "price": "$450.20", "change": "+2.10%", "direction": "up", "meaning": "bad"},
    {"label": "USD/IRR", "price": "42K IRR", "change": "LIVE", "direction": "down", "meaning": "bad"}
  ]
}
```

---

## Backend Files Already Created:
- `server/services/marketService.js` - Fetches real data from Yahoo Finance ✅
- `server/server.js` - Has `/api/markets` endpoint ✅

## Frontend Files to Fix:
1. `src/components/SpicyMeter.jsx` - Fix rendering of stock rows
2. `src/components/PolymarketWidget.jsx` - Fix broken URLs
3. `src/App.jsx` - Check layout/container sizing

## Test Command:
```bash
cd "D:\US vs IRAN"
npm run build
taskkill /F /IM node.exe
npm run dev
```
Then go to http://localhost:5173/

## Success Criteria:
- [ ] War Market shows 4 market data rows + WW3.RISK row
- [ ] Each row shows: Label, Price, Change %, Arrow
- [ ] Colors: Oil up=red, Gold up=yellow, Defense up=red, IRR=red
- [ ] Clicking "BET ON POLYMARKET" goes to working page (not error)
- [ ] Component has proper height, not collapsed
