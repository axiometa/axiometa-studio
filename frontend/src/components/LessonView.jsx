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
import VerificationStep from './lesson/steps/VerificationStep';
import AIAssistant from './AIAssistant';
import { colors, gradients, fontFamily } from '../styles/theme';
import InteractiveConceptStep from './lesson/steps/InteractiveConceptStep';

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
    padding: '1rem 2rem',
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
    fontSize: '1.25rem',
    color: '#fff',
    margin: 0,
    fontFamily
  },
  connectedBadge: {
    color: colors.primary,
    fontWeight: '600',
    fontFamily
  },
  progressWrapper: {
    padding: '0.75rem 2rem',
    background: 'rgba(0, 0, 0, 0.3)'
  },
  progressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem'
  },
  progressLabel: {
    color: colors.text.muted,
    fontSize: '0.85rem',
    fontFamily
  },
  progressPercent: {
    color: colors.primary,
    fontSize: '0.85rem',
    fontWeight: '600',
    fontFamily
  },
  progressContainer: {
    width: '100%',
    height: '8px',
    background: '#1a1a1a',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    background: colors.primary,
    transition: 'width 0.3s ease',
    borderRadius: '4px'
  },
  mainLayout: {
    display: 'flex',
    alignItems: 'flex-start',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem 1rem',
    gap: '1rem'
  },
  sideNav: {
    position: 'sticky',
    top: '2rem',
    flexShrink: 0
  },
  navButton: {
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    border: `2px solid ${colors.primary}`,
    background: 'transparent',
    color: colors.primary,
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily
  },
  navButtonDisabled: {
    opacity: 0.3,
    cursor: 'not-allowed',
    border: `2px solid ${colors.text.muted}`,
    color: colors.text.muted
  },
  navButtonComplete: {
    background: colors.primary,
    color: '#000'
  },
  content: {
    flex: 1,
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '0 1rem'
  },
  stepCard: {
    marginBottom: '2rem'
  },
  completionCard: {
    background: 'linear-gradient(180deg, #000000ff, #000000ff)',
    border: '2px solid rgba(225, 241, 79, 0)',
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
    needsReconnect,
    upload,
    reconnect,
    setCompilationLogs,
    resetUploadState
  } = useUpload();

  const currentStep = lesson.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / lesson.steps.length) * 100;
  const isChallengeStep = currentStep?.type === 'challenge';
  const challengeId = isChallengeStep ? currentStep.id : null;
  const stars = challengeId ? (challengeStars[challengeId] || 0) : 0;

  // ✅ CHECK CONNECTION STATUS ON MOUNT AND PERIODICALLY
  useEffect(() => {
    // Check immediately on mount
    const checkConnection = () => {
      const connected = connectionService.getConnectionStatus();
      setIsConnected(connected);
    };
    
    checkConnection();
    
    // Check every second to sync state
    const interval = setInterval(checkConnection, 1000);
    
    return () => clearInterval(interval);
  }, []);

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
      setCompilationLogs('');
      resetUploadState();  
      setSerialLogs([]);  
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
      setIsConnected(true); // ✅ This will also be updated by the interval above
    } catch (error) {
      console.error(error);
      setIsConnected(false);
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

  const handleReconnect = async () => {
    await reconnect();
    setIsConnected(true); // ✅ This will also be updated by the interval above
  };

  const renderStep = () => {
    switch (currentStep.type) {
      case 'info':
        return <InfoStep title={currentStep.title} content={currentStep.content} />;

      case 'hardware':
        return <HardwareStep title={currentStep.title} moduleIds={currentStep.moduleIds} />;

      case 'wiring-step':
        return <WiringStep {...currentStep} />;

      case 'dual-image':
        return <DualImageStep {...currentStep} />;

      case 'code-explanation':
        return <CodeExplanationStep {...currentStep} />;

      case 'interactive-concept':
        return (
          <InteractiveConceptStep
            title={currentStep.title}
            description={currentStep.description}
            component={currentStep.component}
            config={currentStep.config}
            showControls={currentStep.showControls !== false}
            autoPlay={currentStep.autoPlay !== false}
          />
        );

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
            needsReconnect={needsReconnect}
            onReconnect={handleReconnect}
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
            needsReconnect={needsReconnect}
            onReconnect={handleReconnect}
          />
        );

      case 'completion':
        return (
          <div style={styles.completionCard}>
            <h1 style={styles.completionTitle}>{currentStep.title}</h1>
            <p style={styles.completionContent}>{currentStep.content}</p>
          </div>
        );

      case 'verification':
        return (
          <VerificationStep
            title={currentStep.title}
            instruction={currentStep.instruction}
            image={currentStep.image}
            confirmText={currentStep.confirmText}
            troubleshootText={currentStep.troubleshootText}
            onConfirm={handleNext}
          />
        );

      default:
        return null;
    }
  };

  const isLastStep = currentStepIndex === lesson.steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <Button variant="secondary" size="small" onClick={onBack}>
            ← Home
          </Button>
          <h2 style={styles.title}>{lesson.title}</h2>
        </div>
        <div>
          {!isConnected ? (
            <Button onClick={handleConnect}>Connect ESP32</Button>
          ) : (
            <div style={styles.connectedBadge}>● Connected</div>
          )}
        </div>
      </div>

      <div style={styles.progressWrapper}>
        <div style={styles.progressInfo}>
          <span style={styles.progressLabel}>
            Step {currentStepIndex + 1} of {lesson.steps.length}: {currentStep.title}
          </span>
          <span style={styles.progressPercent}>{Math.round(progress)}%</span>
        </div>
        <div style={styles.progressContainer}>
          <div style={{ ...styles.progressBar, width: `${progress}%` }} />
        </div>
      </div>

      <div style={styles.mainLayout}>
        {/* Left Nav */}
        <div style={styles.sideNav}>
          <button
            style={{
              ...styles.navButton,
              ...(isFirstStep ? styles.navButtonDisabled : {})
            }}
            onClick={handleBack}
            disabled={isFirstStep}
          >
            Return
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          <Card style={styles.stepCard}>
            {renderStep()}
          </Card>
        </div>

        {/* Right Nav */}
        <div style={styles.sideNav}>
          <button
            style={{
              ...styles.navButton,
              ...(isLastStep ? styles.navButtonComplete : {})
            }}
            onClick={handleNext}
          >
            {isLastStep ? 'Complete' : 'Next'}
          </button>
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