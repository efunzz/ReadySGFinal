# ReadySG - Emergency Preparedness Mobile Application

A mobile-first disaster preparedness application designed to improve emergency readiness among younger Singaporean residents aged 18-39.

## 📱 About ReadySG

ReadySG employs scenario-based learning, gamified challenges, and rapid access to critical information to help users become more informed, confident, and responsive during crises. The app specifically targets digitally connected residents with the potential to influence household decision-making and community preparedness behaviors.

## 🚀 Core Features

### 📚 Interactive Learning Missions
- **Scenario-based simulations** covering flash floods, earthquakes, and other emergency situations
- **Character-driven narratives** following "James" through realistic emergency scenarios
- **Decision-making challenges** that test emergency response knowledge
- **Progressive difficulty levels** from basic to advanced preparedness

### ✅ Emergency Kit Builder
- **Interactive checklists** for building comprehensive emergency kits
- **Category-organized items** (Water & Food, First Aid, Tools, Personal Items)
- **Progress tracking** with visual indicators
- **Gamified completion** with achievement unlocks

### 🧠 Safety Knowledge Quiz
- **Interactive quizzes** testing emergency preparedness knowledge
- **Multiple choice questions** covering various disaster scenarios
- **Immediate feedback** with explanations for correct answers
- **Score tracking** and performance analytics

### 🏆 Achievement System
- **Badge collection** for completing missions and reaching milestones
- **Progress visualization** showing overall preparedness level
- **Motivation through gamification** encouraging continued engagement
- **Community challenges** and social features

### 📍 Local Resources Integration
- **Location-based emergency information** relevant to Singapore
- **Official SCDF guidelines** and safety protocols
- **Real-time alerts** and emergency notifications
- **Community resource sharing** and mutual aid coordination

### 👤 User Profile & Progress
- **Personal achievement tracking** with detailed statistics
- **Progress analytics** showing learning journey
- **Customizable user preferences** and settings
- **Emergency contact management**

## 🛠 Technical Stack

- **Frontend:** React Native with Expo
- **Backend:** Supabase (Authentication, Database, Real-time features)
- **Navigation:** React Navigation v6
- **State Management:** React Context API + useState hooks
- **Styling:** Custom StyleSheet with consistent theme
- **Icons:** Ionicons for consistent UI elements

## 📋 Prerequisites

Before running this application, ensure you have:

- Node.js (v16 or higher)
- npm or yarn package manager
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)
- Git for version control

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/efunzz/ReadySGFinal.git
   cd ReadySGFinal
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   ```bash
   # Create your own .env file (not included in repository for security)
   cp .env.example .env
   
   # Add your Supabase credentials to .env:
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Start the development server**
   ```bash
   npx expo start
   # or
   yarn expo start
   ```

5. **Run on device/simulator**
   - Scan QR code with Expo Go app (iOS/Android)
   - Or press 'a' for Android emulator
   - Or press 'i' for iOS simulator

## 📁 Project Structure

```
ReadySGFinal/
├── screens/              # Application screens
│   ├── HomeScreen.js     # Main dashboard
│   ├── MenuScreen.js     # Learning missions
│   ├── CartScreen.js     # Preparedness tools
│   ├── LikeScreen.js     # Local resources
│   └── ProfileScreen.js  # User profile
├── navigation/           # Navigation configuration
├── constants/            # Theme and configuration
├── lib/                  # External service configurations
├── assets/              # Images and static files
└── App.js               # Main application entry point
```

## 🔒 Security Notes

- **API Keys:** No sensitive credentials are included in this repository
- **Environment Variables:** Create your own `.env` file with required Supabase credentials
- **Authentication:** User authentication handled securely through Supabase
- **Data Privacy:** User data stored securely with proper access controls

## 🎯 Target Audience

- **Primary:** Singaporean residents aged 18-39
- **Secondary:** Families and community groups interested in emergency preparedness
- **Use Case:** Individual learning, family planning, community preparedness initiatives

## 📖 Usage Instructions

1. **Registration:** Create account or sign in
2. **Profile Setup:** Complete basic profile information
3. **Start Learning:** Begin with introductory missions
4. **Build Kit:** Use checklist to prepare emergency supplies
5. **Take Quizzes:** Test knowledge with safety quizzes
6. **Track Progress:** Monitor achievements and improvement
7. **Explore Resources:** Access local emergency information

## 🤝 Contributing

This project was developed as part of CM3070 Final Year Project at University of London. For academic integrity, contributions are not currently accepted.

## 📄 License

This project is developed for educational purposes as part of university coursework. All rights reserved.


**Note:** This application is designed specifically for Singapore's emergency preparedness context and incorporates official SCDF guidelines and local emergency protocols.