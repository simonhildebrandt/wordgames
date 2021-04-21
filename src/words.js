import { useState, useEffect } from 'react';

import axios from 'axios';

let words = [];
const wordsPromise = axios.get('/words.json')
.then(response => words = response.data);

export function useWordsReady() {
  const [wordsReady, setWordsReady] = useState(true);
  
  useEffect(() => {
    wordsPromise.then(() => setWordsReady(true))
  }, []);

  return wordsReady;
}

export const allWords = () => words;

export function getMatchingWords(regex) {
  return words.filter(word => word.match(regex));
}

export function getRandomMatchingWord(regex) {
  const matches = getMatchingWords(regex);
  return matches[Math.floor(Math.random() * matches.length)];
}

export const cleaned = (words) => words.map(w => w.replace("'", ""));

export const downcased = (words) => words.map(w => w.toLowerCase());

export function matched(regex) {
  return words => words.filter(word => word.match(regex));
}

export const deduped = (words) =>
  words.filter((item, index) => words.indexOf(item) == index)

export function allSubWords(masterWord, {match = /.\*/}) {
  return words.filter(word => {
    if (!match.test(word)) return;

    let test = masterWord.split("");
    return word.split("").every(letter => {
      const index = test.indexOf(letter);
      if (index == -1) {
        return false;
      } else {
        test[index] = null;
      }
      return true;
    });
  });
}
