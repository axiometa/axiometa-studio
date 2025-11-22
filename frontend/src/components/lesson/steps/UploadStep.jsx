import React from 'react';
import CodeEditor from '../../common/CodeEditor';
import Button from '../../common/Button';
import UploadStatus from '../../common/UploadStatus';
import SerialMonitor from '../../common/SerialMonitor';
import { colors, borderRadius, fontFamily, fontFamilyMono } from '../../../styles/theme';

const styles = {
  title: {
    fontSize: '2.25rem',
    marginBottom: '1.5rem',
    color: colors.primary,
    fontFamily
  },
  instruction: {
    fontSize: '1.125rem',
    lineHeight: '1.8',
    color: colors.text.secondary,
    marginBottom: '2rem',
    whiteSpace: 'pre-line',
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

export default function UploadStep({
  title,
  instruction,
  code,
  onCodeChange,
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
      <h1 style={styles.title}>{title}</h1>
      <p style={styles.instruction}>{instruction}</p>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <CodeEditor code={code} onChange={onCodeChange} />
      </div>

      <Button 
        fullWidth
        disabled={isUploading}
        onClick={onUpload}
      >
        {isUploading ? 'Uploading...' : 'Upload Code'}
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
