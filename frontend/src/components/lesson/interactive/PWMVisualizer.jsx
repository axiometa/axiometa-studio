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
  controlSection: {
    background: '#0a0a0a',
    borderRadius: borderRadius.md,
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  controlTitle: {
    color: colors.primary,
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    fontFamily
  },
  sliderContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  sliderLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: colors.text.secondary,
    fontSize: '0.9rem',
    fontFamily
  },
  sliderValue: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: '1.1rem'
  },
  slider: {
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    background: '#333',
    outline: 'none',
    cursor: 'pointer',
    WebkitAppearance: 'none',
    appearance: 'none'
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
    height: '200px',
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
  ledSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2rem',
    padding: '1.5rem',
    background: '#0a0a0a',
    borderRadius: borderRadius.md,
    marginBottom: '1.5rem'
  },
  ledContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem'
  },
  led: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    transition: 'all 0.05s ease'
  },
  ledLabel: {
    fontFamily,
    fontSize: '0.9rem',
    color: colors.text.secondary
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  statBox: {
    background: '#0a0a0a',
    borderRadius: borderRadius.md,
    padding: '1rem',
    textAlign: 'center'
  },
  statLabel: {
    color: colors.text.tertiary,
    fontSize: '0.8rem',
    fontFamily,
    marginBottom: '0.25rem'
  },
  statValue: {
    color: colors.primary,
    fontSize: '1.25rem',
    fontWeight: '600',
    fontFamily
  },
  statUnit: {
    color: colors.text.secondary,
    fontSize: '0.8rem',
    fontFamily
  },
  presetButtons: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    marginTop: '0.5rem'
  },
  presetButton: {
    background: 'rgba(225, 241, 79, 0.1)',
    border: `1px solid ${colors.primary}`,
    color: colors.primary,
    padding: '0.5rem 1rem',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontFamily,
    fontSize: '0.85rem',
    transition: 'all 0.2s'
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
  codePreview: {
    background: '#111',
    borderRadius: borderRadius.md,
    padding: '1rem',
    marginTop: '1rem',
    fontFamily: 'monospace',
    fontSize: '0.9rem',
    color: colors.primary,
    border: '1px solid rgba(255, 255, 255, 0.1)'
  }
};

