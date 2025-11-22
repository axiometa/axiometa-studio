import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { connectionService } from '../services/connection';
import { api } from '../services/api';
import { browserFlasher } from '../services/flasher';

export default function LessonView({ lesson, onComplete, onBack, challengeStars, onChallengeComplete }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [code, setCode] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [serialLogs, setSerialLogs] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [compilationLogs, setCompilationLogs] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const [validationError, setValidationError] = useState(null);
  const serialEndRef = useRef(null);
  const logsEndRef = useRef(null);
  
  const currentStep = lesson.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / lesson.steps.length) * 100;
  const isChallengeStep = currentStep?.type === 'challenge';
  const challengeId = isChallengeStep ? currentStep.id : null;
  const stars = challengeId ? (challengeStars[challengeId] || 0) : 0;

  // Inject CSS animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes progress {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(250%); }
        100% { transform: translateX(-100%); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const unsubscribe = connectionService.onData((line) => {
      setSerialLogs(prev => [...prev.slice(-50), line]);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    serialEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [serialLogs]);

  useEffect(() => {
    if (showAdvanced) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [compilationLogs, showAdvanced]);

  const handleImageError = (imagePath) => {
    setImageErrors(prev => ({ ...prev, [imagePath]: true }));
  };

  const handleNext = () => {
    if (currentStepIndex < lesson.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setHintLevel(0);
      setUploadStatus('');
      setCompilationLogs('');
      setValidationError(null);
      
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
      setUploadStatus('');
      setCompilationLogs('');
      setValidationError(null);
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
    if (!code.trim()) return;

    setIsUploading(true);
    setUploadStatus('Axie is checking your code...');
    setCompilationLogs('');
    setValidationError(null);

    try {
      const device = connectionService.getPort();
      
      if (!device) {
        throw new Error('Device not connected. Please connect your ESP32 first.');
      }
      
      const expectedCode = currentStep.code || 
        lesson.steps.find(s => s.type === 'upload' || s.type === 'code-explanation')?.code || '';
      
      const validation = await api.validateCode(
        code, 
        expectedCode, 
        currentStep.instruction || currentStep.title
      );
      
      if (!validation.is_valid) {
        setValidationError(validation.message);
        setUploadStatus('Code needs some fixes');
        setCompilationLogs('Validation failed:\n' + validation.message);
        setIsUploading(false);
        if (isChallengeStep && onChallengeComplete) {
          onChallengeComplete(challengeId, 0);
        }
        return;
      }
      
      setUploadStatus('Axie is compiling your code...');
      setCompilationLogs(prev => prev + 'Compiling code...\n');
      
      const compileResult = await api.compile(code);
      
      if (!compileResult.success) {
        throw new Error('Compilation failed');
      }

      setCompilationLogs(prev => prev + 'Compilation successful!\n');
      setCompilationLogs(prev => prev + `Generated ${Object.keys(compileResult.binaries).length} binary file(s)\n`);
      setUploadStatus('Uploading to your device...');
      setCompilationLogs(prev => prev + 'Starting upload...\n');
      
      await connectionService.disconnect();
      
      await browserFlasher.flashWithDevice(device, compileResult.binaries, (message) => {
        setCompilationLogs(prev => prev + message + '\n');
      });

      setUploadStatus('Upload complete! Code is running.');
      setCompilationLogs(prev => prev + 'Upload complete!\n');
      
      if (isChallengeStep && onChallengeComplete) {
        onChallengeComplete(challengeId, 3);
      }
      
      if (isConnected) {
        setCompilationLogs(prev => prev + 'Reconnecting...\n');
        await new Promise(r => setTimeout(r, 1000));
        await connectionService.connect();
      }

    } catch (error) {
      setUploadStatus('Upload failed');
      setCompilationLogs(prev => prev + `Error: ${error.message}\n`);
      if (isChallengeStep && onChallengeComplete) {
        onChallengeComplete(challengeId, 0);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const showHint = () => {
    if (currentStep.type === 'challenge' && hintLevel < currentStep.hints.length) {
      setHintLevel(hintLevel + 1);
    }
  };

  const ImageWithFallback = ({ src, alt, style }) => {
    if (imageErrors[src]) {
      return (
        <div style={styles.imageFallback}>
          <div style={styles.fallbackText}>Image not found</div>
          <code style={styles.fallbackPath}>{src}</code>
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        style={style}
        onError={() => handleImageError(src)}
      />
    );
  };

  const renderStarRating = () => {
    if (!isChallengeStep) return null;
    
    return (
      <div style={styles.starRating}>
        {[1, 2, 3].map(i => (
          <span key={i} style={i <= stars ? styles.starFilled : styles.starEmpty}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.homeButton} onClick={onBack}>
            Home
          </button>
          <h2 style={styles.title}>{lesson.title}</h2>
          <div style={styles.stepIndicator}>
            Step {currentStepIndex + 1} of {lesson.steps.length}
          </div>
        </div>
        <div style={styles.headerActions}>
          {!isConnected ? (
            <button style={styles.connectButton} onClick={handleConnect}>
              Connect ESP32
            </button>
          ) : (
            <div style={styles.connectedBadge}>Connected</div>
          )}
        </div>
      </div>

      <div style={styles.progressContainer}>
        <div style={{...styles.progressBar, width: `${progress}%`}} />
      </div>

      <div style={styles.content}>
        {currentStep.type === 'info' && (
          <div style={styles.stepCard}>
            <h1 style={styles.stepTitle}>{currentStep.title}</h1>
            <p style={styles.stepContent}>{currentStep.content}</p>
          </div>
        )}

        {currentStep.type === 'hardware' && (
          <div style={styles.stepCard}>
            <h1 style={styles.stepTitle}>{currentStep.title}</h1>
            <div style={styles.hardwareGrid}>
              {currentStep.items.map((item, i) => (
                <div key={i} style={styles.hardwareItem}>
                  {item.image ? (
                    <div style={styles.hardwareImageContainer}>
                      <ImageWithFallback 
                        src={item.image} 
                        alt={item.name}
                        style={styles.hardwareImage}
                      />
                    </div>
                  ) : (
                    <div style={styles.hardwareIcon}>Component</div>
                  )}
                  <h3 style={styles.hardwareItemName}>{item.name}</h3>
                  <p style={styles.hardwareItemDesc}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep.type === 'wiring-step' && (
          <div style={styles.stepCard}>
            <h1 style={styles.stepTitle}>{currentStep.title}</h1>
            <div style={styles.wiringStep}>
              <div style={styles.stepNumber}>{currentStep.stepNumber}</div>
              <div style={styles.wiringContent}>
                <p style={styles.wiringInstruction}>{currentStep.instruction}</p>
                {currentStep.image && (
                  <div style={styles.wiringImageContainer}>
                    <ImageWithFallback 
                      src={currentStep.image}
                      alt={currentStep.title}
                      style={styles.wiringImage}
                    />
                  </div>
                )}
              </div>
            </div>
            <div style={styles.wiringProgress}>
              Step {currentStep.stepNumber} of {currentStep.totalSteps}
            </div>
          </div>
        )}

        {currentStep.type === 'code-explanation' && (
          <div style={styles.stepCard}>
            <h1 style={styles.stepTitle}>{currentStep.title}</h1>
            <div style={styles.codeBlockContainer}>
              <pre style={styles.codeBlock}>{currentStep.code}</pre>
            </div>
            <div style={styles.explanations}>
              {currentStep.explanations.map((exp, i) => (
                <div key={i} style={styles.explanation}>
                  <code style={styles.highlightedCode}>{exp.highlight}</code>
                  <p style={styles.explanationText}>{exp.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep.type === 'upload' && (
          <div style={styles.stepCard}>
            <h1 style={styles.stepTitle}>{currentStep.title}</h1>
            <p style={styles.stepContent}>{currentStep.instruction}</p>
            
            <div style={styles.editorContainer}>
              <Editor
                height="350px"
                defaultLanguage="cpp"
                theme="vs-dark"
                value={code}
                onChange={setCode}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  readOnly: false,
                  scrollBeyondLastLine: false,
                }}
              />
            </div>

            <button 
              style={styles.uploadButton}
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Code'}
            </button>

            {uploadStatus && (
              <div style={styles.uploadStatusCard}>
                <div style={styles.axieStatusMain}>
                  <div style={styles.axieAvatar}>
                    <img 
                      src="/images/axie-robot.png" 
                      alt="Axie"
                      style={styles.axieAvatarImg}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  <div style={styles.axieStatusContent}>
                    <div style={styles.axieStatusTitle}>{uploadStatus}</div>
                    {isUploading && (
                      <div style={styles.progressBarContainer}>
                        <div style={styles.progressBarAnimated} />
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  style={styles.advancedToggle}
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? '▼ Hide Details' : '▶ Advanced'}
                </button>
              </div>
            )}

            {showAdvanced && compilationLogs && (
              <div style={styles.advancedPanel}>
                <div style={styles.advancedHeader}>
                  <span style={styles.advancedTitle}>Technical Details</span>
                </div>
                <pre style={styles.advancedLogs}>{compilationLogs}</pre>
                <div ref={logsEndRef} />
              </div>
            )}

            {serialLogs.length > 0 && (
              <div style={styles.serialMonitor}>
                <h4 style={styles.serialTitle}>Serial Monitor:</h4>
                <div style={styles.serialContent}>
                  {serialLogs.map((log, i) => (
                    <div key={i} style={styles.serialLine}>{log}</div>
                  ))}
                  <div ref={serialEndRef} />
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep.type === 'challenge' && (
          <div style={styles.stepCard}>
            <div style={styles.challengeHeader}>
              <h1 style={styles.stepTitle}>{currentStep.title}</h1>
              {renderStarRating()}
            </div>
            <p style={styles.challengeInstruction}>{currentStep.instruction}</p>
            
            {hintLevel > 0 && (
              <div style={styles.hintsContainer}>
                {currentStep.hints.slice(0, hintLevel).map((hint, i) => (
                  <div key={i} style={styles.hint}>
                    Hint {i + 1}: {hint}
                  </div>
                ))}
              </div>
            )}

            {hintLevel < currentStep.hints.length && (
              <button style={styles.hintButton} onClick={showHint}>
                Show Hint ({hintLevel + 1}/{currentStep.hints.length})
              </button>
            )}

            <div style={styles.editorContainer}>
              <Editor
                height="350px"
                defaultLanguage="cpp"
                theme="vs-dark"
                value={code}
                onChange={setCode}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                }}
              />
            </div>

            <button 
              style={styles.uploadButton}
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? 'Testing...' : 'Upload & Test'}
            </button>

            {uploadStatus && (
              <div style={styles.uploadStatusCard}>
                <div style={styles.axieStatusMain}>
                  <div style={styles.axieAvatar}>
                    <img 
                      src="/images/axie-robot.png" 
                      alt="Axie"
                      style={styles.axieAvatarImg}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  <div style={styles.axieStatusContent}>
                    <div style={styles.axieStatusTitle}>{uploadStatus}</div>
                    {isUploading && (
                      <div style={styles.progressBarContainer}>
                        <div style={styles.progressBarAnimated} />
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  style={styles.advancedToggle}
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? '▼ Hide Details' : '▶ Advanced'}
                </button>
              </div>
            )}

            {showAdvanced && compilationLogs && (
              <div style={styles.advancedPanel}>
                <div style={styles.advancedHeader}>
                  <span style={styles.advancedTitle}>Technical Details</span>
                </div>
                <pre style={styles.advancedLogs}>{compilationLogs}</pre>
                <div ref={logsEndRef} />
              </div>
            )}

            {serialLogs.length > 0 && (
              <div style={styles.serialMonitor}>
                <h4 style={styles.serialTitle}>Serial Monitor:</h4>
                <div style={styles.serialContent}>
                  {serialLogs.map((log, i) => (
                    <div key={i} style={styles.serialLine}>{log}</div>
                  ))}
                  <div ref={serialEndRef} />
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep.type === 'completion' && (
          <div style={styles.completionCard}>
            <h1 style={styles.completionTitle}>{currentStep.title}</h1>
            <p style={styles.completionContent}>{currentStep.content}</p>
          </div>
        )}

        <div style={styles.navigation}>
          {currentStepIndex > 0 && (
            <button style={styles.navButton} onClick={handleBack}>
              Previous
            </button>
          )}
          <button style={styles.navButtonPrimary} onClick={handleNext}>
            {currentStepIndex === lesson.steps.length - 1 ? 'Complete Lesson' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0a',
    paddingBottom: '4rem',
    fontFamily: 'DM Sans, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  homeButton: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#fff',
    padding: '0.5rem 1.25rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontFamily: 'DM Sans',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
  title: {
    fontSize: '1.5rem',
    color: '#fff',
    margin: 0,
    fontFamily: 'DM Sans',
  },
  stepIndicator: {
    color: '#888',
    fontSize: '0.9rem',
  },
  headerActions: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  connectButton: {
    background: 'linear-gradient(135deg, #00d4aa, #7c3aed)',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontFamily: 'DM Sans',
  },
  connectedBadge: {
    color: '#00d4aa',
    fontWeight: '600',
    fontFamily: 'DM Sans',
  },
  progressContainer: {
    position: 'relative',
    width: '100%',
    height: '4px',
    background: '#1a1a1a',
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #00d4aa, #7c3aed)',
    transition: 'width 0.3s ease',
  },
  content: {
    maxWidth: '900px',
    margin: '3rem auto',
    padding: '0 2rem',
  },
  stepCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '3rem',
    marginBottom: '2rem',
  },
  stepTitle: {
    fontSize: '2.25rem',
    marginBottom: '1.5rem',
    color: '#00d4aa',
    fontFamily: 'DM Sans',
  },
  stepContent: {
    fontSize: '1.125rem',
    lineHeight: '1.8',
    color: '#ccc',
    marginBottom: '2rem',
    whiteSpace: 'pre-line',
    fontFamily: 'DM Sans',
  },
  hardwareGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    margin: '2rem 0',
  },
  hardwareItem: {
    textAlign: 'center',
  },
  hardwareImageContainer: {
    width: '100%',
    height: '150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  hardwareImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  hardwareIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    color: '#666',
  },
  hardwareItemName: {
    fontSize: '1.125rem',
    color: '#fff',
    marginBottom: '0.5rem',
    fontFamily: 'DM Sans',
  },
  hardwareItemDesc: {
    color: '#aaa',
    fontSize: '0.95rem',
    fontFamily: 'DM Sans',
  },
  wiringStep: {
    display: 'flex',
    gap: '2rem',
    marginBottom: '2rem',
    alignItems: 'flex-start',
  },
  stepNumber: {
    background: '#00d4aa',
    color: '#000',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  wiringContent: {
    flex: 1,
  },
  wiringInstruction: {
    fontSize: '1.125rem',
    marginBottom: '1rem',
    color: '#fff',
    fontFamily: 'DM Sans',
  },
  wiringImageContainer: {
    background: '#000',
    padding: '1rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
  },
  wiringImage: {
    maxWidth: '100%',
    maxHeight: '500px',
    objectFit: 'contain',
    borderRadius: '4px',
  },
  wiringProgress: {
    textAlign: 'center',
    color: '#888',
    fontSize: '0.9rem',
  },
  imageFallback: {
    width: '100%',
    padding: '2rem',
    textAlign: 'center',
    color: '#666',
  },
  fallbackText: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
    color: '#888',
  },
  fallbackPath: {
    fontSize: '0.75rem',
    color: '#555',
    wordBreak: 'break-all',
    display: 'block',
    marginTop: '0.5rem',
  },
  codeBlockContainer: {
    marginBottom: '2rem',
  },
  codeBlock: {
    background: '#000',
    padding: '1.5rem',
    borderRadius: '8px',
    overflow: 'auto',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: '#fff',
    fontFamily: 'monospace',
    margin: 0,
  },
  explanations: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  explanation: {
    background: 'rgba(0, 212, 170, 0.05)',
    border: '1px solid rgba(0, 212, 170, 0.2)',
    borderRadius: '8px',
    padding: '1rem',
  },
  highlightedCode: {
    background: '#00d4aa',
    color: '#000',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.95rem',
    fontFamily: 'monospace',
    display: 'inline-block',
    marginBottom: '0.5rem',
  },
  explanationText: {
    color: '#ccc',
    lineHeight: '1.6',
    margin: 0,
    fontFamily: 'DM Sans',
  },
  editorContainer: {
    marginBottom: '1.5rem',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #333',
  },
  uploadButton: {
    background: 'linear-gradient(135deg, #00d4aa, #7c3aed)',
    border: 'none',
    color: '#fff',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '1rem',
    fontFamily: 'DM Sans',
  },
  uploadStatusCard: {
    background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.08), rgba(124, 58, 237, 0.08))',
    border: '2px solid rgba(0, 212, 170, 0.3)',
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '1rem',
  },
  axieStatusMain: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '1rem',
  },
  axieAvatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #00d4aa, #7c3aed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(0, 212, 170, 0.3)',
  },
  axieAvatarImg: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
  },
  axieStatusContent: {
    flex: 1,
  },
  axieStatusTitle: {
    color: '#fff',
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
    fontFamily: 'DM Sans',
  },
  progressBarContainer: {
    width: '100%',
    height: '8px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBarAnimated: {
    height: '100%',
    background: 'linear-gradient(90deg, #00d4aa, #7c3aed)',
    borderRadius: '4px',
    animation: 'progress 1.5s ease-in-out infinite',
    width: '40%',
  },
  advancedToggle: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#aaa',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontFamily: 'DM Sans',
    transition: 'all 0.2s',
  },
  advancedPanel: {
    background: '#000',
    border: '1px solid #333',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '1rem',
  },
  advancedHeader: {
    background: 'rgba(0, 212, 170, 0.1)',
    borderBottom: '1px solid #333',
    padding: '0.75rem 1rem',
  },
  advancedTitle: {
    color: '#00d4aa',
    fontSize: '0.875rem',
    fontWeight: '600',
    fontFamily: 'DM Sans',
  },
  advancedLogs: {
    color: '#0f0',
    fontFamily: 'monospace',
    fontSize: '0.75rem',
    maxHeight: '300px',
    overflow: 'auto',
    margin: 0,
    padding: '1rem',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.4',
  },
  serialMonitor: {
    background: '#000',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
  },
  serialTitle: {
    color: '#00d4aa',
    marginBottom: '0.75rem',
    fontSize: '1rem',
    fontFamily: 'DM Sans',
  },
  serialContent: {
    maxHeight: '200px',
    overflow: 'auto',
  },
  serialLine: {
    color: '#0f0',
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    marginBottom: '0.25rem',
  },
  challengeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  starRating: {
    display: 'flex',
    gap: '0.5rem',
  },
  starFilled: {
    fontSize: '2rem',
    color: '#00d4aa',
  },
  starEmpty: {
    fontSize: '2rem',
    color: '#333',
  },
  challengeInstruction: {
    fontSize: '1.125rem',
    color: '#fff',
    marginBottom: '1.5rem',
    lineHeight: '1.6',
    fontFamily: 'DM Sans',
  },
  hintsContainer: {
    margin: '1.5rem 0',
  },
  hint: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '0.5rem',
    color: '#ccc',
    fontFamily: 'DM Sans',
  },
  hintButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid #555',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '1.5rem',
    fontFamily: 'DM Sans',
  },
  completionCard: {
    background: 'rgba(0, 212, 170, 0.1)',
    border: '2px solid rgba(0, 212, 170, 0.3)',
    borderRadius: '16px',
    padding: '4rem',
    textAlign: 'center',
  },
  completionTitle: {
    fontSize: '2.5rem',
    marginBottom: '1.5rem',
    color: '#00d4aa',
    fontFamily: 'DM Sans',
  },
  completionContent: {
    fontSize: '1.25rem',
    lineHeight: '2',
    color: '#ccc',
    whiteSpace: 'pre-line',
    fontFamily: 'DM Sans',
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    marginTop: '2rem',
  },
  navButton: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#fff',
    padding: '1rem 2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    fontFamily: 'DM Sans',
  },
  navButtonPrimary: {
    background: 'linear-gradient(135deg, #00d4aa, #7c3aed)',
    border: 'none',
    color: '#fff',
    padding: '1rem 2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    fontFamily: 'DM Sans',
  },
};