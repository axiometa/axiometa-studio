import React, { useState } from 'react';
import { colors, borderRadius, fontFamily } from '../../../styles/theme';

const styles = {
  container: {
    background: '#000',
    border: `2px solid ${colors.primary}`,
    borderRadius: borderRadius.lg,
    padding: '2rem',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '1.5rem',
    color: colors.primary,
    marginBottom: '1rem',
    fontFamily,
    textAlign: 'center'
  },
  explanation: {
    color: colors.text.secondary,
    fontSize: '1rem',
    marginBottom: '2rem',
    lineHeight: '1.6',
    fontFamily,
    textAlign: 'center'
  },
  simulatorBox: {
    background: '#0a0a0a',
    borderRadius: borderRadius.md,
    padding: '2rem',
    marginBottom: '1.5rem'
  },
  sliderContainer: {
    marginBottom: '2rem'
  },
  sliderLabel: {
    color: colors.text.secondary,
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
    fontFamily,
    textAlign: 'center'
  },
  slider: {
    width: '100%',
    height: '12px',
    borderRadius: '6px',
    background: 'linear-gradient(90deg, #1a1a1a 0%, rgba(225, 241, 79, 0.88) 100%)',
    outline: 'none',
    WebkitAppearance: 'none',
    appearance: 'none',
    cursor: 'pointer'
  },
  valuesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
    marginTop: '2rem'
  },
  valueCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.md,
    padding: '1.25rem',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  valueLabel: {
    color: colors.text.tertiary,
    fontSize: '0.85rem',
    marginBottom: '0.5rem',
    fontFamily
  },
  valueNumber: {
    color: colors.primary,
    fontSize: '2rem',
    fontWeight: 'bold',
    fontFamily,
    marginBottom: '0.25rem'
  },
  valueUnit: {
    color: colors.text.muted,
    fontSize: '0.9rem',
    fontFamily
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: '#1a1a1a',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '0.5rem'
  },
  progressFill: {
    height: '100%',
    background: colors.primary,
    transition: 'width 0.2s ease',
    borderRadius: '4px'
  },
  conceptBox: {
    background: 'rgba(225, 241, 79, 0.1)',
    border: `1px solid ${colors.primary}`,
    borderRadius: borderRadius.md,
    padding: '1.5rem',
    marginTop: '1.5rem'
  },
  conceptTitle: {
    color: colors.primary,
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
    fontFamily
  },
  conceptText: {
    color: colors.text.secondary,
    fontSize: '0.95rem',
    lineHeight: '1.6',
    fontFamily
  }
};

// Inject slider thumb styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(225, 241, 79, 0.88);
      cursor: pointer;
      box-shadow: 0 0 10px rgba(225, 241, 79, 0.5);
    }
    
    input[type="range"]::-moz-range-thumb {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(225, 241, 79, 0.88);
      cursor: pointer;
      border: none;
      box-shadow: 0 0 10px rgba(225, 241, 79, 0.5);
    }
  `;
  if (!document.head.querySelector('[data-slider-styles]')) {
    styleSheet.setAttribute('data-slider-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

export default function AnalogSimulator({ 
  config = {},
  showControls = true,
  autoPlay = true
}) {
  const {
    minVoltage = 0,
    maxVoltage = 3.3,
    resolution = 4095, // 12-bit ADC
    title = "Analog Input Simulation",
    explanation = "Rotate the virtual potentiometer to see how voltage changes from 0V to 3.3V. Watch how the ADC converts this to digital values!"
  } = config;

  // Start at 50% (middle position)
  const [voltage, setVoltage] = useState(maxVoltage / 2);

  // Calculate ADC value (12-bit: 0-4095)
  const adcValue = Math.round((voltage / maxVoltage) * resolution);
  
  // Calculate percentage
  const percentage = Math.round((voltage / maxVoltage) * 100);

  const handleSliderChange = (e) => {
    const newVoltage = parseFloat(e.target.value);
    setVoltage(newVoltage);
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.explanation}>{explanation}</p>

      <div style={styles.simulatorBox}>
        {/* Slider Control */}
        <div style={styles.sliderContainer}>
          <div style={styles.sliderLabel}>
            🎛️ Rotate the Potentiometer
          </div>
          <input 
            type="range"
            min={minVoltage}
            max={maxVoltage}
            step="0.01"
            value={voltage}
            onChange={handleSliderChange}
            style={styles.slider}
          />
        </div>

        {/* Values Display */}
        <div style={styles.valuesGrid}>
          {/* Voltage */}
          <div style={styles.valueCard}>
            <div style={styles.valueLabel}>Voltage</div>
            <div style={styles.valueNumber}>{voltage.toFixed(2)}</div>
            <div style={styles.valueUnit}>volts</div>
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill, 
                  width: `${percentage}%`
                }} 
              />
            </div>
          </div>

          {/* ADC Value */}
          <div style={styles.valueCard}>
            <div style={styles.valueLabel}>ADC Value</div>
            <div style={styles.valueNumber}>{adcValue}</div>
            <div style={styles.valueUnit}>/ {resolution}</div>
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill, 
                  width: `${percentage}%`
                }} 
              />
            </div>
          </div>

          {/* Percentage */}
          <div style={styles.valueCard}>
            <div style={styles.valueLabel}>Percentage</div>
            <div style={styles.valueNumber}>{percentage}</div>
            <div style={styles.valueUnit}>%</div>
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill, 
                  width: `${percentage}%`
                }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Concept Explanation */}
      <div style={styles.conceptBox}>
        <div style={styles.conceptTitle}>💡 What's Happening?</div>
        <div style={styles.conceptText}>
          When you rotate a potentiometer, it changes the resistance, which changes the voltage from {minVoltage}V to {maxVoltage}V.
          The ESP32's ADC (Analog-to-Digital Converter) reads this voltage and converts it to a number from 0 to {resolution}.
          <br/><br/>
          <strong>Current reading:</strong> {voltage.toFixed(2)}V = {adcValue} in code (analogRead)
        </div>
      </div>
    </div>
  );
}