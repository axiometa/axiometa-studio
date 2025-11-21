import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import LessonView from './components/LessonView';
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

  const handleStartLesson = () => {
    setCurrentLesson(lessons[0]);
    setCurrentView('lesson');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setCurrentLesson(null);
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

    // Show completion and return to dashboard
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
        />
      )}
      
      {currentView === 'lesson' && currentLesson && (
        <LessonView
          lesson={currentLesson}
          onComplete={handleCompleteLesson}
          onBack={handleBackToDashboard}
        />
      )}
    </>
  );
}
