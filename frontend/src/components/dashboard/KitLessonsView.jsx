import React from 'react';
import LessonCard from './LessonCard';
import Button from '../common/Button';
import { colors, borderRadius, fontFamily } from '../../styles/theme';
import { getLessonMetadata } from '../../data/lessons';

const styles = {
  container: {
    animation: 'fadeIn 0.4s ease-out'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: colors.text.secondary,
    padding: '0.6rem 1rem',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontFamily,
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  },
  backButtonHover: {
    background: 'rgba(255, 255, 255, 0.1)',
    borderColor: colors.primary
  },
  kitInfo: {
    flex: 1
  },
  kitTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '0.25rem',
    fontFamily,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  kitBadge: {
    fontSize: '0.75rem',
    padding: '0.3rem 0.6rem',
    borderRadius: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  kitSubtitle: {
    fontSize: '0.95rem',
    color: colors.text.tertiary,
    fontFamily
  },
  progressBar: {
    width: '200px',
    height: '8px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.5s ease'
  },
  lessonsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  lessonNumber: {
    position: 'absolute',
    top: '-8px',
    left: '-8px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    fontWeight: '700',
    fontFamily,
    zIndex: 5,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: borderRadius.lg,
    border: '1px dashed rgba(255, 255, 255, 0.1)'
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },
  emptyTitle: {
    fontSize: '1.5rem',
    color: colors.text.secondary,
    marginBottom: '0.5rem',
    fontFamily,
    fontWeight: '600'
  },
  emptyText: {
    color: colors.text.muted,
    fontSize: '1rem',
    fontFamily
  }
};

// Inject CSS animation
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  if (!document.head.querySelector('[data-kit-lessons-styles]')) {
    styleSheet.setAttribute('data-kit-lessons-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

export default function KitLessonsView({
  kit,
  lessons,
  completedLessons = [],
  hasRequiredModules,
  onBack,
  onStartLesson
}) {
  const [backButtonHovered, setBackButtonHovered] = React.useState(false);

  const completedCount = lessons.filter(l => completedLessons.includes(l.id)).length;
  const progressPercent = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  return (
    <div style={styles.container}>
      {/* Header with back button and kit info */}
      <div style={styles.header}>
        <button
          style={{
            ...styles.backButton,
            ...(backButtonHovered ? styles.backButtonHover : {})
          }}
          onClick={onBack}
          onMouseEnter={() => setBackButtonHovered(true)}
          onMouseLeave={() => setBackButtonHovered(false)}
        >
          ← Back to Kits
        </button>

        <div style={styles.kitInfo}>
          <h2 style={styles.kitTitle}>
            {kit.name}
            <span
              style={{
                ...styles.kitBadge,
                background: `${kit.color}20`,
                color: kit.color,
                border: `1px solid ${kit.color}40`
              }}
            >
              {kit.difficulty}
            </span>
          </h2>
          <p style={styles.kitSubtitle}>
            {completedCount} of {lessons.length} lessons completed
          </p>
        </div>

        {/* Progress bar */}
        <div>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progressPercent}%`,
                background: `linear-gradient(90deg, ${kit.color}, ${kit.accentColor})`
              }}
            />
          </div>
        </div>
      </div>

      {/* Lessons grid - 2 columns */}
      <div style={styles.lessonsGrid}>
        {lessons.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📚</div>
            <div style={styles.emptyTitle}>Lessons Coming Soon</div>
            <div style={styles.emptyText}>
              We're working on creating amazing lessons for this kit.
            </div>
          </div>
        ) : (
          lessons.map((lesson, index) => {
            const metadata = getLessonMetadata(lesson);
            const isCompleted = completedLessons.includes(lesson.id);
            const isLocked = index > 0 && !completedLessons.includes(lessons[index - 1]?.id);

            return (
              <div
                key={lesson.id}
                style={{
                  position: 'relative',
                  animation: `slideInUp 0.4s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Lesson number badge */}
                <div
                  style={{
                    ...styles.lessonNumber,
                    background: isCompleted 
                      ? `linear-gradient(135deg, ${kit.color}, ${kit.accentColor})`
                      : 'rgba(255, 255, 255, 0.1)',
                    color: isCompleted ? '#000' : colors.text.secondary,
                    border: isCompleted ? 'none' : '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>

                <LessonCard
                  lessonNumber={index + 1}
                  boardName={kit.name.split(' ')[1]} // Extract board name
                  title={metadata.title}
                  description={lesson.steps[0]?.content?.substring(0, 100) + '...' || 'Learn something new!'}
                  duration={metadata.duration}
                  xp={metadata.xpReward}
                  challenges={metadata.challenges}
                  hasRequiredParts={hasRequiredModules(lesson)}
                  image={lesson.thumbnail || null}
                  isCompleted={isCompleted}
                  isLocked={false} // For now, don't lock lessons
                  accentColor={kit.color}
                  onStart={() => onStartLesson(lesson)}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}