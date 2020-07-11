import * as functions from 'firebase-functions';
import * as mailgun from 'mailgun-js';
import checkIfGetEmailNotification from '../common/checkIfGetEmailNotification';

export default async (
  db: FirebaseFirestore.Firestore,
  mg: mailgun.Mailgun,
  snap: functions.firestore.QueryDocumentSnapshot
) => {
  const upvote = snap.data();

  const [
    userPSnapshot,
    userSSnapshot,
    senderSnapshot,
    answerSnapshot,
  ] = await Promise.all([
    db.collection('publicUsers').doc(upvote.answerUserId).get(),
    db.collection('secretUsers').doc(upvote.answerUserId).get(),
    db.collection('publicUsers').doc(upvote.senderId).get(),
    db.collection('answers').doc(upvote.answerId).get(),
  ]);
  const userP = userPSnapshot.data();
  const userS = userSSnapshot.data();
  const sender = senderSnapshot.data();
  const answer = answerSnapshot.data();

  const questionSnapshot = await db
    .collection('questions')
    .doc(answer!.questionId)
    .get();
  const question = questionSnapshot.data();

  const ifGetNotification = await checkIfGetEmailNotification(
    userS!.uid,
    'getNewUpvoteNotification',
    db
  );

  const mailList = ['taishi.k0903@gmail.com'];

  if (ifGetNotification) mailList.push(userS!.email);

  const url = `https://askmakers.co/answers/${question!.slug}/${
    upvote.answerId
  }`;
  const senderUrl = `https://askmakers.co/${sender!.username}`;

  for (const mail of mailList) {
    const data = {
      from: 'AskMakers <community@mail.askmakers.co>',
      to: [mail],
      subject: `${sender!.customName} upvoted your answer ⬆️ | AskMakers`,
      text: `${
        sender!.customName
      } upvoted your answer ⬆️  Please check it out! ${url}`,
      html: `<div style="max-width:600px; margin: 0 auto;">
      <p style="text-align: center;"><img src="https://askmakers.co/askmakers-300.png" width="80px" style="border-radius: 9999px"/></p>
      <p style="font-size: 18px;font-weight: bold;line-height: 22.5px; text-align: center;">Hi, ${
        userP!.customName
      }! <a href="${senderUrl}">${
        sender!.customName
      }</a> upvoted <a href="${url}">your answer</a> on AskMakers.</p>
      <div style="padding-top: 10px;">
        <div style="background-color: #c6f6d5; border-left: 3px solid #48bb78; line-height: 1.4em; margin: 0 0 12px; max-width: 640px; padding: 12px 16px;">${
          answer!.content
        }</div>
        <div>
          Thank you for sharing your knowledge.
        </div>
      </div>
      <div style="padding:38px 0">
        <div style="border-top: 1px solid hsl(0,0%,88%);"></div>
      </div>
      <footer style="color: hsl(0,0%,50%);font-size: 13px; line-height: 18.75px; text-align: center;">
        You can turn off the notification <a href="https://askmakers.co/settings">here</a>.
      </footer>
      </div>`,
    };
    await mg.messages().send(data, (err: any, body: any) => {
      console.log(body);
      if (err) {
        console.error(err);
      }
    });
  }
};
