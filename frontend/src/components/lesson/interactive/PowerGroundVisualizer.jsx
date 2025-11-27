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
    flexDirection: 'column',
    gap: '1rem'
  },
  sliderGroup: {
    background: '#0a0a0a',
    borderRadius: borderRadius.md,
    padding: '1.25rem'
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
    height: '12px',
    borderRadius: '6px',
    outline: 'none',
    WebkitAppearance: 'none',
    appearance: 'none',
    cursor: 'pointer',
    background: `linear-gradient(90deg, #1a1a1a 0%, ${colors.primary} 100%)`
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
    transition: 'all 0.2s',
    alignSelf: 'center'
  }
};

// Inject slider styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    input[type="range"].voltage-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(225, 241, 79, 0.88);
      cursor: pointer;
      box-shadow: 0 0 10px rgba(225, 241, 79, 0.5);
    }
    
    input[type="range"].voltage-slider::-moz-range-thumb {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(225, 241, 79, 0.88);
      cursor: pointer;
      border: none;
    }
  `;
  if (!document.head.querySelector('[data-voltage-slider-styles]')) {
    styleSheet.setAttribute('data-voltage-slider-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

export default function PowerGroundVisualizer({ 
  config = {},
  showControls = true,
  autoPlay = true
}) {
  const waterCanvasRef = useRef(null);
  const circuitCanvasRef = useRef(null);
  const [isFlowing, setIsFlowing] = useState(autoPlay);
  const [waterDrops, setWaterDrops] = useState([]);
  const [voltage, setVoltage] = useState(3.3);
  const animationRef = useRef(null);

  const towerHeight = 120 + (voltage * 20);
  
  // Particle speed - wider range for visible difference
  // At 1V: 0.3 (slow crawl), At 9V: 4 (fast)
  const particleSpeed = 0.2 + (voltage * 0.4);
  
  // Spawn rate - more voltage = more particles
  const spawnChance = Math.min(0.7, 0.1 + (voltage / 20));
  
  // Use refs so interval doesn't restart on voltage change
  const particleSpeedRef = useRef(particleSpeed);
  const spawnChanceRef = useRef(spawnChance);
  
  useEffect(() => {
    particleSpeedRef.current = particleSpeed;
    spawnChanceRef.current = spawnChance;
  }, [particleSpeed, spawnChance]);

  useEffect(() => {
    const waterCanvas = waterCanvasRef.current;
    const circuitCanvas = circuitCanvasRef.current;
    if (!waterCanvas || !circuitCanvas) return;

    const dpr = window.devicePixelRatio || 1;
    
    [waterCanvas, circuitCanvas].forEach(canvas => {
      canvas.width = 250 * dpr;
      canvas.height = 280 * dpr;
      canvas.getContext('2d').scale(dpr, dpr);
    });

    const drawWater = () => {
      const ctx = waterCanvas.getContext('2d');
      ctx.clearRect(0, 0, 250, 280);

      // Background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, 250, 280);

      // Ground
      ctx.fillStyle = '#1a3d1a';
      ctx.fillRect(0, 250, 250, 30);

      const towerX = 80;
      const towerBottom = 250;
      const towerTop = towerBottom - towerHeight;

      // Tower legs
      ctx.fillStyle = '#555';
      ctx.beginPath();
      ctx.moveTo(towerX - 25, towerBottom);
      ctx.lineTo(towerX - 12, towerTop + 35);
      ctx.lineTo(towerX - 8, towerTop + 35);
      ctx.lineTo(towerX - 18, towerBottom);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(towerX + 25, towerBottom);
      ctx.lineTo(towerX + 12, towerTop + 35);
      ctx.lineTo(towerX + 8, towerTop + 35);
      ctx.lineTo(towerX + 18, towerBottom);
      ctx.closePath();
      ctx.fill();

      // Water tank
      ctx.fillStyle = '#2980b9';
      ctx.beginPath();
      ctx.ellipse(towerX, towerTop + 25, 30, 15, 0, Math.PI, 0);
      ctx.fill();
      
      ctx.fillStyle = '#3498db';
      ctx.fillRect(towerX - 30, towerTop + 10, 60, 25);
      
      ctx.beginPath();
      ctx.ellipse(towerX, towerTop + 10, 30, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Water inside
      ctx.fillStyle = 'rgba(52, 152, 219, 0.7)';
      ctx.beginPath();
      ctx.ellipse(towerX, towerTop + 14, 26, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pipe down
      ctx.fillStyle = '#777';
      ctx.fillRect(towerX - 4, towerTop + 35, 8, towerHeight - 45);
      
      // Pipe outlet
      ctx.fillRect(towerX, towerBottom - 25, 50, 8);

      // Turbine
      ctx.save();
      ctx.translate(towerX + 42, towerBottom - 21);
      if (isFlowing) {
        ctx.rotate((Date.now() / (300 / voltage)) % (Math.PI * 2));
      }
      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(12, 0);
        ctx.stroke();
        ctx.rotate(Math.PI / 2);
      }
      ctx.restore();

      // Pool
      ctx.fillStyle = '#2980b9';
      ctx.beginPath();
      ctx.ellipse(towerX + 60, towerBottom - 3, 40, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Height arrow
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(towerX + 50, towerTop + 10);
      ctx.lineTo(towerX + 50, towerBottom - 8);
      ctx.stroke();
      ctx.setLineDash([]);

      // Arrow heads
      ctx.fillStyle = colors.primary;
      ctx.beginPath();
      ctx.moveTo(towerX + 50, towerTop + 10);
      ctx.lineTo(towerX + 46, towerTop + 18);
      ctx.lineTo(towerX + 54, towerTop + 18);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(towerX + 50, towerBottom - 8);
      ctx.lineTo(towerX + 46, towerBottom - 16);
      ctx.lineTo(towerX + 54, towerBottom - 16);
      ctx.closePath();
      ctx.fill();

      // Height label
      ctx.fillStyle = colors.primary;
      ctx.font = `bold 11px ${fontFamily}`;
      ctx.textAlign = 'left';
      ctx.fillText('Height', towerX + 60, (towerTop + towerBottom) / 2 - 8);
      ctx.font = `10px ${fontFamily}`;
      ctx.fillText('= pressure', towerX + 60, (towerTop + towerBottom) / 2 + 5);

      // Water drops - convert progress to Y position
      if (isFlowing) {
        ctx.fillStyle = '#3498db';
        const dropStartY = towerTop + 35;
        const dropEndY = towerBottom - 10;
        const dropRange = dropEndY - dropStartY;
        
        waterDrops.forEach(drop => {
          const y = dropStartY + (drop.progress * dropRange);
          ctx.beginPath();
          ctx.arc(towerX, y, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Labels
      ctx.fillStyle = '#ff6b6b';
      ctx.font = `bold 10px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText('HIGH', towerX - 40, towerTop + 15);
      ctx.fillStyle = '#4a9eff';
      ctx.fillText('LOW', towerX + 90, towerBottom - 3);
    };

    const drawCircuit = () => {
      const ctx = circuitCanvas.getContext('2d');
      ctx.clearRect(0, 0, 250, 280);

      // Background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, 250, 280);

      const circuitX = 125;
      const circuitTop = 40;
      const circuitBottom = 240;

      // VCC label
      ctx.fillStyle = '#ff6b6b';
      ctx.font = `bold 14px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText(`+${voltage.toFixed(1)}V`, circuitX, circuitTop - 10);

      // Wire from top
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(circuitX, circuitTop);
      ctx.lineTo(circuitX, circuitTop + 70);
      ctx.stroke();

      // LED
      const ledY = circuitTop + 90;
      const ledSize = 12;
      
      ctx.fillStyle = isFlowing ? '#00ff00' : '#333';
      ctx.beginPath();
      ctx.moveTo(circuitX - ledSize, ledY - ledSize);
      ctx.lineTo(circuitX + ledSize, ledY - ledSize);
      ctx.lineTo(circuitX, ledY + ledSize);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Cathode bar
      ctx.beginPath();
      ctx.moveTo(circuitX - ledSize, ledY + ledSize + 2);
      ctx.lineTo(circuitX + ledSize, ledY + ledSize + 2);
      ctx.stroke();

      // LED glow
      if (isFlowing) {
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 12;
        ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(circuitX, ledY, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Wire to ground
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(circuitX, ledY + ledSize + 6);
      ctx.lineTo(circuitX, circuitBottom - 20);
      ctx.stroke();

      // Ground symbol
      ctx.strokeStyle = '#4a9eff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(circuitX - 18, circuitBottom - 20);
      ctx.lineTo(circuitX + 18, circuitBottom - 20);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(circuitX - 10, circuitBottom - 12);
      ctx.lineTo(circuitX + 10, circuitBottom - 12);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(circuitX - 4, circuitBottom - 4);
      ctx.lineTo(circuitX + 4, circuitBottom - 4);
      ctx.stroke();

      // GND label
      ctx.fillStyle = '#4a9eff';
      ctx.font = `bold 14px ${fontFamily}`;
      ctx.fillText('0V', circuitX, circuitBottom + 15);

      // Electrons - use progress directly
      if (isFlowing) {
        const electronStartY = circuitTop + 10;
        const electronEndY = circuitBottom - 30;
        const electronRange = electronEndY - electronStartY;
        
        waterDrops.forEach(drop => {
          const electronY = electronStartY + (drop.progress * electronRange);
          ctx.fillStyle = '#00d4aa';
          ctx.beginPath();
          ctx.arc(circuitX, electronY, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowColor = '#00d4aa';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }
    };

    const animate = () => {
      drawWater();
      drawCircuit();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [waterDrops, isFlowing, voltage, towerHeight]);

  // Clear drops only when flow stops
  useEffect(() => {
    if (!isFlowing) {
      setWaterDrops([]);
    }
  }, [isFlowing]);

  // Water drop animation - progress-based so voltage changes just affect speed
  useEffect(() => {
    if (!isFlowing) {
      return;
    }

    const interval = setInterval(() => {
      setWaterDrops(prev => {
        const newDrops = [...prev];
        
        // Spawn based on voltage - more voltage = more drops
        if (Math.random() < spawnChanceRef.current) {
          newDrops.push({
            progress: 0  // 0 = top, 1 = bottom
          });
        }

        // Move drops - progress increases by speed percentage
        return newDrops
          .map(drop => ({
            ...drop,
            progress: drop.progress + (particleSpeedRef.current / 100)
          }))
          .filter(drop => drop.progress < 1);
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [isFlowing]);

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <div style={styles.visualSection}>
          <div style={styles.sectionTitle}>🌊 Water Tower</div>
          <canvas 
            ref={waterCanvasRef}
            style={{ maxWidth: '100%', height: 'auto', borderRadius: borderRadius.md }}
          />
        </div>

        <div style={styles.visualSection}>
          <div style={styles.sectionTitle}>⚡ Circuit</div>
          <canvas 
            ref={circuitCanvasRef}
            style={{ maxWidth: '100%', height: 'auto', borderRadius: borderRadius.md }}
          />
        </div>
      </div>

      {showControls && (
        <div style={styles.controls}>
          <div style={styles.sliderGroup}>
            <div style={styles.sliderLabel}>
              <span style={styles.sliderName}>⚡ Voltage</span>
              <span style={styles.sliderValue}>{voltage.toFixed(1)}V</span>
            </div>
            <input
              type="range"
              className="voltage-slider"
              min="1"
              max="9"
              step="0.1"
              value={voltage}
              onChange={(e) => setVoltage(parseFloat(e.target.value))}
              style={styles.slider}
            />
          </div>
          
          <button 
            style={styles.button}
            onClick={() => setIsFlowing(!isFlowing)}
          >
            {isFlowing ? '⏸ Stop' : '▶ Start'}
          </button>
        </div>
      )}
    </div>
  );
}