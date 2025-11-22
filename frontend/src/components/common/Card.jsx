import React from 'react';
import { colors, borderRadius } from '../../styles/theme';

export default function Card({ children, style = {}, ...props }) {
  const cardStyle = {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.lg,
    padding: '1.5rem',
    ...style
  };

  return (
    <div style={cardStyle} {...props}>
      {children}
    </div>
  );
}
