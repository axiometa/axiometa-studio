import React from 'react';
import Button from '../common/Button';
import { colors, fontFamily } from '../../styles/theme';

const styles = {
  container: {
    textAlign: 'center'
  },
  connectedBadge: {
    color: colors.primary,
    fontSize: '1rem',
    fontWeight: '600',
    fontFamily
  }
};

export default function ConnectionStatus({ 
  isConnected, 
  isConnecting, 
  boardName,
  onConnect 
}) {
  if (!isConnected) {
    return (
      <div style={styles.container}>
        <Button onClick={onConnect} disabled={isConnecting}>
          {isConnecting ? 'Connecting...' : 'Connect Device'}
        </Button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.connectedBadge}>
        Connected to {boardName}
      </div>
    </div>
  );
}
