import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import SplashScreen from './components/SplashScreen';
import Dashboard from './components/Dashboard';
import AboutUs from './components/AboutUs';
import AIAssistant from './components/AIAssistant';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');

  useEffect(() => {
    const timer = setTimeout(() => setCurrentScreen('dashboard'), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <StatusBar barStyle="light-content" backgroundColor="#5AA3C8" />

      {currentScreen === 'splash' && <SplashScreen />}

      {currentScreen === 'dashboard' && (
        <Dashboard
          onNavigateToAbout={() => setCurrentScreen('about')}
          onNavigateToAI={() => setCurrentScreen('ai-assistant')}
        />
      )}

      {currentScreen === 'about' && (
        <AboutUs onBack={() => setCurrentScreen('dashboard')} />
      )}

      {currentScreen === 'ai-assistant' && (
        <AIAssistant onBack={() => setCurrentScreen('dashboard')} />
      )}
    </SafeAreaView>
  );
}