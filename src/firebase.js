import React, { useState, useEffect } from 'react';

import firebase from 'firebase/app';
import firestore from 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB4bpCB8dYYQigjbBVK0zxwBkRqoLFjzHc",
  authDomain: "wordgames-d84a9.firebaseapp.com",
  databaseURL: "https://wordgames-d84a9.firebaseio.com",
  projectId: "wordgames-d84a9",
  storageBucket: "wordgames-d84a9.appspot.com",
  messagingSenderId: "236922041846",
  appId: "1:236922041846:web:600f3c3259ef9aee2843d7"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth;

const logout = () => { auth().signOut() };

const objectFromDocs = snapshot => {
  const hash = {};
  snapshot.docs.map(doc => hash[doc.id] = doc.data());
  return hash;
}

const listFromDocs = snapshot => snapshot.docs.map(d => d.data());

function useFirestoreCollection(path, {where, type = 'hash'} = {}) {
  const [data, setData] = useState({});

  useEffect(() => {
    let collection = db.collection(path);
    if (where) collection = collection.where(...where);
    const unsub = collection.onSnapshot(snapshot => {
      if (type === 'hash') {
        setData(objectFromDocs(snapshot));
      } else {
        setData(listFromDocs(snapshot));
      }
    });

    return () => { unsub() };
  }, [path]);

  return data;
}

export {
  firebaseConfig, auth, db, logout, useFirestoreCollection
}
