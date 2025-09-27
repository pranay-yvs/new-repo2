import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { HomePage } from './components/HomePage';
import { ResultPage } from './components/ResultPage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { analyzeLeaf } from './services/geminiService';
import type { AnalysisResult, AppState, HistoryEntry } from './types';
import { LANGUAGES } from './constants';
import type { Language } from './types';
import { Logo } from './components/Logo';
import { Chatbot } from './components/chatbot/Chatbot';
import { playNotificationSound } from './utils/audio';

const SpeakerOnIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);

const SpeakerOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l-2-2m0 0l-2-2m2 2l-2 2m2-2l2 2" />
    </svg>
);

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('agriSentrySoundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('agriSentryHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
      localStorage.removeItem('agriSentryHistory');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('agriSentrySoundEnabled', JSON.stringify(isSoundEnabled));
  }, [isSoundEnabled]);

  const backgroundColor = useMemo(() => {
    if (appState === 'RESULT' && analysisResult && !analysisResult.isHealthy) {
      const risk = analysisResult.riskLevel;
      if (risk <= 33) return 'bg-yellow-50';
      if (risk <= 66) return 'bg-orange-100';
      return 'bg-red-100';
    }
    return 'bg-green-50';
  }, [appState, analysisResult]);


  const handleAnalysis = useCallback(async (imageFile: File, imageDataUrl: string) => {
    setAppState('ANALYZING');
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeLeaf(imageFile, selectedLanguage.name);
      setAnalysisResult(result);
      setAppState('RESULT');

      if (isSoundEnabled) {
        playNotificationSound('complete');
      }

      const newEntry: HistoryEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        imageDataUrl,
        result,
      };

      setHistory(prevHistory => {
        const updatedHistory = [newEntry, ...prevHistory];
        localStorage.setItem('agriSentryHistory', JSON.stringify(updatedHistory));
        return updatedHistory;
      });

    } catch (err) {
      console.error(err);
      setError('Failed to analyze the image. Please try again.');
      setAppState('IDLE');
    }
  }, [selectedLanguage, isSoundEnabled]);

  const handleReset = () => {
    setAppState('IDLE');
    setAnalysisResult(null);
    setError(null);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('agriSentryHistory');
  };

  const renderContent = () => {
    switch (appState) {
      case 'ANALYZING':
        return <LoadingSpinner language={selectedLanguage}/>;
      case 'RESULT':
        return analysisResult ? (
          <ResultPage result={analysisResult} onReset={handleReset} />
        ) : (
          <HomePage 
            onAnalyze={handleAnalysis} 
            isLoading={false} 
            error={error} 
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            history={history}
            onClearHistory={handleClearHistory}
          />
        );
      case 'IDLE':
      default:
        return (
          <HomePage 
            onAnalyze={handleAnalysis} 
            isLoading={false} 
            error={error}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            history={history}
            onClearHistory={handleClearHistory}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen ${backgroundColor} text-gray-800 flex flex-col items-center p-4 font-sans transition-colors duration-500 ease-in-out`}>
       <div className="w-full max-w-4xl mx-auto relative">
        <button
          onClick={() => setIsSoundEnabled(prev => !prev)}
          className="absolute top-2 right-2 p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 z-20"
          aria-label={isSoundEnabled ? "Disable sound notifications" : "Enable sound notifications"}
        >
          {isSoundEnabled ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
        </button>
      </div>
      <header className="w-full max-w-4xl mx-auto text-center mb-6">
        <div className="flex justify-center">
            <Logo />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-green-800 tracking-wider -mt-4 uppercase">
          AgriSentry
        </h1>
        <p className="text-lg text-green-700 mt-2">
          Your AI-powered plant health assistant.
        </p>
      </header>
      <main className="w-full max-w-2xl">
        {renderContent()}
      </main>
      <footer className="w-full max-w-4xl mx-auto text-center mt-8 text-sm text-gray-500">
        <p>&copy; 2024 AgriSentry. Helping farmers grow healthier crops.</p>
      </footer>
      <Chatbot isSoundEnabled={isSoundEnabled} />
    </div>
  );
};

export default App;