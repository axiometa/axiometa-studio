import React, { useState, useEffect } from 'react';
import { getModuleById } from '../../../constants/modules';
import { colors, borderRadius, fontFamily } from '../../../styles/theme';

const styles = {
  container: {
    padding: '2rem'
  },
  header: {
    marginBottom: '1rem'
  },
  title: {
    fontSize: '1.5rem',
    color: colors.primary,
    marginBottom: '0.5rem',
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
  contentArea: {
    marginBottom: '1.5rem',
    overflow: 'hidden' // clearfix
  },
  kitIconContainer: {
    float: 'left',
    marginRight: '1.5rem',
    marginBottom: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem',
    background: 'rgba(225, 241, 79, 0.05)',
    border: `1px solid ${colors.borderLight}`,
    borderRadius: borderRadius.md
  },
  kitIconImage: {
    width: '100px',
    height: '100px',
    objectFit: 'contain',
    marginBottom: '0.75rem'
  },
  kitIconLabel: {
    color: colors.text.muted,
    fontSize: '0.75rem',
    textAlign: 'center',
    marginBottom: '0.25rem',
    fontFamily
  },
  kitIconName: {
    color: colors.primary,
    fontSize: '0.85rem',
    fontWeight: '600',
    textAlign: 'center',
    fontFamily,
    lineHeight: '1.2',
    maxWidth: '110px'
  },
  instruction: {
    color: colors.text.secondary,
    fontSize: '1.1rem',
    lineHeight: '1.8',
    fontFamily,
    textAlign: 'left',
    margin: 0
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
  },
  dualImageContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    width: '100%'
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
  mainImage: {
    maxWidth: '100%',
    maxHeight: '400px',
    borderRadius: borderRadius.lg,
    border: `2px solid ${colors.borderLight}`
  }
};

export default function WiringStep({ 
  title, 
  instruction, 
  image,
  images,
  kitItemId,
  stepNumber, 
  totalSteps 
}) {
  const [resolvedKitItem, setResolvedKitItem] = useState(null);
  const [imageError, setImageError] = useState(false);
  const hasDualImages = images && images.length === 2;

  useEffect(() => {
    setImageError(false);
    setResolvedKitItem(null);
    
    if (!kitItemId) return;

    const module = getModuleById(kitItemId);
    if (module && module.image) {
      setResolvedKitItem({
        name: module.name,
        image: module.image
      });
      return;
    }
    
    const timer = setTimeout(() => {
      const delayedModule = getModuleById(kitItemId);
      if (delayedModule && delayedModule.image) {
        setResolvedKitItem({
          name: delayedModule.name,
          image: delayedModule.image
        });
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [kitItemId]);

  const handleImageError = () => {
    setImageError(true);
  };

  const renderMainImage = () => {
    if (hasDualImages) {
      return (
        <div style={styles.dualImageContainer}>
          {images.map((img, index) => (
            <div key={index} style={styles.imageBox}>
              {img.label && <div style={styles.imageLabel}>{img.label}</div>}
              <img src={img.src} alt={img.label || title} style={styles.image} />
            </div>
          ))}
        </div>
      );
    }
    
    if (image) {
      return (
        <div style={styles.imageContainer}>
          <img src={image} alt={title} style={styles.mainImage} />
        </div>
      );
    }
    
    return null;
  };

  const showKitItem = resolvedKitItem && !imageError;

  return (
    <div style={styles.container}>
      {/* Kit item floats left, everything else flows around it */}
      {showKitItem && (
        <div style={styles.kitIconContainer}>
          <img 
            src={resolvedKitItem.image} 
            alt={resolvedKitItem.name} 
            style={styles.kitIconImage}
            onError={handleImageError}
          />
          <div style={styles.kitIconLabel}>You need: </div>
          <div style={styles.kitIconName}>{resolvedKitItem.name}</div>
        </div>
      )}
      
      <div style={styles.header}>
        {stepNumber && totalSteps && (
          <div style={{ textAlign: 'left' }}>
            <span style={styles.stepBadge}>Step {stepNumber} of {totalSteps}</span>
          </div>
        )}
        
        <h2 style={styles.title}>{title}</h2>
      </div>
      
      <div style={styles.contentArea}>
        <p style={styles.instruction}>{instruction}</p>
      </div>

      {/* Main image below, unaffected by float */}
      <div style={{ clear: 'both' }}>
        {renderMainImage()}
      </div>
    </div>
  );
}