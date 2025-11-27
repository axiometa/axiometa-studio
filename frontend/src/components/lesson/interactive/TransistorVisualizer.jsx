import React, { useEffect, useRef, useState } from 'react';
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
  statusBadge: {
    padding: '0.75rem 1.5rem',
    borderRadius: borderRadius.md,
    fontFamily,
    fontWeight: '600',
    fontSize: '0.95rem'
  }
};

export default function TransistorVisualizer({ showControls = true, config = {}, autoPlay = false }) {
  const schematicCanvasRef = useRef(null);
  const waterCanvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isOn, setIsOn] = useState(autoPlay);
  const [autoToggle, setAutoToggle] = useState(false);
  const waterDropsRef = useRef([]);
  const electronsRef = useRef([]);

  class Particle {
    constructor(x, y, path, color, isWater = false) {
      this.x = x;
      this.y = y;
      this.path = path;
      this.color = color;
      this.radius = isWater ? 4 : 3;
      this.speed = isWater ? 2.5 : 2;
      this.isWater = isWater;
      this.progress = 0;
    }

    update() {
      this.progress += this.speed / 100;

      if (this.path === 'water') {
        if (this.progress < 0.25) {
          this.x = 250;
          this.y = 160 + 60 * (this.progress / 0.25);
        } else if (this.progress < 0.5) {
          this.x = 250;
          this.y = 220 + 55 * ((this.progress - 0.25) / 0.25);
        } else if (this.progress < 1) {
          this.x = 250;
          this.y = 275 + 85 * ((this.progress - 0.5) / 0.5);
        }
      } else if (this.path === 'collector') {
        if (this.progress < 1) {
          this.x = 250;
          this.y = 80 + 100 * this.progress;
        } else {
          this.path = 'collector-diagonal';
          this.progress = 0;
        }
      } else if (this.path === 'collector-diagonal') {
        if (this.progress < 1) {
          this.x = 250 - 50 * this.progress;
          this.y = 180 + 40 * this.progress;
        } else {
          this.path = 'base-bar';
          this.progress = 0;
        }
      } else if (this.path === 'base-bar') {
        if (this.progress < 1) {
          this.x = 200;
          this.y = 220 + 60 * this.progress;
        } else {
          this.path = 'diagonal-emitter';
          this.progress = 0;
        }
      } else if (this.path === 'diagonal-emitter') {
        if (this.progress < 1) {
          this.x = 200 + 50 * this.progress;
          this.y = 280 + 40 * this.progress;
        } else {
          this.path = 'emitter';
          this.progress = 0;
        }
      } else if (this.path === 'emitter') {
        if (this.progress < 1) {
          this.x = 250;
          this.y = 320 + 100 * this.progress;
        }
      } else if (this.path === 'base') {
        if (this.progress < 1) {
          this.x = 100 + 100 * this.progress;
          this.y = 250;
        }
      }
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      if (this.isWater) {
        ctx.strokeStyle = '#2980b9';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  useEffect(() => {
    const schematicCanvas = schematicCanvasRef.current;
    const waterCanvas = waterCanvasRef.current;
    if (!schematicCanvas || !waterCanvas) return;

    const schematicCtx = schematicCanvas.getContext('2d');
    const waterCtx = waterCanvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    [schematicCanvas, waterCanvas].forEach(canvas => {
      canvas.width = 500 * dpr;
      canvas.height = 500 * dpr;
      canvas.style.width = '100%';
      canvas.style.maxWidth = '400px';
      canvas.style.height = 'auto';
      canvas.getContext('2d').scale(dpr, dpr);
    });

    const drawNPNSchematic = () => {
      const ctx = schematicCtx;
      ctx.clearRect(0, 0, 500, 500);

      // Background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, 500, 500);

      const centerX = 250;
      const centerY = 250;

      // Collector line
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, 80);
      ctx.lineTo(centerX, 180);
      ctx.stroke();

      // Potential energy label
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - 20, 65);
      ctx.lineTo(centerX + 20, 65);
      ctx.stroke();

      ctx.fillStyle = colors.primary;
      ctx.font = `10px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText('Potential', centerX, 50);
      ctx.fillText('Energy', centerX, 62);

      // Collector label
      ctx.font = `bold 16px ${fontFamily}`;
      ctx.fillText('C', centerX - 40, 100);
      ctx.font = `11px ${fontFamily}`;
      ctx.fillStyle = colors.text.muted;
      ctx.fillText('Collector', centerX - 40, 113);

      // Base line
      ctx.strokeStyle = '#f39c12';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(100, centerY);
      ctx.lineTo(200, centerY);
      ctx.stroke();

      // Base label
      ctx.fillStyle = '#f39c12';
      ctx.font = `bold 16px ${fontFamily}`;
      ctx.textAlign = 'right';
      ctx.fillText('B', 85, centerY + 5);
      ctx.font = `11px ${fontFamily}`;
      ctx.fillStyle = colors.text.muted;
      ctx.fillText('Base', 85, centerY + 18);

      // Base current arrows
      if (isOn) {
        ctx.strokeStyle = '#f39c12';
        for (let i = 0; i < 3; i++) {
          const arrowX = 130 + i * 25;
          ctx.beginPath();
          ctx.moveTo(arrowX - 5, centerY - 3);
          ctx.lineTo(arrowX, centerY);
          ctx.lineTo(arrowX - 5, centerY + 3);
          ctx.stroke();
        }
      }

      // Vertical base bar
      ctx.fillStyle = '#555';
      ctx.fillRect(198, 180, 4, 140);

      // Collector to base connection
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, 180);
      ctx.lineTo(200, 220);
      ctx.stroke();

      // Emitter to base connection
      ctx.beginPath();
      ctx.moveTo(200, 280);
      ctx.lineTo(centerX, 320);
      ctx.stroke();

      // Emitter arrow
      const arrowX = (centerX + 200) / 2;
      const arrowY = (320 + 280) / 2;
      ctx.fillStyle = '#666';
      ctx.beginPath();
      ctx.moveTo(arrowX + 16, arrowY + 16);
      ctx.lineTo(arrowX - 6, arrowY + 6);
      ctx.lineTo(arrowX + 6, arrowY - 6);
      ctx.closePath();
      ctx.fill();

      // Emitter line
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, 320);
      ctx.lineTo(centerX, 420);
      ctx.stroke();

      // Emitter label
      ctx.fillStyle = colors.primary;
      ctx.font = `bold 16px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText('E', centerX + 40, 390);
      ctx.font = `11px ${fontFamily}`;
      ctx.fillStyle = colors.text.muted;
      ctx.fillText('Emitter', centerX + 40, 403);

      // Ground symbol
      ctx.strokeStyle = '#4a9eff';
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        const width = 30 - i * 10;
        ctx.beginPath();
        ctx.moveTo(centerX - width / 2, 425 + i * 6);
        ctx.lineTo(centerX + width / 2, 425 + i * 6);
        ctx.stroke();
      }

      // Draw electrons
      if (isOn) {
        electronsRef.current = electronsRef.current.filter(e => {
          e.update();
          if (e.path === 'emitter' && e.progress >= 1) return false;
          if (e.path === 'base' && e.progress >= 1) return false;
          e.draw(ctx);
          return true;
        });

        if (Math.random() > 0.7) {
          electronsRef.current.push(new Particle(250, 80, 'collector', '#00d4aa'));
        }
        if (Math.random() > 0.85) {
          electronsRef.current.push(new Particle(100, 250, 'base', '#f39c12'));
        }
      }
    };

    const drawWaterAnalogy = () => {
      const ctx = waterCtx;
      ctx.clearRect(0, 0, 500, 500);

      // Background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, 500, 500);

      const centerX = 250;
      const centerY = 250;

      // Water tank
      ctx.fillStyle = '#1a3d5c';
      ctx.fillRect(210, 85, 80, 75);
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 3;
      ctx.strokeRect(210, 85, 80, 75);

      ctx.beginPath();
      ctx.arc(250, 85, 40, Math.PI, 0, false);
      ctx.fillStyle = '#1a3d5c';
      ctx.fill();
      ctx.strokeStyle = colors.primary;
      ctx.stroke();

      // Water inside tank
      ctx.fillStyle = 'rgba(52, 152, 219, 0.5)';
      ctx.fillRect(215, 90, 70, 65);

      // Waves
      ctx.strokeStyle = '#3498db';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 2; i++) {
        ctx.moveTo(220 + i * 30, 92);
        ctx.quadraticCurveTo(230 + i * 30, 88, 240 + i * 30, 92);
      }
      ctx.stroke();

      // Label
      ctx.fillStyle = colors.text.muted;
      ctx.font = `10px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText('Potential', centerX, 115);
      ctx.fillText('Energy', centerX, 127);
      ctx.fillText('(Gravity)', centerX, 139);

      // Main pipe
      ctx.fillStyle = '#1a3d5c';
      ctx.fillRect(centerX - 10, 160, 20, 60);
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;
      ctx.strokeRect(centerX - 10, 160, 20, 60);

      // Valve housing
      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(centerX - 40, centerY - 25, 80, 50);
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 3;
      ctx.strokeRect(centerX - 40, centerY - 25, 80, 50);

      // Valve plate
      const valveAngle = isOn ? Math.PI / 2 : 0;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(valveAngle);
      ctx.fillStyle = isOn ? '#27ae60' : '#e74c3c';
      ctx.fillRect(-35, -6, 70, 12);
      ctx.strokeStyle = isOn ? '#229954' : '#c0392b';
      ctx.lineWidth = 2;
      ctx.strokeRect(-35, -6, 70, 12);
      ctx.restore();

      // Control pipe
      ctx.fillStyle = '#3d2d1a';
      ctx.fillRect(100, centerY - 5, 110, 10);
      ctx.strokeStyle = '#f39c12';
      ctx.lineWidth = 2;
      ctx.strokeRect(100, centerY - 5, 110, 10);

      // Base label
      ctx.fillStyle = '#f39c12';
      ctx.font = `bold 14px ${fontFamily}`;
      ctx.textAlign = 'right';
      ctx.fillText('Control', 90, centerY - 10);
      ctx.font = `11px ${fontFamily}`;
      ctx.fillStyle = colors.text.muted;
      ctx.fillText('(User Input)', 90, centerY + 3);

      // Control flow
      if (isOn) {
        ctx.fillStyle = '#f39c12';
        for (let i = 0; i < 3; i++) {
          const x = 120 + i * 30;
          ctx.beginPath();
          ctx.arc(x, centerY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.moveTo(185, centerY - 4);
        ctx.lineTo(195, centerY);
        ctx.lineTo(185, centerY + 4);
        ctx.fill();
      }

      // Output pipe
      ctx.fillStyle = '#1a3d5c';
      ctx.fillRect(centerX - 10, 275, 20, 85);
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;
      ctx.strokeRect(centerX - 10, 275, 20, 85);

      // Drain
      ctx.fillStyle = '#0d2840';
      ctx.fillRect(180, 360, 140, 60);
      ctx.strokeStyle = '#3498db';
      ctx.lineWidth = 3;
      ctx.strokeRect(180, 360, 140, 60);

      ctx.fillStyle = colors.text.muted;
      ctx.font = `bold 14px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText('Output', centerX, 385);
      ctx.font = `11px ${fontFamily}`;
      ctx.fillText('(Ground)', centerX, 398);

      // Water drops
      if (isOn) {
        waterDropsRef.current = waterDropsRef.current.filter(drop => {
          drop.update();
          if (drop.progress < 1) {
            drop.draw(ctx);
            return true;
          }
          return false;
        });

        if (Math.random() > 0.6) {
          waterDropsRef.current.push(new Particle(250, 160, 'water', '#3498db', true));
        }
      }
    };

    const animate = () => {
      drawNPNSchematic();
      drawWaterAnalogy();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isOn]);

  useEffect(() => {
    let interval;
    if (autoToggle) {
      interval = setInterval(() => {
        setIsOn(prev => !prev);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [autoToggle]);

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <div style={styles.visualSection}>
          <div style={styles.sectionTitle}>🌊 Valve</div>
          <canvas ref={waterCanvasRef} />
        </div>
        <div style={styles.visualSection}>
          <div style={styles.sectionTitle}>⚡ Transistor</div>
          <canvas ref={schematicCanvasRef} />
        </div>
      </div>

      {showControls && (
        <div style={styles.controls}>
          <button
            onClick={() => setIsOn(!isOn)}
            style={styles.button}
          >
            {isOn ? '⏸ Turn Off' : '⚡ Turn On'}
          </button>
          <button
            onClick={() => setAutoToggle(!autoToggle)}
            style={{
              ...styles.button,
              ...(autoToggle ? {} : styles.buttonSecondary)
            }}
          >
            Auto: {autoToggle ? 'ON' : 'OFF'}
          </button>
          <div style={{
            ...styles.statusBadge,
            background: isOn ? 'rgba(39, 174, 96, 0.2)' : 'rgba(231, 76, 60, 0.2)',
            color: isOn ? '#27ae60' : '#e74c3c',
            border: `1px solid ${isOn ? '#27ae60' : '#e74c3c'}`
          }}>
            {isOn ? '✓ Conducting' : '✗ Off'}
          </div>
        </div>
      )}
    </div>
  );
}