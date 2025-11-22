import React from 'react';
import { colors, gradients, borderRadius, fontFamily } from '../../styles/theme';

const styles = {
  card: {
    background: gradients.primarySubtle,
    border: '2px solid rgba(0, 212, 170, 0.3)',
    borderRadius: borderRadius.xl,
    padding: '1.5rem',
    marginBottom: '1rem'
  },
  main: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '1rem'
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: gradients.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(0, 212, 170, 0.3)'
  },
  avatarImg: {
    width: '56px',
    height: '56px',
    borderRadius: '50%'
  },
  content: {
    flex: 1
  },
  title: {
    color: '#fff',
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
    fontFamily
  },
  progressContainer: {
    width: '100%',
    height: '8px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    background: gradients.primary,
    borderRadius: '4px',
    animation: 'progress 1.5s ease-in-out infinite',
    width: '40%'
  },
  toggleButton: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${colors.borderLight}`,
    color: colors.text.tertiary,
    padding: '0.5rem 1rem',
    borderRadius: borderRadius.sm,
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontFamily,
    transition: 'all 0.2s'
  }
};

export default function UploadStatus({ 
  status, 
  isUploading, 
  showAdvanced, 
  onToggleAdvanced 
}) {
  return (
    <div style={styles.card}>
      <div style={styles.main}>
        <div style={styles.avatar}>
          <img 
            src="/images/axie-robot.png" 
            alt="Axie"
            style={styles.avatarImg}
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
        <div style={styles.content}>
          <div style={styles.title}>{status}</div>
          {isUploading && (
            <div style={styles.progressContainer}>
              <div style={styles.progressBar} />
            </div>
          )}
        </div>
      </div>
      <button 
        style={styles.toggleButton}
        onClick={onToggleAdvanced}
      >
        {showAdvanced ? '▼ Hide Details' : '▶ Advanced'}
      </button>
    </div>
  );
}
