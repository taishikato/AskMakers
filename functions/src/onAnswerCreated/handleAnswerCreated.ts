import * as functions from 'firebase-functions';
import * as mailgun from 'mailgun-js';
import sendEmailNotification from './sendEmailNotification';
import sendEmailNotificationToFollowers from './sendEmailNotificationToFollowers';

export default async (
  db: FirebaseFirestore.Firestore,
  mg: mailgun.Mailgun,
  snap: functions.firestore.QueryDocumentSnapshot
) => {
  const answer = snap.data();

  // 回答ユーザー、質問
  const [answerUserSnapshot, questionSnapshot] = await Promise.all([
    db.collection('publicUsers').doc(answer.answerUserId).get(),
    db.collection('questions').doc(answer.questionId).get(),
  ]);
  const answerUser = answerUserSnapshot.data();
  const question = questionSnapshot.data();

  try {
    await sendEmailNotification(db, mg, answer, answerUser, question);
  } catch (err) {
    console.error(err);
  }
  try {
    await sendEmailNotificationToFollowers(
      db,
      mg,
      answer,
      answerUser,
      question
    );
  } catch (err) {
    console.error(err);
  }
};
