import { Center, Heading, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { match, P } from 'ts-pattern';

import { useQuiz } from '~/hooks/useQuiz';
import QuizLayout from '~/layouts/QuizLayout';

export default function LobbyPage() {
  const router = useRouter();
  const quizId = router.query.id as string | undefined;
  const quiz = useQuiz(quizId);

  return (
    <Center flexDir="column">
      <Heading>Lobby for quiz {quizId}</Heading>

      {match(quiz)
        .with({ status: 'ready', quiz: { myTeam: P.nullish } }, () => (
          <p>
            Please choose your team first{' '}
            <Link as={NextLink} href={`/quiz/${quizId}/teams`}>
              Teams
            </Link>
          </p>
        ))
        .with({ status: 'ready', quiz: { isStarted: false } }, () => {
          return <p>Please wait for the quiz to start</p>;
        })
        .with({ status: 'ready' }, () => {
          return <p>Quiz ongoing... wait for next question</p>;
        })
        .otherwise(() => (
          <p>You should not be here</p>
        ))}
    </Center>
  );
}

LobbyPage.getLayout = (page: React.ReactNode) => (
  <QuizLayout>{page}</QuizLayout>
);
