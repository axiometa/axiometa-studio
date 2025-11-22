import React from 'react';
import { colors, borderRadius, fontFamily } from '../../styles/theme';
import { BOARDS } from '../../constants/boards';

const styles = {
  container: {
    marginBottom: 0
  },
  label: {
    display: 'block',
    color: '#aaa',
    marginBottom: '0.75rem',
    fontSize: '0.9rem',
    fontFamily
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '0.75rem'
  },
  button: {
    background: colors.surface,
    border: `2px solid ${colors.borderLight}`,
    borderRadius: borderRadius.md,
    padding: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative',
    fontFamily
  },
  buttonActive: {
    background: 'rgba(0, 212, 170, 0.1)',
    borderColor: colors.primary
  },
  buttonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed'
  },
  boardName: {
    display: 'block',
    color: '#fff',
    fontWeight: '600',
    fontSize: '0.9rem',
    marginBottom: '0.25rem',
    fontFamily
  },
  comingSoonBadge: {
    display: 'inline-block',
    background: '#333',
    color: '#888',
    padding: '0.2rem 0.4rem',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontFamily
  }
};

export default function BoardSelector({ selectedBoard, onBoardSelect }) {
  return (
    <div style={styles.container}>
      <label style={styles.label}>Microcontroller:</label>
      <div style={styles.grid}>
        {BOARDS.map(board => (
          <button
            key={board.id}
            style={{
              ...styles.button,
              ...(selectedBoard === board.id ? styles.buttonActive : {}),
              ...(!board.available ? styles.buttonDisabled : {})
            }}
            onClick={() => board.available && onBoardSelect(board.id)}
            disabled={!board.available}
          >
            <span style={styles.boardName}>{board.name}</span>
            {!board.available && (
              <span style={styles.comingSoonBadge}>Soon</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
