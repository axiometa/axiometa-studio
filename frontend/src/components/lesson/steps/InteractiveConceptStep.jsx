import React from 'react';
import VoltageGraph from '../interactive/VoltageGraph';
import VoltageDivider from '../interactive/VoltageDivider';
import PotentiometerKnob from '../interactive/PotentiometerKnob';
import ButtonPressVisualizer from '../interactive/ButtonPressVisualizer';
import CircuitFlow from '../interactive/CircuitFlow';
import TransistorVisualizer from '../interactive/TransistorVisualizer';
import OhmsLawCircuit from '../interactive/OhmsLawCircuit';
import PowerGroundVisualizer from '../interactive/PowerGroundVisualizer';
import ResistorVisualizer from '../interactive/ResistorVisualizer';
import CapacitorVisualizer from '../interactive/CapacitorVisualizer';
import InductorVisualizer from '../interactive/InductorVisualizer';
import BreadboardVisualizer from '../interactive/BreadboardVisualizer';
import PWMVisualizer from '../interactive/PWMVisualizer';

import { colors, fontFamily } from '../../../styles/theme';

const styles = {
  container: {
    marginBottom: '2rem'
  },
  title: {
    fontSize: '2.25rem',
    marginBottom: '1.5rem',
    color: colors.primary,
    fontFamily
  },
  description: {
    fontSize: '1.125rem',
    lineHeight: '1.8',
    color: colors.text.secondary,
    marginBottom: '2rem',
    whiteSpace: 'pre-line',
    fontFamily
  }
};

// Map of available interactive components
const INTERACTIVE_COMPONENTS = {
  'voltage-graph': VoltageGraph,
  'voltage-divider': VoltageDivider,
  'potentiometer-knob': PotentiometerKnob,
  'button-press-visualizer': ButtonPressVisualizer,
  'circuit-flow': CircuitFlow,
  'transistor-visualizer': TransistorVisualizer,
  'ohms-law-circuit': OhmsLawCircuit,
  'power-ground-visualizer': PowerGroundVisualizer,
  'resistor-visualizer': ResistorVisualizer,
  'capacitor-visualizer': CapacitorVisualizer,
  'inductor-visualizer': InductorVisualizer,
  'breadboard-visualizer': BreadboardVisualizer,
  'pwm-visualizer': PWMVisualizer,
};

export default function InteractiveConceptStep({
  title,
  description,
  component,
  config = {},
  showControls = true,
  autoPlay = true
}) {
  const InteractiveComponent = INTERACTIVE_COMPONENTS[component];

  if (!InteractiveComponent) {
    console.error(`Unknown interactive component: ${component}`);
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.description}>
          Interactive component "{component}" not found.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {title && <h1 style={styles.title}>{title}</h1>}
      {description && <p style={styles.description}>{description}</p>}

      <InteractiveComponent
        config={config}
        showControls={showControls}
        autoPlay={autoPlay}
      />
    </div>
  );
}