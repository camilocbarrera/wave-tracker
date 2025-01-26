# Wave Tracker - Mobile Network Analysis Tool 📱

A powerful web application for analyzing mobile network performance and coverage. Built for the LabLab AI for Connectivity Hackathon.

![Wave Tracker Banner](public/lablab_ai_logo.png)

## 🎥 Demo

![Wave Tracker Demo](https://github.com/camilocbarrera/wave-tracker/raw/main/assets/demo-web-tracker.gif)


## 🚀 Features

- **Single Tower Analysis**: Analyze individual cell tower performance using MCC, MNC, Cell ID, and LAC codes
- **Area Coverage Analysis**: Evaluate network coverage across geographical areas
- **Real-time Speed Predictions**: Get instant speed estimates based on signal strength and tower data
- **AI-Powered Insights**: Receive intelligent suggestions for network optimization
- **Interactive Visualization**: View network performance metrics through dynamic charts and graphs

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: 
  - Geist Font (by Vercel)
  - Framer Motion (for animations)
  - Chart.js (for data visualization)
  - React Icons

### Backend (API Routes)
- **Runtime**: Node.js
- **API Framework**: Next.js API Routes
- **External APIs**:
  - OpenCellID API (for tower data)
  - OpenAI GPT-4 API (for network insights)

### Development Tools
- **Package Manager**: npm
- **Version Control**: Git
- **Code Quality**: TypeScript strict mode
- **Development Server**: Next.js development server

## 📦 Dependencies

```json
{
  "dependencies": {
    "next": "14.2.23",
    "react": "^18",
    "react-dom": "^18",
    "framer-motion": "latest",
    "chart.js": "^4.x",
    "react-chartjs-2": "^5.x",
    "openai": "^4.x",
    "react-icons": "^4.x",
    "@geist-ui/core": "latest"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/react": "^18",
    "@types/node": "^20",
    "tailwindcss": "^3",
    "autoprefixer": "^10",
    "postcss": "^8"
  }
}
```

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/wave-tracker.git
   cd wave-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   OPENCELLID_API_KEY=your_opencellid_api_key
   OPEN_AI_API_KEY=your_openai_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 API Integration

### OpenCellID API
- Used for fetching cell tower data
- Endpoints used:
  - `/cell/get`: Get single tower information
  - Parameters: MCC, MNC, Cell ID, LAC

### OpenAI API
- Used for generating network insights
- Model: GPT-4
- Implementation: Custom prompts for network analysis

## 📊 Data Flow

1. **User Input**
   - Tower Analysis: MCC, MNC, Cell ID, LAC codes
   - Area Analysis: Geographic coordinates, radius

2. **Data Processing**
   - Tower data fetching from OpenCellID
   - Signal strength calculation
   - Speed prediction algorithms

3. **AI Analysis**
   - Network performance evaluation
   - Optimization suggestions generation
   - Coverage improvement recommendations

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: System preference detection
- **Interactive Elements**:
  - Animated transitions
  - Loading states
  - Error handling
- **Onboarding Tutorial**: First-time user guidance
- **Accessibility**: WCAG compliance

## 🔒 Security

- Environment variables for API keys
- Input validation
- Rate limiting on API routes
- Secure headers configuration

## 🚀 Deployment

The application is optimized for deployment on Vercel:

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Configure Environment Variables**
4. **Deploy**

Alternative deployment options:
- AWS
- DigitalOcean
- Netlify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **AI Ninjas**
  - Built during the LabLab AI for Connectivity Hackathon
  - [Team Profile](https://lablab.ai/event/ai-for-connectivity-hackathon/ai-ninjas)

## 🙏 Acknowledgments

- LabLab.ai for hosting the hackathon
- OpenCellID for providing tower data
- OpenAI for AI capabilities
- Vercel for hosting and deployment

---

For more information, contact the team or visit our [GitHub repository](https://github.com/your-username/wave-tracker).
