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
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    marginBottom: '2rem'
  },
  diagramSection: {
    background: '#0a0a0a',
    borderRadius: borderRadius.md,
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  diagramTitle: {
    color: colors.primary,
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '2rem',
    fontFamily
  },
  schematic: {
    position: 'relative',
    width: '300px',
    height: '500px'
  },
  controlsSection: {
    background: '#0a0a0a',
    borderRadius: borderRadius.md,
    padding: '2rem'
  },
  sliderContainer: {
    marginBottom: '2rem'
  },
  sliderLabel: {
    color: colors.text.secondary,
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
    fontFamily,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sliderValue: {
    color: colors.primary,
    fontWeight: 'bold'
  },
  slider: {
    width: '100%',
    height: '12px',
    borderRadius: '6px',
    background: 'linear-gradient(90deg, #1a1a1a 0%, rgba(225, 241, 79, 0.88) 100%)',
    outline: 'none',
    WebkitAppearance: 'none',
    appearance: 'none',
    cursor: 'pointer',
    marginBottom: '1rem'
  },
  formula: {
    background: 'rgba(225, 241, 79, 0.1)',
    border: '1px solid ' + colors.primary,
    borderRadius: borderRadius.md,
    padding: '1rem',
    fontFamily: 'monospace',
    fontSize: '0.95rem',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: '1.5rem'
  },
  valueBox: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.md,
    padding: '1rem',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginTop: '1rem'
  },
  valueLabel: {
    color: colors.text.tertiary,
    fontSize: '0.75rem',
    marginBottom: '0.5rem',
    fontFamily
  },
  valueNumber: {
    color: '#00ff00',
    fontSize: '2rem',
    fontWeight: 'bold',
    fontFamily
  },
  valueUnit: {
    color: colors.text.muted,
    fontSize: '0.85rem',
    fontFamily
  },
  conceptBox: {
    background: 'rgba(225, 241, 79, 0.1)',
    border: `1px solid ${colors.primary}`,
    borderRadius: borderRadius.md,
    padding: '1.5rem'
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
  if (!document.head.querySelector('[data-voltage-slider-styles]')) {
    styleSheet.setAttribute('data-voltage-slider-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

// SVG Schematic Component
function SchematicDiagram({ vcc, r1Value, r2Value, vOut }) {
  return (
    <svg width="300" height="500" viewBox="0 0 300 500">
      {/* VCC at top */}
      <text x="150" y="30" fill={colors.primary} fontSize="18" fontWeight="bold" textAnchor="middle">
        +{vcc}V (VCC)
      </text>
      
      {/* Vertical wire from VCC */}
      <line x1="150" y1="40" x2="150" y2="80" stroke={colors.primary} strokeWidth="2"/>
      
      {/* R1 - Resistor symbol (zigzag) - BIGGER */}
      <g>
        <path 
          d="M 150 80 L 150 85 L 165 100 L 135 125 L 165 150 L 135 175 L 165 200 L 150 215 L 150 220" 
          fill="none" 
          stroke={colors.primary} 
          strokeWidth="3"
        />
        {/* R1 Label */}
        <text x="185" y="150" fill="#fff" fontSize="18" fontWeight="bold">Resistor 1</text>
        <text x="185" y="175" fill={colors.primary} fontSize="18" fontWeight="bold">
          {(r1Value / 1000).toFixed(1)}kΩ
        </text>
      </g>
      
      {/* Wire from R1 to midpoint */}
      <line x1="150" y1="220" x2="150" y2="250" stroke={colors.primary} strokeWidth="2"/>
      
      {/* Output node (green dot) */}
      <circle cx="150" cy="250" r="6" fill="#00ff00" stroke="#00ff00" strokeWidth="2">
        <animate attributeName="r" values="6;8;6" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      
      {/* Output wire to the right */}
      <line x1="150" y1="250" x2="200" y2="250" stroke="#00ff00" strokeWidth="2"/>
      
      {/* Output label */}
      <rect x="205" y="235" width="95" height="32" fill="rgba(0, 255, 0, 0.1)" stroke="#00ff00" strokeWidth="1" rx="4"/>
      <text x="252" y="258" fill="#00ff00" fontSize="16" fontWeight="bold" textAnchor="middle">
        OUT: {vOut.toFixed(2)}V
      </text>
      
      {/* Wire from midpoint to R2 */}
      <line x1="150" y1="250" x2="150" y2="280" stroke={colors.primary} strokeWidth="2"/>
      
      {/* R2 - Resistor symbol (zigzag) - BIGGER */}
      <g>
        <path 
          d="M 150 280 L 150 285 L 165 300 L 135 325 L 165 350 L 135 375 L 165 400 L 150 415 L 150 420" 
          fill="none" 
          stroke={colors.primary} 
          strokeWidth="3"
        />
        {/* R2 Label */}
        <text x="185" y="350" fill="#fff" fontSize="18" fontWeight="bold">Resistor 2</text>
        <text x="185" y="375" fill={colors.primary} fontSize="18" fontWeight="bold">
          {(r2Value / 1000).toFixed(1)}kΩ
        </text>
      </g>
      
      {/* Wire from R2 to ground */}
      <line x1="150" y1="420" x2="150" y2="450" stroke={colors.primary} strokeWidth="2"/>
      
      {/* Ground symbol */}
      <g>
        <line x1="130" y1="450" x2="170" y2="450" stroke={colors.primary} strokeWidth="2"/>
        <line x1="137" y1="460" x2="163" y2="460" stroke={colors.primary} strokeWidth="2"/>
        <line x1="144" y1="470" x2="156" y2="470" stroke={colors.primary} strokeWidth="2"/>
        <text x="150" y="490" fill={colors.primary} fontSize="16" fontWeight="bold" textAnchor="middle">GND</text>
      </g>
    </svg>
  );
}

export default function VoltageDivider({ 
  config = {},
  showControls = true,
  autoPlay = true
}) {
  const {
    vcc = 3.3,
    title = "Understanding Voltage Dividers",
    explanation = "A voltage divider is a fundamental circuit that uses two resistors to reduce voltage. The output voltage depends on the ratio of the resistances!"
  } = config;

  // Resistance values - user can change these
  const [r1Value, setR1Value] = useState(5000); // 5kΩ
  const [r2Value, setR2Value] = useState(5000); // 5kΩ
  
  // Calculate output voltage using voltage divider formula
  const vOut = (r2Value / (r1Value + r2Value)) * vcc;

  const handleR1Change = (e) => {
    setR1Value(parseFloat(e.target.value));
  };

  const handleR2Change = (e) => {
    setR2Value(parseFloat(e.target.value));
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.explanation}>{explanation}</p>

      <div style={styles.mainContent}>
        {/* Schematic Diagram */}
        <div style={styles.diagramSection}>
          <div style={styles.diagramTitle}>Schematic Diagram</div>
          <div style={styles.schematic}>
            <SchematicDiagram 
              vcc={vcc}
              r1Value={r1Value}
              r2Value={r2Value}
              vOut={vOut}
            />
          </div>
        </div>

        {/* Controls */}
        <div style={styles.controlsSection}>
          <div style={styles.sliderContainer}>
            <div style={styles.sliderLabel}>
              <span>Resistor 1 (Top Resistor)</span>
              <span style={styles.sliderValue}>{(r1Value / 1000).toFixed(1)}kΩ</span>
            </div>
            <input 
              type="range"
              min="100"
              max="10000"
              step="100"
              value={r1Value}
              onChange={handleR1Change}
              style={styles.slider}
            />
          </div>

          <div style={styles.sliderContainer}>
            <div style={styles.sliderLabel}>
              <span>Resistor 2 (Bottom Resistor)</span>
              <span style={styles.sliderValue}>{(r2Value / 1000).toFixed(1)}kΩ</span>
            </div>
            <input 
              type="range"
              min="100"
              max="10000"
              step="100"
              value={r2Value}
              onChange={handleR2Change}
              style={styles.slider}
            />
          </div>

          <div style={styles.valueBox}>
            <div style={styles.valueLabel}>Output Voltage</div>
            <div style={styles.valueNumber}>
              {vOut.toFixed(2)}
            </div>
            <div style={styles.valueUnit}>volts</div>
          </div>
        </div>
      </div>

      {/* Concept Explanation */}
      <div style={styles.conceptBox}>
        <div style={styles.conceptTitle}>💡 Why Do We Need Voltage Dividers?</div>
        <div style={styles.conceptText}>
          Many sensors output the full supply voltage (3.3V), but we need to measure varying resistance or position.
          A voltage divider lets us convert resistance changes into voltage changes that the ESP32 can measure!
          <br/><br/>
          <strong>The Formula:</strong> The output voltage is determined by the ratio of R2 to the total resistance (R1 + R2).
          <br/><br/>
          <strong>Try it:</strong> Change Resistor 1 to 1kΩ and Resistor 2 to 9kΩ. Notice how the output drops to about 3.0V!
          <br/>
          Change Resistor 1 to 9kΩ and Resistor 2 to 1kΩ. Now the output is only about 0.3V!
          <br/><br/>
          This principle is exactly how potentiometers work - they're just adjustable voltage dividers!
        </div>
      </div>
    </div>
  );
}