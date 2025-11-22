import React from 'react';
import CodeEditor from '../../common/CodeEditor';
import Button from '../../common/Button';
import UploadStatus from '../../common/UploadStatus';
import SerialMonitor from '../../common/SerialMonitor';
import { colors, borderRadius, fontFamily, fontFamilyMono } from '../../../styles/theme';

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  title: {
    fontSize: '2.25rem',
    marginBottom: 0,
    color: colors.primary,
    fontFamily
  },
  starRating: {
    display: 'flex',
    gap: '0.5rem'
  },
  starFilled: {
    fontSize: '2rem',
    color: colors.primary
  },
  starEmpty: {
    fontSize: '2rem',
    color: '#333'
  },
  instruction: {
    fontSize: '1.125rem',
    color: '#fff',
    marginBottom: '1.5rem',
    lineHeight: '1.6',
    fontFamily
  },
  hintsContainer: {
    margin: '1.5rem 0'
  },
  hint: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '1rem',
    borderRadius: borderRadius.md,
    marginBottom: '0.5rem',
    color: colors.text.secondary,
    fontFamily
  },
  advancedPanel: {
    background: '#000',
    border: '1px solid #333',
    borderRadius: borderRadius.lg,
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
    fontFamily: fontFamilyMono,
    fontSize: '0.75rem',
    maxHeight: '300px',
    overflow: 'auto',
    margin: 0,
    padding: '1rem',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.4'
  }
};

export default function ChallengeStep({
  title,
  instruction,
  hints,
  stars,
  hintLevel,
  code,
  onCodeChange,
  onShowHint,
  isUploading,
  uploadStatus,
  compilationLogs,
  serialLogs,
  showAdvanced,
  onToggleAdvanced,
  onUpload
}) {
  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>{title}</h1>
        <div style={styles.starRating}>
          {[1, 2, 3].map(i => (
            <span key={i} style={i <= stars ? styles.starFilled : styles.starEmpty}>
              ★
            </span>
          ))}
        </div>
      </div>
      
      <p style={styles.instruction}>{instruction}</p>
      
      {hintLevel > 0 && (
        <div style={styles.hintsContainer}>
          {hints.slice(0, hintLevel).map((hint, i) => (
            <div key={i} style={styles.hint}>
              Hint {i + 1}: {hint}
            </div>
          ))}
        </div>
      )}

      {hintLevel < hints.length && (
        <div style={{ marginBottom: '1.5rem' }}>
          <Button variant="secondary" onClick={onShowHint}>
            Show Hint ({hintLevel + 1}/{hints.length})
          </Button>
        </div>
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <CodeEditor code={code} onChange={onCodeChange} />
      </div>

      <Button 
        fullWidth
        disabled={isUploading}
        onClick={onUpload}
      >
        {isUploading ? 'Testing...' : 'Upload & Test'}
      </Button>

      {uploadStatus && (
        <>
          <div style={{ marginTop: '1rem' }}>
            <UploadStatus
              status={uploadStatus}
              isUploading={isUploading}
              showAdvanced={showAdvanced}
              onToggleAdvanced={onToggleAdvanced}
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

      <SerialMonitor logs={serialLogs} />
    </>
  );
}
