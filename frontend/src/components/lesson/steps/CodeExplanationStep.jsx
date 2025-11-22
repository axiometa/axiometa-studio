import React from 'react';
import { colors, borderRadius, fontFamily, fontFamilyMono } from '../../../styles/theme';

const styles = {
  title: {
    fontSize: '2.25rem',
    marginBottom: '1.5rem',
    color: colors.primary,
    fontFamily
  },
  codeBlockContainer: {
    marginBottom: '2rem'
  },
  codeBlock: {
    background: '#000',
    padding: '1.5rem',
    borderRadius: borderRadius.md,
    overflow: 'auto',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: '#fff',
    fontFamily: fontFamilyMono,
    margin: 0
  },
  explanations: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  explanation: {
    background: '#000000ff',
    border: '1px solid rgba(225, 241, 79, 0.88)',
    borderRadius: borderRadius.md,
    padding: '1rem'
  },
  highlightedCode: {
    background: colors.primary,
    color: '#000',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.95rem',
    fontFamily: fontFamilyMono,
    display: 'inline-block',
    marginBottom: '0.5rem'
  },
  explanationText: {
    color: colors.text.secondary,
    lineHeight: '1.6',
    margin: 0,
    fontFamily
  }
};

export default function CodeExplanationStep({ title, code, explanations }) {
  return (
    <>
      <h1 style={styles.title}>{title}</h1>
      <div style={styles.codeBlockContainer}>
        <pre style={styles.codeBlock}>{code}</pre>
      </div>
      <div style={styles.explanations}>
        {explanations.map((exp, i) => (
          <div key={i} style={styles.explanation}>
            <code style={styles.highlightedCode}>{exp.highlight}</code>
            <p style={styles.explanationText}>{exp.explanation}</p>
          </div>
        ))}
      </div>
    </>
  );
}
