import React, { useState, useEffect, useRef } from 'react';
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
  buttonSection: {
    background: '#0a0a0a',
    borderRadius: borderRadius.md,
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonTitle: {
    color: colors.primary,
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    fontFamily
  },
  virtualButton: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 30%, #666, #222)',
    border: '4px solid ' + colors.primary,
    boxShadow: `0 0 30px rgba(225, 241, 79, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5)`,
    cursor: 'pointer',
    transition: 'all 0.1s ease',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    userSelect: 'none'
  },
  buttonPressed: {
    transform: 'scale(0.95)',
    boxShadow: `0 0 40px rgba(225, 241, 79, 0.6), inset 0 0 30px rgba(225, 241, 79, 0.2)`,
    background: 'radial-gradient(circle at 30% 30%, #888, #444)'
  },
  stateDisplay: {
    marginTop: '1.5rem',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    fontFamily
  },
  graphSection: {
    background: '#0a0a0a',
    borderRadius: borderRadius.md,
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  graphTitle: {
    color: colors.primary,
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    fontFamily,
    textAlign: 'center'
  },
  graphCanvas: {
    width: '100%',
    height: '280px',
    background: '#000',
    borderRadius: borderRadius.md,
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  graphLegend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    marginTop: '1rem',
    fontSize: '0.85rem',
    color: colors.text.tertiary,
    fontFamily
  },
  ledIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1rem',
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.md
  },
  led: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)'
  },
  ledLabel: {
    fontFamily,
    fontSize: '1.1rem',
    fontWeight: '600'
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
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1.5rem',
    marginBottom: '1.5rem'
  },
  button: {
    background: colors.primary,
    color: '#000',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontFamily,
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'all 0.2s'
  },
  instructionText: {
    color: colors.text.tertiary,
    fontSize: '0.9rem',
    fontFamily,
    textAlign: 'center',
    marginTop: '1rem'
  }
};

export default function ButtonPressVisualizer({ 
  config = {},
  showControls = true,
  autoPlay = false
}) {
  const {
    highVoltage = 3.3,
    lowVoltage = 0,
    title = "Button Input - Digital Reading",
    explanation = "When you press a button, it changes the voltage on the input pin! Watch how the button press affects the signal and controls the LED."
  } = config;

  const [isPressed, setIsPressed] = useState(false);
  const [voltageHistory, setVoltageHistory] = useState([]);
  const canvasRef = useRef(null);

  // Update voltage history when button state changes
  useEffect(() => {
    const interval = setInterval(() => {
      const currentVoltage = isPressed ? lowVoltage : highVoltage; // INPUT_PULLUP: pressed = LOW
      setVoltageHistory(prev => {
        const newHistory = [...prev, currentVoltage];
        return newHistory.slice(-100); // Keep last 100 readings
      });
    }, 100); // Sample every 100ms

    return () => clearInterval(interval);
  }, [isPressed, highVoltage, lowVoltage]);

  // Draw voltage graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || voltageHistory.length < 2) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    
    // Horizontal lines
    for (let i = 0; i <= 3; i++) {
      const y = (height - 40) * (i / 3) + 20;
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }

    // Y-axis labels
    ctx.fillStyle = colors.text.tertiary;
    ctx.font = '10px ' + fontFamily;
    ctx.fillText(`${highVoltage}V (HIGH)`, 5, 25);
    ctx.fillText('0V (LOW)', 5, height - 15);

    // Draw voltage line
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();

    const maxPoints = Math.min(voltageHistory.length, 100);
    const xStep = (width - 50) / maxPoints;

    voltageHistory.forEach((voltage, i) => {
      const x = 30 + (i * xStep);
      const y = height - 20 - ((voltage / highVoltage) * (height - 40));
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw current value indicator (red dot)
    if (voltageHistory.length > 0) {
      const lastVoltage = voltageHistory[voltageHistory.length - 1];
      const lastX = 30 + ((voltageHistory.length - 1) * xStep);
      const lastY = height - 20 - ((lastVoltage / highVoltage) * (height - 40));
      
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
      ctx.fill();
    }

  }, [voltageHistory, highVoltage]);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  const clearGraph = () => {
    setVoltageHistory([]);
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.explanation}>{explanation}</p>

      <div style={styles.mainContent}>
        {/* Virtual Button Section - LEFT */}
        <div style={styles.buttonSection}>
          <div style={styles.buttonTitle}>🔘 Press the Button</div>
          
          <div 
            style={{
              ...styles.virtualButton,
              ...(isPressed ? styles.buttonPressed : {})
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
          >
            {isPressed ? '⬇️' : '⬆️'}
          </div>

          <div style={{
            ...styles.stateDisplay,
            color: isPressed ? '#ff0000' : colors.primary
          }}>
            {isPressed ? 'PRESSED (LOW)' : 'RELEASED (HIGH)'}
          </div>

          <div style={styles.instructionText}>
            Click and hold to press
          </div>
        </div>

        {/* Graph Section - RIGHT */}
        <div style={styles.graphSection}>
          <div style={styles.graphTitle}>📊 GPIO Pin Voltage Signal</div>
          <canvas 
            ref={canvasRef}
            style={styles.graphCanvas}
          />
          <div style={styles.graphLegend}>
            <span style={{ color: colors.primary }}>━ Voltage Signal</span>
            <span style={{ color: '#ff0000' }}>● Current Value</span>
          </div>
        </div>
      </div>

      {/* LED Indicator */}
      <div style={styles.ledIndicator}>
        <span style={styles.ledLabel}>LED State:</span>
        <div style={{
          ...styles.led,
          background: isPressed 
            ? 'radial-gradient(circle, #00ff00, #00cc00)' 
            : 'radial-gradient(circle, #333, #111)',
          boxShadow: isPressed 
            ? '0 0 30px rgba(0, 255, 0, 0.8), 0 0 60px rgba(0, 255, 0, 0.4)' 
            : '0 0 20px rgba(0, 0, 0, 0.5)'
        }} />
        <span style={{
          ...styles.ledLabel,
          color: isPressed ? '#00ff00' : '#666'
        }}>
          {isPressed ? 'ON (Button Pressed)' : 'OFF (Button Released)'}
        </span>
      </div>

      {/* Controls */}
      {showControls && (
        <div style={styles.controls}>
          <button 
            style={styles.button}
            onClick={clearGraph}
          >
            🗑️ Clear Graph
          </button>
        </div>
      )}

      {/* Concept Explanation */}
      <div style={styles.conceptBox}>
        <div style={styles.conceptTitle}>💡 How Button Inputs Work</div>
        <div style={styles.conceptText}>
          <strong>INPUT_PULLUP Mode:</strong> The ESP32 has an internal resistor that "pulls" the pin to HIGH (3.3V) when nothing is connected.
          <br/><br/>
          <strong>When Button is RELEASED:</strong> Internal pullup resistor keeps the pin at HIGH (3.3V) → digitalRead() returns HIGH → LED OFF
          <br/><br/>
          <strong>When Button is PRESSED:</strong> Button connects the pin to GND (0V) → digitalRead() returns LOW → LED ON
          <br/><br/>
          <strong>Why INPUT_PULLUP?</strong> Without it, the pin would "float" (random values) when the button isn't pressed. The pullup resistor ensures a stable HIGH state when released.
          <br/><br/>
          <strong>Try it:</strong> Press and hold the button, then release it. Watch how the voltage instantly switches between HIGH (3.3V) and LOW (0V)!
        </div>
      </div>
    </div>
  );
}