import React, { useState, useRef } from 'react';
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
  knobSection: {
    background: '#0a0a0a',
    borderRadius: borderRadius.md,
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  knobTitle: {
    color: colors.primary,
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    fontFamily
  },
  knobContainer: {
    position: 'relative',
    width: '200px',
    height: '200px',
    marginBottom: '1.5rem'
  },
  knob: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 30%, #444, #111)',
    border: '4px solid ' + colors.primary,
    boxShadow: `0 0 30px rgba(225, 241, 79, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5)`,
    cursor: 'grab',
    position: 'relative',
    transition: 'transform 0.1s ease-out'
  },
  knobGrabbing: {
    cursor: 'grabbing'
  },
  knobIndicator: {
    position: 'absolute',
    top: '10%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '4px',
    height: '30%',
    background: colors.primary,
    borderRadius: '2px',
    boxShadow: '0 0 10px ' + colors.primary
  },
  knobCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, #666, #222)',
    border: '2px solid #888'
  },
  angleDisplay: {
    color: colors.primary,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    fontFamily,
    marginBottom: '1rem'
  },
  resistorSection: {
    background: '#0a0a0a',
    borderRadius: borderRadius.md,
    padding: '2rem',
    marginBottom: '2rem'
  },
  resistorTitle: {
    color: colors.primary,
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    fontFamily,
    textAlign: 'center'
  },
  resistorDiagram: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    gap: '2rem',
    alignItems: 'center',
    marginBottom: '2rem',
    maxWidth: '800px',
    margin: '0 auto 2rem'
  },
  resistorBox: {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.md,
    padding: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  resistorLabel: {
    color: colors.text.tertiary,
    fontSize: '0.85rem',
    marginBottom: '0.5rem',
    fontFamily
  },
  resistorValue: {
    color: colors.primary,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    fontFamily
  },
  arrow: {
    fontSize: '2rem',
    color: colors.primary
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
  valueBox: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.md,
    padding: '1.25rem',
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
  },
  adcBox: {
    background: 'rgba(0, 255, 0, 0.1)',
    border: '1px solid #00ff00',
    borderRadius: borderRadius.md,
    padding: '1rem',
    marginTop: '1rem',
    textAlign: 'center'
  },
  adcTitle: {
    color: '#00ff00',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    fontFamily
  },
  adcValue: {
    color: '#00ff00',
    fontSize: '1.75rem',
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
  valuesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    maxWidth: '600px',
    margin: '0 auto'
  }
};

