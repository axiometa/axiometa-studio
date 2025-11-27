/**
 * Kit configurations
 * Each kit contains a set of lessons and required modules
 */

export const KITS = [
  {
    id: 'pixie-m1-beginners',
    name: 'Axiometa PIXIE M1 Beginners Kit',
    description: 'Start your hardware programming journey with the PIXIE M1. Learn electronics fundamentals, digital and analog I/O.',
    image: '/images/kits/pixie-m1-beginners-kit.png',
    board: 'pixie-m1',
    lessonBoard: 'pixie-m1',
    difficulty: 'Beginner',
    estimatedTime: '4-6 hours',
    modules: ['MTA0007', 'AX22-0006', 'AX22-0007', 'AX22-0004-H1', 'TOOL-BB-001', 'TOOL-JW-001'],
    available: true,
    featured: true,
    color: '#e1f14f', // Primary yellow
    accentColor: '#00d4aa'
  },
  {
    id: 'spark-3-starter',
    name: 'SPARK 3 Starter Kit',
    description: 'Build IoT projects with the powerful SPARK 3 board. WiFi, Bluetooth, and advanced sensors.',
    image: '/images/kits/spark-3-starter-kit.png',
    board: 'spark-3',
    lessonBoard: 'spark-3',
    difficulty: 'Intermediate',
    estimatedTime: '6-8 hours',
    modules: [],
    available: false,
    featured: false,
    color: '#7c3aed',
    accentColor: '#a855f7'
  },
  {
    id: 'genesis-mini-explorer',
    name: 'GENESIS MINI Explorer Kit',
    description: 'Compact but powerful. Perfect for portable projects and wearables.',
    image: '/images/kits/genesis-mini-kit.png',
    board: 'genesis-mini',
    lessonBoard: 'genesis-mini',
    difficulty: 'Intermediate',
    estimatedTime: '8-10 hours',
    modules: [],
    available: false,
    featured: false,
    color: '#f59e0b',
    accentColor: '#fbbf24'
  },
  {
    id: 'genesis-one-pro',
    name: 'GENESIS ONE Pro Kit',
    description: 'The complete professional development kit. Master advanced hardware programming.',
    image: '/images/kits/genesis-one-kit.png',
    board: 'genesis-one',
    lessonBoard: 'genesis-one',
    difficulty: 'Advanced',
    estimatedTime: '12-15 hours',
    modules: [],
    available: false,
    featured: false,
    color: '#ef4444',
    accentColor: '#f87171'
  }
];

export const getKitById = (id) => KITS.find(k => k.id === id);
export const getAvailableKits = () => KITS.filter(k => k.available);
export const getFeaturedKits = () => KITS.filter(k => k.featured);
export const getKitByBoard = (boardId) => KITS.find(k => k.board === boardId || k.lessonBoard === boardId);