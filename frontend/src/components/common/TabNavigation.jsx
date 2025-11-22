import React from 'react';
import { colors, fontFamily } from '../../styles/theme';

const styles = {
  container: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    overflow: 'hidden'
  },
  tabs: {
    display: 'flex',
    borderBottom: `1px solid ${colors.border}`,
    background: 'rgba(0, 0, 0, 0.2)'
  },
  tab: {
    flex: 1,
    background: 'none',
    border: 'none',
    color: colors.text.muted,
    padding: '1rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily,
    transition: 'all 0.2s'
  },
  tabActive: {
    flex: 1,
    background: 'rgba(0, 212, 170, 0.1)',
    border: 'none',
    borderBottom: `2px solid ${colors.primary}`,
    color: colors.primary,
    padding: '1rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily
  },
  content: {
    padding: '2rem'
  }
};

export default function TabNavigation({ tabs, activeTab, onTabChange, children }) {
  return (
    <div style={styles.container}>
      <div style={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            style={activeTab === tab.id ? styles.tabActive : styles.tab}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={styles.content}>
        {children}
      </div>
    </div>
  );
}
