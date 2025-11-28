import { lesson as lesson1Introduction } from './mcu-breadboard/pixie-m1/lesson-1-introduction';
import { lesson as lesson2Blinky } from './mcu-breadboard/pixie-m1/lesson-2-blinky';
import { lesson as lesson3Button } from './mcu-breadboard/pixie-m1/lesson-3-button';
import { lesson as lesson4Potentiometer } from './mcu-breadboard/pixie-m1/lesson-4-potentiometer';
import { lesson as lesson5buttonAndLED } from './mcu-breadboard/pixie-m1/lesson-5-buttonAndLED';
import { lesson as lesson6trafficLightControl } from './mcu-breadboard/pixie-m1/lesson-6-trafficLightControl';


export const lessons = [
  lesson1Introduction,
  lesson2Blinky,
  lesson3Button,
  lesson4Potentiometer,
  lesson5buttonAndLED,
  lesson6trafficLightControl,
];

// Helper functions
export const getLessonsByBoard = (boardId) => {
  return lessons.filter(lesson => 
    lesson.board === boardId || lesson.board === 'universal'
  );
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