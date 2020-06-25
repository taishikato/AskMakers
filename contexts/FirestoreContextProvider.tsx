import React from 'react';
import firebase from '../plugins/firebase';
import 'firebase/firestore';

const db = firebase.firestore();

export const FirestoreContext = React.createContext<
  firebase.firestore.Firestore
>(db);

const FirestoreContextProvider: React.FC = ({ children }) => {
  return (
    <FirestoreContext.Provider value={db}>{children}</FirestoreContext.Provider>
  );
};

export default FirestoreContextProvider;
