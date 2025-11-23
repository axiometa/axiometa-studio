import React, { useRef, useEffect, useState } from 'react';
import { colors, borderRadius, fontFamily, fontFamilyMono } from '../../styles/theme';

const styles = {
  container: {
    background: '#000',
    border: '1px solid #333',
    borderRadius: borderRadius.md,
    padding: '1rem',
    marginBottom: '1rem',
    position: 'relative'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem'
  },
  title: {
    color: colors.primary,
    fontSize: '1rem',
    fontFamily,
    fontWeight: 'bold',
    margin: 0
  },
  controls: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  },
  button: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: colors.text.secondary,
    padding: '0.4rem 0.8rem',
    borderRadius: borderRadius.sm,
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontFamily,
    transition: 'all 0.2s'
  },
  content: {
    maxHeight: '200px',
    overflow: 'auto',
    position: 'relative'
  },
  line: {
    color: colors.terminal,
    fontFamily: fontFamilyMono,
    fontSize: '0.875rem',
    marginBottom: '0.25rem',
    lineHeight: '1.4',
    wordBreak: 'break-all'
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: '0.5rem',
    right: '0.5rem',
    background: 'rgba(225, 241, 79, 0.9)',
    color: '#000',
    padding: '0.4rem 0.8rem',
    borderRadius: borderRadius.sm,
    fontSize: '0.75rem',
    fontWeight: 'bold',
    fontFamily,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    zIndex: 10,
    animation: 'pulse 1.5s ease-in-out infinite'
  },
  emptyState: {
    color: colors.text.muted,
    fontFamily,
    fontSize: '0.875rem',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '2rem 1rem'
  }
};

// Add pulse animation
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  `;
  if (!document.head.querySelector('[data-serial-monitor-pulse]')) {
    styleSheet.setAttribute('data-serial-monitor-pulse', 'true');
    document.head.appendChild(styleSheet);
  }
}

export default function SerialMonitor({ logs }) {
  const contentRef = useRef(null);
  const endRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Check if user is at the bottom
  const isAtBottom = () => {
    if (!contentRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    return scrollHeight - scrollTop - clientHeight < 50; // 50px threshold
  };

  // Handle scroll event - show button if not at bottom
  const handleScroll = () => {
    const atBottom = isAtBottom();
    setShowScrollButton(!atBottom && logs && logs.length > 0);
  };

  // Show scroll button when new messages arrive and user is scrolled up
  useEffect(() => {
    if (logs && logs.length > 0 && !isAtBottom()) {
      setShowScrollButton(true);
    }
  }, [logs]);

  // Scroll to bottom when button clicked
  const scrollToBottom = () => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
      setShowScrollButton(false);
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  };

  if (!logs || logs.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h4 style={styles.title}>Serial Monitor</h4>
        </div>
        <div style={styles.emptyState}>
          Waiting for serial output...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h4 style={styles.title}>Serial Monitor ({logs.length} lines)</h4>
        <div style={styles.controls}>
          <button 
            style={styles.button}
            onClick={scrollToTop}
            title="Scroll to top"
          >
            ⬆️ Top
          </button>
          <button 
            style={styles.button}
            onClick={scrollToBottom}
            title="Scroll to bottom"
          >
            ⬇️ Bottom
          </button>
        </div>
      </div>
      
      <div 
        style={styles.content}
        ref={contentRef}
        onScroll={handleScroll}
      >
        {logs.map((log, i) => (
          <div key={i} style={styles.line}>{log}</div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Show floating indicator when scrolled up with new messages */}
      {showScrollButton && (
        <div 
          style={styles.scrollIndicator}
          onClick={scrollToBottom}
        >
          ↓ New messages
        </div>
      )}
    </div>
  );
}