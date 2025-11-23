import React from 'react';
import Button from '../common/Button';
import { colors, gradients, borderRadius, fontFamily } from '../../styles/theme';

const styles = {
  card: {
    background: gradients.primarySubtle,
    border: '2px solid rgba(0, 212, 170, 0)',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  cardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(225, 241, 79, 0.2)'
  },
  imageContainer: {
    width: '100%',
    height: '200px',
    background: '#000',
    overflow: 'hidden',
    position: 'relative'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a1a, #0a0a0a)',
    fontSize: '3rem'
  },
  badge: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    background: colors.primary,
    color: '#000',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    fontFamily
  },
  statusBadge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    fontFamily
  },
  hasParts: {
    background: 'rgba(0, 255, 0, 0.2)',
    border: '1px solid rgba(0, 255, 0, 0.5)',
    color: '#00ff00'
  },
  missingParts: {
    background: 'rgba(255, 0, 0, 0.2)',
    border: '1px solid rgba(255, 0, 0, 0.5)',
    color: '#ff6b6b'
  },
  content: {
    padding: '1.5rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '0.75rem',
    color: '#fff',
    fontFamily,
    fontWeight: 'bold'
  },
  description: {
    color: colors.text.secondary,
    marginBottom: '1.25rem',
    lineHeight: '1.6',
    fontFamily,
    flex: 1,
    fontSize: '0.95rem'
  },
  meta: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1.25rem',
    flexWrap: 'wrap'
  },
  metaItem: {
    color: colors.text.tertiary,
    fontSize: '0.9rem',
    fontFamily,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  buttonContainer: {
    marginTop: 'auto'
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
  onStart 
}) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div 
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {})
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
            style={styles.image}
            onError={(e) => e.target.style.display = 'none'}
          />
        ) : (
          <div style={styles.imagePlaceholder}>
            🎓
          </div>
        )}
        
        {/* Lesson Number Badge */}
        <div style={styles.badge}>
          Lesson {lessonNumber} • {boardName}
        </div>

        {/* Parts Status Badge */}
        <div style={{
          ...styles.statusBadge,
          ...(hasRequiredParts ? styles.hasParts : styles.missingParts)
        }}>
          {hasRequiredParts ? '✓ Ready' : 'Missing Parts'}
        </div>
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
          <span style={styles.metaItem}>
            🎯 {challenges} Challenges
          </span>
        </div>

        <div style={styles.buttonContainer}>
          <Button 
            fullWidth
            disabled={!hasRequiredParts}
            onClick={onStart}
          >
            {hasRequiredParts ? 'Start Learning' : 'Get Required Parts'}
          </Button>
        </div>
      </div>
    </div>
  );
}