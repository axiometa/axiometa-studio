import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import LessonView from './components/LessonView';
import Sandbox from './components/Sandbox';
import AIAssistant from './components/AIAssistant';
import { lessons } from './data/lessons';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [userProgress, setUserProgress] = useState({
    level: 1,
    xp: 0,
    nextLevelXp: 500,
    completedLessons: []
  });
  const [currentLesson, setCurrentLesson] = useState(null);
  const [challengeStars, setChallengeStars] = useState({});
  const [showAxie, setShowAxie] = useState(false);
  const [axieContext, setAxieContext] = useState(null);

  const handleStartLesson = () => {
    setCurrentLesson(lessons[0]);
    setCurrentView('lesson');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setCurrentLesson(null);
  };

  const handleOpenSandbox = () => {
    setCurrentView('sandbox');
  };

  const handleChallengeComplete = (challengeId, stars) => {
    setChallengeStars(prev => ({
      ...prev,
      [challengeId]: stars
    }));
  };

  const handleCompleteLesson = (xpReward) => {
    setUserProgress(prev => {
      const newXp = prev.xp + xpReward;
      const newLevel = newXp >= prev.nextLevelXp ? prev.level + 1 : prev.level;
      const newNextLevelXp = newLevel > prev.level ? prev.nextLevelXp + 500 : prev.nextLevelXp;

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        nextLevelXp: newNextLevelXp,
        completedLessons: [...prev.completedLessons, currentLesson.id]
      };
    });

    setTimeout(() => {
      handleBackToDashboard();
    }, 2000);
  };

  return (
    <>
      {currentView === 'dashboard' && (
        <Dashboard 
          userProgress={userProgress}
          onStartLesson={handleStartLesson}
          onOpenSandbox={handleOpenSandbox}
        />
      )}
      
      {currentView === 'lesson' && currentLesson && (
        <>
          <LessonView
            lesson={currentLesson}
            onComplete={handleCompleteLesson}
            onBack={handleBackToDashboard}
            challengeStars={challengeStars}
            onChallengeComplete={handleChallengeComplete}
          />
          <AIAssistant
            lesson={currentLesson}
            currentStep={currentLesson.steps[0]}
            userCode=""
            validationError={null}
          />
        </>
      )}

      {currentView === 'sandbox' && (
        <>
          <Sandbox onBack={handleBackToDashboard} />
          <AIAssistant
            lesson={{
              id: 'sandbox',
              title: 'Creative Sandbox',
              board: 'pixie-m1',
              steps: []
            }}
            currentStep={{
              id: 'sandbox',
              type: 'sandbox',
              title: 'Free Coding',
              instruction: 'You are in sandbox mode - experiment freely with your code!'
            }}
            userCode=""
            validationError={null}
          />
        </>
      )}
    </>
  );
}