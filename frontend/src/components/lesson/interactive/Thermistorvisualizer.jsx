import React, { useState, useEffect } from 'react';
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
    marginBottom: '1rem',
    fontFamily
  },
  controlsSection: {
    background: '#0a0a0a',
    borderRadius: borderRadius.md,
    padding: '2rem'
  },
  thermometerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  thermometerOuter: {
    width: '60px',
    height: '200px',
    background: '#1a1a1a',
    borderRadius: '30px 30px 40px 40px',
    border: '3px solid #444',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '10px'
  },
  thermometerFill: {
    width: '30px',
    borderRadius: '15px 15px 25px 25px',
    transition: 'all 0.3s ease',
    position: 'absolute',
    bottom: '10px'
  },
  thermometerBulb: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    position: 'absolute',
    bottom: '5px',
    transition: 'all 0.3s ease'
  },
  tempDisplay: {
    marginTop: '1rem',
    textAlign: 'center'
  },
  tempValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    fontFamily
  },
  tempUnit: {
    fontSize: '1rem',
    color: colors.text.secondary,
    fontFamily
  },
  sliderContainer: {
    marginBottom: '1.5rem'
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
    outline: 'none',
    WebkitAppearance: 'none',
    appearance: 'none',
    cursor: 'pointer'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginTop: '1.5rem'
  },
  statBox: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.md,
    padding: '1rem',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  statLabel: {
    color: colors.text.tertiary,
    fontSize: '0.75rem',
    marginBottom: '0.25rem',
    fontFamily
  },
  statValue: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    fontFamily
  },
  statUnit: {
    color: colors.text.muted,
    fontSize: '0.75rem',
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
  },
  ntcBadge: {
    display: 'inline-block',
    background: 'rgba(255, 100, 100, 0.2)',
    border: '1px solid #ff6464',
    borderRadius: '4px',
    padding: '2px 8px',
    fontSize: '0.8rem',
    color: '#ff6464',
    marginLeft: '0.5rem'
  }
};

