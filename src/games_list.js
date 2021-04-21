import React from 'react';
import { Button, Text, Flex } from '@chakra-ui/core';
import { AddIcon } from '@chakra-ui/icons'

import { useFirestoreCollection } from './firebase';

import { pipe, map, sort } from 'ramda';



const GameMenuItem = ({game}) => {
  return JSON.stringify(game);
}

export default function GamesList ({newGame}) {
  const gamesCollection = useFirestoreCollection('games');

  const games = pipe(
    Object.entries,
    map(([id, g]) => ({...g, id})),
    sort((a, b) => a.createdAt - b.createdAt)
  )(gamesCollection);

  const pending = games.filter(g => g.status === 'waiting');
  const started = games.filter(g => g.status === 'started');

  return <Flex direction="column">
    <Button onClick={newGame} rightIcon={<AddIcon/>}>New Game</Button>

    <Flex>Pending</Flex>
    { pending.map(game => <GameMenuItem key={game.id} game={game} />) }
    <Flex>Active</Flex>
    { started.map(game => <GameMenuItem key={game.id} game={game} />) }
  </Flex>
}
