import { Heading, Flex, Button, SimpleGrid } from '@chakra-ui/react';
import React from 'react';

import { Quiz, Team } from '~/types';

type TeamListProps = {
  quiz: Quiz;
  joinTeam: (team: Team) => void;
  leaveTeam: (team: Team) => void;
};

export default function TeamList({ quiz, joinTeam, leaveTeam }: TeamListProps) {
  return (
    <SimpleGrid columns={3} spacing={10} width="100%" height="100%" p={10}>
      {quiz.teams?.map((team) => (
        <Flex
          key={team.id}
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
            {team.id}
          </Heading>
          <Flex width="100%" justifyContent="flex-end">
            {quiz.myTeam?.id === team.id ? (
              <Button
                onClick={() => leaveTeam(team)}
                width="75px"
                height="30px"
                colorScheme="pink"
              >
                Leave
              </Button>
            ) : (
              !quiz.myTeam && (
                <Button
                  onClick={() => joinTeam(team)}
                  width="75px"
                  height="30px"
                  colorScheme="pink"
                >
                  Join
                </Button>
              )
            )}
          </Flex>
        </Flex>
      ))}
    </SimpleGrid>
  );
}
