import React from 'react';
import Button from '../common/Button';
import { colors, gradients, borderRadius, fontFamily } from '../../styles/theme';

const styles = {
  card: {
    background: gradients.primarySubtle,
    border: '2px solid rgba(0, 212, 170, 0.2)',
    borderRadius: borderRadius.lg,
    padding: '2rem',
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    gap: '1rem'
  },
  headerContent: {
    flex: 1
  },
  checkmark: {
    minWidth: '48px',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: colors.primary,
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    flexShrink: 0
  },
  missingParts: {
    padding: '0.5rem 1rem',
    background: 'rgba(255, 0, 0, 0.1)',
    border: '1px solid rgba(255, 0, 0, 0.3)',
    borderRadius: '20px',
    color: colors.error,
    fontSize: '0.85rem',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    flexShrink: 0
  },
  badge: {
    display: 'inline-block',
    background: colors.primary,
    color: '#000',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    marginBottom: '0.75rem',
    fontFamily
  },
  title: {
    fontSize: '1.75rem',
    marginBottom: '0.5rem',
    color: '#fff',
    fontFamily,
    margin: 0
  },
  description: {
    color: colors.text.secondary,
    marginBottom: '1rem',
    lineHeight: '1.6',
    fontFamily,
    flex: 1
  },
  meta: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap'
  },
  metaItem: {
    color: colors.text.tertiary,
    fontSize: '0.9rem',
    fontFamily
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
  onStart 
}) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.badge}>
            Lesson {lessonNumber} • {boardName}
          </div>
          <h3 style={styles.title}>{title}</h3>
          <p style={styles.description}>{description}</p>
        </div>
        {hasRequiredParts ? (
          <div style={styles.checkmark}>✓</div>
        ) : (
          <div style={styles.missingParts}>Missing Parts</div>
        )}
      </div>
      <div style={styles.meta}>
        <span style={styles.metaItem}>{duration} min</span>
        <span style={styles.metaItem}>{xp} XP</span>
        <span style={styles.metaItem}>{challenges} Challenges</span>
      </div>
      <Button 
        fullWidth
        disabled={!hasRequiredParts}
        onClick={onStart}
      >
        {hasRequiredParts ? 'Start Learning' : 'Get Required Parts'}
      </Button>
    </div>
  );
}
