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
    overflow: 'hidden'
  },
  kitIconsWrapper: {
    float: 'left',
    marginRight: '1.5rem',
    marginBottom: '0.5rem',
    display: 'flex',
    flexDirection: 'row',
    gap: '1rem'
  },
  kitIconContainer: {
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
  kitItemIds,
  stepNumber,
  totalSteps
}) {
  const [resolvedKitItems, setResolvedKitItems] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const hasDualImages = images && images.length === 2;

  useEffect(() => {
    setImageErrors({});
    setResolvedKitItems([]);

    // Normalize to array - support both kitItemId and kitItemIds
    const ids = kitItemIds || (kitItemId ? [kitItemId] : []);

    if (ids.length === 0) return;

    const resolveItems = () => {
      const items = ids
        .map(id => {
          const module = getModuleById(id);
          if (module && module.image) {
            return {
              id,
              name: module.name,
              image: module.image
            };
          }
          return null;
        })
        .filter(Boolean);

      if (items.length > 0) {
        setResolvedKitItems(items);
      }
    };

    resolveItems();

    // Retry after delay in case modules aren't loaded yet
    const timer = setTimeout(resolveItems, 300);

    return () => clearTimeout(timer);
  }, [kitItemId, kitItemIds]);

  const handleImageError = (itemId) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
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

  // Filter out items with image errors
  const visibleKitItems = resolvedKitItems.filter(item => !imageErrors[item.id]);

  return (
    <div style={styles.container}>
      {/* Kit items float left, everything else flows around them */}
      {visibleKitItems.length > 0 && (
        <div style={styles.kitIconsWrapper}>
          {visibleKitItems.map(item => (
            <div key={item.id} style={styles.kitIconContainer}>
              <img
                src={item.image}
                alt={item.name}
                style={styles.kitIconImage}
                onError={() => handleImageError(item.id)}
              />
              <div style={styles.kitIconLabel}>You need:</div>
              <div style={styles.kitIconName}>{item.name}</div>
            </div>
          ))}
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