import React, { useEffect, useState } from 'react';
import { getModuleById } from '../../../constants/modules';
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
    background: 'rgba(255, 255, 255, 0)',
    borderRadius: borderRadius.md,
    overflow: 'hidden'
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    borderRadius: 10
  },
  name: {
    fontSize: '1.125rem',
    color: '#fff',
    marginBottom: '0.5rem',
    fontFamily
  },
  loadingText: {
    color: colors.text.tertiary,
    textAlign: 'center',
    padding: '2rem',
    fontFamily
  }
};

export default function HardwareStep({ title, items, moduleIds }) {
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Small delay to ensure modules are loaded from Shopify
    const timer = setTimeout(() => {
      // If moduleIds provided, fetch from modules.js
      if (moduleIds && moduleIds.length > 0) {
        const fetchedModules = moduleIds.map(id => {
          const module = getModuleById(id);
          if (module) {
            return {
              name: module.name,
              image: module.image
            };
          }
          // Fallback if module not found
          console.warn(`Module ${id} not found in ALL_MODULES`);
          return null;
        }).filter(Boolean);
        
        setModules(fetchedModules);
      } 
      // Otherwise use provided items (legacy support)
      else if (items) {
        setModules(items);
      }
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [moduleIds, items]);

  if (isLoading) {
    return (
      <>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.loadingText}>Loading modules...</p>
      </>
    );
  }

  if (modules.length === 0) {
    return (
      <>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.loadingText}>
          No modules found. Please check your module configuration.
        </p>
      </>
    );
  }

  return (
    <>
      <h1 style={styles.title}>{title}</h1>
      <div style={styles.grid}>
        {modules.map((item, i) => (
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
          </div>
        ))}
      </div>
    </>
  );
}