import firebase from './firebase';
import 'firebase/firestore';

const db = firebase.firestore();

export default async (user, username: string): Promise<boolean> => {
  if (username === '') return false;
  const result = await db
    .collection('publicUsers')
    .where('username', '==', username)
    .get();
  if (result.size === 0) return true;
  if (result.size === 1) {
    const userData = result.docs[0].data();
    if (userData.uid === user.uid) return true;
  }
  return false;
};
