import * as functions from 'firebase-functions';
import * as mailgun from 'mailgun-js';
import asyncForEach from './asyncForEach';

const addGeneralQuestion = async (
  db: FirebaseFirestore.Firestore,
  mg: mailgun.Mailgun,
  snap: functions.firestore.QueryDocumentSnapshot
) => {
  // ユーザー全員分のメアド取得
  const userData = await db.collection('secretUsers').get();
  // メアド抽出
  const mailAdressArray = [];
  await asyncForEach(userData.docs, async (doc) => {
    const user = doc.data();
    const ifGetNotification = await checkIfGetEmailNotification(user.uid, db);
    if (user.email !== undefined && ifGetNotification === true) {
      mailAdressArray.push(user.email);
    }
  });
  mailAdressArray.push('taishi@hey.com');
  // メール送信
  const question = snap.data();
  mailAdressArray.forEach(async (email) => {
    const data = {
      from: 'AskMakers <community@mail.askmakers.co>',
      to: [email],
      subject: `New Question: ${question.text} | AskMakers`,
      text: `New question is just posted! Please check it out! https://askmakers.co/questions/${question.slug}`,
      html: `<div style="max-width:600px; margin: 0 auto;">
      <p style="text-align: center;"><img src="https://askmakers.co/askmakers-300.png" width="80px" style="border-radius: 9999px"/></p>
      <p style="font-size: 18px;font-weight: bold;line-height: 22.5px; text-align: center;">Hi, Makers! New question is just posted.</p>
      <div style="padding-top: 30px;">
        <a style="color: #68d391; font-size: 17px;font-weight: bold; line-height: 22.5px; text-decoration: none;" href="https://askmakers.co/questions/${question.slug}">${question.text}</a>
        <div style="color: hsl(210,10%,10%)!important; font-size: 16px; line-height: 1.5em; margin-top: 10px;">${question.body}</div>
        <a href="https://askmakers.co/questions/${question.slug}" target="_blank" style="font-size: 14px;">Check this out</a>
      </div>
      <div style="padding:38px 0">
        <div style="border-top: 1px solid hsl(0,0%,88%);"></div>
      </div>
      <footer style="color: hsl(0,0%,50%);font-size: 13px; line-height: 18.75px; text-align: center;">
        You can unsubscribe <a href="https://askmakers.co/settings" target="_blank">here</a>.
      </footer>
      </div>`,
    };
    await mg.messages().send(data, (err: any, body: any) => {
      console.log(body);
      if (err) {
        console.error(err);
      }
    });
  });
};

export default addGeneralQuestion;

const checkIfGetEmailNotification = async (
  uid: string,
  db: FirebaseFirestore.Firestore
) => {
  const settingSnapShot = await db
    .collection('publicUsers')
    .doc(uid)
    .collection('settings')
    .doc('notifications')
    .get();
  if (!settingSnapShot.exists) return true;
  const settings = settingSnapShot.data();
  if (settings!.getNewQuestionNotification === undefined) return true;
  if (settings!.getNewQuestionNotification === true) return true;
  return false;
};
