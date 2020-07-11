import sendEmailNotification from './sendEmailNotification';
import * as functions from 'firebase-functions';
import * as mailgun from 'mailgun-js';

export default async (
  db: FirebaseFirestore.Firestore,
  mg: mailgun.Mailgun,
  snap: functions.firestore.QueryDocumentSnapshot
) => {
  return sendEmailNotification(db, mg, snap);
};
