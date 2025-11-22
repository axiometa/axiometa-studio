import React, { useRef, useEffect } from 'react';
import { colors, borderRadius, fontFamily, fontFamilyMono } from '../../styles/theme';

const styles = {
  container: {
    background: '#000',
    border: '1px solid #333',
    borderRadius: borderRadius.md,
    padding: '1rem',
    marginBottom: '1rem'
  },
  title: {
    color: colors.primary,
    marginBottom: '0.75rem',
    fontSize: '1rem',
    fontFamily,
    fontWeight: 'bold'
  },
  content: {
    maxHeight: '200px',
    overflow: 'auto'
  },
  line: {
    color: colors.terminal,
    fontFamily: fontFamilyMono,
    fontSize: '0.875rem',
    marginBottom: '0.25rem'
  }
};

export default function SerialMonitor({ logs }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!logs || logs.length === 0) {
    return null;
  }

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>Serial Monitor:</h4>
      <div style={styles.content}>
        {logs.map((log, i) => (
          <div key={i} style={styles.line}>{log}</div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}
