import React, { useState, useEffect } from 'react';
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
  const [uploadLogs, setUploadLogs] = useState('');
  const [serialLogs, setSerialLogs] = useState([]);

  useEffect(() => {
    const unsubscribe = connectionService.onData((line) => {
      setSerialLogs(prev => [...prev.slice(-50), line]);
    });
    return () => unsubscribe();
  }, []);

  const handleUpload = async () => {
    if (!code.trim()) return;

    setIsUploading(true);
    setUploadLogs('');

    try {
      // Get the already-connected port from connectionService
      const device = connectionService.getPort();
      
      if (!device) {
        throw new Error('Device not connected. Please connect from the dashboard first.');
      }
      
      setUploadLogs(prev => prev + '⏳ Compiling code...\n');
      const compileResult = await api.compile(code);
      
      if (!compileResult.success) {
        throw new Error('Compilation failed');
      }

      setUploadLogs(prev => prev + '✅ Compilation successful!\n');
      setUploadLogs(prev => prev + `📦 Generated ${Object.keys(compileResult.binaries).length} binary file(s)\n`);
      setUploadLogs(prev => prev + '📡 Starting upload...\n');
      
      // Disconnect serial monitor temporarily for flashing
      await connectionService.disconnect();
      
      // Flash with the existing device
      await browserFlasher.flashWithDevice(device, compileResult.binaries, (message) => {
        setUploadLogs(prev => prev + message + '\n');
      });

      setUploadLogs(prev => prev + '🎉 Upload complete!\n');
      
      // Reconnect serial monitor
      setUploadLogs(prev => prev + '🔌 Reconnecting...\n');
      await new Promise(r => setTimeout(r, 1000));
      await connectionService.connect();

    } catch (error) {
      setUploadLogs(prev => prev + `❌ Error: ${error.message}\n`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← Back to Dashboard
        </button>
        <h1 style={styles.title}>🎨 Creative Sandbox</h1>
        <div style={styles.betaBadge}>BETA</div>
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
            {isUploading ? '⏳ Uploading...' : '⚡ Upload to Device'}
          </button>
        </div>

        <div style={styles.monitorSection}>
          {uploadLogs && (
            <div style={styles.logsCard}>
              <h4 style={styles.logsTitle}>📋 Upload Log</h4>
              <pre style={styles.logs}>{uploadLogs}</pre>
            </div>
          )}

          {serialLogs.length > 0 && (
            <div style={styles.logsCard}>
              <h4 style={styles.logsTitle}>📊 Serial Monitor</h4>
              <div style={styles.serialMonitor}>
                {serialLogs.map((log, i) => (
                  <div key={i} style={styles.serialLine}>{log}</div>
                ))}
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
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
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
  backButton: {
    background: 'none',
    border: '1px solid #555',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'DM Sans',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#fff',
    margin: 0,
    fontFamily: 'DM Sans',
  },
  betaBadge: {
    background: '#8a2be2',
    color: '#fff',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    fontFamily: 'DM Sans',
  },
  content: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '2rem',
  },
  editorSection: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
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
    background: 'linear-gradient(90deg, #00ff88, #00ccff)',
    border: 'none',
    color: '#000',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    fontFamily: 'DM Sans',
  },
  monitorSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  logsCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '1.5rem',
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
    maxHeight: '300px',
    overflow: 'auto',
    margin: 0,
  },
  serialMonitor: {
    background: '#000',
    padding: '1rem',
    borderRadius: '8px',
    maxHeight: '300px',
    overflow: 'auto',
  },
  serialLine: {
    color: '#0f0',
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    marginBottom: '0.25rem',
  },
};