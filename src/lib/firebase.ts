import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, type QueryDocumentSnapshot } from 'firebase/firestore';

import { Question, Quiz, Team } from '~/types';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const converters = {
  quiz: {
    toFirestore: (quiz: Quiz) => quiz,
    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
      const data = snapshot.data();
      return { ...data, id: snapshot.id } as Quiz;
    },
  },
  team: {
    toFirestore: (team: Team) => team,
    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
      const data = snapshot.data();
      return { ...data, id: snapshot.id } as Team;
    },
  },
  question: {
    toFirestore: (question: Question) => question,
    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
      const data = snapshot.data();
      return { ...data, id: snapshot.id } as Question;
    },
  },
};
