
export interface MathProblem {
  title: string;
  totalStudents: number;
  setAName: string;
  setBName: string;
  countA: number;
  countB: number;
  countBoth: number;
  description: string;
}

export type StepKey = 'TOTAL' | 'SET_A' | 'SET_B' | 'BOTH' | 'ONLY_A' | 'ONLY_B' | 'UNION' | 'RESULT';

export interface SolverStep {
  key: StepKey;
  label: string;
  description: string;
  calculation?: string;
}
