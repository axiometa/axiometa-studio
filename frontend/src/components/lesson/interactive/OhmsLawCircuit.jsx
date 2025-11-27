import React, { useState, useEffect, useRef } from 'react';
import { colors, borderRadius, fontFamily } from '../../../styles/theme';

const styles = {
  container: {
    background: '#000',
    border: `2px solid ${colors.primary}`,
    borderRadius: borderRadius.lg,
    padding: '1.5rem',
    marginBottom: '2rem',
    overflow: 'hidden',
    maxWidth: '100%',
    boxSizing: 'border-box'
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
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  schematicSection: {
    background: '#0a0a0a',
    borderRadius: borderRadius.md,
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  controlsSection: {
    background: '#0a0a0a',
    borderRadius: borderRadius.md,
    padding: '1.5rem',
    overflow: 'hidden',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column'
  },
  sliderGroup: {
    marginBottom: '1.5rem',
    overflow: 'hidden'
  },
  sliderLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
    fontFamily
  },
  sliderName: {
    color: colors.text.secondary,
    fontSize: '0.95rem'
  },
  sliderValue: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: '1.1rem'
  },
  slider: {
    width: '100%',
    maxWidth: '100%',
    height: '12px',
    borderRadius: '6px',
    outline: 'none',
    WebkitAppearance: 'none',
    appearance: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box'
  },
  ohmsLawBox: {
    background: 'rgba(225, 241, 79, 0.1)',
    border: `2px solid ${colors.primary}`,
    borderRadius: borderRadius.lg,
    padding: '1rem',
    marginTop: 'auto'
  },
  ohmsLawTitle: {
    color: colors.primary,
    fontSize: '1.1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '0.75rem',
    fontFamily
  },
  formula: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem'
  },
  fractionContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    background: 'rgba(0, 0, 0, 0.5)',
    borderRadius: borderRadius.md,
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  fractionTop: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    fontFamily,
    paddingBottom: '0.3rem'
  },
  fractionBar: {
    width: '100%',
    height: '2px',
    background: colors.primary,
    margin: '0.2rem 0'
  },
  fractionBottom: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    fontFamily,
    paddingTop: '0.3rem'
  },
  formulaEquals: {
    color: colors.primary,
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  formulaResult: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    fontFamily,
    padding: '0.5rem 1rem',
    background: 'rgba(0, 0, 0, 0.5)',
    borderRadius: borderRadius.md,
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  statusIndicator: {
    textAlign: 'center',
    marginTop: '0.75rem'
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '600',
    fontFamily,
    display: 'inline-block'
  },
  warningBox: {
    background: 'rgba(255, 0, 0, 0.2)',
    border: '2px solid #ff4444',
    borderRadius: borderRadius.md,
    padding: '1rem',
    marginTop: '1rem',
    textAlign: 'center'
  },
  warningText: {
    color: '#ff6b6b',
    fontSize: '1rem',
    fontWeight: '600',
    fontFamily
  },
  resetButton: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    background: colors.primary,
    color: '#000',
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontWeight: '600',
    fontFamily,
    fontSize: '0.95rem'
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

// Inject CSS animations and slider styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes explosionPulse {
      0% { transform: scale(0.8); opacity: 0; }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); opacity: 1; }
    }
    
    input[type="range"].voltage-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #ff6b6b;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
    }
    
    input[type="range"].voltage-slider::-moz-range-thumb {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #ff6b6b;
      cursor: pointer;
      border: none;
    }
    
    input[type="range"].resistance-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #00d4aa;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(0, 212, 170, 0.5);
    }
    
    input[type="range"].resistance-slider::-moz-range-thumb {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #00d4aa;
      cursor: pointer;
      border: none;
    }
  `;
  if (!document.head.querySelector('[data-ohms-law-styles]')) {
    styleSheet.setAttribute('data-ohms-law-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

// Wire color - all yellow
const WIRE_COLOR = colors.primary;
const WIRE_WIDTH = 3;

// Clean Circuit Schematic Component
function CircuitSchematic({ voltage, resistance, current, ledBrightness, isExploded, electrons }) {
  const ledColor = isExploded 
    ? '#333' 
    : `rgba(0, 255, 0, ${Math.min(1, ledBrightness)})`;
  
  const ledGlowIntensity = Math.min(20, ledBrightness * 20);

  return (
    <svg width="320" height="260" viewBox="0 0 320 260">
      {/* Background grid */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
        </pattern>
        <filter id="ledGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={ledGlowIntensity} result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect width="320" height="260" fill="url(#grid)"/>
      
      {/* === WIRES (all yellow, connected) === */}
      
      {/* Top wire: from power supply + to resistor */}
      <line x1="50" y1="50" x2="100" y2="50" stroke={WIRE_COLOR} strokeWidth={WIRE_WIDTH}/>
      
      {/* Top wire: from resistor to right corner */}
      <line x1="200" y1="50" x2="270" y2="50" stroke={WIRE_COLOR} strokeWidth={WIRE_WIDTH}/>
      
      {/* Right wire: down to LED */}
      <line x1="270" y1="50" x2="270" y2="95" stroke={WIRE_COLOR} strokeWidth={WIRE_WIDTH}/>
      
      {/* Wire from LED bottom down to corner */}
      <line x1="270" y1="155" x2="270" y2="210" stroke={WIRE_COLOR} strokeWidth={WIRE_WIDTH}/>
      
      {/* Bottom wire: from right to left */}
      <line x1="270" y1="210" x2="50" y2="210" stroke={WIRE_COLOR} strokeWidth={WIRE_WIDTH}/>
      
      {/* Left wire: up to power supply - */}
      <line x1="50" y1="210" x2="50" y2="165" stroke={WIRE_COLOR} strokeWidth={WIRE_WIDTH}/>
      
      {/* === POWER SUPPLY (left side, vertical, + at top, single cell) === */}
      <g transform="translate(50, 130)">
        {/* Battery symbol - single cell, vertical orientation */}
        {/* Long line (positive) - at top */}
        <line x1="-12" y1="-15" x2="12" y2="-15" stroke={WIRE_COLOR} strokeWidth="4"/>
        {/* Short line (negative) - below positive */}
        <line x1="-7" y1="0" x2="7" y2="0" stroke={WIRE_COLOR} strokeWidth="2"/>
        
        {/* Vertical connection lines */}
        <line x1="0" y1="-80" x2="0" y2="-15" stroke={WIRE_COLOR} strokeWidth={WIRE_WIDTH}/>
        <line x1="0" y1="0" x2="0" y2="35" stroke={WIRE_COLOR} strokeWidth={WIRE_WIDTH}/>
        
        {/* + and - labels */}
        <text x="20" y="-10" fill="#ff6b6b" fontSize="14" fontWeight="bold" fontFamily={fontFamily}>+</text>
        <text x="20" y="5" fill="#4a9eff" fontSize="16" fontWeight="bold" fontFamily={fontFamily}>−</text>
        
        {/* Voltage label - to the right */}
        <text x="22" y="30" fill={colors.primary} fontSize="14" fontWeight="bold" textAnchor="start" fontFamily={fontFamily}>
          {voltage.toFixed(1)}V
        </text>
      </g>
      
      {/* === RESISTOR (top, horizontal) === */}
      <g transform="translate(150, 50)">
        {/* Zigzag resistor symbol */}
        <path 
          d="M -50 0 L -40 0 L -35 -10 L -25 10 L -15 -10 L -5 10 L 5 -10 L 15 10 L 25 -10 L 35 10 L 40 0 L 50 0" 
          fill="none" 
          stroke="#00d4aa" 
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Resistor label */}
        <text x="0" y="-18" fill="#00d4aa" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily={fontFamily}>
          {resistance}Ω
        </text>
      </g>
      
      {/* === LED (right side, vertical, triangle pointing DOWN, smaller) === */}
      <g transform="translate(270, 125)">
        {/* LED triangle - pointing DOWN (anode at top, cathode at bottom) - smaller */}
        <polygon 
          points="0,22 -12,-10 12,-10" 
          fill={ledColor}
          stroke="#fff"
          strokeWidth="2"
          filter={!isExploded && ledBrightness > 0.1 ? "url(#ledGlow)" : "none"}
        />
        
        {/* LED bar (cathode) at bottom */}
        <line x1="-12" y1="25" x2="12" y2="25" stroke="#fff" strokeWidth="3"/>
        
        {/* Anode + marker (top) */}
        <text x="22" y="-18" fill="#ff6b6b" fontSize="11" fontWeight="bold" fontFamily={fontFamily}>+</text>
        
        {/* Cathode - marker (bottom) */}
        <text x="22" y="30" fill="#4a9eff" fontSize="13" fontWeight="bold" fontFamily={fontFamily}>−</text>
        
        {/* Connection points */}
        {/* Top connection (anode) */}
        <line x1="0" y1="-30" x2="0" y2="-10" stroke={WIRE_COLOR} strokeWidth={WIRE_WIDTH}/>
        {/* Bottom connection (cathode) */}
        <line x1="0" y1="25" x2="0" y2="30" stroke={WIRE_COLOR} strokeWidth={WIRE_WIDTH}/>
        
        {/* LED light glow - directly on the LED */}
        {!isExploded && ledBrightness > 0.1 && (
          <>
            <circle 
              cx="0" 
              cy="5" 
              r={20 + (ledBrightness * 15)} 
              fill={ledColor} 
              opacity={ledBrightness * 0.3}
            />
            <circle 
              cx="0" 
              cy="5" 
              r={12 + (ledBrightness * 8)} 
              fill={ledColor} 
              opacity={ledBrightness * 0.5}
            />
          </>
        )}
        
        {/* Explosion effect */}
        {isExploded && (
          <text x="0" y="8" fontSize="28" textAnchor="middle" dominantBaseline="middle">💥</text>
        )}
        
        {/* LED label */}
        <text x="-25" y="10" fill={colors.text.muted} fontSize="11" textAnchor="end" fontFamily={fontFamily}>
          LED
        </text>
      </g>
      
      {/* === MOVING ELECTRONS === */}
      {!isExploded && electrons.map((electron, i) => {
        const progress = electron.progress;
        let x, y;
        
        // Path: from + (top left) -> through resistor -> down right side through LED -> bottom -> back to - (bottom left)
        
        if (progress < 0.2) {
          // Top wire: left to right through resistor
          const p = progress / 0.2;
          x = 50 + (220 * p);
          y = 50;
        } else if (progress < 0.45) {
          // Right side: down through LED
          const p = (progress - 0.2) / 0.25;
          x = 270;
          y = 50 + (160 * p);
        } else if (progress < 0.7) {
          // Bottom: right to left
          const p = (progress - 0.45) / 0.25;
          x = 270 - (220 * p);
          y = 210;
        } else {
          // Left side: up through power supply
          const p = (progress - 0.7) / 0.3;
          x = 50;
          y = 210 - (160 * p);
        }
        
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={4}
            fill="#00d4aa"
            style={{
              filter: 'drop-shadow(0 0 4px #00d4aa)'
            }}
          />
        );
      })}
    </svg>
  );
}

export default function OhmsLawCircuit({ 
  config = {},
  showControls = true,
  autoPlay = true
}) {
  const {
    title = "Ohm's Law - The Fundamental Circuit",
    explanation = "Adjust voltage and resistance to see how current changes. Watch the electrons flow!",
    maxCurrent = 0.025, // 25mA - typical LED max before burnout
  } = config;

  const [voltage, setVoltage] = useState(3.3);
  const [resistance, setResistance] = useState(220);
  const [isExploded, setIsExploded] = useState(false);
  const [electrons, setElectrons] = useState([]);
  const animationRef = useRef(null);

  // Calculate current using Ohm's Law: I = V / R
  const current = voltage / resistance;
  const currentMA = current * 1000;
  
  // LED brightness based on current
  const ledBrightness = Math.min(1, current / maxCurrent);
  
  // Check if LED should explode
  useEffect(() => {
    if (current > maxCurrent && !isExploded) {
      const timer = setTimeout(() => {
        setIsExploded(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [current, maxCurrent, isExploded]);

  // Animate electrons
  useEffect(() => {
    if (isExploded) {
      setElectrons([]);
      return;
    }

    const baseSpeed = 0.002;
    const speedMultiplier = Math.min(5, current / 0.005);
    const speed = baseSpeed * speedMultiplier;
    
    const numElectrons = Math.max(3, Math.min(12, Math.floor(currentMA / 2)));
    
    if (electrons.length !== numElectrons) {
      const newElectrons = Array.from({ length: numElectrons }, (_, i) => ({
        progress: i / numElectrons
      }));
      setElectrons(newElectrons);
    }

    const animate = () => {
      setElectrons(prev => prev.map(e => ({
        ...e,
        progress: (e.progress + speed) % 1
      })));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [current, isExploded, electrons.length, currentMA]);

  const handleReset = () => {
    setIsExploded(false);
    setVoltage(3.3);
    setResistance(220);
  };

  const isDangerous = current > maxCurrent * 0.8;
  const isWarning = current > maxCurrent * 0.6;

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        {/* Schematic Section */}
        <div style={styles.schematicSection}>
          <CircuitSchematic 
            voltage={voltage}
            resistance={resistance}
            current={current}
            ledBrightness={ledBrightness}
            isExploded={isExploded}
            electrons={electrons}
          />
        </div>

        {/* Controls Section */}
        <div style={styles.controlsSection}>
          {/* Voltage Slider */}
          <div style={styles.sliderGroup}>
            <div style={styles.sliderLabel}>
              <span style={styles.sliderName}>⚡ Voltage (V)</span>
              <span style={{...styles.sliderValue, color: '#ff6b6b'}}>{voltage.toFixed(1)}V</span>
            </div>
            <input
              type="range"
              className="voltage-slider"
              min="1.2"
              max="12"
              step="0.1"
              value={voltage}
              onChange={(e) => setVoltage(parseFloat(e.target.value))}
              disabled={isExploded}
              style={{
                ...styles.slider,
                background: `linear-gradient(90deg, #1a1a1a 0%, #ff6b6b 100%)`
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: colors.text.muted, marginTop: '0.25rem' }}>
              <span>1.2V</span>
              <span>12V</span>
            </div>
          </div>

          {/* Resistance Slider */}
          <div style={styles.sliderGroup}>
            <div style={styles.sliderLabel}>
              <span style={styles.sliderName}>🔧 Resistance (Ω)</span>
              <span style={{...styles.sliderValue, color: '#00d4aa'}}>{resistance}Ω</span>
            </div>
            <input
              type="range"
              className="resistance-slider"
              min="10"
              max="1000"
              step="10"
              value={resistance}
              onChange={(e) => setResistance(parseFloat(e.target.value))}
              disabled={isExploded}
              style={{
                ...styles.slider,
                background: `linear-gradient(90deg, #1a1a1a 0%, #00d4aa 100%)`
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: colors.text.muted, marginTop: '0.25rem' }}>
              <span>10Ω</span>
              <span>1000Ω</span>
            </div>
          </div>

          {/* Ohm's Law Box - contains formula AND status */}
          <div style={styles.ohmsLawBox}>
            <div style={styles.ohmsLawTitle}>⚡ Ohm's Law</div>
            
            <div style={styles.formula}>
              {/* V/R fraction */}
              <div style={styles.fractionContainer}>
                <div style={{...styles.fractionTop, color: '#ff6b6b'}}>
                  {voltage.toFixed(1)}V
                </div>
                <div style={styles.fractionBar}></div>
                <div style={{...styles.fractionBottom, color: '#00d4aa'}}>
                  {resistance}Ω
                </div>
              </div>
              
              <span style={styles.formulaEquals}>=</span>
              
              <div style={{
                ...styles.formulaResult, 
                color: isDangerous ? '#ff4444' : isWarning ? '#ffaa00' : colors.primary
              }}>
                {currentMA.toFixed(1)}mA
              </div>
            </div>
            
            {/* Status indicator inside the box */}
            <div style={styles.statusIndicator}>
              <span style={{ 
                ...styles.statusBadge,
                background: isDangerous ? 'rgba(255, 68, 68, 0.2)' : isWarning ? 'rgba(255, 170, 0, 0.2)' : 'rgba(0, 212, 170, 0.2)',
                color: isDangerous ? '#ff4444' : isWarning ? '#ffaa00' : '#00d4aa',
                border: `1px solid ${isDangerous ? '#ff4444' : isWarning ? '#ffaa00' : '#00d4aa'}`
              }}>
                {isDangerous ? '⚠️ DANGER!' : isWarning ? '⚡ Getting hot...' : '✓ Safe'}
              </span>
            </div>
          </div>

          {/* Explosion warning */}
          {isExploded && (
            <div style={styles.warningBox}>
              <div style={styles.warningText}>💥 LED BURNED OUT!</div>
              <div style={{ color: colors.text.secondary, fontSize: '0.9rem', marginTop: '0.5rem', fontFamily }}>
                Current exceeded {(maxCurrent * 1000).toFixed(0)}mA
              </div>
              <button style={styles.resetButton} onClick={handleReset}>
                🔄 Reset Circuit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}