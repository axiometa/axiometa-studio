import React from 'react';
import { colors, gradients, borderRadius, fontFamily } from '../../styles/theme';

const buttonStyles = {
  base: {
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontWeight: '600',
    fontFamily,
    transition: 'all 0.2s',
    fontSize: '0.95rem'
  },
  primary: {
    background: 'rgba(225, 241, 79, 0.88)',
    color: '#000000ff',
    padding: '1rem 2rem'
  },
  secondary: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${colors.borderLight}`,
    color: '#fff',
    padding: '0.5rem 1.25rem'
  },
  disabled: {
    background: '#333',
    color: '#666',
    cursor: 'not-allowed'
  },
  small: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem'
  },
  large: {
    padding: '1rem 2rem',
    fontSize: '1rem'
  },
  fullWidth: {
    width: '100%'
  }
};

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  ...props 
}) {
  const style = {
    ...buttonStyles.base,
    ...(variant === 'primary' ? buttonStyles.primary : buttonStyles.secondary),
    ...(size === 'small' ? buttonStyles.small : {}),
    ...(size === 'large' ? buttonStyles.large : {}),
    ...(fullWidth ? buttonStyles.fullWidth : {}),
    ...(disabled ? buttonStyles.disabled : {})
  };

  return (
    <button 
      style={style}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
