import React, { useState } from 'react';
import { colors, borderRadius, fontFamily } from '../../../styles/theme';
import SerialMonitor from '../../common/SerialMonitor';

const styles = {
  container: {
    padding: '2rem'
  },
  title: {
    fontSize: '1.75rem',
    color: colors.primary,
    marginBottom: '1.5rem',
    fontFamily,
    textAlign: 'left'
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem'
  },
  image: {
    maxWidth: '100%',
    maxHeight: '350px',
    borderRadius: borderRadius.lg,
    border: `2px solid ${colors.primary}`,
    boxShadow: '0 0 30px rgba(225, 241, 79, 0.2)'
  },
  serialContainer: {
    marginBottom: '2rem',
    border: `1px solid ${colors.borderLight}`,
    borderRadius: borderRadius.md,
    overflow: 'hidden'
  },
  instruction: {
    color: colors.text.secondary,
    fontSize: '1.1rem',
    lineHeight: '1.8',
    marginBottom: '2rem',
    fontFamily,
    textAlign: 'left'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  confirmButton: {
    background: colors.primary,
    color: '#000',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontFamily,
    fontWeight: '600',
    fontSize: '1.1rem',
    transition: 'all 0.2s'
  },
  troubleshootButton: {
    background: 'transparent',
    color: colors.text.muted,
    border: `1px solid ${colors.borderLight}`,
    padding: '1rem 2rem',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontFamily,
    fontWeight: '500',
    fontSize: '1rem',
    transition: 'all 0.2s'
  },
  troubleshootPanel: {
    marginTop: '2rem',
    padding: '1.5rem',
    background: 'rgba(255, 100, 100, 0.1)',
    border: '1px solid rgba(255, 100, 100, 0.3)',
    borderRadius: borderRadius.md
  },
  troubleshootTitle: {
    color: '#ff6b6b',
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    fontFamily
  },
  troubleshootList: {
    color: colors.text.secondary,
    fontSize: '1rem',
    lineHeight: '2',
    fontFamily,
    paddingLeft: '1.5rem'
  },
  troubleshootItem: {
    marginBottom: '0.5rem'
  }
};

const DEFAULT_TROUBLESHOOT_TIPS = [
  {
    title: "Check LED direction",
    description: "The longer leg (anode) should connect to the resistor side (positive)"
  },
  {
    title: "Verify connections",
    description: "Make sure all components are firmly inserted into the breadboard"
  },
  {
    title: "Check USB power",
    description: "The PIXIE's power LED should be on"
  },
  {
    title: "Try a different LED",
    description: "Your LED might be damaged"
  },
  {
    title: "Verify resistor value",
    description: "Use a 330Ω resistor (orange-orange-brown)"
  }
];

export default function VerificationStep({
  title,
  instruction,
  image,
  showSerialMonitor = false,
  serialLogs = [],  // ← Add this
  troubleshootTips,
  confirmText = "Yes, it works!",
  troubleshootText = "It's not working",
  onConfirm
}) {
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  const tips = troubleshootTips || DEFAULT_TROUBLESHOOT_TIPS;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{title}</h2>

      {image && (
        <div style={styles.imageContainer}>
          <img src={image} alt={title} style={styles.image} />
        </div>
      )}

      {showSerialMonitor && (
        <div style={styles.serialContainer}>
          <SerialMonitor logs={serialLogs} />
        </div>
      )}

      <p style={styles.instruction}>{instruction}</p>

      <div style={styles.buttons}>
        <button
          style={styles.confirmButton}
          onClick={onConfirm}
        >
          {confirmText}
        </button>

        <button
          style={styles.troubleshootButton}
          onClick={() => setShowTroubleshoot(!showTroubleshoot)}
        >
          {troubleshootText}
        </button>
      </div>

      {showTroubleshoot && (
        <div style={styles.troubleshootPanel}>
          <div style={styles.troubleshootTitle}>🔧 Troubleshooting Tips</div>
          <ul style={styles.troubleshootList}>
            {tips.map((tip, index) => (
              <li key={index} style={styles.troubleshootItem}>
                <strong>{tip.title}</strong> — {tip.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}