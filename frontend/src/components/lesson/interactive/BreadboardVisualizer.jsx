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
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem'
  },
  legend: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.md
  },
  legendColor: {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    flexShrink: 0
  },
  legendText: {
    color: colors.text.secondary,
    fontSize: '0.9rem',
    fontFamily
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '2rem'
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
  buttonActive: {
    background: '#00d4aa',
    color: '#000'
  },
  buttonSecondary: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    border: `1px solid ${colors.borderLight}`
  },
  instructionBox: {
    background: 'rgba(0, 212, 170, 0.1)',
    border: '2px solid #00d4aa',
    borderRadius: borderRadius.md,
    padding: '1rem',
    textAlign: 'center',
    marginBottom: '1.5rem'
  },
  instructionText: {
    color: '#00d4aa',
    fontSize: '1rem',
    fontFamily,
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
  gifPlaceholder: {
    width: '100%',
    maxWidth: '600px',
    height: '300px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: `2px dashed ${colors.borderLight}`,
    borderRadius: borderRadius.lg,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto'
  },
  gifPlaceholderIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  gifPlaceholderText: {
    color: colors.text.muted,
    fontSize: '1rem',
    fontFamily
  }
};

export default function BreadboardVisualizer({ 
  config = {},
  showControls = true,
  autoPlay = true
}) {
  const {
    title = "How a Breadboard Works",
    explanation = "Click on any hole to see which other holes are connected. Understanding these hidden connections is key to building circuits!",
    mode = 'interactive' // 'interactive', 'power-rails', 'terminal-strips', 'center-gap'
  } = config;

  const canvasRef = useRef(null);
  const [selectedHole, setSelectedHole] = useState(null);
  const [hoveredHole, setHoveredHole] = useState(null);
  const [showConnections, setShowConnections] = useState(true);
  const [viewMode, setViewMode] = useState(mode);

  // Breadboard dimensions
  const holeSpacing = 20;
  const holeRadius = 6;
  const powerRailWidth = 40;
  const terminalCols = 30;
  const terminalRows = 5;
  const canvasWidth = 680;
  const canvasHeight = 320;
  const startX = 60;
  const startY = 50;

  // Determine if two holes are connected
  const areConnected = (hole1, hole2) => {
    if (!hole1 || !hole2) return false;
    if (hole1.row === hole2.row && hole1.col === hole2.col && hole1.section === hole2.section) return false;

    // Power rails - full vertical strips
    if (hole1.section === 'power' && hole2.section === 'power') {
      return hole1.rail === hole2.rail && hole1.side === hole2.side;
    }

    // Terminal strips - horizontal groups of 5
    if (hole1.section === 'terminal' && hole2.section === 'terminal') {
      return hole1.col === hole2.col && hole1.side === hole2.side;
    }

    return false;
  };

  // Get all connected holes for a given hole
  const getConnectedHoles = (hole) => {
    if (!hole) return [];
    
    const connected = [];
    
    if (hole.section === 'power') {
      // All holes in the same power rail
      for (let row = 0; row < 25; row++) {
        if (row !== hole.row) {
          connected.push({ ...hole, row });
        }
      }
    } else if (hole.section === 'terminal') {
      // All holes in the same 5-hole strip
      for (let row = 0; row < 5; row++) {
        if (row !== hole.row) {
          connected.push({ ...hole, row });
        }
      }
    }
    
    return connected;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw breadboard body
    ctx.fillStyle = '#f5f5dc'; // Cream color
    ctx.fillRect(20, 20, canvasWidth - 40, canvasHeight - 40);
    
    // Breadboard texture
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvasWidth; i += 10) {
      ctx.beginPath();
      ctx.moveTo(i, 20);
      ctx.lineTo(i, canvasHeight - 20);
      ctx.stroke();
    }

    // Draw power rail backgrounds
    // Top power rails
    ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
    ctx.fillRect(startX - 10, 25, canvasWidth - startX - 10, 25);
    ctx.fillStyle = 'rgba(0, 0, 255, 0.1)';
    ctx.fillRect(startX - 10, 50, canvasWidth - startX - 10, 25);

    // Bottom power rails
    ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
    ctx.fillRect(startX - 10, canvasHeight - 75, canvasWidth - startX - 10, 25);
    ctx.fillStyle = 'rgba(0, 0, 255, 0.1)';
    ctx.fillRect(startX - 10, canvasHeight - 50, canvasWidth - startX - 10, 25);

    // Center gap
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(startX - 10, canvasHeight / 2 - 10, canvasWidth - startX - 10, 20);

    // Draw power rail markings
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX - 5, 35);
    ctx.lineTo(canvasWidth - 30, 35);
    ctx.stroke();
    
    ctx.strokeStyle = '#0000ff';
    ctx.beginPath();
    ctx.moveTo(startX - 5, 60);
    ctx.lineTo(canvasWidth - 30, 60);
    ctx.stroke();

    ctx.strokeStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(startX - 5, canvasHeight - 65);
    ctx.lineTo(canvasWidth - 30, canvasHeight - 65);
    ctx.stroke();
    
    ctx.strokeStyle = '#0000ff';
    ctx.beginPath();
    ctx.moveTo(startX - 5, canvasHeight - 40);
    ctx.lineTo(canvasWidth - 30, canvasHeight - 40);
    ctx.stroke();

    // Draw + and - symbols
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('+', 30, 40);
    ctx.fillText('+', 30, canvasHeight - 60);
    
    ctx.fillStyle = '#0000ff';
    ctx.fillText('−', 30, 65);
    ctx.fillText('−', 30, canvasHeight - 35);

    // Get connected holes for selected hole
    const connectedHoles = selectedHole ? getConnectedHoles(selectedHole) : [];

    // Draw hidden connections when showing
    if (showConnections && selectedHole) {
      ctx.strokeStyle = 'rgba(0, 255, 100, 0.4)';
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      
      if (selectedHole.section === 'power') {
        // Draw vertical connection line for power rail
        const x = startX + selectedHole.col * holeSpacing;
        const yStart = selectedHole.side === 'top' ? 30 : canvasHeight - 70;
        const yEnd = selectedHole.side === 'top' ? 70 : canvasHeight - 30;
        
        ctx.beginPath();
        ctx.moveTo(x, yStart);
        ctx.lineTo(x, yEnd);
        ctx.stroke();
      } else if (selectedHole.section === 'terminal') {
        // Draw horizontal connection line for terminal strip
        const y = selectedHole.side === 'top' 
          ? 100 + selectedHole.row * holeSpacing
          : canvasHeight - 100 - (4 - selectedHole.row) * holeSpacing;
        const x = startX + selectedHole.col * holeSpacing;
        
        ctx.beginPath();
        ctx.moveTo(x - 40, y);
        ctx.lineTo(x + 40, y);
        ctx.stroke();
      }
    }

    // Draw holes
    const drawHole = (x, y, hole) => {
      const isSelected = selectedHole && 
        selectedHole.row === hole.row && 
        selectedHole.col === hole.col && 
        selectedHole.section === hole.section &&
        selectedHole.side === hole.side;
      
      const isConnected = connectedHoles.some(h => 
        h.row === hole.row && 
        h.col === hole.col && 
        h.section === hole.section &&
        h.side === hole.side
      );
      
      const isHovered = hoveredHole &&
        hoveredHole.row === hole.row &&
        hoveredHole.col === hole.col &&
        hoveredHole.section === hole.section &&
        hoveredHole.side === hole.side;

      // Outer ring for selected/connected
      if (isSelected || isConnected) {
        ctx.beginPath();
        ctx.arc(x, y, holeRadius + 3, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? colors.primary : '#00ff64';
        ctx.fill();
      }

      // Hole
      ctx.beginPath();
      ctx.arc(x, y, holeRadius, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? '#666' : '#333';
      ctx.fill();
      
      // Inner highlight
      ctx.beginPath();
      ctx.arc(x, y, holeRadius - 2, 0, Math.PI * 2);
      ctx.fillStyle = '#1a1a1a';
      ctx.fill();
    };

    // Draw power rail holes (top)
    for (let col = 0; col < 25; col++) {
      drawHole(startX + col * holeSpacing, 35, { section: 'power', rail: 'positive', side: 'top', col, row: 0 });
      drawHole(startX + col * holeSpacing, 60, { section: 'power', rail: 'negative', side: 'top', col, row: 0 });
    }

    // Draw power rail holes (bottom)
    for (let col = 0; col < 25; col++) {
      drawHole(startX + col * holeSpacing, canvasHeight - 65, { section: 'power', rail: 'positive', side: 'bottom', col, row: 0 });
      drawHole(startX + col * holeSpacing, canvasHeight - 40, { section: 'power', rail: 'negative', side: 'bottom', col, row: 0 });
    }

    // Draw terminal strip holes (top section)
    for (let col = 0; col < 25; col++) {
      for (let row = 0; row < 5; row++) {
        const x = startX + col * holeSpacing;
        const y = 100 + row * holeSpacing;
        drawHole(x, y, { section: 'terminal', side: 'top', col, row });
      }
    }

    // Draw terminal strip holes (bottom section)
    for (let col = 0; col < 25; col++) {
      for (let row = 0; row < 5; row++) {
        const x = startX + col * holeSpacing;
        const y = canvasHeight - 100 - (4 - row) * holeSpacing;
        drawHole(x, y, { section: 'terminal', side: 'bottom', col, row });
      }
    }

    // Row labels
    ctx.fillStyle = colors.text.muted;
    ctx.font = `10px ${fontFamily}`;
    ctx.textAlign = 'right';
    const rowLabels = ['a', 'b', 'c', 'd', 'e'];
    rowLabels.forEach((label, i) => {
      ctx.fillText(label, startX - 15, 105 + i * holeSpacing);
    });
    
    const bottomRowLabels = ['f', 'g', 'h', 'i', 'j'];
    bottomRowLabels.forEach((label, i) => {
      ctx.fillText(label, startX - 15, canvasHeight - 95 - (4 - i) * holeSpacing);
    });

    // Column numbers
    ctx.textAlign = 'center';
    for (let col = 0; col < 25; col += 5) {
      ctx.fillText((col + 1).toString(), startX + col * holeSpacing, canvasHeight - 10);
    }

  }, [selectedHole, hoveredHole, showConnections, viewMode]);

  // Handle mouse events
  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const hole = getHoleAtPosition(x, y);
    setSelectedHole(hole);
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const hole = getHoleAtPosition(x, y);
    setHoveredHole(hole);
  };

  const getHoleAtPosition = (x, y) => {
    // Check power rails (top)
    for (let col = 0; col < 25; col++) {
      const holeX = startX + col * holeSpacing;
      
      if (Math.hypot(x - holeX, y - 35) < holeRadius + 2) {
        return { section: 'power', rail: 'positive', side: 'top', col, row: 0 };
      }
      if (Math.hypot(x - holeX, y - 60) < holeRadius + 2) {
        return { section: 'power', rail: 'negative', side: 'top', col, row: 0 };
      }
    }

    // Check power rails (bottom)
    for (let col = 0; col < 25; col++) {
      const holeX = startX + col * holeSpacing;
      
      if (Math.hypot(x - holeX, y - (canvasHeight - 65)) < holeRadius + 2) {
        return { section: 'power', rail: 'positive', side: 'bottom', col, row: 0 };
      }
      if (Math.hypot(x - holeX, y - (canvasHeight - 40)) < holeRadius + 2) {
        return { section: 'power', rail: 'negative', side: 'bottom', col, row: 0 };
      }
    }

    // Check terminal strips (top)
    for (let col = 0; col < 25; col++) {
      for (let row = 0; row < 5; row++) {
        const holeX = startX + col * holeSpacing;
        const holeY = 100 + row * holeSpacing;
        
        if (Math.hypot(x - holeX, y - holeY) < holeRadius + 2) {
          return { section: 'terminal', side: 'top', col, row };
        }
      }
    }

    // Check terminal strips (bottom)
    for (let col = 0; col < 25; col++) {
      for (let row = 0; row < 5; row++) {
        const holeX = startX + col * holeSpacing;
        const holeY = canvasHeight - 100 - (4 - row) * holeSpacing;
        
        if (Math.hypot(x - holeX, y - holeY) < holeRadius + 2) {
          return { section: 'terminal', side: 'bottom', col, row };
        }
      }
    }

    return null;
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.explanation}>{explanation}</p>

      <div style={styles.instructionBox}>
        <div style={styles.instructionText}>
          {selectedHole 
            ? `✓ Selected hole is connected to ${getConnectedHoles(selectedHole).length} other holes (shown in green)`
            : '👆 Click any hole to see its connections'}
        </div>
      </div>

      <div style={styles.canvasContainer}>
        <canvas 
          ref={canvasRef}
          style={{ 
            maxWidth: '100%', 
            height: 'auto', 
            borderRadius: borderRadius.md,
            cursor: 'pointer'
          }}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredHole(null)}
        />
      </div>

      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{...styles.legendColor, background: '#ff6b6b'}} />
          <span style={styles.legendText}>Power Rail (+) - All holes in red strip connected</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{...styles.legendColor, background: '#4a9eff'}} />
          <span style={styles.legendText}>Ground Rail (-) - All holes in blue strip connected</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{...styles.legendColor, background: colors.primary}} />
          <span style={styles.legendText}>Terminal Strips - Groups of 5 holes connected horizontally</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{...styles.legendColor, background: '#333'}} />
          <span style={styles.legendText}>Center Gap - NO connections across this divide</span>
        </div>
      </div>

      {showControls && (
        <div style={styles.controls}>
          <button 
            style={{
              ...styles.button,
              ...(showConnections ? styles.buttonActive : styles.buttonSecondary)
            }}
            onClick={() => setShowConnections(!showConnections)}
          >
            {showConnections ? '✓ Show Connections' : 'Show Connections'}
          </button>
          <button 
            style={{...styles.button, ...styles.buttonSecondary}}
            onClick={() => setSelectedHole(null)}
          >
            Clear Selection
          </button>
        </div>
      )}

      <div style={styles.conceptBox}>
        <div style={styles.conceptTitle}>💡 Breadboard Connection Rules</div>
        <div style={styles.conceptText}>
          <strong>Power Rails (+ and -):</strong> The long strips on the sides. ALL holes in a single rail are connected vertically. Use these to distribute power and ground throughout your circuit.
          <br/><br/>
          <strong>Terminal Strips (a-e, f-j):</strong> The main grid area. Each row of 5 holes is connected horizontally. When you plug a component's legs into the same row, they're electrically connected.
          <br/><br/>
          <strong>Center Gap:</strong> The divide down the middle is NOT connected. This is intentional - it's sized perfectly for DIP chips (like your microcontroller) so each pin connects to its own row.
          <br/><br/>
          <strong>Pro Tip:</strong> Holes in the same column but different rows (like a1 and b1) are NOT connected unless they're in the same terminal strip section!
        </div>
      </div>
    </div>
  );
}