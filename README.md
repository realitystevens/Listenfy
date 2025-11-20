# Listenfy - AI Music Mood Analysis

![Listenfy Banner](https://img.shields.io/badge/Listenfy-AI%20Music%20Mood%20Analysis-purple?style=for-the-badge)

Listenfy is an AI-powered web application that analyzes your Spotify listening patterns to provide insights into your mental wellness and mood. Get personalized mood reports, track emotional trends over time, and chat with an AI therapy assistant for guidance and support.

## ✨ Features

- 🎵 **Mood Analysis**: Analyze your mental state based on Spotify listening patterns
- 📊 **Mood Trends**: Track your emotional wellness over time with beautiful visualizations
- 🤖 **AI Therapy Assistant**: Chat with an empathetic AI assistant for mental health support
- 🎨 **Beautiful UI**: Modern, responsive design with glassmorphism effects
- 🔒 **Secure Authentication**: OAuth 2.0 integration with Spotify
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or higher
- A Spotify Developer account
- A Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/realitystevens/listenfy.git
   cd listenfy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

   Update the following variables:
   - `SPOTIFY_CLIENT_ID`: Your Spotify app client ID
   - `SPOTIFY_CLIENT_SECRET`: Your Spotify app client secret
   - `SPOTIFY_REDIRECT_URI`: Set to `http://127.0.0.1:3000/api/auth/callback` for local development
   - `GEMINI_API_KEY`: Your Google Gemini API key

4. **Configure Spotify App**
   
   Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard):
   - Create a new app
   - Add `http://127.0.0.1:3000/api/auth/callback` to Redirect URIs
   - Copy your Client ID and Client Secret to `.env`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://127.0.0.1:3000](http://127.0.0.1:3000)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI**: Google Gemini AI
- **Authentication**: Spotify OAuth 2.0
- **API**: Spotify Web API

## 📁 Project Structure

```
listenfy/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── chat/         # AI chat endpoints
│   │   ├── mood/         # Mood analysis endpoints
│   │   └── spotify/      # Spotify API endpoints
│   ├── dashboard/        # Dashboard page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── ChatInterface.tsx
│   ├── LoadingScreen.tsx
│   ├── LoginScreen.tsx
│   ├── MoodAnalysis.tsx
│   ├── MoodTrends.tsx
│   └── TimeFilter.tsx
├── public/              # Static files
├── .env.example         # Environment variables template
├── next.config.js       # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── package.json         # Dependencies
```

## 🎯 How It Works

1. **Authentication**: Users log in with their Spotify account
2. **Data Collection**: The app fetches user's listening history and audio features
3. **Mood Analysis**: AI analyzes audio features (valence, energy, danceability, etc.)
4. **Insights Generation**: Personalized insights and recommendations are created
5. **AI Chat**: Users can discuss their mood with an AI therapy assistant

## 🔐 Privacy & Security

- All Spotify data is processed in real-time and not stored permanently
- OAuth 2.0 ensures secure authentication
- HTTP-only cookies protect session data
- No personal data is shared with third parties

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Stevens Reality**
- GitHub: [@realitystevens](https://github.com/realitystevens)

## 🙏 Acknowledgments

- Spotify for their amazing Web API
- Google for Gemini AI
- The Next.js team for an excellent framework

## ⚠️ Disclaimer

Listenfy is designed to provide insights and support but is not a replacement for professional mental health care. If you're experiencing serious mental health issues, please consult with a qualified healthcare professional.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/realitystevens/listenfy/issues).

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!
