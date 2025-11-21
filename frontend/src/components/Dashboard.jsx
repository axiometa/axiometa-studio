import React, { useState, useEffect } from 'react';
import { connectionService } from '../services/connection';

export default function Dashboard({ userProgress, onStartLesson, onOpenSandbox }) {
  const { level, xp, nextLevelXp } = userProgress;
  const xpPercentage = (xp / nextLevelXp) * 100;
  
  const [isConnected, setIsConnected] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState('axiometa_pixie_m1');
  const [isConnecting, setIsConnecting] = useState(false);

  // Auto-connect on mount if previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (connectionService.getConnectionStatus()) {
        setIsConnected(true);
      }
    };
    checkConnection();
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectionService.connect();
      setIsConnected(true);
    } catch (error) {
      console.error('Connection failed:', error);
      alert('Failed to connect to ESP32. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const boards = [
    {
      id: 'axiometa_pixie_m1',
      name: 'PIXIE M1',
      available: true,
      fqbn: 'esp32:esp32:axiometa_pixie_m1:CDCOnBoot=cdc'
    },
    {
      id: 'spark_3',
      name: 'SPARK 3',
      available: false,
      fqbn: null
    },
    {
      id: 'genesis_mini',
      name: 'GENESIS MINI',
      available: false,
      fqbn: null
    },
    {
      id: 'genesis_one',
      name: 'GENESIS ONE',
      available: false,
      fqbn: null
    }
  ];

  return (
    <div style={styles.dashboard}>
      {/* Header with logo */}
      <div style={styles.header}>
        <div style={styles.logoContainer}>
          <img 
            src="https://cdn.shopify.com/s/files/1/0966/7756/0659/files/white_logo.png" 
            alt="Axiometa" 
            style={styles.logo}
          />
          <span style={styles.studioText}>Studio</span>
        </div>
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
        {/* Connection & Board Selection */}
        <div style={styles.connectionCard}>
          <h3 style={styles.sectionTitle}>🔌 Device Connection</h3>
          
          <div style={styles.boardSelector}>
            <label style={styles.label}>Select Microcontroller:</label>
            <div style={styles.boardGrid}>
              {boards.map(board => (
                <button
                  key={board.id}
                  style={{
                    ...styles.boardButton,
                    ...(selectedBoard === board.id ? styles.boardButtonActive : {}),
                    ...((!board.available) ? styles.boardButtonDisabled : {})
                  }}
                  onClick={() => board.available && setSelectedBoard(board.id)}
                  disabled={!board.available}
                >
                  <span style={styles.boardName}>{board.name}</span>
                  {!board.available && (
                    <span style={styles.comingSoonBadge}>Coming Soon</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.connectionStatus}>
            {!isConnected ? (
              <button 
                style={styles.connectButton} 
                onClick={handleConnect}
                disabled={isConnecting}
              >
                {isConnecting ? '⏳ Connecting...' : '🔌 Connect Device'}
              </button>
            ) : (
              <div style={styles.connectedBadge}>
                ✅ Connected to {boards.find(b => b.id === selectedBoard)?.name}
              </div>
            )}
          </div>
        </div>

        {/* Learning Path */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📚 Learning Path</h2>
          
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

        {/* Creative Sandbox */}
        <div style={styles.sandboxCard}>
          <div style={styles.sandboxHeader}>
            <h2 style={styles.sectionTitle}>🎨 Creative Sandbox</h2>
            <span style={styles.betaBadge}>BETA</span>
          </div>
          <p style={styles.sandboxDescription}>
            Experiment freely! Write your own code, test ideas, and create without following a structured lesson.
          </p>
          <button 
            style={styles.sandboxButton}
            onClick={onOpenSandbox}
            disabled={!isConnected}
          >
            {isConnected ? 'Open Sandbox →' : '🔌 Connect Device First'}
          </button>
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
    fontFamily: 'DM Sans, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logo: {
    height: '40px',
    width: 'auto',
  },
  studioText: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#fff',
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
    fontFamily: 'DM Sans',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#00ff88',
    fontFamily: 'DM Sans',
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
  connectionCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    color: '#fff',
    fontFamily: 'DM Sans',
    fontWeight: 'bold',
  },
  boardSelector: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    color: '#aaa',
    marginBottom: '0.75rem',
    fontSize: '0.95rem',
    fontFamily: 'DM Sans',
  },
  boardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  boardButton: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative',
    fontFamily: 'DM Sans',
  },
  boardButtonActive: {
    background: 'rgba(0, 255, 136, 0.1)',
    borderColor: '#00ff88',
  },
  boardButtonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  boardName: {
    display: 'block',
    color: '#fff',
    fontWeight: '600',
    marginBottom: '0.25rem',
    fontFamily: 'DM Sans',
  },
  comingSoonBadge: {
    display: 'inline-block',
    background: '#555',
    color: '#aaa',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontFamily: 'DM Sans',
  },
  connectionStatus: {
    textAlign: 'center',
  },
  connectButton: {
    background: 'linear-gradient(90deg, #00ff88, #00ccff)',
    color: '#000',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'DM Sans',
  },
  connectedBadge: {
    color: '#00ff88',
    fontSize: '1.125rem',
    fontWeight: 'bold',
    fontFamily: 'DM Sans',
  },
  section: {
    marginBottom: '3rem',
  },
  lessonCard: {
    background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 204, 255, 0.1))',
    border: '2px solid rgba(0, 255, 136, 0.3)',
    borderRadius: '16px',
    padding: '2rem',
    marginBottom: '2rem',
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
    fontFamily: 'DM Sans',
  },
  lessonTitle: {
    fontSize: '1.75rem',
    marginBottom: '0.5rem',
    color: '#fff',
    fontFamily: 'DM Sans',
  },
  lessonDescription: {
    color: '#ccc',
    marginBottom: '1.5rem',
    lineHeight: '1.6',
    fontFamily: 'DM Sans',
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
    fontFamily: 'DM Sans',
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
    fontFamily: 'DM Sans',
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
    fontFamily: 'DM Sans',
  },
  lockedText: {
    color: '#888',
    fontSize: '0.875rem',
    margin: 0,
    fontFamily: 'DM Sans',
  },
  sandboxCard: {
    background: 'rgba(138, 43, 226, 0.1)',
    border: '2px solid rgba(138, 43, 226, 0.3)',
    borderRadius: '16px',
    padding: '2rem',
  },
  sandboxHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  betaBadge: {
    background: '#8a2be2',
    color: '#fff',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    fontFamily: 'DM Sans',
  },
  sandboxDescription: {
    color: '#ccc',
    marginBottom: '1.5rem',
    lineHeight: '1.6',
    fontFamily: 'DM Sans',
  },
  sandboxButton: {
    background: 'linear-gradient(90deg, #8a2be2, #9370db)',
    color: '#fff',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'DM Sans',
  },
};