import React, { useState, useEffect } from 'react';
import { connectionService } from '../services/connection';
import Button from './common/Button';
import CodeEditor from './common/CodeEditor';
import UploadStatus from './common/UploadStatus';
import SerialMonitor from './common/SerialMonitor';
import AIAssistant from './AIAssistant';
import { useUpload } from '../hooks/useUpload';
import { colors, fontFamily } from '../styles/theme';

const INITIAL_CODE = `#define LED_PIN 2

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  delay(1000);
}`;

const styles = {
  container: {
    minHeight: '100vh',
    background: colors.background,
    padding: '2rem',
    fontFamily
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#fff',
    margin: 0,
    fontFamily
  },
  spacer: {
    flex: 1
  },
  content: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '2rem'
  },
  editorSection: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    padding: '1.5rem'
  },
  sectionTitle: {
    fontSize: '1.125rem',
    color: '#fff',
    fontFamily,
    fontWeight: 'bold',
    marginBottom: '1rem'
  },
  monitorSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  advancedPanel: {
    background: '#000',
    border: '1px solid #333',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '1rem'
  },
  advancedHeader: {
    background: 'rgba(0, 212, 170, 0.1)',
    borderBottom: '1px solid #333',
    padding: '0.75rem 1rem'
  },
  advancedTitle: {
    color: colors.primary,
    fontSize: '0.875rem',
    fontWeight: '600',
    fontFamily
  },
  advancedLogs: {
    color: colors.terminal,
    fontFamily: 'monospace',
    fontSize: '0.75rem',
    maxHeight: '300px',
    overflow: 'auto',
    margin: 0,
    padding: '1rem',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.4'
  }
};

// Inject CSS animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes progress {
    0% { transform: translateX(-100%); }
    50% { transform: translateX(250%); }
    100% { transform: translateX(-100%); }
  }
`;
document.head.appendChild(styleSheet);

export default function Sandbox({ onBack }) {
  const [code, setCode] = useState(INITIAL_CODE);
  const [serialLogs, setSerialLogs] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const { 
    isUploading, 
    uploadStatus, 
    compilationLogs, 
    upload 
  } = useUpload();

  useEffect(() => {
    const unsubscribe = connectionService.onData((line) => {
      setSerialLogs(prev => [...prev.slice(-50), line]);
    });
    return () => unsubscribe();
  }, []);

  const handleUpload = async () => {
    await upload(code, '', 'Sandbox code');
  };

  return (
    <>
      <div style={styles.container}>
        <div style={styles.header}>
          <Button variant="secondary" size="small" onClick={onBack}>
            Home
          </Button>
          <h1 style={styles.title}>Creative Sandbox</h1>
          <div style={styles.spacer} />
        </div>

        <div style={styles.content}>
          <div style={styles.editorSection}>
            <h3 style={styles.sectionTitle}>Code Editor</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <CodeEditor 
                code={code} 
                onChange={setCode} 
                height="500px"
              />
            </div>
            
            <Button 
              fullWidth
              disabled={isUploading}
              onClick={handleUpload}
            >
              {isUploading ? 'Uploading...' : 'Upload to Device'}
            </Button>

            {uploadStatus && (
              <>
                <div style={{ marginTop: '1rem' }}>
                  <UploadStatus
                    status={uploadStatus}
                    isUploading={isUploading}
                    showAdvanced={showAdvanced}
                    onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
                  />
                </div>

                {showAdvanced && compilationLogs && (
                  <div style={styles.advancedPanel}>
                    <div style={styles.advancedHeader}>
                      <span style={styles.advancedTitle}>Technical Details</span>
                    </div>
                    <pre style={styles.advancedLogs}>{compilationLogs}</pre>
                  </div>
                )}
              </>
            )}
          </div>

          <div style={styles.monitorSection}>
            <SerialMonitor logs={serialLogs} />
          </div>
        </div>
      </div>

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
        userCode={code}
        validationError={null}
      />
    </>
  );
}
