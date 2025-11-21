import React from 'react';

export default function Dashboard({ userProgress, onStartLesson }) {
  const { level, xp, nextLevelXp } = userProgress;
  const xpPercentage = (xp / nextLevelXp) * 100;

  return (
    <div style={styles.dashboard}>
      <div style={styles.header}>
        <h1 style={styles.title}>🎓 ESP32 Academy</h1>
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Level</span>
            <span style={styles.statValue}>{level}</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>XP</span>
            <span style={styles.statValue}>{xp} / {nextLevelXp}</span>
          </div>
        </div>
      </div>

      <div style={styles.progressBarContainer}>
        <div style={{ ...styles.progressBar, width: `${xpPercentage}%` }} />
      </div>

      <div style={styles.content}>
        <div style={styles.welcomeCard}>
          <h2 style={styles.welcomeTitle}>Welcome to Your Learning Journey!</h2>
          <p style={styles.welcomeText}>
            Start with the fundamentals and build your way up to advanced hardware projects.
          </p>
        </div>

        <div style={styles.lessonCard}>
          <div style={styles.lessonBadge}>Lesson 1</div>
          <h3 style={styles.lessonTitle}>Blinky - Your First LED</h3>
          <p style={styles.lessonDescription}>
            Learn the basics of controlling an LED with digitalWrite()
          </p>
          <div style={styles.lessonMeta}>
            <span style={styles.metaItem}>⏱️ 15 min</span>
            <span style={styles.metaItem}>⭐ 100 XP</span>
            <span style={styles.metaItem}>🎯 3 Challenges</span>
          </div>
          <button style={styles.startButton} onClick={onStartLesson}>
            Start Learning →
          </button>
        </div>

        <div style={styles.comingSoon}>
          <div style={styles.lockedLesson}>
            <div style={styles.lockIcon}>🔒</div>
            <h4 style={styles.lockedTitle}>Lesson 2: Reading Sensors</h4>
            <p style={styles.lockedText}>Complete Lesson 1 to unlock</p>
          </div>
          <div style={styles.lockedLesson}>
            <div style={styles.lockIcon}>🔒</div>
            <h4 style={styles.lockedTitle}>Lesson 3: PWM & Brightness</h4>
            <p style={styles.lockedText}>Complete Lesson 2 to unlock</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  dashboard: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #00ff88, #00ccff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
  },
  stats: {
    display: 'flex',
    gap: '2rem',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#888',
    marginBottom: '0.25rem',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#00ff88',
  },
  progressBarContainer: {
    width: '100%',
    height: '8px',
    background: '#222',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '2rem',
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #00ff88, #00ccff)',
    transition: 'width 0.3s ease',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  welcomeCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem',
  },
  welcomeTitle: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    color: '#fff',
  },
  welcomeText: {
    color: '#aaa',
    lineHeight: '1.6',
    margin: 0,
  },
  lessonCard: {
    background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 204, 255, 0.1))',
    border: '2px solid rgba(0, 255, 136, 0.3)',
    borderRadius: '16px',
    padding: '2rem',
    marginBottom: '2rem',
    position: 'relative',
  },
  lessonBadge: {
    display: 'inline-block',
    background: '#00ff88',
    color: '#000',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  lessonTitle: {
    fontSize: '1.75rem',
    marginBottom: '0.5rem',
    color: '#fff',
  },
  lessonDescription: {
    color: '#ccc',
    marginBottom: '1.5rem',
    lineHeight: '1.6',
  },
  lessonMeta: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  metaItem: {
    color: '#aaa',
    fontSize: '0.875rem',
  },
  startButton: {
    background: 'linear-gradient(90deg, #00ff88, #00ccff)',
    color: '#000',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  comingSoon: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem',
  },
  lockedLesson: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center',
    opacity: 0.5,
  },
  lockIcon: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  lockedTitle: {
    fontSize: '1.125rem',
    marginBottom: '0.25rem',
    color: '#fff',
  },
  lockedText: {
    color: '#888',
    fontSize: '0.875rem',
    margin: 0,
  },
};
