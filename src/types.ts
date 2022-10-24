import { type User } from 'firebase/auth';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export interface Question {
  value: string;
  time: number;
  points: number;
}

export interface Team {
  id: string;
  membersUids: User['uid'][];
  leaderUid: User['uid'];
}

export interface Quiz {
  id: string;
  isFinished: boolean;
  adminUids: User['uid'][];
  questions?: Question[];
  currentQuestion?: Question;
  teams?: Team[];
  myTeam?: Team;
}