export default function PWMVisualizer({ 
  config = {},
  showControls = true
}) {
  const {
    title = "PWM - Pulse Width Modulation",
    explanation = "PWM controls brightness by rapidly switching the LED on and off. Adjust the duty cycle to see how it affects brightness!",
    maxFrequency = 300,
    defaultDutyCycle = 50,
    defaultFrequency = 200
  } = config;

  const [dutyCycle, setDutyCycle] = useState(defaultDutyCycle);
  const [frequency, setFrequency] = useState(defaultFrequency);
  const [animationPhase, setAnimationPhase] = useState(0);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Calculate derived values
  const period = 1000 / frequency; // Period in ms
  const onTime = (period * dutyCycle) / 100;
  const offTime = period - onTime;
  const pwmValue = Math.round((dutyCycle / 100) * 255);
  const averageVoltage = (3.3 * dutyCycle) / 100;

  // Animation loop for waveform
  useEffect(() => {
    let lastTime = 0;
    const animate = (currentTime) => {
      if (currentTime - lastTime > 16) { // ~60fps
        setAnimationPhase(prev => (prev + (frequency / 60)) % 100);
        lastTime = currentTime;
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [frequency]);

  // Draw PWM waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 30, bottom: 30, left: 50, right: 20 };
    const graphWidth = width - padding.left - padding.right;
    const graphHeight = height - padding.top - padding.bottom;

    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 2; i++) {
      const y = padding.top + (graphHeight * i) / 2;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Y-axis labels
    ctx.fillStyle = colors.text.tertiary;
    ctx.font = '11px ' + fontFamily;
    ctx.textAlign = 'right';
    ctx.fillText('3.3V', padding.left - 8, padding.top + 4);
    ctx.fillText('0V', padding.left - 8, height - padding.bottom + 4);

    // Draw PWM square wave
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();

    const cycles = 4; // Show 4 complete cycles
    const cycleWidth = graphWidth / cycles;
    const highY = padding.top;
    const lowY = height - padding.bottom;
    const dutyWidth = (cycleWidth * dutyCycle) / 100;

    // Calculate phase offset for animation
    const phaseOffset = (animationPhase / 100) * cycleWidth;

    for (let i = -1; i <= cycles; i++) {
      const cycleStart = padding.left + (i * cycleWidth) - phaseOffset;
      
      // HIGH portion
      const highStart = cycleStart;
      const highEnd = cycleStart + dutyWidth;
      
      // LOW portion
      const lowStart = highEnd;
      const lowEnd = cycleStart + cycleWidth;

      // Draw rising edge
      if (i === -1) {
        ctx.moveTo(Math.max(padding.left, highStart), dutyCycle > 0 ? highY : lowY);
      }
      
      // Draw HIGH level
      if (dutyCycle > 0) {
        ctx.lineTo(Math.max(padding.left, Math.min(width - padding.right, highStart)), highY);
        ctx.lineTo(Math.max(padding.left, Math.min(width - padding.right, highEnd)), highY);
      }
      
      // Draw falling edge and LOW level
      if (dutyCycle < 100) {
        ctx.lineTo(Math.max(padding.left, Math.min(width - padding.right, highEnd)), lowY);
        ctx.lineTo(Math.max(padding.left, Math.min(width - padding.right, lowEnd)), lowY);
      }
      
      // Draw rising edge for next cycle
      if (dutyCycle > 0 && dutyCycle < 100) {
        ctx.lineTo(Math.max(padding.left, Math.min(width - padding.right, lowEnd)), highY);
      }
    }

    ctx.stroke();

    // Draw average voltage line (dashed)
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    const avgY = height - padding.bottom - (graphHeight * dutyCycle) / 100;
    ctx.beginPath();
    ctx.moveTo(padding.left, avgY);
    ctx.lineTo(width - padding.right, avgY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Label for average voltage
    ctx.fillStyle = '#ff6b6b';
    ctx.font = '10px ' + fontFamily;
    ctx.textAlign = 'left';
    ctx.fillText(`Avg: ${averageVoltage.toFixed(2)}V`, width - padding.right - 60, avgY - 8);

    // Draw duty cycle annotation
    if (dutyCycle > 0 && dutyCycle < 100) {
      const annotationCycleStart = padding.left + cycleWidth - phaseOffset;
      const annotationDutyEnd = annotationCycleStart + dutyWidth;
      
      // ON time bracket
      ctx.strokeStyle = '#4ecdc4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const bracketY = height - padding.bottom + 15;
      ctx.moveTo(annotationCycleStart, bracketY);
      ctx.lineTo(annotationCycleStart, bracketY + 5);
      ctx.lineTo(annotationDutyEnd, bracketY + 5);
      ctx.lineTo(annotationDutyEnd, bracketY);
      ctx.stroke();
      
      ctx.fillStyle = '#4ecdc4';
      ctx.font = '9px ' + fontFamily;
      ctx.textAlign = 'center';
      ctx.fillText('ON', (annotationCycleStart + annotationDutyEnd) / 2, bracketY + 18);
    }

  }, [dutyCycle, frequency, animationPhase, averageVoltage]);

  // Calculate LED brightness based on current phase
  const isLedOn = (animationPhase % 100) < dutyCycle;
  const ledBrightness = dutyCycle / 100;

  const presets = [
    { name: '25%', duty: 25 },
    { name: '50%', duty: 50 },
    { name: '75%', duty: 75 },
    { name: '100%', duty: 100 },
  ];

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.explanation}>{explanation}</p>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statBox}>
          <div style={styles.statLabel}>PWM Value</div>
          <div style={styles.statValue}>{pwmValue}</div>
          <div style={styles.statUnit}>/ 255</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statLabel}>Average Voltage</div>
          <div style={styles.statValue}>{averageVoltage.toFixed(2)}</div>
          <div style={styles.statUnit}>V</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statLabel}>Period</div>
          <div style={styles.statValue}>{period.toFixed(2)}</div>
          <div style={styles.statUnit}>ms</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statLabel}>ON Time</div>
          <div style={styles.statValue}>{onTime.toFixed(2)}</div>
          <div style={styles.statUnit}>ms</div>
        </div>
      </div>

      {/* LED Display */}
      <div style={styles.ledSection}>
        <div style={styles.ledContainer}>
          <div style={{
            ...styles.led,
            background: `radial-gradient(circle, 
              rgba(0, 255, 0, ${ledBrightness}) 0%, 
              rgba(0, 200, 0, ${ledBrightness * 0.8}) 50%, 
              rgba(0, 100, 0, ${ledBrightness * 0.5}) 100%)`,
            boxShadow: `0 0 ${30 * ledBrightness}px rgba(0, 255, 0, ${ledBrightness * 0.8}), 
                        0 0 ${60 * ledBrightness}px rgba(0, 255, 0, ${ledBrightness * 0.4})`,
            border: '2px solid rgba(255, 255, 255, 0.2)'
          }} />
          <div style={styles.ledLabel}>LED Brightness: {dutyCycle}%</div>
        </div>
        
        <div style={{ 
          color: colors.text.secondary, 
          fontFamily, 
          fontSize: '0.9rem',
          maxWidth: '300px',
          lineHeight: '1.5'
        }}>
          {dutyCycle === 0 && "LED is OFF - no voltage applied"}
          {dutyCycle > 0 && dutyCycle < 30 && "LED is dim - short ON pulses"}
          {dutyCycle >= 30 && dutyCycle < 70 && "LED is medium, balanced ON/OFF"}
          {dutyCycle >= 70 && dutyCycle < 100 && "LED is bright - long ON pulses"}
          {dutyCycle === 100 && "LED is fully ON - constant voltage"}
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* Controls Section */}
        <div style={styles.controlSection}>
          <div style={styles.controlTitle}>⚙️ PWM Controls</div>
          
          {/* Duty Cycle Slider */}
          <div style={styles.sliderContainer}>
            <div style={styles.sliderLabel}>
              <span>Duty Cycle</span>
              <span style={styles.sliderValue}>{dutyCycle}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={dutyCycle}
              onChange={(e) => setDutyCycle(parseInt(e.target.value))}
              style={styles.slider}
            />
            <div style={styles.presetButtons}>
              {presets.map(preset => (
                <button
                  key={preset.name}
                  style={{
                    ...styles.presetButton,
                    background: dutyCycle === preset.duty ? colors.primary : 'rgba(225, 241, 79, 0.1)',
                    color: dutyCycle === preset.duty ? '#000' : colors.primary
                  }}
                  onClick={() => setDutyCycle(preset.duty)}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency Slider */}
          <div style={styles.sliderContainer}>
            <div style={styles.sliderLabel}>
              <span>Frequency</span>
              <span style={styles.sliderValue}>{frequency} Hz</span>
            </div>
            <input
              type="range"
              min="1"
              max={maxFrequency}
              value={frequency}
              onChange={(e) => setFrequency(parseInt(e.target.value))}
              style={styles.slider}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '0.75rem', 
              color: colors.text.tertiary,
              fontFamily 
            }}>
              <span>1 Hz (slow)</span>
              <span>{maxFrequency} Hz (fast)</span>
            </div>
          </div>

          {/* Code Preview */}
          <div style={styles.codePreview}>
            <div style={{ color: colors.text.tertiary, marginBottom: '0.5rem' }}>// Arduino Code:</div>
            <div>analogWrite(LED_PIN, <span style={{ color: '#4ecdc4' }}>{pwmValue}</span>);</div>
            <div style={{ color: colors.text.tertiary, marginTop: '0.5rem', fontSize: '0.8rem' }}>
              // {dutyCycle}% of 255 = {pwmValue}
            </div>
          </div>
        </div>

        {/* Graph Section */}
        <div style={styles.graphSection}>
          <div style={styles.graphTitle}>📊 PWM Waveform</div>
          <canvas 
            ref={canvasRef}
            style={styles.graphCanvas}
          />
          <div style={styles.graphLegend}>
            <span style={{ color: colors.primary }}>━ PWM Signal</span>
            <span style={{ color: '#ff6b6b' }}>┅ Average Voltage</span>
            <span style={{ color: '#4ecdc4' }}>━ ON Time</span>
          </div>
        </div>
      </div>

      {/* Concept Explanation */}
      <div style={styles.conceptBox}>
        <div style={styles.conceptTitle}>💡 How PWM Works</div>
        <div style={styles.conceptText}>
          <strong>Pulse Width Modulation (PWM)</strong> rapidly switches a pin between HIGH (3.3V) and LOW (0V). Your eye can't see the flickering, so the LED appears dimmer.
          <br/><br/>
          <strong>Duty Cycle:</strong> The percentage of time the signal is HIGH. 50% duty cycle means the LED is ON half the time, appearing at half brightness.
          <br/><br/>
          <strong>Frequency:</strong> How fast the signal switches. Higher frequency = smoother appearance. ESP32 typically uses 5000 Hz for LEDs.
          <br/><br/>
          <strong>analogWrite(pin, value):</strong> Takes a value from 0-255. The value is converted to duty cycle: 0 = 0% (off), 127 = ~50%, 255 = 100% (full brightness).
          <br/><br/>
          <strong>Try it:</strong> Set duty cycle to 50% and watch how the LED is ON for exactly half of each cycle. Then try 25% and 75% to see the difference!
        </div>
      </div>
    </div>
  );
}