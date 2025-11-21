import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { connectionService } from '../services/connection';
import { api } from '../services/api';
import { browserFlasher } from '../services/flasher'; // ← Import at top

export default function LessonView({ lesson, onComplete, onBack }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [code, setCode] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [serialLogs, setSerialLogs] = useState([]);
  const [uploadLogs, setUploadLogs] = useState('');
  const [hintLevel, setHintLevel] = useState(0);

  const currentStep = lesson.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / lesson.steps.length) * 100;

  useEffect(() => {
    const unsubscribe = connectionService.onData((line) => {
      setSerialLogs(prev => [...prev.slice(-50), line]);
    });
    return () => unsubscribe();
  }, []);

  const handleNext = () => {
    if (currentStepIndex < lesson.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setHintLevel(0);
      
      // Set code when reaching code step
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
    if (!code.trim()) return;

    setIsUploading(true);
    setUploadLogs('');

    try {
      // Step 1: Compile on backend
      setUploadLogs(prev => prev + '⏳ Compiling code...\n');
      const compileResult = await api.compile(code);
      
      if (!compileResult.success) {
        throw new Error('Compilation failed');
      }

      setUploadLogs(prev => prev + '✅ Compilation successful!\n');
      setUploadLogs(prev => prev + `📦 Generated ${Object.keys(compileResult.binaries).length} binary file(s)\n`);

      // Step 2: Flash using browser - NO dynamic import!
      setUploadLogs(prev => prev + '📡 Starting browser-based upload...\n');
      
      await browserFlasher.flash(compileResult.binaries, (message) => {
        setUploadLogs(prev => prev + message + '\n');
      });

      setUploadLogs(prev => prev + '🎉 Upload complete!\n');
      
      // Reconnect serial monitor after upload
      if (!isConnected) {
        setUploadLogs(prev => prev + '🔌 Reconnecting serial monitor...\n');
        await handleConnect();
      }

    } catch (error) {
      setUploadLogs(prev => prev + `❌ Error: ${error.message}\n`);
      
      if (error.message.includes('user gesture') || error.message.includes('requestPort')) {
        setUploadLogs(prev => prev + '💡 Tip: Click the Upload button again when prompted for serial port\n');
      } else if (error.message.includes('No port selected')) {
        setUploadLogs(prev => prev + '💡 Tip: Make sure to select your ESP32 when prompted\n');
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

  // ... rest of the component stays the same
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={handleBack}>
          ← {currentStepIndex === 0 ? 'Back to Dashboard' : 'Previous'}
        </button>
        <h2 style={styles.title}>{lesson.title}</h2>
        {!isConnected ? (
          <button style={styles.connectButton} onClick={handleConnect}>
            🔌 Connect ESP32
          </button>
        ) : (
          <div style={styles.connectedBadge}>✅ Connected</div>
        )}
      </div>

      {/* Progress Bar */}
      <div style={styles.progressContainer}>
        <div style={{...styles.progressBar, width: `${progress}%`}} />
        <div style={styles.progressText}>
          Step {currentStepIndex + 1} of {lesson.steps.length}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {currentStep.type === 'info' && (
          <div style={styles.infoCard}>
            <h1 style={styles.stepTitle}>{currentStep.title}</h1>
            <p style={styles.stepContent}>{currentStep.content}</p>
            <button style={styles.nextButton} onClick={handleNext}>
              Next →
            </button>
          </div>
        )}

        {currentStep.type === 'hardware' && (
          <div style={styles.hardwareCard}>
            <h1 style={styles.stepTitle}>{currentStep.title}</h1>
            <div style={styles.hardwareGrid}>
              {currentStep.items.map((item, i) => (
                <div key={i} style={styles.hardwareItem}>
                  <div style={styles.hardwareIcon}>📦</div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
            <button style={styles.nextButton} onClick={handleNext}>
              I Have These →
            </button>
          </div>
        )}

        {currentStep.type === 'wiring' && (
          <div style={styles.wiringCard}>
            <h1 style={styles.stepTitle}>{currentStep.title}</h1>
            {currentStep.substeps.map((substep, i) => (
              <div key={i} style={styles.wiringStep}>
                <div style={styles.stepNumber}>{i + 1}</div>
                <div style={styles.wiringContent}>
                  <p style={styles.wiringInstruction}>{substep.instruction}</p>
                  <div style={styles.wiringImagePlaceholder}>
                    [Image: {substep.image}]
                  </div>
                </div>
              </div>
            ))}
            <button style={styles.nextButton} onClick={handleNext}>
              Wiring Complete →
            </button>
          </div>
        )}

        {currentStep.type === 'wiring-step' && (
          <div style={styles.wiringCard}>
            <h1 style={styles.stepTitle}>{currentStep.title}</h1>
            <div style={styles.wiringStep}>
              <div style={styles.stepNumber}>{currentStep.stepNumber}</div>
              <div style={styles.wiringContent}>
                <p style={styles.wiringInstruction}>{currentStep.instruction}</p>
                <div style={styles.wiringImagePlaceholder}>
                  [Image: {currentStep.image}]
                </div>
              </div>
            </div>
            <div style={{textAlign: 'center', marginTop: '1rem', color: '#888'}}>
              Step {currentStep.stepNumber} of {currentStep.totalSteps}
            </div>
            <button style={styles.nextButton} onClick={handleNext}>
              {currentStep.stepNumber < currentStep.totalSteps ? 'Next Step →' : 'Wiring Complete →'}
            </button>
          </div>
        )}

        {currentStep.type === 'code-explanation' && (
          <div style={styles.codeExplanationCard}>
            <h1 style={styles.stepTitle}>{currentStep.title}</h1>
            <pre style={styles.codeBlock}>{currentStep.code}</pre>
            <div style={styles.explanations}>
              {currentStep.explanations.map((exp, i) => (
                <div key={i} style={styles.explanation}>
                  <code style={styles.highlightedCode}>{exp.highlight}</code>
                  <p style={styles.explanationText}>{exp.explanation}</p>
                </div>
              ))}
            </div>
            <button style={styles.nextButton} onClick={handleNext}>
              I Understand →
            </button>
          </div>
        )}

        {currentStep.type === 'upload' && (
          <div style={styles.uploadCard}>
            <h1 style={styles.stepTitle}>{currentStep.title}</h1>
            <p style={styles.stepContent}>{currentStep.instruction}</p>
            
            <div style={styles.editorContainer}>
              <Editor
                height="300px"
                defaultLanguage="cpp"
                theme="vs-dark"
                value={code}
                onChange={setCode}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  readOnly: false,
                }}
              />
            </div>

            <button 
              style={styles.uploadButton}
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? '⏳ Uploading...' : '⚡ Upload Code'}
            </button>

            {uploadLogs && (
              <pre style={styles.uploadLogs}>{uploadLogs}</pre>
            )}

            {serialLogs.length > 0 && (
              <div style={styles.serialMonitor}>
                <h4>📊 Serial Monitor:</h4>
                {serialLogs.map((log, i) => (
                  <div key={i} style={styles.serialLine}>{log}</div>
                ))}
              </div>
            )}

            <button style={styles.nextButton} onClick={handleNext}>
              Code Uploaded →
            </button>
          </div>
        )}

        {currentStep.type === 'challenge' && (
          <div style={styles.challengeCard}>
            <h1 style={styles.stepTitle}>{currentStep.title}</h1>
            <p style={styles.challengeInstruction}>{currentStep.instruction}</p>

            {hintLevel > 0 && (
              <div style={styles.hintsContainer}>
                {currentStep.hints.slice(0, hintLevel).map((hint, i) => (
                  <div key={i} style={styles.hint}>
                    💡 Hint {i + 1}: {hint}
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
                height="400px"
                defaultLanguage="cpp"
                theme="vs-dark"
                value={code}
                onChange={setCode}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                }}
              />
            </div>

            <button 
              style={styles.uploadButton}
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? '⏳ Testing...' : '🧪 Test Code'}
            </button>

            {uploadLogs && (
              <pre style={styles.uploadLogs}>{uploadLogs}</pre>
            )}

            {serialLogs.length > 0 && (
              <div style={styles.serialMonitor}>
                <h4>📊 Serial Monitor:</h4>
                {serialLogs.map((log, i) => (
                  <div key={i} style={styles.serialLine}>{log}</div>
                ))}
              </div>
            )}

            <button style={styles.nextButton} onClick={handleNext}>
              Challenge Complete →
            </button>
          </div>
        )}

        {currentStep.type === 'completion' && (
          <div style={styles.completionCard}>
            <h1 style={styles.completionTitle}>{currentStep.title}</h1>
            <p style={styles.completionContent}>{currentStep.content}</p>
            <button style={styles.finishButton} onClick={() => onComplete(lesson.xp_reward)}>
              Finish Lesson
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    borderBottom: '1px solid #222',
  },
  backButton: {
    background: 'none',
    border: '1px solid #555',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  title: {
    color: '#00ff88',
    fontSize: '1.25rem',
  },
  connectButton: {
    background: '#00ff88',
    border: 'none',
    color: '#000',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  connectedBadge: {
    color: '#00ff88',
    fontWeight: 'bold',
  },
  progressContainer: {
    position: 'relative',
    width: '100%',
    height: '4px',
    background: '#222',
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #00ff88, #00ccff)',
    transition: 'width 0.3s ease',
  },
  progressText: {
    position: 'absolute',
    top: '10px',
    right: '2rem',
    fontSize: '0.875rem',
    color: '#888',
  },
  content: {
    maxWidth: '800px',
    margin: '3rem auto',
    padding: '0 2rem',
  },
  infoCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '3rem',
    textAlign: 'center',
  },
  stepTitle: {
    fontSize: '2rem',
    marginBottom: '1.5rem',
    color: '#00ff88',
  },
  stepContent: {
    fontSize: '1.125rem',
    lineHeight: '1.8',
    color: '#ccc',
    marginBottom: '2rem',
    whiteSpace: 'pre-line',
  },
  nextButton: {
    background: 'linear-gradient(90deg, #00ff88, #00ccff)',
    border: 'none',
    color: '#000',
    padding: '1rem 3rem',
    borderRadius: '8px',
    fontSize: '1.125rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    margin: '1rem 0',
  },
  hardwareCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '3rem',
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
  hardwareIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  wiringCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '3rem',
  },
  wiringStep: {
    display: 'flex',
    gap: '2rem',
    marginBottom: '2rem',
    alignItems: 'flex-start',
  },
  stepNumber: {
    background: '#00ff88',
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
  },
  wiringImagePlaceholder: {
    background: '#222',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#666',
  },
  codeExplanationCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '3rem',
  },
  codeBlock: {
    background: '#000',
    padding: '1.5rem',
    borderRadius: '8px',
    overflow: 'auto',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    marginBottom: '2rem',
  },
  explanations: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  explanation: {
    background: 'rgba(0, 255, 136, 0.05)',
    border: '1px solid rgba(0, 255, 136, 0.2)',
    borderRadius: '8px',
    padding: '1rem',
  },
  highlightedCode: {
    background: '#00ff88',
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
  },
  uploadCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '3rem',
  },
  challengeCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '3rem',
  },
  challengeInstruction: {
    fontSize: '1.125rem',
    color: '#fff',
    marginBottom: '1.5rem',
    lineHeight: '1.6',
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
  },
  hintButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid #555',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '1.5rem',
  },
  editorContainer: {
    marginBottom: '1.5rem',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #333',
  },
  uploadButton: {
    background: 'linear-gradient(90deg, #00ff88, #00ccff)',
    border: 'none',
    color: '#000',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '1rem',
  },
  uploadLogs: {
    background: '#000',
    padding: '1rem',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontFamily: 'monospace',
    color: '#0f0',
    maxHeight: '200px',
    overflow: 'auto',
    marginBottom: '1rem',
  },
  serialMonitor: {
    background: '#000',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    maxHeight: '200px',
    overflow: 'auto',
  },
  serialLine: {
    color: '#0f0',
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    marginBottom: '0.25rem',
  },
  completionCard: {
    background: 'rgba(0, 255, 136, 0.1)',
    border: '2px solid rgba(0, 255, 136, 0.3)',
    borderRadius: '16px',
    padding: '4rem',
    textAlign: 'center',
  },
  completionTitle: {
    fontSize: '2.5rem',
    marginBottom: '1.5rem',
    color: '#00ff88',
  },
  completionContent: {
    fontSize: '1.25rem',
    lineHeight: '2',
    color: '#ccc',
    marginBottom: '2rem',
    whiteSpace: 'pre-line',
  },
  finishButton: {
    background: 'linear-gradient(90deg, #00ff88, #00ccff)',
    border: 'none',
    color: '#000',
    padding: '1.25rem 3rem',
    borderRadius: '8px',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};