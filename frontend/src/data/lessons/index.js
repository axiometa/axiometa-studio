import { lesson as lesson1Blinky } from './mcu-breadboard/pixie-m1/lesson-1-blinky';
import { lesson as lesson2Button } from './mcu-breadboard/pixie-m1/lesson-2-button';
import { lesson as lesson3Potentiometer } from './mcu-breadboard/pixie-m1/lesson-3-potentiometer'; // ← ADD THIS

// Add more imports as you create lessons...

export const lessons = [
  lesson1Blinky,
  lesson2Button,
  lesson3Potentiometer,
  // Add more lessons...
];

// Helper functions (no need to edit these)
export const getLessonsByBoard = (boardId) => {
  return lessons.filter(lesson => lesson.board === boardId);
};

export const getLesson = (id) => {
  return lessons.find(lesson => lesson.id === id);
};

// Auto-calculate lesson metadata from lesson data
export const getLessonMetadata = (lesson) => {
  const challengeSteps = lesson.steps.filter(s => s.type === 'challenge').length;
  const totalMinutes = Math.max(15, lesson.steps.length * 3); // Estimate 3min per step, min 15
  
  return {
    id: lesson.id,
    title: lesson.title,
    board: lesson.board,
    xpReward: lesson.xp_reward,
    challenges: challengeSteps,
    duration: totalMinutes
  };
};