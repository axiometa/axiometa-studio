import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { api } from '../services/api';
import { browserFlasher } from '../services/flasher';
import { connectionService } from '../services/connection';

export default function Sandbox({ onBack }) {
  const [code, setCode] = useState(`#define LED_PIN 2

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  delay(1000);
}`);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [compilationLogs, setCompilationLogs] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [serialLogs, setSerialLogs] = useState([]);
  const serialEndRef = useRef(null);
  const logsEndRef = useRef(null);

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

  const handleUpload = async () => {
    if (!code.trim()) return;

    setIsUploading(true);
    setUploadStatus('Axie is checking your code...');
    setCompilationLogs('');

    try {
      const device = connectionService.getPort();
      
      if (!device) {
        throw new Error('Device not connected. Please connect from the dashboard first.');
      }
      
      setCompilationLogs(prev => prev + 'Checking code with AI...\n');
      const validation = await api.validateCode(code, '', 'Sandbox code');
      
      if (!validation.is_valid) {
        setUploadStatus('Code needs some fixes');
        setCompilationLogs(prev => prev + `AI detected a potential issue:\n${validation.message}\n\nReview your code and try again.\n`);
        setIsUploading(false);
        return;
      }
      
      setCompilationLogs(prev => prev + 'AI check passed!\n');
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
      
      setCompilationLogs(prev => prev + 'Reconnecting...\n');
      await new Promise(r => setTimeout(r, 1000));
      await connectionService.connect();

    } catch (error) {
      setUploadStatus('Upload failed');
      setCompilationLogs(prev => prev + `Error: ${error.message}\n`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.homeButton} onClick={onBack}>
          Home
        </button>
        <h1 style={styles.title}>Creative Sandbox</h1>
        <div style={styles.spacer} />
      </div>

      <div style={styles.content}>
        <div style={styles.editorSection}>
          <div style={styles.editorHeader}>
            <h3 style={styles.sectionTitle}>Code Editor</h3>
          </div>
          <div style={styles.editorContainer}>
            <Editor
              height="500px"
              defaultLanguage="cpp"
              theme="vs-dark"
              value={code}
              onChange={setCode}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
          
          <button 
            style={styles.uploadButton}
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload to Device'}
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
        </div>

        <div style={styles.monitorSection}>
          {serialLogs.length > 0 && (
            <div style={styles.logsCard}>
              <h4 style={styles.logsTitle}>Serial Monitor</h4>
              <div style={styles.serialMonitor}>
                {serialLogs.map((log, i) => (
                  <div key={i} style={styles.serialLine}>{log}</div>
                ))}
                <div ref={serialEndRef} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0a',
    padding: '2rem',
    fontFamily: 'DM Sans, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
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
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#fff',
    margin: 0,
    fontFamily: 'DM Sans',
  },
  spacer: {
    flex: 1,
  },
  content: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '2rem',
  },
  monitorSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  editorSection: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  editorHeader: {
    marginBottom: '1rem',
  },
  sectionTitle: {
    fontSize: '1.125rem',
    color: '#fff',
    fontFamily: 'DM Sans',
    fontWeight: 'bold',
  },
  editorContainer: {
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #333',
    marginBottom: '1rem',
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
    fontFamily: 'DM Sans',
    marginBottom: '1rem',
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
  logsCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
  },
  logsTitle: {
    fontSize: '1rem',
    color: '#fff',
    marginBottom: '0.75rem',
    fontFamily: 'DM Sans',
    fontWeight: 'bold',
  },
  logs: {
    background: '#000',
    padding: '1rem',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontFamily: 'monospace',
    color: '#0f0',
    maxHeight: '200px',
    overflow: 'auto',
    margin: 0,
    whiteSpace: 'pre-wrap',
  },
  serialMonitor: {
    background: '#000',
    padding: '1rem',
    borderRadius: '8px',
    maxHeight: '400px',
    overflow: 'auto',
  },
  serialLine: {
    color: '#0f0',
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    marginBottom: '0.25rem',
  },
};