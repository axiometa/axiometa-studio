import React from 'react';
import { colors, borderRadius, fontFamily } from '../../../styles/theme';

const styles = {
  title: {
    fontSize: '2.25rem',
    marginBottom: '1.5rem',
    color: colors.primary,
    fontFamily
  },
  container: {
    display: 'flex',
    gap: '2rem',
    marginBottom: '2rem',
    alignItems: 'flex-start'
  },
  stepNumber: {
    background: colors.primary,
    color: '#000',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    flexShrink: 0
  },
  content: {
    flex: 1
  },
  instruction: {
    fontSize: '1.125rem',
    marginBottom: '1rem',
    color: '#fff',
    fontFamily
  },
  imageContainer: {
    background: '#000',
    padding: '1rem',
    borderRadius: borderRadius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px'
  },
  image: {
    maxWidth: '100%',
    maxHeight: '500px',
    objectFit: 'contain',
    borderRadius: '4px'
  },
  progress: {
    textAlign: 'center',
    color: colors.text.muted,
    fontSize: '0.9rem'
  }
};

export default function WiringStep({ title, stepNumber, totalSteps, instruction, image }) {
  return (
    <>
      <h1 style={styles.title}>{title}</h1>
      <div style={styles.container}>
        <div style={styles.stepNumber}>{stepNumber}</div>
        <div style={styles.content}>
          <p style={styles.instruction}>{instruction}</p>
          {image && (
            <div style={styles.imageContainer}>
              <img 
                src={image}
                alt={title}
                style={styles.image}
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}
        </div>
      </div>
      <div style={styles.progress}>
        Step {stepNumber} of {totalSteps}
      </div>
    </>
  );
}
