import React, { useState, useEffect } from 'react';
import { connectionService } from '../../../services/connection';
import { colors, borderRadius, fontFamily } from '../../../styles/theme';

const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center'
  },
  title: {
    fontSize: '1.75rem',
    color: colors.primary,
    marginBottom: '1.5rem',
    fontFamily,
    textAlign: 'left'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem'
  },
  iconContainer: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3.5rem',
    transition: 'all 0.3s ease'
  },
  iconDisconnected: {
    background: 'rgba(255, 107, 107, 0.1)',
    border: '3px solid rgba(255, 107, 107, 0.5)'
  },
  iconConnecting: {
    background: 'rgba(255, 193, 7, 0.1)',
    border: '3px solid rgba(255, 193, 7, 0.5)',
    animation: 'pulse 1.5s ease-in-out infinite'
  },
  iconConnected: {
    background: 'rgba(0, 212, 170, 0.1)',
    border: '3px solid rgba(0, 212, 170, 0.5)'
  },
  statusText: {
    fontSize: '1.25rem',
    fontFamily,
    fontWeight: '600'
  },
  statusDisconnected: {
    color: '#ff6b6b'
  },
  statusConnecting: {
    color: '#ffc107'
  },
  statusConnected: {
    color: '#00d4aa'
  },
  instruction: {
    color: colors.text.secondary,
    fontSize: '1.1rem',
    lineHeight: '1.8',
    fontFamily,
    maxWidth: '500px',
    textAlign: 'center'
  },
  connectButton: {
    background: colors.primary,
    color: '#000',
    border: 'none',
    padding: '1rem 2.5rem',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontFamily,
    fontWeight: '600',
    fontSize: '1.1rem',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  connectButtonDisabled: {
    background: '#333',
    color: '#666',
    cursor: 'not-allowed'
  },
  connectedMessage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  },
  successBadge: {
    background: 'rgba(0, 212, 170, 0.15)',
    border: '1px solid rgba(0, 212, 170, 0.5)',
    color: '#00d4aa',
    padding: '0.75rem 1.5rem',
    borderRadius: borderRadius.md,
    fontFamily,
    fontWeight: '600',
    fontSize: '1rem'
  },
  continueHint: {
    color: colors.text.muted,
    fontSize: '0.95rem',
    fontFamily,
    marginTop: '1rem'
  },
  errorMessage: {
    color: '#ff6b6b',
    fontSize: '0.95rem',
    fontFamily,
    marginTop: '0.5rem',
    maxWidth: '400px',
    textAlign: 'center'
  },
  tipBox: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${colors.borderLight}`,
    borderRadius: borderRadius.md,
    padding: '1rem 1.5rem',
    marginTop: '1rem',
    maxWidth: '450px'
  },
  tipTitle: {
    color: colors.primary,
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    fontFamily
  },
  tipText: {
    color: colors.text.tertiary,
    fontSize: '0.85rem',
    lineHeight: '1.6',
    fontFamily
  }
};

// Inject CSS animation for pulse effect
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.8; }
    }
  `;
  if (!document.head.querySelector('[data-connection-check-styles]')) {
    styleSheet.setAttribute('data-connection-check-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

export default function ConnectionCheckStep({ 
  title = "Connect Your PIXIE",
  instruction = "Make sure your PIXIE M1 is connected via USB before continuing.",
  onConnected
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Check connection status on mount and periodically
  useEffect(() => {
    const checkConnection = () => {
      const connected = connectionService.getConnectionStatus();
      setIsConnected(connected);
      
      // If connected, notify parent
      if (connected && onConnected) {
        onConnected();
      }
    };
    
    checkConnection();
    
    // Check every second to sync state
    const interval = setInterval(checkConnection, 1000);
    
    return () => clearInterval(interval);
  }, [onConnected]);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      await connectionService.connect();
      setIsConnected(true);
      
      if (onConnected) {
        onConnected();
      }
    } catch (err) {
      console.error('Connection failed:', err);
      setError(err.message || 'Failed to connect. Please try again.');
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const getIcon = () => {
    if (isConnected) return '🔌';
    if (isConnecting) return '⏳';
    return '🔌';
  };

  const getIconStyle = () => {
    if (isConnected) return { ...styles.iconContainer, ...styles.iconConnected };
    if (isConnecting) return { ...styles.iconContainer, ...styles.iconConnecting };
    return { ...styles.iconContainer, ...styles.iconDisconnected };
  };

  const getStatusText = () => {
    if (isConnected) return 'Connected';
    if (isConnecting) return 'Connecting...';
    return 'Not Connected';
  };

  const getStatusStyle = () => {
    if (isConnected) return { ...styles.statusText, ...styles.statusConnected };
    if (isConnecting) return { ...styles.statusText, ...styles.statusConnecting };
    return { ...styles.statusText, ...styles.statusDisconnected };
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{title}</h2>
      
      <div style={styles.content}>
        {/* Status Icon */}
        <div style={getIconStyle()}>
          {getIcon()}
        </div>

        {/* Status Text */}
        <div style={getStatusStyle()}>
          {getStatusText()}
        </div>

        {/* Connected State */}
        {isConnected ? (
          <div style={styles.connectedMessage}>
            <div style={styles.successBadge}>
              ✓ PIXIE M1 Connected
            </div>
            <p style={styles.continueHint}>
              Click "Next" to continue with the lesson
            </p>
          </div>
        ) : (
          <>
            {/* Instruction */}
            <p style={styles.instruction}>{instruction}</p>

            {/* Connect Button */}
            <button
              style={{
                ...styles.connectButton,
                ...(isConnecting ? styles.connectButtonDisabled : {})
              }}
              onClick={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <span>⏳</span>
                  Connecting...
                </>
              ) : (
                <>
                  <span>🔌</span>
                  Connect PIXIE
                </>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <p style={styles.errorMessage}>
                ⚠️ {error}
              </p>
            )}

            {/* Tips */}
            <div style={styles.tipBox}>
              <div style={styles.tipTitle}>💡 Connection Tips</div>
              <div style={styles.tipText}>
                • Use a USB-C cable that supports data (not charge-only)<br/>
                • The power LED on PIXIE should be lit<br/>
                • Use Chrome or Edge browser (Web Serial required)<br/>
                • Select "PIXIE M1" or "ESP32-S3" from the port list
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}