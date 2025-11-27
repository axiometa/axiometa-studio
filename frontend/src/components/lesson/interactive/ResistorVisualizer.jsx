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
    flexDirection: 'column',
    gap: '1.5rem',
    marginBottom: '2rem'
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
  resultBox: {
    background: 'rgba(0, 212, 170, 0.1)',
    border: '2px solid #00d4aa',
    borderRadius: borderRadius.lg,
    padding: '1.5rem',
    textAlign: 'center'
  },
  resultLabel: {
    color: colors.text.tertiary,
    fontSize: '0.85rem',
    marginBottom: '0.5rem',
    fontFamily
  },
  resultValue: {
    color: '#00d4aa',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    fontFamily
  },
  resultUnit: {
    color: colors.text.muted,
    fontSize: '1rem',
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
  colorBands: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '1rem'
  },
  colorBand: {
    width: '30px',
    height: '50px',
    borderRadius: '4px',
    border: '1px solid rgba(255,255,255,0.2)'
  }
};

// Inject slider styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    input[type="range"].resistor-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(225, 241, 79, 0.88);
      cursor: pointer;
      box-shadow: 0 0 10px rgba(225, 241, 79, 0.5);
    }
    
    input[type="range"].resistor-slider::-moz-range-thumb {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(225, 241, 79, 0.88);
      cursor: pointer;
      border: none;
    }
  `;
  if (!document.head.querySelector('[data-resistor-slider-styles]')) {
    styleSheet.setAttribute('data-resistor-slider-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

export default function ResistorVisualizer({ 
  config = {},
  showControls = true,
  autoPlay = true
}) {
  const {
    title = "Resistors - Controlling Current Flow",
    explanation = "A resistor limits how much current can flow through a circuit. Think of it like a narrow section in a water pipe that restricts flow."
  } = config;

  const [resistance, setResistance] = useState(220);
  const waterCanvasRef = useRef(null);
  const circuitCanvasRef = useRef(null);
  const animationRef = useRef(null);
  const [particles, setParticles] = useState([]);

  // Calculate pipe opening based on resistance (inverse relationship)
  const pipeOpening = Math.max(5, 50 - (resistance / 25)); // 5px to 50px
  
  // Current is inversely proportional to resistance (assuming constant voltage)
  const voltage = 3.3;
  const current = voltage / resistance;
  const currentMA = current * 1000;

  // Particle speed based on current - capped for smooth animation
  // More current = more particles AND slightly faster, not just faster
  const particleSpeed = Math.max(0.3, Math.min(3, currentMA / 15));

  useEffect(() => {
    const waterCanvas = waterCanvasRef.current;
    const circuitCanvas = circuitCanvasRef.current;
    if (!waterCanvas || !circuitCanvas) return;

    const drawWaterAnalogy = () => {
      const ctx = waterCanvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      
      waterCanvas.width = 250 * dpr;
      waterCanvas.height = 200 * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, 250, 200);

      // Background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, 250, 200);

      // Wide pipe section (left)
      ctx.fillStyle = '#555';
      ctx.fillRect(0, 70, 80, 60);
      
      // Pipe interior
      ctx.fillStyle = '#333';
      ctx.fillRect(5, 75, 70, 50);

      // Restriction section
      const restrictionHeight = pipeOpening;
      const restrictionY = 100 - restrictionHeight / 2;
      
      ctx.fillStyle = '#555';
      ctx.fillRect(80, 70, 90, 60);
      
      // Upper restriction
      ctx.fillStyle = '#777';
      ctx.fillRect(85, 70, 80, (30 - restrictionHeight / 2));
      
      // Lower restriction
      ctx.fillRect(85, 100 + restrictionHeight / 2, 80, (30 - restrictionHeight / 2));
      
      // Restriction opening
      ctx.fillStyle = '#333';
      ctx.fillRect(85, restrictionY, 80, restrictionHeight);

      // Wide pipe section (right)
      ctx.fillStyle = '#555';
      ctx.fillRect(170, 70, 80, 60);
      
      ctx.fillStyle = '#333';
      ctx.fillRect(175, 75, 70, 50);

      // Flow direction arrows
      ctx.fillStyle = colors.primary;
      ctx.beginPath();
      ctx.moveTo(20, 100);
      ctx.lineTo(30, 95);
      ctx.lineTo(30, 105);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(220, 100);
      ctx.lineTo(230, 95);
      ctx.lineTo(230, 105);
      ctx.closePath();
      ctx.fill();

      // Draw water particles
      ctx.fillStyle = '#3498db';
      particles.forEach(p => {
        if (p.type === 'water') {
          // Adjust y position through restriction
          let y = 100;
          if (p.x > 85 && p.x < 165) {
            // Scale y within restriction
            const restrictionProgress = (p.x - 85) / 80;
            y = restrictionY + restrictionHeight / 2;
          }
          ctx.beginPath();
          ctx.arc(p.x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Labels
      ctx.fillStyle = colors.text.muted;
      ctx.font = `11px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText('Wide Pipe', 40, 50);
      ctx.fillText('Restriction', 125, 50);
      ctx.fillText('Wide Pipe', 210, 50);

      // Flow rate indicator
      ctx.fillStyle = colors.primary;
      ctx.font = `bold 12px ${fontFamily}`;
      ctx.fillText(`Flow Rate: ${(particleSpeed * 2).toFixed(1)}`, 125, 180);
    };

    const drawCircuit = () => {
      const ctx = circuitCanvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      
      circuitCanvas.width = 250 * dpr;
      circuitCanvas.height = 200 * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, 250, 200);

      // Background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, 250, 200);

      // Wire (left)
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(20, 100);
      ctx.lineTo(70, 100);
      ctx.stroke();

      // Resistor symbol (zigzag)
      ctx.strokeStyle = '#00d4aa';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(70, 100);
      ctx.lineTo(80, 100);
      ctx.lineTo(90, 80);
      ctx.lineTo(110, 120);
      ctx.lineTo(130, 80);
      ctx.lineTo(150, 120);
      ctx.lineTo(160, 100);
      ctx.lineTo(170, 100);
      ctx.stroke();

      // Wire (right)
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(170, 100);
      ctx.lineTo(230, 100);
      ctx.stroke();

      // Draw electrons
      ctx.fillStyle = '#00d4aa';
      particles.forEach(p => {
        if (p.type === 'electron') {
          let x = p.x;
          let y = 100;
          
          // Calculate y position through zigzag - match exact resistor path
          // Path: 70-80 flat, 80-90 up to 80, 90-110 down to 120, 110-130 up to 80, 130-150 down to 120, 150-160 up to 100, 160-170 flat
          if (x >= 70 && x < 80) {
            y = 100; // flat entry
          } else if (x >= 80 && x < 90) {
            // going up: 100 -> 80
            const t = (x - 80) / 10;
            y = 100 - (t * 20);
          } else if (x >= 90 && x < 110) {
            // going down: 80 -> 120
            const t = (x - 90) / 20;
            y = 80 + (t * 40);
          } else if (x >= 110 && x < 130) {
            // going up: 120 -> 80
            const t = (x - 110) / 20;
            y = 120 - (t * 40);
          } else if (x >= 130 && x < 150) {
            // going down: 80 -> 120
            const t = (x - 130) / 20;
            y = 80 + (t * 40);
          } else if (x >= 150 && x < 160) {
            // going up: 120 -> 100
            const t = (x - 150) / 10;
            y = 120 - (t * 20);
          } else if (x >= 160 && x < 170) {
            y = 100; // flat exit
          }
          
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowColor = '#00d4aa';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Resistor value label
      ctx.fillStyle = '#00d4aa';
      ctx.font = `bold 14px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText(`${resistance}Ω`, 120, 60);

      // Current direction
      ctx.fillStyle = colors.primary;
      ctx.beginPath();
      ctx.moveTo(200, 95);
      ctx.lineTo(210, 100);
      ctx.lineTo(200, 105);
      ctx.closePath();
      ctx.fill();

      // Current label
      ctx.fillStyle = colors.primary;
      ctx.font = `bold 12px ${fontFamily}`;
      ctx.fillText(`Current: ${currentMA.toFixed(1)}mA`, 125, 180);
    };

    drawWaterAnalogy();
    drawCircuit();
  }, [particles, resistance, pipeOpening, currentMA, particleSpeed]);

  // Particle animation
  useEffect(() => {
    const animate = () => {
      setParticles(prev => {
        const newParticles = [...prev];
        
        // Spawn rate based on current - more current = more particles
        // At low current (1mA): spawn ~10% of frames
        // At high current (330mA): spawn ~80% of frames
        const spawnChance = Math.min(0.8, 0.1 + (currentMA / 50));
        
        if (Math.random() < spawnChance) {
          newParticles.push({
            x: 10,
            type: 'water'
          });
          newParticles.push({
            x: 10,
            type: 'electron'
          });
        }

        // Move particles
        return newParticles
          .map(p => ({
            ...p,
            x: p.x + particleSpeed
          }))
          .filter(p => p.x < 240);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleSpeed, currentMA]);

  // Color band calculation (simplified 4-band)
  const getColorBands = (ohms) => {
    const colorMap = ['black', '#8B4513', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'gray', 'white'];
    const str = ohms.toString();
    const band1 = parseInt(str[0]) || 0;
    const band2 = parseInt(str[1]) || 0;
    const multiplier = str.length - 2;
    
    return [
      colorMap[band1],
      colorMap[band2],
      colorMap[Math.max(0, Math.min(9, multiplier))],
      '#C4A052' // Gold (5% tolerance)
    ];
  };

  const colorBands = getColorBands(resistance);

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        {/* Water Analogy */}
        <div style={styles.visualSection}>
          <div style={styles.sectionTitle}>🌊 Water Pipe</div>
          <canvas 
            ref={waterCanvasRef}
            style={{ maxWidth: '100%', height: 'auto', borderRadius: borderRadius.md }}
          />
        </div>

        {/* Circuit */}
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
              <span style={styles.sliderName}>🔧 Resistance</span>
              <span style={styles.sliderValue}>{resistance}Ω → {currentMA.toFixed(1)}mA</span>
            </div>
            <input
              type="range"
              className="resistor-slider"
              min="10"
              max="1000"
              step="10"
              value={resistance}
              onChange={(e) => setResistance(parseInt(e.target.value))}
              style={styles.slider}
            />
          </div>
        </div>
      )}
    </div>
  );
}