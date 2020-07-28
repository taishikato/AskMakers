import { QUESTIONS_FOLLOW } from '../../consts/FirestoreCollections';
import getUnixTime from '../../plugins/getUnixTime';

export default (
  db: firebase.firestore.Firestore,
  questionId: string,
  userId: string
) => {
  return db.collection(QUESTIONS_FOLLOW).add({
    questionId,
    userId,
    created: getUnixTime(),
  });
};
