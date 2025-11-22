export const BOARDS = [
  {
    id: 'axiometa_pixie_m1',
    name: 'PIXIE M1',
    displayName: 'Pixie M1',
    available: true,
    fqbn: 'esp32:esp32:axiometa_pixie_m1:CDCOnBoot=cdc',
    lessonCount: 8,
    lessonBoard: 'pixie-m1'
  },
  {
    id: 'spark_3',
    name: 'SPARK 3',
    displayName: 'Spark 3',
    available: false,
    fqbn: null,
    lessonCount: 6,
    lessonBoard: 'spark-3'
  },
  {
    id: 'genesis_mini',
    name: 'GENESIS MINI',
    displayName: 'Genesis Mini',
    available: false,
    fqbn: null,
    lessonCount: 10,
    lessonBoard: 'genesis-mini'
  },
  {
    id: 'genesis_one',
    name: 'GENESIS ONE',
    displayName: 'Genesis One',
    available: false,
    fqbn: null,
    lessonCount: 12,
    lessonBoard: 'genesis-one'
  }
];

export const getBoardById = (id) => BOARDS.find(b => b.id === id);
export const getAvailableBoards = () => BOARDS.filter(b => b.available);
