// Import all lesson types
import { lesson as mcuBreadboardPixieM1Blinky } from './mcu-breadboard/pixie-m1/lesson-1-blinky';
// import { lesson as mcuBreadboardSpark3Blinky } from './mcu-breadboard/spark-3/lesson-1-blinky';
// import { lesson as rawBreadboardPixieM1Blinky } from './raw-breadboard/pixie-m1/lesson-1-blinky';

// Export lessons array - can be filtered by board type
export const lessons = [
  mcuBreadboardPixieM1Blinky,
  // mcuBreadboardSpark3Blinky,
  // rawBreadboardPixieM1Blinky,
];

// Helper to get lessons by board
export const getLessonsByBoard = (boardId) => {
  return lessons.filter(lesson => lesson.board === boardId);
};

// Helper to get lessons by type
export const getLessonsByType = (type) => {
  return lessons.filter(lesson => lesson.type === type);
};

// Helper to get specific lesson
export const getLesson = (id) => {
  return lessons.find(lesson => lesson.id === id);
};