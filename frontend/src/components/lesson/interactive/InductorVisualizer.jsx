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
    gap: '1rem'
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
  statusBadge: {
    padding: '0.75rem 1.5rem',
    borderRadius: borderRadius.md,
    fontFamily,
    fontWeight: '600',
    fontSize: '0.95rem'
  }
};

export default function InductorVisualizer({ 
  config = {},
  showControls = true,
  autoPlay = false
}) {
  const flywheelCanvasRef = useRef(null);
  const circuitCanvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isOn, setIsOn] = useState(autoPlay);
  const [current, setCurrent] = useState(0);
  const [magneticField, setMagneticField] = useState(0);
  const [phase, setPhase] = useState('off');

  useEffect(() => {
    const flywheelCanvas = flywheelCanvasRef.current;
    const circuitCanvas = circuitCanvasRef.current;
    if (!flywheelCanvas || !circuitCanvas) return;

    const dpr = window.devicePixelRatio || 1;
    
    [flywheelCanvas, circuitCanvas].forEach(canvas => {
      canvas.width = 250 * dpr;
      canvas.height = 200 * dpr;
      canvas.getContext('2d').scale(dpr, dpr);
    });

    const drawFlywheel = () => {
      const ctx = flywheelCanvas.getContext('2d');
      ctx.clearRect(0, 0, 250, 200);

      // Background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, 250, 200);

      const flywheelX = 125;
      const flywheelY = 100;
      const flywheelRadius = 50;

      // Axle
      ctx.fillStyle = '#555';
      ctx.fillRect(flywheelX - 4, flywheelY - 70, 8, 140);

      // Flywheel
      ctx.save();
      ctx.translate(flywheelX, flywheelY);
      ctx.rotate((Date.now() / (500 / (current + 0.1))) % (Math.PI * 2));
      
      // Outer ring
      ctx.beginPath();
      ctx.arc(0, 0, flywheelRadius, 0, Math.PI * 2);
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 10;
      ctx.stroke();
      
      // Spokes
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 3;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(i * Math.PI / 3) * (flywheelRadius - 5), Math.sin(i * Math.PI / 3) * (flywheelRadius - 5));
        ctx.stroke();
      }
      
      // Hub
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#444';
      ctx.fill();
      
      ctx.restore();

      // Speed indicator
      ctx.fillStyle = colors.primary;
      ctx.font = `bold 12px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText(`Speed: ${(current * 100).toFixed(0)}%`, flywheelX, 180);
    };

    const drawCircuit = () => {
      const ctx = circuitCanvas.getContext('2d');
      ctx.clearRect(0, 0, 250, 200);

      // Background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, 250, 200);

      const circuitX = 125;
      const circuitY = 100;

      // Wire in
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(20, circuitY);
      ctx.lineTo(60, circuitY);
      ctx.stroke();

      // Inductor coil symbol
      ctx.strokeStyle = '#9b59b6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const startX = 60 + i * 20;
        ctx.moveTo(startX, circuitY);
        ctx.arc(startX + 10, circuitY, 10, Math.PI, 0, false);
      }
      ctx.stroke();

      // Wire out
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(140, circuitY);
      ctx.lineTo(230, circuitY);
      ctx.stroke();

      // Magnetic field lines (when current flows)
      if (magneticField > 0.1) {
        ctx.strokeStyle = `rgba(155, 89, 182, ${magneticField * 0.5})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        
        for (let i = 0; i < 3; i++) {
          const fieldRadius = 25 + i * 12;
          ctx.beginPath();
          ctx.ellipse(100, circuitY, fieldRadius, fieldRadius * 0.4, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }

      // Current flow electrons
      if (current > 0.1) {
        const numElectrons = Math.floor(current * 5);
        ctx.fillStyle = '#00d4aa';
        for (let i = 0; i < numElectrons; i++) {
          const offset = ((Date.now() / 20) + i * 40) % 210;
          const x = 20 + offset;
          if (x < 230) {
            ctx.beginPath();
            ctx.arc(x, circuitY, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Inductor value
      ctx.fillStyle = '#9b59b6';
      ctx.font = `bold 12px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText('10mH', 100, circuitY - 35);

      // Current indicator
      ctx.fillStyle = current > 0.1 ? '#00d4aa' : colors.text.muted;
      ctx.fillText(`Current: ${(current * 15).toFixed(1)}mA`, circuitX, 180);
    };

    const animate = () => {
      drawFlywheel();
      drawCircuit();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [current, magneticField, phase]);

  // Current/field simulation
  useEffect(() => {
    if (isOn) {
      setPhase('rising');
      const rampUp = setInterval(() => {
        setCurrent(prev => {
          const next = prev + 0.02;
          if (next >= 1) {
            clearInterval(rampUp);
            setPhase('steady');
            return 1;
          }
          return next;
        });
        setMagneticField(prev => Math.min(1, prev + 0.02));
      }, 50);
      
      return () => clearInterval(rampUp);
    } else {
      if (current > 0) {
        setPhase('falling');
        const rampDown = setInterval(() => {
          setCurrent(prev => {
            const next = prev - 0.03;
            if (next <= 0) {
              clearInterval(rampDown);
              setPhase('off');
              return 0;
            }
            return next;
          });
          setMagneticField(prev => Math.max(0, prev - 0.03));
        }, 50);
        
        return () => clearInterval(rampDown);
      }
    }
  }, [isOn]);

  const getStatusColor = () => {
    if (phase === 'rising') return '#f39c12';
    if (phase === 'steady') return '#27ae60';
    if (phase === 'falling') return '#e74c3c';
    return colors.text.muted;
  };

  const getStatusText = () => {
    if (phase === 'rising') return '↗ Building up';
    if (phase === 'steady') return '→ Steady';
    if (phase === 'falling') return '↘ Releasing';
    return '○ Off';
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <div style={styles.visualSection}>
          <div style={styles.sectionTitle}>🔄 Flywheel</div>
          <canvas 
            ref={flywheelCanvasRef}
            style={{ maxWidth: '100%', height: 'auto', borderRadius: borderRadius.md }}
          />
        </div>

        <div style={styles.visualSection}>
          <div style={styles.sectionTitle}>⚡ Inductor</div>
          <canvas 
            ref={circuitCanvasRef}
            style={{ maxWidth: '100%', height: 'auto', borderRadius: borderRadius.md }}
          />
        </div>
      </div>

      {showControls && (
        <div style={styles.controls}>
          <button 
            style={styles.button}
            onClick={() => setIsOn(!isOn)}
          >
            {isOn ? '⏸ Turn Off' : '⚡ Turn On'}
          </button>
          
          <div style={{
            ...styles.statusBadge,
            background: `${getStatusColor()}22`,
            color: getStatusColor(),
            border: `1px solid ${getStatusColor()}`
          }}>
            {getStatusText()}
          </div>
        </div>
      )}
    </div>
  );
}