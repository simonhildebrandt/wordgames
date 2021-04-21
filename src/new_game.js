import React, { useEffect, useState } from 'react';

import Select from 'react-select'

import { Box, Button } from '@chakra-ui/core';

import { useFirebaseAuthState } from 'react-minimal-auth';

import { pipe, map, reject } from 'ramda';

import { db, useFirestoreCollection } from './firebase';

import { allSubWords, useWordsReady, getRandomMatchingWord } from './words';


function isGameReady(gameState) {
  return gameState.players = gameState.playerState.every(p => {
    return p === gameState.createdBy || p.ready
  });
}

function updateReadyStatus(gameState) {
  if (isGameReady(gameState)) {
    gameState.status = 'started';
    gameState.startedAt = new Date().valueOf();
  } else {
    gameState.status = 'waiting';
  }
}

function NewGame() {
  const users = useFirestoreCollection('users');
  const [searchText, setSearchText] = useState("");
  const [gameWord, setGameWord] = useState(null);
  const [answers, setAnswers] = useState([]);

  const [players, setPlayers] = useState([]);

  const {user} = useFirebaseAuthState();

  const wordsReady = useWordsReady();

  const searchChanged = (event) => {
    setSearchText(event.target.value);
  }

  useEffect(() => {
    if (wordsReady) {
      const word = getRandomMatchingWord(/^[a-zA-Z]{9}$/);
      setGameWord(word);
      const subs = allSubWords(word, {match: /^.{3,}$/});
      console.log(subs);
      setAnswers(subs);
    }
  }, [wordsReady]);

  const searchFocused = () => console.log('focused!');

  const options = pipe(
    Object.entries,
    map(([key, user]) => ({
      value: key, label: user.displayName
    })),
    reject(u => u.value === user.uid),
  )(users);

  function handleChange(e) {
    console.log(e);
    setPlayers(e || []);
  }

  const selectedPlayers = [...players.map(p => p.value), user.uid];

  function createGame() {
    const gameState = {
      createdBy: user.uid,
      createdAt: new Date().valueOf(),
      playerState: selectedPlayers,
    }

    updateReadyStatus(gameState);

    db.collection("games").add(gameState);
  }

  const gameReady = selectedPlayers.length > 0;
  const gameNotReadyMessage = gameReady ? '' : "Needs players";

  return <Box bg="red.50">
    { wordsReady ? (
      <>
        { gameWord }
        <Select isMulti value={players} options={options} onChange={handleChange}/>

        { gameReady ? <Button onClick={createGame}>Create Game</Button> : gameNotReadyMessage }
      </>
    ) : (
      "Loading!"
    )}
  </Box>;
}

export default NewGame;