export default function PotentiometerKnob({ 
  config = {},
  showControls = true,
  autoPlay = true
}) {
  const {
    vcc = 3.3,
    totalResistance = 10000, // 10kΩ
    title = "Potentiometer - An Adjustable Voltage Divider",
    explanation = "A potentiometer is a voltage divider where you can adjust the resistances by turning a knob! Rotate the knob below to see how it changes the internal resistances."
  } = config;

  const [angle, setAngle] = useState(0); // -135 to +135 degrees (270° total)
  const [isDragging, setIsDragging] = useState(false);
  const [voltageHistory, setVoltageHistory] = useState([]);
  const knobRef = useRef(null);
  const canvasRef = useRef(null);

  // Convert angle (-135 to +135) to percentage (0 to 100)
  const percentage = ((angle + 135) / 270) * 100;
  
  // Calculate resistances based on angle
  const r1 = ((100 - percentage) / 100) * totalResistance;
  const r2 = (percentage / 100) * totalResistance;
  
  // Calculate output voltage
  const vOut = (r2 / (r1 + r2)) * vcc;

  // Calculate ADC value (12-bit: 0-4095)
  const adcValue = Math.round((vOut / vcc) * 4095);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    updateAngle(e);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      updateAngle(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateAngle = (e) => {
    if (!knobRef.current) return;

    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    // Calculate angle in degrees
    let newAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    // Adjust so 0° is at the top
    newAngle = newAngle + 90;

    // Constrain to -135° to +135° (270° total range)
    if (newAngle > 180) newAngle -= 360;
    newAngle = Math.max(-135, Math.min(135, newAngle));

    setAngle(newAngle);
  };

  // Add/remove event listeners
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // Track voltage history
  React.useEffect(() => {
    setVoltageHistory(prev => {
      const newHistory = [...prev, vOut];
      // Keep last 100 readings
      return newHistory.slice(-100);
    });
  }, [vOut]);

  // Draw voltage graph
  React.useEffect(() => {
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
    ctx.fillText(`${vcc}V`, 5, 25);
    ctx.fillText('0V', 5, height - 15);

    // Draw voltage line
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();

    const maxPoints = Math.min(voltageHistory.length, 100);
    const xStep = (width - 50) / maxPoints;

    voltageHistory.forEach((voltage, i) => {
      const x = 30 + (i * xStep);
      const y = height - 20 - ((voltage / vcc) * (height - 40));
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw current value indicator (red dot)
    if (voltageHistory.length > 0) {
      const lastX = 30 + ((voltageHistory.length - 1) * xStep);
      const lastY = height - 20 - ((vOut / vcc) * (height - 40));
      
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
      ctx.fill();
    }

  }, [voltageHistory, vOut, vcc]);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.explanation}>{explanation}</p>

      <div style={styles.mainContent}>
        {/* Knob Section - LEFT */}
        <div style={styles.knobSection}>
          <div style={styles.knobTitle}>🎛️ Rotate the Knob</div>
          
          <div style={styles.knobContainer}>
            <div 
              ref={knobRef}
              style={{
                ...styles.knob,
                transform: `rotate(${angle}deg)`,
                ...(isDragging ? styles.knobGrabbing : {})
              }}
              onMouseDown={handleMouseDown}
            >
              <div style={styles.knobIndicator} />
              <div style={styles.knobCenter} />
            </div>
          </div>

          <div style={styles.angleDisplay}>
            {percentage.toFixed(0)}%
          </div>

          <div style={{ color: colors.text.tertiary, fontSize: '0.9rem', fontFamily, textAlign: 'center' }}>
            Click and drag to rotate
          </div>
        </div>

        {/* Graph Section - RIGHT */}
        <div style={styles.graphSection}>
          <div style={styles.graphTitle}>📊 Voltage Output Signal</div>
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

      {/* Resistor Values Section - FULL WIDTH BOTTOM */}
      <div style={styles.resistorSection}>
        <div style={styles.resistorTitle}>
          Internal Voltage Divider
        </div>

        <div style={styles.resistorDiagram}>
          {/* R1 */}
          <div style={styles.resistorBox}>
            <div style={styles.resistorLabel}>R1 (Wiper to VCC)</div>
            <div style={styles.resistorValue}>{(r1 / 1000).toFixed(2)}kΩ</div>
          </div>

          {/* Arrow */}
          <div style={styles.arrow}>→</div>

          {/* R2 */}
          <div style={styles.resistorBox}>
            <div style={styles.resistorLabel}>R2 (GND to Wiper)</div>
            <div style={styles.resistorValue}>{(r2 / 1000).toFixed(2)}kΩ</div>
          </div>
        </div>

        <div style={styles.valuesGrid}>
          <div style={styles.valueBox}>
            <div style={styles.valueLabel}>Output Voltage (to ESP32)</div>
            <div style={styles.valueNumber}>{vOut.toFixed(2)}</div>
            <div style={styles.valueUnit}>volts</div>
          </div>

          <div style={styles.adcBox}>
            <div style={styles.adcTitle}>ESP32 Reads (analogRead):</div>
            <div style={styles.adcValue}>{adcValue}</div>
            <div style={{ color: '#00ff00', fontSize: '0.85rem', fontFamily, marginTop: '0.25rem' }}>
              (out of 4095)
            </div>
          </div>
        </div>
      </div>

      {/* Concept Explanation */}
      <div style={styles.conceptBox}>
        <div style={styles.conceptTitle}>💡 How a Potentiometer Works</div>
        <div style={styles.conceptText}>
          Inside every potentiometer is a resistive track with a {(totalResistance/1000).toFixed(0)}kΩ total resistance. 
          When you turn the knob, you move a "wiper" contact along this track.
          <br/><br/>
          <strong>The Secret:</strong> The wiper divides the total resistance into TWO resistors - R1 and R2!
          <br/><br/>
          <strong>Turn Clockwise (toward 100%):</strong> R1 decreases, R2 increases → Output voltage increases
          <br/>
          <strong>Turn Counter-Clockwise (toward 0%):</strong> R1 increases, R2 decreases → Output voltage decreases
          <br/><br/>
          This is exactly the voltage divider you learned about - but now it's adjustable! The ESP32 reads this 
          changing voltage (0V to 3.3V) and converts it to a number (0 to 4095) using its ADC.
          <br/><br/>
          <strong>Try it:</strong> Turn the knob all the way left (0%) - notice R2 becomes 0Ω and output is 0V.
          <br/>
          Turn it all the way right (100%) - R1 becomes 0Ω and output is 3.3V!
        </div>
      </div>
    </div>
  );
}