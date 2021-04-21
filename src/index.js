import "@babel/polyfill";

import React, { useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { useAuthChanged, MinimalAuth } from 'react-minimal-auth';

import { ChakraProvider, theme } from "@chakra-ui/core";

import { firebaseConfig, db, auth, logout } from './firebase';

import Interface from './interface';


const customTheme = {
  ...theme,
  fonts: {
    heading: '"Avenir Next", sans-serif',
    body: "system-ui, sans-serif",
    mono: "Menlo, monospace",
  }
}

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false
  }
};

const App = () => {
  useAuthChanged(auth, async function(newUser) {
    if (newUser) {
      const { displayName, email } = newUser;

      const userRec = await db.collection('users').doc(newUser.uid).get();
      if (!userRec.exists) {
        await db.collection('users').doc(newUser.uid).set({});
      }

      db.collection('users').doc(newUser.uid).update({ displayName, email });
    }
  });

  //const loggedIn = !!user;

  // const [navHash, setNavHash] = useState({});
  // useEffect(() => {
  //   router.
  //   on('/', function() {
  //     setNavHash({})
  //   }).
  //   on('/clock/:clockId/display', function({clockId}) {
  //     setNavHash({clockId, display: true})
  //   }).
  //   on('/clock/:clockId', function({clockId}) {
  //     setNavHash({clockId})
  //   }).
  //   on('/admin', function() {
  //     setNavHash({admin: true})
  //   }).
  //   resolve();
  // }, [])

  return <MinimalAuth uiConfig={uiConfig} auth={auth}>
    <ChakraProvider theme={customTheme}>
      <Interface />
    </ChakraProvider>
  </MinimalAuth>;
};



ReactDOM.render(<App/>, document.getElementById('app'));
