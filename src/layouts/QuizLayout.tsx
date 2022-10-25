import { Box, Center, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { PropsWithChildren } from 'react';
import { match } from 'ts-pattern';

import { useAuth } from '~/hooks/useAuth';
import { useQuiz } from '~/hooks/useQuiz';
import { BaseLayout } from '~/layouts/BaseLayout';

export const QuizLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const authResult = useAuth();

  const { id } = router.query;
  const quiz = useQuiz(id as string | undefined);

  React.useEffect(() => {
    if (authResult.status !== 'connected') router.push('/');
  });

  return (
    <BaseLayout>
      <Center height="5vh" width="100vw" gap="1rem">
        <NextLink href={{ pathname: '/quiz/[id]/lobby', query: { id } }}>
          <Link>Lobby</Link>
        </NextLink>
        |
        <NextLink href={{ pathname: '/quiz/[id]/teams', query: { id } }}>
          <Link>Teams</Link>
        </NextLink>
        |
        <NextLink href={{ pathname: '/' }}>
          <Link>Exit</Link>
        </NextLink>
      </Center>

      <Box height="95vh" width="100vw">
        {match(quiz)
          .with({ status: 'not_found' }, () => (
            <p>
              No quiz found for this id, please go back{' '}
              <NextLink href={{ pathname: '/' }}>
                <Link>Home</Link>
              </NextLink>
            </p>
          ))
          .with({ status: 'ready', data: { isFinished: true } }, () => (
            <p>
              This quiz is over, please go back{' '}
              <NextLink href={{ pathname: '/' }}>
                <Link>Home</Link>
              </NextLink>
            </p>
          ))
          .with({ status: 'ready' }, () => children)
          .with({ status: 'error' }, () => <p>shit happened ¯\_(ツ)_/¯</p>)
          .exhaustive()}
      </Box>
    </BaseLayout>
  );
};
