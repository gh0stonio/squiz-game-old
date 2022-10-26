import { Box, Center, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { type PropsWithChildren } from 'react';
import { match } from 'ts-pattern';

import { useAuth } from '~/hooks/useAuth';
import { useQuiz } from '~/hooks/useQuiz';
import { BaseLayout } from '~/layouts/BaseLayout';

export default function QuizLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const authResult = useAuth();

  const quizId = router.query.id as string | undefined;
  const quiz = useQuiz(quizId);

  React.useEffect(() => {
    if (authResult.status !== 'connected') router.push('/');
  });

  return (
    <BaseLayout>
      <Center height="5vh" width="100vw" gap="1rem">
        <Link as={NextLink} href={`/quiz/${quizId}/lobby`}>
          Lobby
        </Link>
        |
        <Link as={NextLink} href={`/quiz/${quizId}/teams`}>
          Teams
        </Link>
        |
        <Link as={NextLink} href={'/'}>
          Exit
        </Link>
      </Center>

      <Box height="95vh" width="100vw">
        {match(quiz)
          .with({ status: 'not_found' }, () => (
            <p>
              No quiz found for this id, please go back{' '}
              <Link as={NextLink} href={'/'}>
                Home
              </Link>
            </p>
          ))
          .with({ status: 'ready', quiz: { isFinished: true } }, () => (
            <p>
              This quiz is over, please go back{' '}
              <Link as={NextLink} href={'/'}>
                Home
              </Link>
            </p>
          ))
          .with({ status: 'ready' }, () => children)
          .with({ status: 'error' }, () => <p>shit happened ¯\_(ツ)_/¯</p>)
          .exhaustive()}
      </Box>
    </BaseLayout>
  );
}
