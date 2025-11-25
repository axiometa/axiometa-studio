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
  canvasContainer: {
    position: 'relative',
    background: '#0a0a0a',
    borderRadius: borderRadius.md,
    padding: '2rem',
    marginBottom: '2rem',
    minHeight: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  canvas: {
    maxWidth: '100%',
    height: 'auto'
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1.5rem'
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

export default function CircuitFlow({ config = {}, showControls = true }) {
  const {
    title = "Understanding Circuits - The Complete Path",
    explanation = "A circuit is a complete loop where electricity can flow. Without a complete path, nothing works."
  } = config;

  const [isConnected, setIsConnected] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [electronPosition, setElectronPosition] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = 800 * dpr;
    canvas.height = 400 * dpr;
    ctx.scale(dpr, dpr);

    const draw = () => {
      ctx.clearRect(0, 0, 800, 400);

      // Draw battery
      ctx.fillStyle = '#fff';
      ctx.fillRect(50, 170, 60, 60);
      ctx.fillStyle = colors.primary;
      ctx.font = `20px ${fontFamily}`;
      ctx.fillText('+', 70, 195);
      ctx.fillText('-', 70, 225);

      // Draw LED
      const ledX = 700;
      const ledY = 200;
      const ledOn = isConnected && electronPosition > 50;
      
      ctx.beginPath();
      ctx.arc(ledX, ledY, 25, 0, Math.PI * 2);
      ctx.fillStyle = ledOn ? 'rgba(225, 241, 79, 0.88)' : '#333';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (ledOn) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(225, 241, 79, 0.88)';
        ctx.beginPath();
        ctx.arc(ledX, ledY, 35, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(225, 241, 79, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Draw wires
      ctx.strokeStyle = isConnected ? colors.primary : '#666';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';

      // Top wire
      ctx.beginPath();
      ctx.moveTo(110, 180);
      ctx.lineTo(675, 180);
      ctx.stroke();

      // Bottom wire
      if (isConnected) {
        ctx.beginPath();
        ctx.moveTo(110, 220);
        ctx.lineTo(675, 220);
        ctx.stroke();
      } else {
        // Broken wire
        ctx.beginPath();
        ctx.moveTo(110, 220);
        ctx.lineTo(350, 220);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(450, 220);
        ctx.lineTo(675, 220);
        ctx.stroke();

        // Draw gap indicator
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(350, 220);
        ctx.lineTo(450, 220);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw moving electrons if connected and playing
      if (isConnected && isPlaying) {
        const pathLength = 100;
        const numElectrons = 5;
        
        for (let i = 0; i < numElectrons; i++) {
          const offset = (electronPosition + (i * pathLength / numElectrons)) % pathLength;
          const progress = offset / pathLength;
          
          let x, y;
          if (progress < 0.25) {
            // Top wire: left to right
            const p = progress * 4;
            x = 110 + (565 * p);
            y = 180;
          } else if (progress < 0.5) {
            // Right side: top to bottom
            const p = (progress - 0.25) * 4;
            x = 675;
            y = 180 + (40 * p);
          } else if (progress < 0.75) {
            // Bottom wire: right to left
            const p = (progress - 0.5) * 4;
            x = 675 - (565 * p);
            y = 220;
          } else {
            // Left side: bottom to top
            const p = (progress - 0.75) * 4;
            x = 110;
            y = 220 - (40 * p);
          }

          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#00d4aa';
          ctx.fill();
          ctx.strokeStyle = '#00ffcc';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // Labels
      ctx.fillStyle = colors.text.secondary;
      ctx.font = `14px ${fontFamily}`;
      ctx.fillText('Power Source', 30, 260);
      ctx.fillText('(Battery)', 40, 280);
      ctx.fillText('LED', 690, 260);

      if (!isConnected) {
        ctx.fillStyle = '#ff0000';
        ctx.font = `16px ${fontFamily}`;
        ctx.fillText('Circuit Broken!', 340, 250);
      }
    };

    draw();
  }, [isConnected, isPlaying, electronPosition]);

  useEffect(() => {
    if (!isPlaying || !isConnected) return;

    const interval = setInterval(() => {
      setElectronPosition(prev => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, isConnected]);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.explanation}>{explanation}</p>

      <div style={styles.canvasContainer}>
        <canvas 
          ref={canvasRef}
          width={800}
          height={400}
          style={styles.canvas}
        />
      </div>

      {showControls && (
        <div style={styles.controls}>
          <button 
            style={styles.button}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? 'Pause Flow' : 'Start Flow'}
          </button>
          <button 
            style={{...styles.button, ...styles.buttonSecondary}}
            onClick={() => setIsConnected(!isConnected)}
          >
            {isConnected ? 'Break Circuit' : 'Connect Circuit'}
          </button>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <div style={styles.conceptBox}>
          <div style={styles.conceptTitle}>The Complete Loop</div>
          <div style={styles.conceptText}>
            Electricity needs a complete path from positive to negative. The electrons (shown in teal) flow from negative to positive, creating current. When you break the circuit, the flow stops instantly - no matter where the break occurs.
            <br/><br/>
            Try breaking the circuit above. Notice how the LED turns off immediately and the electron flow stops. This is why switches work - they simply break the circuit to stop the flow of electricity.
          </div>
        </div>
      </div>
    </div>
  );
}