import { Heading, Flex, Button, SimpleGrid } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { Quiz } from '~/types';

type QuizListProps = { quizzes: Quiz[] };

export default function QuizList({ quizzes }: QuizListProps) {
  const router = useRouter();

  const ongoingQuizzes = React.useMemo(
    () => quizzes.filter((quiz) => !quiz.isFinished),
    [quizzes],
  );

  return (
    <SimpleGrid columns={3} spacing={10} width="100%" height="100%" p={10}>
      {ongoingQuizzes.map((quiz) => (
        <Flex
          key={quiz.id}
          height="130px"
          width="100%"
          direction="column"
          bgColor="gray.600"
          overflow="hidden"
          justifyContent="space-between"
          p={4}
          rounded={6}
        >
          <Heading as="h3" size="lg" mb={6} textTransform="capitalize">
            {quiz.id}
          </Heading>
          <Flex width="100%" justifyContent="flex-end">
            <Button
              width="75px"
              height="30px"
              colorScheme="pink"
              onClick={() => router.push(`/quiz/${quiz.id}/lobby`)}
            >
              Join
            </Button>
          </Flex>
        </Flex>
      ))}
    </SimpleGrid>
  );
}
