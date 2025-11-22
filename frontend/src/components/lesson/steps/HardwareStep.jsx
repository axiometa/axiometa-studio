import React from 'react';
import { colors, borderRadius, fontFamily } from '../../../styles/theme';

const styles = {
  title: {
    fontSize: '2.25rem',
    marginBottom: '1.5rem',
    color: colors.primary,
    fontFamily
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    margin: '2rem 0'
  },
  item: {
    textAlign: 'center'
  },
  imageContainer: {
    width: '100%',
    height: '150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: borderRadius.md,
    overflow: 'hidden'
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  },
  name: {
    fontSize: '1.125rem',
    color: '#fff',
    marginBottom: '0.5rem',
    fontFamily
  },
  description: {
    color: colors.text.tertiary,
    fontSize: '0.95rem',
    fontFamily
  }
};

export default function HardwareStep({ title, items }) {
  return (
    <>
      <h1 style={styles.title}>{title}</h1>
      <div style={styles.grid}>
        {items.map((item, i) => (
          <div key={i} style={styles.item}>
            <div style={styles.imageContainer}>
              <img 
                src={item.image} 
                alt={item.name}
                style={styles.image}
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
            <h3 style={styles.name}>{item.name}</h3>
            <p style={styles.description}>{item.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}
