import React from 'react';
import Button from '../common/Button';
import { colors, gradients, borderRadius, fontFamily } from '../../styles/theme';

const styles = {
  card: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative'
  },
  cardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
  },
  cardCompleted: {
    borderColor: 'rgba(0, 212, 170, 0.3)'
  },
  imageContainer: {
    width: '100%',
    height: '140px',
    background: '#000',
    overflow: 'hidden',
    position: 'relative'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease'
  },
  imageHover: {
    transform: 'scale(1.05)'
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a1a, #0a0a0a)',
    fontSize: '2.5rem'
  },
  statusBadge: {
    position: 'absolute',
    top: '0.75rem',
    right: '0.75rem',
    padding: '0.35rem 0.7rem',
    borderRadius: '16px',
    fontSize: '0.7rem',
    fontWeight: '600',
    fontFamily,
    backdropFilter: 'blur(8px)',
    zIndex: 2
  },
  hasParts: {
    background: 'rgba(0, 212, 170, 0.2)',
    border: '1px solid rgba(0, 212, 170, 0.4)',
    color: '#00d4aa'
  },
  missingParts: {
    background: 'rgba(255, 107, 107, 0.2)',
    border: '1px solid rgba(255, 107, 107, 0.4)',
    color: '#ff6b6b'
  },
  completedBadge: {
    background: 'rgba(0, 212, 170, 0.9)',
    color: '#000',
    border: 'none'
  },
  content: {
    padding: '1.25rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    fontSize: '1.1rem',
    marginBottom: '0.5rem',
    color: '#fff',
    fontFamily,
    fontWeight: '600',
    lineHeight: '1.3'
  },
  description: {
    color: colors.text.tertiary,
    marginBottom: '1rem',
    lineHeight: '1.5',
    fontFamily,
    flex: 1,
    fontSize: '0.85rem',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  meta: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    flexWrap: 'wrap'
  },
  metaItem: {
    color: colors.text.muted,
    fontSize: '0.8rem',
    fontFamily,
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem'
  },
  buttonContainer: {
    marginTop: 'auto'
  },
  accentBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '3px',
    opacity: 0,
    transition: 'opacity 0.3s ease'
  },
  accentBarHover: {
    opacity: 1
  }
};

export default function LessonCard({ 
  lessonNumber, 
  boardName,
  title, 
  description, 
  duration, 
  xp, 
  challenges,
  hasRequiredParts,
  image,
  isCompleted = false,
  isLocked = false,
  accentColor = colors.primary,
  onStart 
}) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div 
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {}),
        ...(isCompleted ? styles.cardCompleted : {}),
        borderColor: isHovered ? `${accentColor}40` : (isCompleted ? 'rgba(0, 212, 170, 0.3)' : 'rgba(255, 255, 255, 0.06)')
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div style={styles.imageContainer}>
        {image ? (
          <img 
            src={image} 
            alt={title}
            style={{
              ...styles.image,
              ...(isHovered ? styles.imageHover : {})
            }}
            onError={(e) => e.target.style.display = 'none'}
          />
        ) : (
          <div style={styles.imagePlaceholder}>
            🎓
          </div>
        )}

        {/* Status Badge */}
        {isCompleted ? (
          <div style={{...styles.statusBadge, ...styles.completedBadge}}>
            ✓ Completed
          </div>
        ) : (
          <div style={{
            ...styles.statusBadge,
            ...(hasRequiredParts ? styles.hasParts : styles.missingParts)
          }}>
            {hasRequiredParts ? '✓ Ready' : 'Missing Parts'}
          </div>
        )}

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: 'linear-gradient(transparent, rgba(10, 10, 10, 0.95))',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Content */}
      <div style={styles.content}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.description}>{description}</p>
        
        <div style={styles.meta}>
          <span style={styles.metaItem}>
            ⏱️ {duration} min
          </span>
          <span style={styles.metaItem}>
            ⭐ {xp} XP
          </span>
          {challenges > 0 && (
            <span style={styles.metaItem}>
              🎯 {challenges} Challenge{challenges > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div style={styles.buttonContainer}>
          <Button 
            fullWidth
            disabled={!hasRequiredParts || isLocked}
            onClick={onStart}
            style={{
              background: isCompleted ? 'rgba(0, 212, 170, 0.2)' : undefined,
              borderColor: isCompleted ? 'rgba(0, 212, 170, 0.4)' : undefined
            }}
          >
            {isCompleted ? 'Review Lesson' : (hasRequiredParts ? 'Start Lesson' : 'Get Required Parts')}
          </Button>
        </div>
      </div>

      {/* Accent bar */}
      <div
        style={{
          ...styles.accentBar,
          ...(isHovered ? styles.accentBarHover : {}),
          background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)`
        }}
      />
    </div>
  );
}