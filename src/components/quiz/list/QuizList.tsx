import { Heading, Flex, Button, SimpleGrid } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { Quiz } from '~/types';

export function QuizList({ quizzes }: { quizzes: Quiz[] }) {
  const router = useRouter();

  const ongoingQuizzes = React.useMemo(
    () => quizzes.filter((quiz) => !quiz.isFinished),
    [quizzes],
  );

  return (
    <SimpleGrid columns={3} spacing={10} width="1000px" height="100%" pt={10}>
      {ongoingQuizzes.map((quiz) => (
        <Flex
          key={quiz.id}
          height="160px"
          width="250px"
          direction="column"
          bgColor="gray.700"
          overflow="hidden"
          justifyContent="space-between"
          p={4}
          rounded={6}
        >
          <Heading mb={6} textTransform="capitalize">
            {quiz.id}
          </Heading>
          <Flex width="100%" justifyContent="flex-end">
            <Button
              width="75px"
              height="30px"
              colorScheme="teal"
              onClick={() =>
                router.push({
                  pathname: '/quiz/[id]/lobby',
                  query: { id: quiz.id },
                })
              }
            >
              Join
            </Button>
          </Flex>
        </Flex>
      ))}
    </SimpleGrid>
  );
}
