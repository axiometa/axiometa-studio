import React from 'react';
import { colors, borderRadius, fontFamily } from '../../../styles/theme';

const styles = {
  container: {
    padding: '2rem'
  },
  title: {
    fontSize: '1.5rem',
    color: colors.primary,
    marginBottom: '1rem',
    fontFamily,
    textAlign: 'left'
  },
  stepBadge: {
    display: 'inline-block',
    background: 'rgba(225, 241, 79, 0.15)',
    color: colors.primary,
    padding: '0.25rem 0.75rem',
    borderRadius: borderRadius.sm,
    fontSize: '0.85rem',
    fontFamily,
    marginBottom: '1rem'
  },
  instruction: {
    color: colors.text.secondary,
    fontSize: '1.1rem',
    lineHeight: '1.8',
    whiteSpace: 'pre-line',
    marginBottom: '2rem',
    fontFamily,
    textAlign: 'left'
  },
  singleImageContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem'
  },
  dualImageContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  imageBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  imageLabel: {
    color: colors.primary,
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
    fontFamily
  },
  image: {
    maxWidth: '100%',
    maxHeight: '300px',
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.borderLight}`
  },
  singleImage: {
    maxWidth: '100%',
    maxHeight: '350px',
    borderRadius: borderRadius.lg,
    border: `2px solid ${colors.borderLight}`
  },
  kitReference: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: '#0a0a0a',
    borderRadius: borderRadius.md,
    marginBottom: '1.5rem'
  },
  kitImage: {
    width: '80px',
    height: '80px',
    objectFit: 'contain',
    borderRadius: borderRadius.sm,
    border: `1px solid ${colors.borderLight}`
  },
  kitInfo: {
    flex: 1
  },
  kitLabel: {
    color: colors.text.muted,
    fontSize: '0.85rem',
    marginBottom: '0.25rem',
    fontFamily
  },
  kitName: {
    color: colors.primary,
    fontSize: '1.1rem',
    fontWeight: '600',
    fontFamily
  }
};

export default function WiringStep({ 
  title, 
  instruction, 
  image,
  images,
  kitItem,
  stepNumber, 
  totalSteps 
}) {
  const hasDualImages = images && images.length === 2;

  return (
    <div style={styles.container}>
      {stepNumber && totalSteps && (
        <div style={{ textAlign: 'left' }}>
          <span style={styles.stepBadge}>Step {stepNumber} of {totalSteps}</span>
        </div>
      )}
      
      <h2 style={styles.title}>{title}</h2>
      
      <p style={styles.instruction}>{instruction}</p>

      {kitItem && (
        <div style={styles.kitReference}>
          <img 
            src={kitItem.image} 
            alt={kitItem.name} 
            style={styles.kitImage} 
          />
          <div style={styles.kitInfo}>
            <div style={styles.kitLabel}>From your kit:</div>
            <div style={styles.kitName}>{kitItem.name}</div>
          </div>
        </div>
      )}

      {hasDualImages ? (
        <div style={styles.dualImageContainer}>
          {images.map((img, index) => (
            <div key={index} style={styles.imageBox}>
              {img.label && <div style={styles.imageLabel}>{img.label}</div>}
              <img src={img.src} alt={img.label || title} style={styles.image} />
            </div>
          ))}
        </div>
      ) : image && (
        <div style={styles.singleImageContainer}>
          <img src={image} alt={title} style={styles.singleImage} />
        </div>
      )}
    </div>
  );
}