import { type User as FirebaseUser } from 'firebase/auth';

export type User = {
  uid: FirebaseUser['uid'];
  name: FirebaseUser['displayName'];
  email: FirebaseUser['email'];
  emailVerified?: FirebaseUser['emailVerified'];
  photoURL?: FirebaseUser['photoURL'];
};

export interface Question {
  id: string;
  text: string;
  answer: string;
  duration: number;
  maxPoints: number;
  createdAt: number;
  updatedAt?: number;
}

export interface Quiz {
  id: string;
  name: string;
  description: string;
  status: 'ready' | 'in progress' | 'finished';
  createdAt: number;
  updatedAt?: number;

  questions?: Question[];
}
