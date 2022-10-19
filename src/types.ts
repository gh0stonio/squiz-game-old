import { type User } from 'firebase/auth';

export interface Question {
  value: string;
  time: number;
  points: number;
}
export interface Quiz {
  id: string;
  isFinished: boolean;
  adminUids: User['uid'][];
  questions?: Question[];
  currentQuestion?: Question;
}
