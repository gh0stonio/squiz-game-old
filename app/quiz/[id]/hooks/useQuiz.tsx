import React from 'react';

import { QuizContext } from '~/quiz/[id]/QuizContext';

export default function useQuiz() {
  const { quiz, setQuiz } = React.useContext(QuizContext);

  return { quiz, setQuiz };
}
