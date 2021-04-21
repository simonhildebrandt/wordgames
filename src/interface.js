import React from 'react';

import { useFirebaseAuthState, LoginForm, useAuthChanged } from 'react-minimal-auth';

import {
  useDisclosure,
  Button,
  CircularProgress,
  Box,
} from "@chakra-ui/core";

import { logout, auth } from './firebase';

import MainView from './main_view';


export default function Interface () {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, loginState } = useFirebaseAuthState();

  useAuthChanged(auth, async function(newUser) {
    if (newUser === null) onClose();
  });

  console.log({ user, loginState } )
  if (loginState === 'loading') return <CircularProgress isIndeterminate/>;

  if (loginState === 'logged_in') return <MainView/>;
  if (loginState === 'logged_out') return (
    <>
      <Box>
        <Box>Welcome to Dictionari.li</Box>
      </Box>

      {isOpen ? <LoginForm /> : <Button onClick={onOpen}>Let's Go</Button> }
    </>
  );
}
