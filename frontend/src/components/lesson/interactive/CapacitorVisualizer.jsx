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
  visualSection: {
    background: '#0a0a0a',
    borderRadius: borderRadius.md,
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    fontFamily
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    flexWrap: 'wrap'
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
  buttonSecondary: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    border: `1px solid ${colors.borderLight}`
  },
  chargeContainer: {
    background: '#0a0a0a',
    borderRadius: borderRadius.md,
    padding: '1.25rem',
    marginBottom: '1rem'
  },
  chargeLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
    fontFamily
  },
  chargeName: {
    color: colors.text.secondary,
    fontSize: '0.95rem'
  },
  chargeValue: {
    fontWeight: 'bold',
    fontSize: '1.1rem'
  },
  chargeBar: {
    width: '100%',
    height: '12px',
    background: '#1a1a1a',
    borderRadius: '6px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  chargeFill: {
    height: '100%',
    transition: 'width 0.1s ease-out',
    borderRadius: '6px'
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

export default function CapacitorVisualizer({ 
  config = {},
  showControls = true,
  autoPlay = false
}) {
  const {
    title = "Capacitors - Storing Electrical Energy",
    explanation = "A capacitor stores electrical energy like a water tank stores water. It can charge up slowly and discharge quickly."
  } = config;

  const [chargeLevel, setChargeLevel] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [isDischarging, setIsDischarging] = useState(false);
  const waterCanvasRef = useRef(null);
  const circuitCanvasRef = useRef(null);
  const animationRef = useRef(null);

  // Charge/discharge animation
  useEffect(() => {
    if (isCharging) {
      const interval = setInterval(() => {
        setChargeLevel(prev => {
          const newLevel = prev + 2;
          if (newLevel >= 100) {
            setIsCharging(false);
            return 100;
          }
          return newLevel;
        });
      }, 50);
      return () => clearInterval(interval);
    }
    
    if (isDischarging) {
      const interval = setInterval(() => {
        setChargeLevel(prev => {
          const newLevel = prev - 5; // Discharge faster than charge
          if (newLevel <= 0) {
            setIsDischarging(false);
            return 0;
          }
          return newLevel;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isCharging, isDischarging]);

  useEffect(() => {
    const waterCanvas = waterCanvasRef.current;
    const circuitCanvas = circuitCanvasRef.current;
    if (!waterCanvas || !circuitCanvas) return;

    const drawWaterTank = () => {
      const ctx = waterCanvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      
      waterCanvas.width = 250 * dpr;
      waterCanvas.height = 220 * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, 250, 220);

      // Background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, 250, 220);

      // Tank
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 4;
      ctx.fillStyle = '#1a1a1a';
      
      // Tank body
      ctx.beginPath();
      ctx.roundRect(60, 40, 130, 140, 10);
      ctx.fill();
      ctx.stroke();

      // Water level
      const waterHeight = (chargeLevel / 100) * 120;
      const waterGradient = ctx.createLinearGradient(0, 180 - waterHeight, 0, 180);
      waterGradient.addColorStop(0, '#3498db');
      waterGradient.addColorStop(1, '#2980b9');
      
      ctx.fillStyle = waterGradient;
      ctx.fillRect(64, 176 - waterHeight, 122, waterHeight);

      // Water surface waves
      if (chargeLevel > 5) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const waveY = 176 - waterHeight;
        for (let x = 64; x < 186; x += 20) {
          ctx.moveTo(x, waveY);
          ctx.quadraticCurveTo(x + 10, waveY - 3, x + 20, waveY);
        }
        ctx.stroke();
      }

      // Input pipe (top)
      ctx.fillStyle = '#555';
      ctx.fillRect(115, 10, 20, 30);
      
      // Input flow animation
      if (isCharging) {
        ctx.fillStyle = '#3498db';
        const dropY = (Date.now() / 20) % 30;
        ctx.beginPath();
        ctx.arc(125, 15 + dropY, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Output pipe (bottom)
      ctx.fillStyle = '#555';
      ctx.fillRect(115, 180, 20, 30);
      
      // Output flow animation
      if (isDischarging && chargeLevel > 0) {
        ctx.fillStyle = '#3498db';
        for (let i = 0; i < 3; i++) {
          const dropY = ((Date.now() / 10) + (i * 10)) % 25;
          ctx.beginPath();
          ctx.arc(125, 185 + dropY, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Valve indicator
      ctx.fillStyle = isCharging ? '#27ae60' : isDischarging ? '#e74c3c' : '#555';
      ctx.beginPath();
      ctx.arc(125, 20, 8, 0, Math.PI * 2);
      ctx.fill();

      // Labels
      ctx.fillStyle = colors.text.muted;
      ctx.font = `11px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText('Water Tank', 125, 200);
      ctx.fillText(`${chargeLevel}% Full`, 125, 215);
    };

    const drawCircuit = () => {
      const ctx = circuitCanvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      
      circuitCanvas.width = 250 * dpr;
      circuitCanvas.height = 220 * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, 250, 220);

      // Background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, 250, 220);

      // Capacitor symbol - two parallel plates
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 3;
      
      // Left wire
      ctx.beginPath();
      ctx.moveTo(40, 110);
      ctx.lineTo(100, 110);
      ctx.stroke();
      
      // Left plate
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(100, 70);
      ctx.lineTo(100, 150);
      ctx.stroke();
      
      // Right plate
      ctx.strokeStyle = '#4a9eff';
      ctx.beginPath();
      ctx.moveTo(130, 70);
      ctx.lineTo(130, 150);
      ctx.stroke();
      
      // Right wire
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(130, 110);
      ctx.lineTo(210, 110);
      ctx.stroke();

      // Electric field lines between plates (when charged)
      if (chargeLevel > 10) {
        const intensity = chargeLevel / 100;
        ctx.strokeStyle = `rgba(225, 241, 79, ${intensity * 0.5})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        
        for (let y = 80; y < 140; y += 15) {
          ctx.beginPath();
          ctx.moveTo(105, y);
          ctx.lineTo(125, y);
          ctx.stroke();
          
          // Arrow head
          ctx.fillStyle = `rgba(225, 241, 79, ${intensity * 0.5})`;
          ctx.beginPath();
          ctx.moveTo(125, y);
          ctx.lineTo(120, y - 3);
          ctx.lineTo(120, y + 3);
          ctx.closePath();
          ctx.fill();
        }
        ctx.setLineDash([]);
      }

      // Charge indicators
      if (chargeLevel > 20) {
        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        for (let i = 0; i < Math.min(3, chargeLevel / 30); i++) {
          ctx.fillText('+', 90, 85 + i * 25);
        }
        
        ctx.fillStyle = '#4a9eff';
        for (let i = 0; i < Math.min(3, chargeLevel / 30); i++) {
          ctx.fillText('−', 140, 85 + i * 25);
        }
      }

      // Electron flow animation
      if (isCharging) {
        ctx.fillStyle = '#00d4aa';
        const electronPos = (Date.now() / 10) % 60;
        ctx.beginPath();
        ctx.arc(40 + electronPos, 110, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      if (isDischarging && chargeLevel > 0) {
        ctx.fillStyle = '#00d4aa';
        const electronPos = (Date.now() / 5) % 80;
        ctx.beginPath();
        ctx.arc(130 + electronPos, 110, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Value label
      ctx.fillStyle = colors.primary;
      ctx.font = `bold 14px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText('100µF', 115, 45);

      // Labels
      ctx.fillStyle = colors.text.muted;
      ctx.font = `11px ${fontFamily}`;
      ctx.fillText('Capacitor', 115, 185);
      ctx.fillText(`${chargeLevel}% Charged`, 115, 200);
    };

    const animate = () => {
      drawWaterTank();
      drawCircuit();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [chargeLevel, isCharging, isDischarging]);

  const handleCharge = () => {
    setIsDischarging(false);
    setIsCharging(true);
  };

  const handleDischarge = () => {
    setIsCharging(false);
    setIsDischarging(true);
  };

  const handleReset = () => {
    setIsCharging(false);
    setIsDischarging(false);
    setChargeLevel(0);
  };

  const chargeColor = chargeLevel > 80 ? '#27ae60' : chargeLevel > 40 ? '#f39c12' : '#e74c3c';

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        {/* Water Tank */}
        <div style={styles.visualSection}>
          <div style={styles.sectionTitle}>🌊 Water Tank</div>
          <canvas 
            ref={waterCanvasRef}
            style={{ maxWidth: '100%', height: 'auto', borderRadius: borderRadius.md }}
          />
        </div>

        {/* Circuit */}
        <div style={styles.visualSection}>
          <div style={styles.sectionTitle}>⚡ Capacitor</div>
          <canvas 
            ref={circuitCanvasRef}
            style={{ maxWidth: '100%', height: 'auto', borderRadius: borderRadius.md }}
          />
        </div>
      </div>

      {/* Charge level indicator - styled like resistor slider */}
      <div style={styles.chargeContainer}>
        <div style={styles.chargeLabel}>
          <span style={styles.chargeName}>🔋 Charge Level</span>
          <span style={{...styles.chargeValue, color: chargeColor}}>{chargeLevel}%</span>
        </div>
        <div style={styles.chargeBar}>
          <div style={{
            ...styles.chargeFill,
            width: `${chargeLevel}%`,
            background: chargeColor
          }} />
        </div>
      </div>

      {showControls && (
        <div style={styles.controls}>
          <button 
            style={{
              ...styles.button,
              background: isCharging ? '#27ae60' : colors.primary
            }}
            onClick={handleCharge}
            disabled={chargeLevel >= 100}
          >
            ⚡ Charge
          </button>
          <button 
            style={{
              ...styles.button,
              background: isDischarging ? '#e74c3c' : '#ff6b6b'
            }}
            onClick={handleDischarge}
            disabled={chargeLevel <= 0}
          >
            💨 Discharge
          </button>
          <button 
            style={{...styles.button, ...styles.buttonSecondary}}
            onClick={handleReset}
          >
            🔄 Reset
          </button>
        </div>
      )}
    </div>
  );
}