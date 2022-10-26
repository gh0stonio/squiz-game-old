import { Center, Heading } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { match, P } from 'ts-pattern';

import { useQuiz } from '~/hooks/useQuiz';
import QuizLayout from '~/layouts/QuizLayout';

import TeamList from '../../../components/TeamList';

export default function TeamsPage() {
  const router = useRouter();
  const quizId = router.query.id as string | undefined;
  const quiz = useQuiz(quizId);

  return (
    <Center flexDir="column">
      <Heading>Teams for quiz {quizId}</Heading>
      {match(quiz)
        .with(
          { status: 'ready', quiz: { teams: P.union(P.nullish, []) } },
          () => <p>no teams available</p>,
        )
        .with({ status: 'ready' }, ({ quiz, joinTeam, leaveTeam }) => (
          <TeamList quiz={quiz} joinTeam={joinTeam} leaveTeam={leaveTeam} />
        ))
        .with({ status: 'error' }, () => <p>shit happened ¯\_(ツ)_/¯</p>)
        .otherwise(() => (
          <p>You should not be here</p>
        ))}
    </Center>
  );
}

TeamsPage.getLayout = (page: React.ReactNode) => (
  <QuizLayout>{page}</QuizLayout>
);
