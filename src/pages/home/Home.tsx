import { Center, Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import type { NextPage } from 'next';
import React from 'react';
import { match, P } from 'ts-pattern';

import { QuizList } from '~/components/quiz/list/QuizList';
import { useQuizzes } from '~/hooks/useQuizzes';

import Logo from '../../../public/logo.png';

const Home: NextPage = () => {
  const quizzesResult = useQuizzes();

  return (
    <VStack
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Center maxH="md">
        <Image src={Logo} alt="logo" height={150} width={150} />
      </Center>
      <Center maxH="100px">
        <Text fontSize="5xl">Squiz Game</Text>
      </Center>
      <Center height="300px" width="100%">
        {match(quizzesResult)
          .with({ status: 'disabled' }, () => <p>Please sign in.</p>)
          .with(
            { status: 'ready', ongoingQuizzes: P.union(P.nullish, []) },
            () => <Text fontSize="md">No quiz available.</Text>,
          )
          .with({ status: 'ready' }, ({ quizzes }) => (
            <QuizList quizzes={quizzes} />
          ))
          .with({ status: 'loading' }, () => (
            <Text fontSize="md">fetching quizzes...</Text>
          ))
          .with({ status: 'error' }, () => (
            <Text fontSize="md">shit happened</Text>
          ))
          .exhaustive()}
      </Center>
    </VStack>
  );
};

export default Home;
