import React, { useState } from 'react';
import { colors, borderRadius, fontFamily } from '../../../styles/theme';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  header: {
    marginBottom: '1.5rem'
  },
  title: {
    fontSize: '2.25rem',
    marginBottom: '0.5rem',  // ✅ REDUCED from 1rem
    color: colors.primary,
    fontFamily
  },
  stepIndicator: {
    fontSize: '1rem',
    color: colors.text.muted,
    marginBottom: '0.75rem',  // ✅ REDUCED from 1.5rem
    fontFamily
  },
  instruction: {
    fontSize: '1.125rem',
    lineHeight: '1.8',
    color: colors.text.secondary,
    marginBottom: '2rem',
    fontFamily
  },
  imageContainer: {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    position: 'relative',
    cursor: 'zoom-in'
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: borderRadius.lg,
    border: `2px solid ${colors.borderLight}`,
    transition: 'transform 0.2s ease'
  },
  imageHover: {
    transform: 'scale(1.02)'
  },
  magnifyIcon: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'rgba(0, 0, 0, 0.7)',
    color: colors.primary,
    padding: '0.5rem 0.75rem',
    borderRadius: borderRadius.sm,
    fontSize: '0.875rem',
    fontFamily,
    fontWeight: '600',
    pointerEvents: 'none',
    opacity: 0,
    transition: 'opacity 0.2s ease'
  },
  magnifyIconVisible: {
    opacity: 1
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.95)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    cursor: 'zoom-out',
    padding: '2rem'
  },
  modalImage: {
    maxWidth: '95%',
    maxHeight: '95%',
    width: 'auto',
    height: 'auto',
    borderRadius: borderRadius.lg,
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
  },
  closeHint: {
    position: 'absolute',
    top: '2rem',
    right: '2rem',
    color: colors.text.muted,
    fontSize: '1rem',
    fontFamily
  }
};

export default function WiringStep({ title, instruction, image, stepNumber, totalSteps }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>{title}</h1>
          
          {stepNumber && totalSteps && (
            <div style={styles.stepIndicator}>
              Step {stepNumber} of {totalSteps}
            </div>
          )}
          
          <p style={styles.instruction}>{instruction}</p>
        </div>
        
        {image && (
          <div 
            style={styles.imageContainer}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsZoomed(true)}
          >
            <img 
              src={image} 
              alt={title}
              style={{
                ...styles.image,
                ...(isHovered ? styles.imageHover : {})
              }}
            />
            <div style={{
              ...styles.magnifyIcon,
              ...(isHovered ? styles.magnifyIconVisible : {})
            }}>
              🔍 Click to zoom
            </div>
          </div>
        )}
      </div>

      {/* Lightbox/Zoom Modal */}
      {isZoomed && (
        <div 
          style={styles.modal}
          onClick={() => setIsZoomed(false)}
        >
          <div style={styles.closeHint}>
            Click anywhere to close
          </div>
          <img 
            src={image} 
            alt={title}
            style={styles.modalImage}
          />
        </div>
      )}
    </>
  );
}