# 🇺🇸 US vs IRAN - War Tracker Dashboard

A fully live, AI-powered, meme dashboard that tracks US-Iran tensions with real news, AI analysis, and Gen-Z commentary.

![Dashboard Preview](https://via.placeholder.com/800x400/0d0d12/ffffff?text=US+vs+IRAN+Dashboard)

## ✨ Features

- 📰 **Real News Aggregation** - Fetches from Reuters, BBC, Al Jazeera, AP News, The Guardian + GDELT OSINT
- 🤖 **AI-Powered Analysis** - Uses Moonshot AI (Kimi) to analyze sentiment and generate meme captions
- 🎮 **Fighting Game UI** - Street Fighter-style HP bars that shift based on real news
- 🌶️ **Spicy Meter** - Live tension gauge based on news severity
- 🎲 **Prediction Markets** - Real odds from Polymarket on escalation probability
- 🛰️ **NASA FIRMS Integration** - Satellite fire detection near Iran
- 🎭 **Meme Feed** - Auto-generated memes with share buttons
- 🤖 **Gen-Z Analyst** - AI chatbot that speaks in brainrot slang
- 🔥 **Trump GIF Reactions** - Dynamic GIFs based on who's winning
- ⚠️ **Breaking Alerts** - Full-screen alerts for high-severity news

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- (Optional) API keys for enhanced features

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd "US vs IRAN"

# Install dependencies
npm install

# Set up environment variables (optional)
cp .env.example .env
# Edit .env and add your API keys
```

### Running the App

```bash
# Start both frontend and backend
npm run dev

# Or run separately:
npm run server  # Backend on http://localhost:3001
npm run vite    # Frontend on http://localhost:3000
```

The dashboard will be available at `http://localhost:3000`

## 🔑 API Keys (Optional but Recommended)

| Service | Key Name | Get From | Cost |
|---------|----------|----------|------|
| Moonshot AI | `KIMI_API_KEY` | [platform.moonshot.cn](https://platform.moonshot.cn/) | Free tier available |
| Giphy | `GIPHY_API_KEY` | [developers.giphy.com](https://developers.giphy.com/) | Free |
| NASA FIRMS | `NASA_FIRMS_KEY` | [firms.modaps.eosdis.nasa.gov](https://firms.modaps.eosdis.nasa.gov/) | Free |

Without API keys, the app will use mock data and fallback responses.

## 📁 Project Structure

```
.
├── server/                     # Backend Node.js/Express
│   ├── server.js              # Main server file
│   └── services/              # API services
│       ├── rssService.js      # RSS feed fetching
│       ├── gdeltService.js    # GDELT OSINT API
│       ├── kimiService.js     # Moonshot AI integration
│       ├── polymarketService.js # Prediction markets
│       ├── nasaFirmsService.js  # Satellite fire data
│       ├── giphyService.js    # Trump GIFs
│       └── gameStateService.js # Game state management
├── src/
│   ├── components/            # React components
│   │   ├── App.jsx           # Main app
│   │   ├── HPBar.jsx         # Fighting game HP bars
│   │   ├── FighterCard.jsx   # Trump/Iran cards with GIFs
│   │   ├── MemeCard.jsx      # Meme feed with share buttons
│   │   ├── SpicyMeter.jsx    # Tension gauge
│   │   ├── PolymarketWidget.jsx # Betting odds
│   │   ├── GenZAnalyst.jsx   # AI chatbot
│   │   ├── NasaFirmsStrip.jsx # Satellite data strip
│   │   ├── BreakingAlert.jsx # Full-screen alerts
│   │   └── ComicTicker.jsx   # Scrolling ticker
│   └── lib/
│       ├── api.js            # API client
│       └── mockData.js       # Fallback data
└── package.json
```

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/news` | GET | Get latest news (RSS + GDELT) |
| `/api/analyze` | POST | Analyze headline with AI |
| `/api/chat` | POST | Chat with Gen-Z Analyst |
| `/api/state` | GET | Get current game state |
| `/api/state/refresh` | POST | Refresh game state with latest news |
| `/api/memes` | GET | Get analyzed news with memes |
| `/api/polymarket` | GET | Get prediction market data |
| `/api/fires` | GET | Get NASA FIRMS fire data |
| `/api/ticker` | GET | Get comic ticker text |
| `/api/trump-gif` | GET | Get Trump GIF URL |

## 🎮 How It Works

### News Flow

1. **RSS Feeds** - Fetches every 5 minutes from 5 major news sources
2. **GDELT Backup** - Queries GDELT for additional OSINT data
3. **Deduplication** - Merges and removes duplicate headlines
4. **AI Analysis** - Sends headlines to Moonshot AI for analysis
5. **Game State** - Updates HP bars and tension based on AI scores

### Scoring System

- **Score -5 to +5**: How much the news impacts each side
- **Side**: US, IRAN, or NEUTRAL
- **Severity**: low, medium, high (affects spicy meter)
- **Badge**: BREAKING 💥, YIKES 😬, SUS 👀, OOF 💀, W 🏆, L 💀

### HP Bar Logic

- Positive score → US HP up, Iran HP down
- Negative score → Iran HP up, US HP down
- Changes are dampened (30% of calculated value) for smooth transitions

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- Framer Motion (animations)
- Lucide React (icons)

### Backend
- Node.js + Express
- node-fetch (HTTP requests)
- xml2js (RSS parsing)
- dotenv (environment variables)

### Data Sources
- **News**: Reuters, BBC, Al Jazeera, AP News, The Guardian
- **OSINT**: GDELT Project
- **Markets**: Polymarket
- **Satellite**: NASA FIRMS
- **AI**: Moonshot AI (Kimi)
- **GIFs**: Giphy

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# Moonshot AI (Kimi) API Key - Required for AI analysis
KIMI_API_KEY=your_kimi_api_key_here

# Giphy API Key - Optional, for Trump GIFs
GIPHY_API_KEY=your_giphy_api_key_here

# NASA FIRMS API Key - Optional, for satellite data
NASA_FIRMS_KEY=your_nasa_firms_key_here

# Server Port (default: 3001)
PORT=3001
```

## 🤝 Contributing

This is a satirical project. Please keep it fun and respectful.

## ⚠️ Disclaimer

This dashboard provides real-time data aggregation for informational purposes. Data sources include NASA FIRMS, Polymarket prediction markets, and global news RSS feeds. For critical decisions, consult official sources.

## 📄 License

MIT License - Feel free to use and modify!

---

Built with ❤️ and chaos by the community.
