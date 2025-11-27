import React, { useState } from 'react';
import { colors, borderRadius, fontFamily } from '../../styles/theme';

const styles = {
  card: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid rgba(255, 255, 255, 0.06)'
  },
  cardHover: {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
  },
  cardLocked: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    transition: 'opacity 0.4s ease',
    pointerEvents: 'none',
    zIndex: 1
  },
  glowOverlayHover: {
    opacity: 1
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #1a1a1a, #0a0a0a)'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  imageHover: {
    transform: 'scale(1.1)'
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '4rem',
    background: 'linear-gradient(135deg, #1a1a1a, #0a0a0a)'
  },
  badges: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    right: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 2
  },
  difficultyBadge: {
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '700',
    fontFamily,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    backdropFilter: 'blur(10px)'
  },
  statusBadge: {
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    fontFamily,
    backdropFilter: 'blur(10px)'
  },
  content: {
    position: 'relative',
    padding: '1.5rem',
    zIndex: 2
  },
  title: {
    fontSize: '1.35rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '0.5rem',
    fontFamily,
    lineHeight: '1.3'
  },
  description: {
    fontSize: '0.9rem',
    color: colors.text.tertiary,
    lineHeight: '1.6',
    fontFamily,
    marginBottom: '1.25rem'
  },
  meta: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.85rem',
    color: colors.text.muted,
    fontFamily
  },
  metaIcon: {
    fontSize: '1rem'
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    backdropFilter: 'blur(4px)'
  },
  lockedIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  lockedText: {
    color: colors.text.muted,
    fontSize: '1rem',
    fontFamily,
    fontWeight: '600'
  },
  cornerAccent: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '100px',
    height: '100px',
    opacity: 0.1,
    transition: 'opacity 0.4s ease'
  },
  cornerAccentHover: {
    opacity: 0.2
  }
};

const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'beginner':
      return { bg: 'rgba(0, 212, 170, 0.2)', color: '#00d4aa', border: 'rgba(0, 212, 170, 0.4)' };
    case 'intermediate':
      return { bg: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.4)' };
    case 'advanced':
      return { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.4)' };
    default:
      return { bg: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: 'rgba(255, 255, 255, 0.2)' };
  }
};

export default function KitCard({
  kit,
  lessonCount = 0,
  onClick
}) {
  const [isHovered, setIsHovered] = useState(false);
  const difficultyColors = getDifficultyColor(kit.difficulty);

  const handleClick = () => {
    if (kit.available && onClick) {
      onClick(kit);
    }
  };

  return (
    <div
      style={{
        ...styles.card,
        ...(isHovered && kit.available ? styles.cardHover : {}),
        ...(!kit.available ? styles.cardLocked : {}),
        borderColor: isHovered && kit.available ? `${kit.color}40` : 'rgba(255, 255, 255, 0.06)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Glow effect on hover */}
      <div
        style={{
          ...styles.glowOverlay,
          ...(isHovered && kit.available ? styles.glowOverlayHover : {}),
          background: `radial-gradient(ellipse at center, ${kit.color}15 0%, transparent 70%)`
        }}
      />

      {/* Image */}
      <div style={styles.imageContainer}>
        {kit.image ? (
          <img
            src={kit.image}
            alt={kit.name}
            style={{
              ...styles.image,
              ...(isHovered ? styles.imageHover : {})
            }}
            onError={(e) => e.target.style.display = 'none'}
          />
        ) : (
          <div style={styles.imagePlaceholder}>
            📦
          </div>
        )}

        {/* Badges */}
        <div style={styles.badges}>
          <span
            style={{
              ...styles.difficultyBadge,
              background: difficultyColors.bg,
              color: difficultyColors.color,
              border: `1px solid ${difficultyColors.border}`
            }}
          >
            {kit.difficulty}
          </span>
          
          {kit.available ? (
            <span
              style={{
                ...styles.statusBadge,
                background: 'rgba(0, 212, 170, 0.15)',
                color: '#00d4aa',
                border: '1px solid rgba(0, 212, 170, 0.3)'
              }}
            >
              ✓ Available
            </span>
          ) : (
            <span
              style={{
                ...styles.statusBadge,
                background: 'rgba(255, 255, 255, 0.1)',
                color: colors.text.muted,
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              Coming Soon
            </span>
          )}
        </div>

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '80px',
            background: 'linear-gradient(transparent, rgba(10, 10, 10, 0.9))',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Content */}
      <div style={styles.content}>
        <h3 style={styles.title}>{kit.name}</h3>
        <p style={styles.description}>{kit.description}</p>

        <div style={styles.meta}>
          <span style={styles.metaItem}>
            <span style={styles.metaIcon}>📚</span>
            {lessonCount} Lessons
          </span>
          <span style={styles.metaItem}>
            <span style={styles.metaIcon}>⏱️</span>
            {kit.estimatedTime}
          </span>
          <span style={styles.metaItem}>
            <span style={styles.metaIcon}>🔧</span>
            {kit.modules?.length || 0} Components
          </span>
        </div>
      </div>

      {/* Corner accent */}
      <svg
        style={{
          ...styles.cornerAccent,
          ...(isHovered ? styles.cornerAccentHover : {})
        }}
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M100 100 L100 0 L0 100 Z"
          fill={kit.color}
        />
      </svg>

      {/* Locked overlay */}
      {!kit.available && (
        <div style={styles.lockedOverlay}>
          <div style={styles.lockedIcon}>🔒</div>
          <div style={styles.lockedText}>Coming Soon</div>
        </div>
      )}
    </div>
  );
}