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
    alignItems: 'center'
  },
  diagramTitle: {
    color: colors.primary,
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    fontFamily
  },
  circuit: {
    position: 'relative',
    width: '100%',
    maxWidth: '300px',
    aspectRatio: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2rem 1rem'
  },
  voltageSource: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '3px solid ' + colors.primary,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(225, 241, 79, 0.1)',
    fontFamily,
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: colors.primary
  },
  resistor: {
    width: '60px',
    height: '80px',
    background: 'linear-gradient(180deg, #8B4513, #A0522D)',
    border: '2px solid #654321',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    fontFamily,
    fontSize: '0.85rem',
    color: '#fff'
  },
  resistorStripes: {
    width: '100%',
    height: '8px',
    background: '#FFD700',
    margin: '2px 0'
  },
  wire: {
    width: '3px',
    height: '40px',
    background: colors.primary,
    margin: '0.5rem 0'
  },
  ground: {
    width: '60px',
    height: '3px',
    background: colors.primary,
    position: 'relative',
    marginTop: '0.5rem'
  },
  groundLines: {
    position: 'absolute',
    top: '5px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  groundLine: {
    height: '2px',
    background: colors.primary
  },
  voltageLabel: {
    position: 'absolute',
    right: '-80px',
    background: 'rgba(225, 241, 79, 0.2)',
    border: '1px solid ' + colors.primary,
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    fontFamily,
    fontSize: '0.9rem',
    color: colors.primary,
    whiteSpace: 'nowrap',
    fontWeight: 'bold'
  },
  sliderSection: {
    background: '#0a0a0a',
    borderRadius: borderRadius.md,
    padding: '2rem'
  },
  sliderLabel: {
    color: colors.text.secondary,
    fontSize: '0.9rem',
    marginBottom: '1rem',
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
    cursor: 'pointer',
    marginBottom: '2rem'
  },
  valuesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  valueBox: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.md,
    padding: '1rem',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  valueLabel: {
    color: colors.text.tertiary,
    fontSize: '0.75rem',
    marginBottom: '0.5rem',
    fontFamily
  },
  valueNumber: {
    color: colors.primary,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    fontFamily
  },
  valueUnit: {
    color: colors.text.muted,
    fontSize: '0.85rem',
    fontFamily
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
    marginBottom: '1rem'
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

export default function VoltageDivider({ 
  config = {},
  showControls = true,
  autoPlay = true
}) {
  const {
    vcc = 3.3,
    title = "Voltage Divider - How Potentiometers Work",
    explanation = "A potentiometer is basically two resistors! As you turn it, one resistance increases while the other decreases, changing the output voltage."
  } = config;

  // Resistance values (total = 10kΩ)
  const [position, setPosition] = useState(50); // 0-100%
  
  // Calculate resistances
  const totalResistance = 10000; // 10kΩ
  const r1 = (position / 100) * totalResistance;
  const r2 = ((100 - position) / 100) * totalResistance;
  
  // Calculate output voltage using voltage divider formula
  const vOut = (r2 / (r1 + r2)) * vcc;

  const handleSliderChange = (e) => {
    setPosition(parseFloat(e.target.value));
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.explanation}>{explanation}</p>

      <div style={styles.mainContent}>
        {/* Circuit Diagram */}
        <div style={styles.diagramSection}>
          <div style={styles.diagramTitle}>Circuit Diagram</div>
          <div style={styles.circuit}>
            {/* Voltage Source */}
            <div style={styles.voltageSource}>
              <div>+{vcc}V</div>
              <div style={{ fontSize: '0.7rem', color: colors.text.secondary }}>VCC</div>
            </div>

            {/* Wire down */}
            <div style={styles.wire} />

            {/* R1 (top resistor) */}
            <div style={styles.resistor}>
              <div style={styles.voltageLabel}>
                {(vcc - vOut).toFixed(2)}V
              </div>
              <div style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>R1</div>
              <div style={styles.resistorStripes} />
              <div style={styles.resistorStripes} />
              <div style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>
                {(r1 / 1000).toFixed(1)}kΩ
              </div>
            </div>

            {/* Wire down */}
            <div style={styles.wire} />

            {/* Output point */}
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: colors.primary,
              boxShadow: '0 0 15px ' + colors.primary,
              position: 'relative'
            }}>
              <div style={{
                ...styles.voltageLabel,
                right: '-100px',
                background: 'rgba(0, 255, 0, 0.2)',
                borderColor: '#00ff00',
                color: '#00ff00'
              }}>
                OUT: {vOut.toFixed(2)}V
              </div>
            </div>

            {/* Wire down */}
            <div style={styles.wire} />

            {/* R2 (bottom resistor) */}
            <div style={styles.resistor}>
              <div style={styles.voltageLabel}>
                {vOut.toFixed(2)}V
              </div>
              <div style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>R2</div>
              <div style={styles.resistorStripes} />
              <div style={styles.resistorStripes} />
              <div style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>
                {(r2 / 1000).toFixed(1)}kΩ
              </div>
            </div>

            {/* Wire to ground */}
            <div style={styles.wire} />

            {/* Ground */}
            <div style={styles.ground}>
              <div style={styles.groundLines}>
                <div style={{...styles.groundLine, width: '40px'}} />
                <div style={{...styles.groundLine, width: '30px'}} />
                <div style={{...styles.groundLine, width: '20px'}} />
              </div>
            </div>
          </div>
        </div>

        {/* Controls & Values */}
        <div style={styles.sliderSection}>
          <div style={styles.sliderLabel}>
            🎛️ Rotate the Potentiometer
          </div>
          <input 
            type="range"
            min="0"
            max="100"
            step="1"
            value={position}
            onChange={handleSliderChange}
            style={styles.slider}
          />

          <div style={styles.valuesGrid}>
            <div style={styles.valueBox}>
              <div style={styles.valueLabel}>R1 (Top)</div>
              <div style={styles.valueNumber}>{(r1 / 1000).toFixed(1)}</div>
              <div style={styles.valueUnit}>kΩ</div>
            </div>
            <div style={styles.valueBox}>
              <div style={styles.valueLabel}>R2 (Bottom)</div>
              <div style={styles.valueNumber}>{(r2 / 1000).toFixed(1)}</div>
              <div style={styles.valueUnit}>kΩ</div>
            </div>
          </div>

          <div style={styles.valueBox}>
            <div style={styles.valueLabel}>Output Voltage</div>
            <div style={{...styles.valueNumber, fontSize: '2rem', color: '#00ff00'}}>
              {vOut.toFixed(2)}
            </div>
            <div style={styles.valueUnit}>volts</div>
          </div>

          <div style={styles.formula}>
            V<sub>OUT</sub> = V<sub>CC</sub> × (R2 / (R1 + R2))<br/>
            V<sub>OUT</sub> = {vcc} × ({(r2/1000).toFixed(1)} / {((r1+r2)/1000).toFixed(1)}) = {vOut.toFixed(2)}V
          </div>
        </div>
      </div>

      {/* Concept Explanation */}
      <div style={styles.conceptBox}>
        <div style={styles.conceptTitle}>💡 How It Works</div>
        <div style={styles.conceptText}>
          When you turn the potentiometer knob, you're changing where the "wiper" (middle pin) touches the resistive material inside.
          <br/><br/>
          <strong>Turn clockwise:</strong> R1 increases, R2 decreases → Output voltage decreases<br/>
          <strong>Turn counter-clockwise:</strong> R1 decreases, R2 increases → Output voltage increases
          <br/><br/>
          The ESP32 reads this changing voltage (0V to 3.3V) and converts it to a number (0 to 4095) using its ADC!
        </div>
      </div>
    </div>
  );
}