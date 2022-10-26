import { Button, Flex } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { match } from 'ts-pattern';

import { useAuth } from '~/hooks/useAuth';

export const Login: React.FC = () => {
  const authResult = useAuth();

  return (
    <Flex
      height="5vh"
      width="100%"
      align="flex-end"
      justify="flex-end"
      px="16px"
    >
      {match(authResult)
        .with({ status: 'disconnected' }, ({ logIn }) => (
          <Button onClick={logIn} size="sm" colorScheme="pink">
            Sign In
            <Icon as={FaSignInAlt} ml={3} />
          </Button>
        ))
        .with({ status: 'connected' }, ({ user, logOut }) => (
          <Flex width="100%" justify="space-between" align="center">
            <p>Welcome {user.displayName}</p>
            <Button onClick={logOut} size="sm" colorScheme="pink">
              Sign Out
              <Icon as={FaSignOutAlt} ml={3} />
            </Button>
          </Flex>
        ))
        .with({ status: 'error' }, ({ error }) => (
          <p>shit happened {error.message}</p>
        ))
        .otherwise(() => null)}
    </Flex>
  );
};
