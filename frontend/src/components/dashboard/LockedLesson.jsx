import React from 'react';
import { colors, borderRadius, fontFamily } from '../../styles/theme';

const styles = {
  container: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.lg,
    padding: '1.5rem',
    textAlign: 'center',
    opacity: 0.5
  },
  icon: {
    fontSize: '2rem',
    marginBottom: '0.5rem'
  },
  title: {
    fontSize: '1.125rem',
    marginBottom: '0.25rem',
    color: '#fff',
    fontFamily
  },
  text: {
    color: colors.text.muted,
    fontSize: '0.875rem',
    margin: 0,
    fontFamily
  }
};

export default function LockedLesson({ title, unlockText }) {
  return (
    <div style={styles.container}>
      <div style={styles.icon}>🔒</div>
      <h4 style={styles.title}>{title}</h4>
      <p style={styles.text}>{unlockText}</p>
    </div>
  );
}
