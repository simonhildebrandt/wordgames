import React, { useState } from 'react';

import { logout } from './firebase';

import { Button,Text, Flex } from '@chakra-ui/core';

import GamesList from './games_list';

import NewGame from './new_game';


export default function MainView() {
  const [view, setView] = useState('new-game');

  const newGame = () => {
    setView('new-game')
  }

  return <Flex w="100%" h="100%" direction="column">
    <Flex bg="red.50" direction="row" alignItems="center" width={"100%"}>
      <Flex flexGrow={1} ml={4}>
        <Text as="span" fontSize="lg" fontWeight="bold">Dictionari.li</Text>
      </Flex>
      <Flex m={1}>
        <Button onClick={logout}>Logout</Button>
      </Flex>
    </Flex>
    <Flex bg="green.50" flexGrow={1} direction="row">
      <Flex bg="blue.50" w={64} h="100%">
        <GamesList newGame={newGame}/>
      </Flex>
      <Flex bg="yellow.50" flexGrow={1} h="100%" direction="column">
        { view === 'welcome' ? 'welcome' : <NewGame/> }
      </Flex>
    </Flex>
  </Flex>;
}
