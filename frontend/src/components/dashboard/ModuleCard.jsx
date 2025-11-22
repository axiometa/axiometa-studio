import React from 'react';
import { colors, borderRadius, fontFamily } from '../../styles/theme';

const styles = {
  card: {
    background: colors.surface,
    border: `2px solid ${colors.borderLight}`,
    borderRadius: borderRadius.lg,
    padding: '1.5rem',
    transition: 'all 0.2s',
    position: 'relative',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column'
  },
  cardOwned: {
    background: 'rgba(0, 212, 170, 0.08)',
    borderColor: colors.primary
  },
  clickArea: {
    cursor: 'pointer',
    flex: 1
  },
  checkbox: {
    position: 'absolute',
    top: '0.75rem',
    right: '0.75rem',
    width: '24px',
    height: '24px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.3)'
  },
  checkIcon: {
    color: colors.primary,
    fontSize: '1rem',
    fontWeight: 'bold'
  },
  imageContainer: {
    width: '100%',
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: borderRadius.md
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  },
  name: {
    fontSize: '1rem',
    color: '#fff',
    marginBottom: '0.5rem',
    fontFamily,
    fontWeight: '600'
  },
  description: {
    color: colors.text.muted,
    fontSize: '0.85rem',
    marginBottom: '0.75rem',
    fontFamily
  },
  requiredFor: {
    fontSize: '0.75rem',
    color: colors.primary,
    fontFamily
  },
  purchaseLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '1rem',
    padding: '0.5rem',
    background: 'rgba(0, 212, 170, 0.1)',
    border: '1px solid rgba(0, 212, 170, 0.3)',
    borderRadius: borderRadius.sm,
    color: colors.primary,
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: '500',
    fontFamily,
    transition: 'all 0.2s'
  }
};

export default function ModuleCard({ 
  module, 
  isOwned, 
  onToggle 
}) {
  return (
    <div style={{
      ...styles.card,
      ...(isOwned ? styles.cardOwned : {})
    }}>
      <div style={styles.clickArea} onClick={onToggle}>
        <div style={styles.checkbox}>
          {isOwned && <span style={styles.checkIcon}>✓</span>}
        </div>
        <div style={styles.imageContainer}>
          <img 
            src={module.image} 
            alt={module.name}
            style={styles.image}
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
        <h4 style={styles.name}>{module.name}</h4>
        <p style={styles.description}>{module.description}</p>
        {module.requiredFor.length > 0 && (
          <div style={styles.requiredFor}>
            Required for {module.requiredFor.length} lesson(s)
          </div>
        )}
      </div>
      <a 
        href={module.purchaseUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={styles.purchaseLink}
        onClick={(e) => e.stopPropagation()}
      >
        <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>ⓘ</span> Learn More
      </a>
    </div>
  );
}
