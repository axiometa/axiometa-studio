import React, { useRef, useEffect } from 'react';
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
  emptyState: {
    color: colors.text.muted,
    fontFamily,
    fontSize: '0.875rem',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '2rem 1rem'
  }
};

export default function SerialMonitor({ logs }) {
  const contentRef = useRef(null);

  // ✅ Always scroll to bottom when new messages arrive
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [logs]);

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
      </div>
      
      <div 
        style={styles.content}
        ref={contentRef}
      >
        {logs.map((log, i) => (
          <div key={i} style={styles.line}>{log}</div>
        ))}
      </div>
    </div>
  );
}