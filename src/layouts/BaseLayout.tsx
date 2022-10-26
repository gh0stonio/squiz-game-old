import { Flex } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

import { Login } from '~/components/Login';

export const BaseLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Login />
      <Flex width="100vw" height="95vh" direction="column">
        {children}
      </Flex>
    </>
  );
};
