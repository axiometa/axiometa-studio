import React, { useState, useEffect } from 'react';
import { connectionService } from '../services/connection';
import { useUpload } from '../hooks/useUpload';
import Button from './common/Button';
import Card from './common/Card';
import InfoStep from './lesson/steps/InfoStep';
import HardwareStep from './lesson/steps/HardwareStep';
import WiringStep from './lesson/steps/WiringStep';
import CodeExplanationStep from './lesson/steps/CodeExplanationStep';
import UploadStep from './lesson/steps/UploadStep';
import ChallengeStep from './lesson/steps/ChallengeStep';
import AIAssistant from './AIAssistant';
import { colors, gradients, fontFamily } from '../styles/theme';

const styles = {
  container: {
    minHeight: '100vh',
    background: colors.background,
    paddingBottom: '4rem',
    fontFamily
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(10px)',
    borderBottom: `1px solid ${colors.borderLight}`,
    flexWrap: 'wrap',
    gap: '1rem'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  title: {
    fontSize: '1.5rem',
    color: '#fff',
    margin: 0,
    fontFamily
  },
  stepIndicator: {
    color: colors.text.muted,
    fontSize: '0.9rem'
  },
  connectedBadge: {
    color: colors.primary,
    fontWeight: '600',
    fontFamily
  },
  progressContainer: {
    position: 'relative',
    width: '100%',
    height: '4px',
    background: '#1a1a1a'
  },
  progressBar: {
    height: '100%',
    background: gradients.primary,
    transition: 'width 0.3s ease'
  },
  content: {
    maxWidth: '900px',
    margin: '3rem auto',
    padding: '0 2rem'
  },
  stepCard: {
    marginBottom: '2rem'
  },
  completionCard: {
    background: 'rgba(0, 212, 170, 0.1)',
    border: '2px solid rgba(0, 212, 170, 0.3)',
    borderRadius: '16px',
    padding: '4rem',
    textAlign: 'center'
  },
  completionTitle: {
    fontSize: '2.5rem',
    marginBottom: '1.5rem',
    color: colors.primary,
    fontFamily
  },
  completionContent: {
    fontSize: '1.25rem',
    lineHeight: '2',
    color: colors.text.secondary,
    whiteSpace: 'pre-line',
    fontFamily
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    marginTop: '2rem'
  }
};

export default function LessonView({ lesson, onComplete, onBack, challengeStars, onChallengeComplete }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [code, setCode] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [serialLogs, setSerialLogs] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  
  const { 
    isUploading, 
    uploadStatus, 
    compilationLogs, 
    validationError,
    upload 
  } = useUpload();
  
  const currentStep = lesson.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / lesson.steps.length) * 100;
  const isChallengeStep = currentStep?.type === 'challenge';
  const challengeId = isChallengeStep ? currentStep.id : null;
  const stars = challengeId ? (challengeStars[challengeId] || 0) : 0;

  useEffect(() => {
    const unsubscribe = connectionService.onData((line) => {
      setSerialLogs(prev => [...prev.slice(-50), line]);
    });
    return () => unsubscribe();
  }, []);

  // Initialize code when component mounts or step changes
  useEffect(() => {
    if (currentStep?.type === 'upload' || currentStep?.type === 'challenge') {
      const initialCode = currentStep.code || 
        lesson.steps.find(s => s.type === 'upload' || s.type === 'code-explanation')?.code || '';
      setCode(initialCode);
    }
  }, [currentStepIndex, currentStep, lesson.steps]);

  const handleNext = () => {
    if (currentStepIndex < lesson.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setHintLevel(0);
      setUploadStatus('');
      
      const nextStep = lesson.steps[currentStepIndex + 1];
      if (nextStep.type === 'upload' || nextStep.type === 'challenge') {
        setCode(nextStep.code || lesson.steps.find(s => s.type === 'upload')?.code || '');
      }
    } else {
      onComplete(lesson.xp_reward);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      onBack();
    }
  };

  const handleConnect = async () => {
    try {
      await connectionService.connect();
      setIsConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async () => {
    const expectedCode = currentStep.code || 
      lesson.steps.find(s => s.type === 'upload' || s.type === 'code-explanation')?.code || '';
    
    const result = await upload(
      code, 
      expectedCode, 
      currentStep.instruction || currentStep.title
    );

    if (isChallengeStep && onChallengeComplete) {
      onChallengeComplete(challengeId, result.stars);
    }
  };

  const renderStep = () => {
    switch (currentStep.type) {
      case 'info':
        return <InfoStep title={currentStep.title} content={currentStep.content} />;
      
      case 'hardware':
        return <HardwareStep title={currentStep.title} items={currentStep.items} />;
      
      case 'wiring-step':
        return <WiringStep {...currentStep} />;
      
      case 'code-explanation':
        return <CodeExplanationStep {...currentStep} />;
      
      case 'upload':
        return (
          <UploadStep
            title={currentStep.title}
            instruction={currentStep.instruction}
            code={code}
            onCodeChange={setCode}
            isUploading={isUploading}
            uploadStatus={uploadStatus}
            compilationLogs={compilationLogs}
            serialLogs={serialLogs}
            showAdvanced={showAdvanced}
            onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
            onUpload={handleUpload}
          />
        );
      
      case 'challenge':
        return (
          <ChallengeStep
            title={currentStep.title}
            instruction={currentStep.instruction}
            hints={currentStep.hints}
            stars={stars}
            hintLevel={hintLevel}
            code={code}
            onCodeChange={setCode}
            onShowHint={() => setHintLevel(h => h + 1)}
            isUploading={isUploading}
            uploadStatus={uploadStatus}
            compilationLogs={compilationLogs}
            serialLogs={serialLogs}
            showAdvanced={showAdvanced}
            onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
            onUpload={handleUpload}
          />
        );
      
      case 'completion':
        return (
          <div style={styles.completionCard}>
            <h1 style={styles.completionTitle}>{currentStep.title}</h1>
            <p style={styles.completionContent}>{currentStep.content}</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <Button variant="secondary" size="small" onClick={onBack}>
            Home
          </Button>
          <h2 style={styles.title}>{lesson.title}</h2>
          <div style={styles.stepIndicator}>
            Step {currentStepIndex + 1} of {lesson.steps.length}
          </div>
        </div>
        <div>
          {!isConnected ? (
            <Button onClick={handleConnect}>Connect ESP32</Button>
          ) : (
            <div style={styles.connectedBadge}>Connected</div>
          )}
        </div>
      </div>

      <div style={styles.progressContainer}>
        <div style={{...styles.progressBar, width: `${progress}%`}} />
      </div>

      <div style={styles.content}>
        <Card style={styles.stepCard}>
          {renderStep()}
        </Card>

        <div style={styles.navigation}>
          {currentStepIndex > 0 && (
            <Button variant="secondary" onClick={handleBack}>
              Previous
            </Button>
          )}
          <Button onClick={handleNext}>
            {currentStepIndex === lesson.steps.length - 1 ? 'Complete Lesson' : 'Next'}
          </Button>
        </div>
      </div>

      <AIAssistant
        lesson={lesson}
        currentStep={currentStep}
        userCode={code}
        validationError={validationError}
      />
    </div>
  );
}