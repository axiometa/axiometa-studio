import React, { useState } from 'react';
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
    background: 'rgba(255, 255, 255, 0.08)',
    border: `2px solid ${colors.primary}`
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
    borderRadius: borderRadius.md
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    borderRadius: borderRadius.md
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem'
  },
  name: {
    fontSize: '1rem',
    color: '#fff',
    fontFamily,
    fontWeight: '600'
  },
  infoIcon: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: '1.5px solid rgba(255, 255, 255, 0.4)',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    cursor: 'help',
    flexShrink: 0
  },
  tooltip: {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: '0.5rem',
    padding: '0.75rem',
    background: 'rgba(0, 0, 0, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.md,
    color: '#fff',
    fontSize: '0.85rem',
    lineHeight: '1.4',
    width: '220px',
    textAlign: 'left',
    zIndex: 1000,
    pointerEvents: 'none',
    fontFamily
  },
  tooltipArrow: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: '6px solid rgba(0, 0, 0, 0.95)'
  },
  requiredFor: {
    fontSize: '0.75rem',
    color: colors.primary,
    fontFamily,
    marginBottom: '0.75rem'
  },
  cornerIcons: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: '0.75rem'
  },
  iconButton: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '0.9rem',
    textDecoration: 'none'
  },
  iconButtonHover: {
    background: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    transform: 'scale(1.1)'
  },
};

export default function ModuleCard({ 
  module, 
  isOwned, 
  onToggle 
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHoveringInfo, setIsHoveringInfo] = useState(false);
  const [isHoveringCart, setIsHoveringCart] = useState(false);
  
  const usageCount = typeof module.requiredFor === 'number' 
    ? module.requiredFor 
    : (module.requiredFor?.length || 0);

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
        {usageCount > 0 && (
          <div style={styles.requiredFor}>
            Required for {usageCount} lesson{usageCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>
      
      <div style={styles.cornerIcons}>
        {/* Info icon - bottom left */}
        {module.description && (
          <div 
            style={{
              ...styles.iconButton,
              ...(isHoveringInfo ? styles.iconButtonHover : {})
            }}
            onMouseEnter={() => {
              setShowTooltip(true);
              setIsHoveringInfo(true);
            }}
            onMouseLeave={() => {
              setShowTooltip(false);
              setIsHoveringInfo(false);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            ⓘ
            {showTooltip && (
              <div style={styles.tooltip}>
                {module.description}
                <div style={styles.tooltipArrow} />
              </div>
            )}
          </div>
        )}
        
        <div style={{ flex: 1 }} />
        
        {/* Cart icon - bottom right */}
        {(module.productUrl || module.purchaseUrl) && (
          <a 
            href={module.productUrl || module.purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...styles.iconButton,
              ...(isHoveringCart ? styles.iconButtonHover : {})
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setIsHoveringCart(true)}
            onMouseLeave={() => setIsHoveringCart(false)}
          >
            🛒
          </a>
        )}
      </div>
    </div>
  );
}