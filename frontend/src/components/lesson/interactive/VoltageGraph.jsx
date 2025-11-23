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
    marginBottom: '1.5rem',
    lineHeight: '1.6',
    fontFamily,
    textAlign: 'center'
  },
  canvasContainer: {
    position: 'relative',
    background: '#0a0a0a',
    borderRadius: borderRadius.md,
    padding: '1rem',
    marginBottom: '1rem'
  },
  canvas: {
    width: '100%',
    height: '300px',
    borderRadius: borderRadius.md
  },
  legend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily,
    fontSize: '0.9rem'
  },
  legendColor: {
    width: '20px',
    height: '20px',
    borderRadius: '4px'
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1rem'
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
  annotations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none'
  },
  annotation: {
    position: 'absolute',
    background: 'rgba(0, 0, 0, 0.8)',
    border: `1px solid ${colors.primary}`,
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    fontSize: '0.85rem',
    fontFamily,
    color: '#fff',
    whiteSpace: 'nowrap'
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
  }
};

export default function VoltageGraph({ 
  config = {},
  showControls = true,
  autoPlay = true
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [ledState, setLedState] = useState(false);

  // Default config
  const {
    highVoltage = 3.3,
    lowVoltage = 0,
    delayHigh = 1000,
    delayLow = 1000,
    showAnnotations = true,
    title = "Digital Signal Visualization",
    explanation = "Watch how the voltage toggles between HIGH (3.3V) and LOW (0V), making the LED blink!"
  } = config;

  const period = delayHigh + delayLow;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Draw function
    const draw = (time) => {
      // Clear canvas
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      drawGrid(ctx, width, height);

      // Draw voltage wave
      drawVoltageWave(ctx, width, height, time);

      // Draw axes
      drawAxes(ctx, width, height);
      
      // Update LED state
      const cyclePosition = time % period;
      setLedState(cyclePosition < delayHigh);
    };

    // Initial draw
    draw(currentTime);

  }, [currentTime, period, delayHigh, delayLow, highVoltage, lowVoltage]);

  // Separate effect for animation timing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const next = prev + 100;
        // Reset after 3 full cycles
        if (next >= period * 3) return 0;
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, period]);

  const drawGrid = (ctx, width, height) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    // Horizontal lines
    for (let i = 0; i <= 4; i++) {
      const y = (height - 60) * (i / 4) + 30;
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }

    // Vertical lines
    for (let i = 0; i <= 6; i++) {
      const x = 40 + ((width - 60) * (i / 6));
      ctx.beginPath();
      ctx.moveTo(x, 30);
      ctx.lineTo(x, height - 30);
      ctx.stroke();
    }
  };

  const drawAxes = (ctx, width, height) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'; // Changed from colors.primary to white/gray
    ctx.lineWidth = 2;
    ctx.font = `12px ${fontFamily}`;
    ctx.fillStyle = colors.text.tertiary;

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(40, 30);
    ctx.lineTo(40, height - 30);
    ctx.stroke();

    // Y-axis labels
    ctx.fillText(`${highVoltage}V`, 5, 35);
    ctx.fillText('0V', 15, height - 25);

    // X-axis
    ctx.beginPath();
    ctx.moveTo(40, height - 30);
    ctx.lineTo(width - 20, height - 30);
    ctx.stroke();

    // X-axis label
    ctx.fillText('Time →', width / 2 - 20, height - 10);
  };

  const drawVoltageWave = (ctx, width, height, time) => {
    const graphWidth = width - 60;
    const graphHeight = height - 60;
    const timeScale = graphWidth / (period * 3);

    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();

    let firstPoint = true;
    let drawnToTime = false;
    
    // Draw up to current time only
    for (let cycle = 0; cycle < 3; cycle++) {
      const cycleStart = cycle * period;
      const cycleEnd = cycleStart + period;
      
      // Stop if we've gone past current time
      if (cycleStart > time) break;
      
      // High phase
      const x1 = 40 + (cycleStart * timeScale);
      const x2 = 40 + ((cycleStart + delayHigh) * timeScale);
      const yHigh = 30 + (graphHeight * (1 - highVoltage / highVoltage));
      const yLow = 30 + graphHeight;

      if (firstPoint) {
        ctx.moveTo(x1, yLow);
        firstPoint = false;
      }

      // Rising edge - only if we're past this point
      if (time >= cycleStart) {
        ctx.lineTo(x1, yLow);
        ctx.lineTo(x1, yHigh);
        
        // High level - draw up to current time or end of high phase
        const highEndTime = Math.min(time, cycleStart + delayHigh);
        const xHighEnd = 40 + (highEndTime * timeScale);
        ctx.lineTo(xHighEnd, yHigh);
        
        // If current time is in HIGH phase, stop here
        if (time < cycleStart + delayHigh) {
          drawnToTime = true;
          break;
        }
        
        // Falling edge
        ctx.lineTo(x2, yHigh);
        ctx.lineTo(x2, yLow);
        
        // Low phase - draw up to current time or end of cycle
        const lowEndTime = Math.min(time, cycleEnd);
        const xLowEnd = 40 + (lowEndTime * timeScale);
        ctx.lineTo(xLowEnd, yLow);
        
        // If current time is in LOW phase, stop here
        if (time < cycleEnd) {
          drawnToTime = true;
          break;
        }
      }
    }

    ctx.stroke();

    // Draw current time indicator (red dot at the end of drawn wave)
    const currentX = 40 + (time * timeScale);
    const cyclePos = time % period;
    const isHigh = cyclePos < delayHigh;
    const currentY = isHigh ? 30 : height - 30;
    
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
    ctx.fill();
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const reset = () => {
    setCurrentTime(0);
    setLedState(false);
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.explanation}>{explanation}</p>

      <div style={styles.canvasContainer}>
        <canvas 
          ref={canvasRef} 
          style={styles.canvas}
        />
      </div>

      {/* LED Indicator */}
      <div style={styles.ledIndicator}>
        <span style={styles.ledLabel}>LED State:</span>
        <div style={{
          ...styles.led,
          background: ledState 
            ? 'radial-gradient(circle, #00ff00, #00cc00)' 
            : 'radial-gradient(circle, #333, #111)',
          boxShadow: ledState 
            ? '0 0 30px rgba(0, 255, 0, 0.8), 0 0 60px rgba(0, 255, 0, 0.4)' 
            : '0 0 20px rgba(0, 0, 0, 0.5)'
        }} />
        <span style={{
          ...styles.ledLabel,
          color: ledState ? '#00ff00' : '#666'
        }}>
          {ledState ? 'ON (HIGH)' : 'OFF (LOW)'}
        </span>
      </div>

      {/* Annotations */}
      {showAnnotations && (
        <div style={styles.legend}>
          <div style={styles.legendItem}>
            <span style={{ color: colors.text.secondary, fontSize: '1.1rem', marginRight: '0.5rem' }}>↑</span>
            <span style={{ color: colors.text.secondary }}>
              HIGH = {highVoltage}V (LED ON) for {delayHigh}ms
            </span>
          </div>
          <div style={styles.legendItem}>
            <span style={{ color: colors.text.secondary, fontSize: '1.1rem', marginRight: '0.5rem' }}>↓</span>
            <span style={{ color: colors.text.secondary }}>
              LOW = {lowVoltage}V (LED OFF) for {delayLow}ms
            </span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, background: '#ff0000'}} />
            <span style={{ color: colors.text.secondary }}>Current Time (red dot)</span>
          </div>
        </div>
      )}

      {/* Controls */}
      {showControls && (
        <div style={styles.controls}>
          <button 
            style={styles.button}
            onClick={togglePlayPause}
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button 
            style={{...styles.button, ...styles.buttonSecondary}}
            onClick={reset}
          >
            ↺ Reset
          </button>
        </div>
      )}
    </div>
  );
}