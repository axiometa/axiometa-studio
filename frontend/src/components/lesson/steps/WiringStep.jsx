import React, { useState, useEffect } from 'react';
import { getModuleById } from '../../../constants/modules';
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
    marginBottom: '1.5rem',
    fontFamily,
    textAlign: 'left'
  },
  mainContent: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'flex-start'
  },
  kitIconContainer: {
    flexShrink: 0,
    width: '120px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem',
    background: 'rgba(225, 241, 79, 0.05)',
    border: `1px solid ${colors.borderLight}`,
    borderRadius: borderRadius.md
  },
  kitIconImage: {
    width: '80px',
    height: '80px',
    objectFit: 'contain',
    marginBottom: '0.75rem'
  },
  kitIconLabel: {
    color: colors.text.muted,
    fontSize: '0.7rem',
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
    lineHeight: '1.3'
  },
  imageSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  singleImageContainer: {
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
  singleImage: {
    maxWidth: '100%',
    maxHeight: '350px',
    borderRadius: borderRadius.lg,
    border: `2px solid ${colors.borderLight}`
  },
  fullWidthImageContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1rem'
  }
};

export default function WiringStep({ 
  title, 
  instruction, 
  image,
  images,
  kitItem,      // Object format: { name, image } - direct usage
  kitItemId,    // Module ID format: "MTA0007" - lookup from modules
  stepNumber, 
  totalSteps 
}) {
  const [resolvedKitItem, setResolvedKitItem] = useState(null);
  const [imageError, setImageError] = useState(false);
  const hasDualImages = images && images.length === 2;

  useEffect(() => {
    setImageError(false);
    
    // If kitItemId is provided, look up the module first (priority)
    if (kitItemId) {
      const module = getModuleById(kitItemId);
      if (module && module.image) {
        setResolvedKitItem({
          name: module.name,
          image: module.image
        });
        return;
      }
      
      // If not found, wait for Shopify modules to load
      const timer = setTimeout(() => {
        const delayedModule = getModuleById(kitItemId);
        if (delayedModule && delayedModule.image) {
          setResolvedKitItem({
            name: delayedModule.name,
            image: delayedModule.image
          });
        } else {
          console.warn(`Kit item module not found: ${kitItemId}`);
          if (kitItem && kitItem.name) {
            setResolvedKitItem(kitItem);
          } else {
            setResolvedKitItem(null);
          }
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }

    // If kitItem object is provided directly (with name and image), use it
    if (kitItem && kitItem.name) {
      setResolvedKitItem(kitItem);
      return;
    }

    setResolvedKitItem(null);
  }, [kitItem, kitItemId]);

  const handleImageError = () => {
    setImageError(true);
  };

  const renderImages = () => {
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
        <div style={styles.singleImageContainer}>
          <img src={image} alt={title} style={styles.singleImage} />
        </div>
      );
    }
    
    return null;
  };

  return (
    <div style={styles.container}>
      {stepNumber && totalSteps && (
        <div style={{ textAlign: 'left' }}>
          <span style={styles.stepBadge}>Step {stepNumber} of {totalSteps}</span>
        </div>
      )}
      
      <h2 style={styles.title}>{title}</h2>
      
      <p style={styles.instruction}>{instruction}</p>

      {resolvedKitItem && !imageError ? (
        <div style={styles.mainContent}>
          <div style={styles.kitIconContainer}>
            <img 
              src={resolvedKitItem.image} 
              alt={resolvedKitItem.name} 
              style={styles.kitIconImage}
              onError={handleImageError}
            />
            <div style={styles.kitIconLabel}>From your kit:</div>
            <div style={styles.kitIconName}>{resolvedKitItem.name}</div>
          </div>
          
          <div style={styles.imageSection}>
            {renderImages()}
          </div>
        </div>
      ) : (
        <div style={styles.fullWidthImageContainer}>
          {renderImages()}
        </div>
      )}
    </div>
  );
}