// Inject slider thumb styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    input[type="range"].thermistor-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ff6464 0%, #ff3232 100%);
      cursor: pointer;
      box-shadow: 0 0 15px rgba(255, 100, 100, 0.6);
      border: 2px solid #fff;
    }
    
    input[type="range"].thermistor-slider::-moz-range-thumb {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ff6464 0%, #ff3232 100%);
      cursor: pointer;
      border: 2px solid #fff;
      box-shadow: 0 0 15px rgba(255, 100, 100, 0.6);
    }
  `;
  if (!document.head.querySelector('[data-thermistor-slider-styles]')) {
    styleSheet.setAttribute('data-thermistor-slider-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

// Calculate NTC thermistor resistance using Steinhart-Hart equation (simplified Beta equation)
function calculateThermistorResistance(tempCelsius, r25 = 10000, beta = 3950) {
  const t25 = 298.15; // 25°C in Kelvin
  const tKelvin = tempCelsius + 273.15;
  return r25 * Math.exp(beta * (1 / tKelvin - 1 / t25));
}

// SVG Schematic with Thermistor
function ThermistorSchematic({ vcc, rFixed, rThermistor, vOut, temperature }) {
  // Color based on temperature
  const tempColor = temperature < 20 ? '#64b5f6' : 
                    temperature < 30 ? '#81c784' : 
                    temperature < 40 ? '#ffb74d' : '#ff6464';
  
  return (
    <svg width="280" height="420" viewBox="0 0 280 420">
      {/* VCC at top */}
      <text x="140" y="25" fill={colors.primary} fontSize="16" fontWeight="bold" textAnchor="middle">
        +{vcc}V (VCC)
      </text>
      
      {/* Vertical wire from VCC */}
      <line x1="140" y1="35" x2="140" y2="60" stroke={colors.primary} strokeWidth="2"/>
      
      {/* Fixed Resistor R1 */}
      <g>
        <path 
          d="M 140 60 L 140 65 L 155 75 L 125 90 L 155 105 L 125 120 L 155 135 L 140 145 L 140 150" 
          fill="none" 
          stroke={colors.primary} 
          strokeWidth="3"
        />
        <text x="170" y="100" fill="#fff" fontSize="14" fontWeight="bold">R1 (Fixed)</text>
        <text x="170" y="118" fill={colors.primary} fontSize="14" fontWeight="bold">
          {(rFixed / 1000).toFixed(1)}kΩ
        </text>
      </g>
      
      {/* Wire to midpoint */}
      <line x1="140" y1="150" x2="140" y2="175" stroke={colors.primary} strokeWidth="2"/>
      
      {/* Output node */}
      <circle cx="140" cy="175" r="5" fill="#00ff00" stroke="#00ff00" strokeWidth="2">
        <animate attributeName="r" values="5;7;5" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      
      {/* Output wire */}
      <line x1="140" y1="175" x2="190" y2="175" stroke="#00ff00" strokeWidth="2"/>
      
      {/* Output label */}
      <rect x="195" y="160" width="80" height="30" fill="rgba(0, 255, 0, 0.1)" stroke="#00ff00" strokeWidth="1" rx="4"/>
      <text x="235" y="180" fill="#00ff00" fontSize="14" fontWeight="bold" textAnchor="middle">
        {vOut.toFixed(2)}V
      </text>
      
      {/* Wire to thermistor */}
      <line x1="140" y1="175" x2="140" y2="200" stroke={colors.primary} strokeWidth="2"/>
      
      {/* Thermistor symbol - resistor with temperature indicator */}
      <g>
        {/* Thermistor body with temperature-based color */}
        <path 
          d="M 140 200 L 140 205 L 155 215 L 125 230 L 155 245 L 125 260 L 155 275 L 140 285 L 140 290" 
          fill="none" 
          stroke={tempColor}
          strokeWidth="3"
        />
        {/* Temperature indicator line through resistor */}
        <line x1="120" y1="225" x2="160" y2="265" stroke={tempColor} strokeWidth="2"/>
        
        {/* Thermistor label */}
        <text x="170" y="238" fill="#fff" fontSize="14" fontWeight="bold">NTC</text>
        <text x="170" y="256" fill={tempColor} fontSize="14" fontWeight="bold">
          {rThermistor >= 1000 ? (rThermistor / 1000).toFixed(1) + 'kΩ' : rThermistor.toFixed(0) + 'Ω'}
        </text>
        <text x="170" y="274" fill={tempColor} fontSize="12">
          @ {temperature}°C
        </text>
      </g>
      
      {/* Wire to ground */}
      <line x1="140" y1="290" x2="140" y2="350" stroke={colors.primary} strokeWidth="2"/>
      
      {/* Ground symbol */}
      <g>
        <line x1="120" y1="350" x2="160" y2="350" stroke={colors.primary} strokeWidth="2"/>
        <line x1="127" y1="358" x2="153" y2="358" stroke={colors.primary} strokeWidth="2"/>
        <line x1="134" y1="366" x2="146" y2="366" stroke={colors.primary} strokeWidth="2"/>
        <text x="140" y="390" fill={colors.primary} fontSize="14" fontWeight="bold" textAnchor="middle">GND</text>
      </g>
      
      {/* ADC indicator */}
      <rect x="5" y="155" width="55" height="40" fill="rgba(0, 255, 0, 0.1)" stroke="#00ff00" strokeWidth="1" rx="4"/>
      <text x="32" y="172" fill="#00ff00" fontSize="10" textAnchor="middle">ADC PIN</text>
      <text x="32" y="188" fill="#00ff00" fontSize="12" fontWeight="bold" textAnchor="middle">
        {Math.round((vOut / vcc) * 4095)}
      </text>
      <line x1="60" y1="175" x2="135" y2="175" stroke="#00ff00" strokeWidth="1" strokeDasharray="4,2"/>
    </svg>
  );
}

export default function ThermistorVisualizer({ 
  config = {},
  showControls = true
}) {
  const {
    vcc = 3.3,
    rFixed = 10000, // 10kΩ fixed resistor
    r25 = 10000, // Thermistor resistance at 25°C
    beta = 3950, // Beta coefficient
    title = "How a Thermistor Works",
    explanation = "A thermistor changes its resistance based on temperature. As it gets hotter, resistance decreases (NTC type), changing the voltage at the output!"
  } = config;

  const [temperature, setTemperature] = useState(25);
  
  // Calculate thermistor resistance at current temperature
  const rThermistor = calculateThermistorResistance(temperature, r25, beta);
  
  // Calculate output voltage (thermistor is bottom resistor in voltage divider)
  const vOut = (rThermistor / (rFixed + rThermistor)) * vcc;
  
  // Calculate ADC value
  const adcValue = Math.round((vOut / vcc) * 4095);
  
  // Temperature color
  const getTempColor = (temp) => {
    if (temp < 15) return '#64b5f6'; // Cold blue
    if (temp < 25) return '#81c784'; // Cool green
    if (temp < 35) return '#fff176'; // Warm yellow
    if (temp < 45) return '#ffb74d'; // Hot orange
    return '#ff6464'; // Very hot red
  };
  
  const tempColor = getTempColor(temperature);
  
  // Thermometer fill height (0-100%)
  const fillPercent = ((temperature + 10) / 70) * 100; // Range: -10 to 60°C

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.explanation}>{explanation}</p>

      <div style={styles.mainContent}>
        {/* Left: Schematic */}
        <div style={styles.diagramSection}>
          <div style={styles.diagramTitle}>
            Circuit Schematic
            <span style={styles.ntcBadge}>NTC Thermistor</span>
          </div>
          <ThermistorSchematic 
            vcc={vcc}
            rFixed={rFixed}
            rThermistor={rThermistor}
            vOut={vOut}
            temperature={temperature}
          />
        </div>

        {/* Right: Controls & Thermometer */}
        <div style={styles.controlsSection}>
          {/* Visual Thermometer */}
          <div style={styles.thermometerContainer}>
            <div style={styles.thermometerOuter}>
              {/* Fill */}
              <div style={{
                ...styles.thermometerFill,
                height: `${Math.min(100, Math.max(10, fillPercent))}%`,
                background: `linear-gradient(to top, ${tempColor}, ${tempColor}aa)`
              }} />
              {/* Bulb */}
              <div style={{
                ...styles.thermometerBulb,
                background: tempColor,
                boxShadow: `0 0 20px ${tempColor}88`
              }} />
            </div>
            <div style={styles.tempDisplay}>
              <div style={{ ...styles.tempValue, color: tempColor }}>
                {temperature}°C
              </div>
              <div style={styles.tempUnit}>
                ({((temperature * 9/5) + 32).toFixed(1)}°F)
              </div>
            </div>
          </div>

          {/* Temperature Slider */}
          <div style={styles.sliderContainer}>
            <div style={styles.sliderLabel}>
              <span>🌡️ Simulated Temperature</span>
              <span style={{ ...styles.sliderValue, color: tempColor }}>{temperature}°C</span>
            </div>
            <input 
              type="range"
              className="thermistor-slider"
              min="-10"
              max="60"
              step="1"
              value={temperature}
              onChange={(e) => setTemperature(parseInt(e.target.value))}
              style={{
                ...styles.slider,
                background: `linear-gradient(90deg, #64b5f6 0%, #81c784 30%, #fff176 50%, #ffb74d 70%, #ff6464 100%)`
              }}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '0.75rem', 
              color: colors.text.tertiary,
              marginTop: '0.25rem'
            }}>
              <span>🥶 -10°C</span>
              <span>🥵 60°C</span>
            </div>
          </div>

          {/* Stats */}
          <div style={styles.statsGrid}>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Thermistor Resistance</div>
              <div style={{ ...styles.statValue, color: tempColor }}>
                {rThermistor >= 1000 ? (rThermistor / 1000).toFixed(2) : rThermistor.toFixed(0)}
              </div>
              <div style={styles.statUnit}>{rThermistor >= 1000 ? 'kΩ' : 'Ω'}</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Output Voltage</div>
              <div style={{ ...styles.statValue, color: '#00ff00' }}>
                {vOut.toFixed(3)}
              </div>
              <div style={styles.statUnit}>V</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>ADC Reading</div>
              <div style={{ ...styles.statValue, color: '#00ff00' }}>
                {adcValue}
              </div>
              <div style={styles.statUnit}>/ 4095</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Fixed Resistor</div>
              <div style={{ ...styles.statValue, color: colors.primary }}>
                {(rFixed / 1000).toFixed(1)}
              </div>
              <div style={styles.statUnit}>kΩ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Concept Explanation */}
      <div style={styles.conceptBox}>
        <div style={styles.conceptTitle}>💡 How NTC Thermistors Work</div>
        <div style={styles.conceptText}>
          <strong>NTC = Negative Temperature Coefficient:</strong> As temperature increases, resistance decreases. This is the opposite of regular resistors!
          <br/><br/>
          <strong>At 25°C (room temp):</strong> The thermistor has its rated resistance (typically 10kΩ). This is called R25.
          <br/><br/>
          <strong>When heated:</strong> Resistance drops → More current flows → Voltage at ADC pin drops
          <br/><br/>
          <strong>When cooled:</strong> Resistance rises → Less current flows → Voltage at ADC pin rises
          <br/><br/>
          <strong>Try it:</strong> Slide to 0°C and watch the resistance climb to ~27kΩ. Then slide to 50°C and see it drop to ~3.6kΩ!
          <br/><br/>
          <strong>The Math:</strong> We use the Steinhart-Hart equation (simplified Beta formula) to convert ADC readings back to temperature in our code.
        </div>
      </div>
    </div>
  );
}