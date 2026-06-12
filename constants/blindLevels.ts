export interface BlindLevel {
  levelNumber: number | null;
  smallBlind: string;
  bigBlind: string;
  isBreak: boolean;
}

export const BLIND_LEVELS: BlindLevel[] = [
  { levelNumber: 1,    smallBlind: '0.25', bigBlind: '0.50', isBreak: false },
  { levelNumber: 2,    smallBlind: '0.50', bigBlind: '1',    isBreak: false },
  { levelNumber: 3,    smallBlind: '1',    bigBlind: '2',    isBreak: false },
  { levelNumber: 4,    smallBlind: '2',    bigBlind: '4',    isBreak: false },
  { levelNumber: null, smallBlind: '',     bigBlind: '',     isBreak: true  },
  { levelNumber: 5,    smallBlind: '3',    bigBlind: '6',    isBreak: false },
  { levelNumber: 6,    smallBlind: '4',    bigBlind: '8',    isBreak: false },
  { levelNumber: 7,    smallBlind: '5',    bigBlind: '10',   isBreak: false },
  { levelNumber: 8,    smallBlind: '10',   bigBlind: '20',   isBreak: false },
  { levelNumber: 9,    smallBlind: '20',   bigBlind: '40',   isBreak: false },
  { levelNumber: 10,   smallBlind: '30',   bigBlind: '60',   isBreak: false },
  { levelNumber: 11,   smallBlind: '40',   bigBlind: '80',   isBreak: false },
];

export const TOTAL_LEVELS = BLIND_LEVELS.filter(l => !l.isBreak).length;
export const DEFAULT_LEVEL_MINUTES = 15;
export const BREAK_DURATION_MINUTES = 10;
