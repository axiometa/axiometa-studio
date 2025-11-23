import React from 'react';
import { colors, borderRadius, fontFamily } from '../../styles/theme';

const styles = {
  container: {
    background: 'rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.md,
    padding: '1rem',
    marginBottom: '1rem'
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.75rem'
  },
  axie: {
    width: '40px',
    height: '40px',
    flexShrink: 0
  },
  axieSpinning: {
    width: '40px',
    height: '40px',
    flexShrink: 0,
    animation: 'spin 2s linear infinite'
  },
  statusText: {
    color: colors.text.primary,
    fontSize: '1rem',
    fontFamily,
    fontWeight: '500'
  },
  progressBarContainer: {
    width: '100%',
    height: '8px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '0.75rem'
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #e1f14f 0%, #00d4aa 100%)',
    transition: 'width 0.3s ease',
    borderRadius: '4px'
  },
  toggleButton: {
    background: 'transparent',
    border: 'none',
    color: colors.text.muted,
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontFamily,
    textDecoration: 'underline',
    padding: 0
  }
};

// Add spin animation
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  if (!document.head.querySelector('[data-upload-status-spin]')) {
    styleSheet.setAttribute('data-upload-status-spin', 'true');
    document.head.appendChild(styleSheet);
  }
}

export default function UploadStatus({ status, isUploading, showAdvanced, onToggleAdvanced }) {
  // Determine progress based on status message
  const getProgress = () => {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('checking')) return 10;
    if (statusLower.includes('compiling')) return 30;
    if (statusLower.includes('uploading')) return 50;
    if (statusLower.includes('reconnecting')) return 90;
    if (statusLower.includes('success') || statusLower.includes('running')) return 100;
    if (statusLower.includes('complete')) return 100;
    
    return 0;
  };

  const progress = getProgress();
  const isComplete = progress === 100;
  const hasError = status.toLowerCase().includes('failed') || status.toLowerCase().includes('error');

  return (
    <div style={styles.container}>
      <div style={styles.status}>
        {/* Axie Avatar - spins when uploading */}
        <img 
          src="/images/axie-robot.png" 
          alt="Axie" 
          style={isUploading ? styles.axieSpinning : styles.axie}
        />
        
        {/* Status Icons (only when not uploading) */}
        {!isUploading && isComplete && <span style={{ fontSize: '1.5rem' }}></span>}
        {!isUploading && hasError && <span style={{ fontSize: '1.5rem' }}></span>}
        
        <span style={styles.statusText}>{status}</span>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressBarContainer}>
        <div 
          style={{
            ...styles.progressBar,
            width: `${progress}%`,
            background: hasError 
              ? 'linear-gradient(90deg, #ff4444 0%, #cc0000 100%)'
              : 'linear-gradient(90deg, #e1f14f 0%, #00d4aa 100%)'
          }}
        />
      </div>

      <button 
        style={styles.toggleButton}
        onClick={onToggleAdvanced}
      >
        {showAdvanced ? '▲ Hide Details' : '▼ Show Details'}
      </button>
    </div>
  );
}