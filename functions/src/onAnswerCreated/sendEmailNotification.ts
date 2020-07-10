import * as functions from 'firebase-functions';
import * as mailgun from 'mailgun-js';

export default async (
  db: FirebaseFirestore.Firestore,
  mg: mailgun.Mailgun,
  snap: functions.firestore.QueryDocumentSnapshot
) => {
  const answer = snap.data();

  const mailList = ['taishi.k0903@gmail.com'];

  // 回答ユーザー、質問
  const [answerUserSnapshot, questionSnapshot] = await Promise.all([
    db.collection('publicUsers').doc(answer.answerUserId).get(),
    db.collection('questions').doc(answer.questionId).get(),
  ]);
  const answerUser = answerUserSnapshot.data();
  const question = questionSnapshot.data();

  // 質問ユーザー
  const [questionUserPSnapshot, questionUserSSnapshot] = await Promise.all([
    db.collection('publicUsers').doc(question!.fromUserId).get(),
    db.collection('secretUsers').doc(question!.fromUserId).get(),
  ]);
  const questionUserP = questionUserPSnapshot.data();
  const questionUserS = questionUserSSnapshot.data();

  mailList.push(questionUserS!.email);

  const url = `https://askmakers.co/answers/${question!.slug}/${answer.id}`;
  const answerUserUrl = `https://askmakers.co/${answerUser!.username}`;
  const questionUrl = `https://askmakers.co/questions/${question!.slug}`;

  for (const mail of mailList) {
    const data = {
      from: 'AskMakers <community@mail.askmakers.co>',
      to: [mail],
      subject: `${
        answerUser!.customName
      } answered your question 💡 | AskMakers`,
      text: `${
        answerUser!.customName
      } answered your question 💡 Please check it out! ${url}`,
      html: `<div style="max-width:600px; margin: 0 auto;">
      <p style="text-align: center;"><img src="https://askmakers.co/askmakers-300.png" width="80px" style="border-radius: 9999px"/></p>
      <p style="font-size: 18px;font-weight: bold;line-height: 22.5px; text-align: center;">Hi, ${
        questionUserP!.customName
      }! You have a new answer on AskMakers.</p>
      <div style="padding-top: 10px;">
        <div style="background-color: #c6f6d5; border-left: 3px solid #48bb78; line-height: 1.4em; margin: 0 0 12px; max-width: 640px; padding: 12px 16px;">${
          answer.content
        }</div>
        <div>
          This answer was posted by <a href="${answerUserUrl}">${
        answerUser!.customName
      }</a> in <a href="${questionUrl}">your question</a>.
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
