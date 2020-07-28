// import * as functions from 'firebase-functions';
import * as mailgun from 'mailgun-js';

export default async (
  db: FirebaseFirestore.Firestore,
  mg: mailgun.Mailgun,
  answer: any,
  answerUser: any,
  question: any
) => {
  const questionsFollowSnapshot = await db
    .collection('questionsFollow')
    .where('questionId', '==', question.id)
    .get();
  if (questionsFollowSnapshot.empty) return;

  for (const doc of questionsFollowSnapshot.docs) {
    const docData = doc.data();
    // フォローしているユーザー
    const [userPSnapshot, userSSnapshot] = await Promise.all([
      db.collection('publicUsers').doc(docData.userId).get(),
      db.collection('secretUsers').doc(docData.userId).get(),
    ]);
    const userP = userPSnapshot.data();
    const userS = userSSnapshot.data();

    const url = `https://askmakers.co/answers/${question.slug}/${answer.id}`;
    const answerUserUrl = `https://askmakers.co/${answerUser.username}`;
    const questionUrl = `https://askmakers.co/questions/${question.slug}`;

    const data = {
      from: 'AskMakers <community@mail.askmakers.co>',
      to: [userS!.email],
      subject: `${answerUser.customName} answered the question you are following 💡 | AskMakers`,
      text: `${answerUser.customName} answered the question you are following 💡 Please check it out! ${url}`,
      html: `<div style="max-width:600px; margin: 0 auto;">
      <p style="text-align: center;"><img src="https://askmakers.co/askmakers-300.png" width="80px" style="border-radius: 9999px"/></p>
      <p style="font-size: 18px;font-weight: bold;line-height: 22.5px; text-align: center;">Hi, ${
        userP!.customName
      }!<br />You have a new answer on a question you are following.</p>
      <p style="margin: 0;font-size: 16px;font-weight: bold;line-height: 22.5px;">${
        question.text
      }</p>
      <div style="padding-top: 10px;">
        <div style="background-color: #c6f6d5; border-left: 3px solid #48bb78; line-height: 1.4em; margin: 0 0 12px; max-width: 640px; padding: 12px 16px;">${
          answer.content
        }</div>
        <div>
          This answer was posted by <a href="${answerUserUrl}">${
        answerUser.customName
      }</a> in <a href="${questionUrl}">${question.text}</a>.
        </div>
      </div>
      <div style="padding:38px 0">
        <div style="border-top: 1px solid hsl(0,0%,88%);"></div>
      </div>
      </div>`,
    };
    await mg.messages().send(data, (err: any, body: any) => {
      console.log(body);
      if (err) {
        console.error(err);
      }
    });
  }

  await sendToAdmin(mg, answer, answerUser, question);
};

const sendToAdmin = async (
  mg: mailgun.Mailgun,
  answer: any,
  answerUser: any,
  question: any
) => {
  const url = `https://askmakers.co/answers/${question.slug}/${answer.id}`;
  const answerUserUrl = `https://askmakers.co/${answerUser.username}`;
  const questionUrl = `https://askmakers.co/questions/${question.slug}`;

  const data = {
    from: 'AskMakers <community@mail.askmakers.co>',
    to: ['taishi.k0903@gmail.com'],
    subject: `${answerUser.customName} answered the question you are following 💡 | AskMakers`,
    text: `${answerUser.customName} answered the question you are following 💡 Please check it out! ${url}`,
    html: `<div style="max-width:600px; margin: 0 auto;">
      <p style="text-align: center;"><img src="https://askmakers.co/askmakers-300.png" width="80px" style="border-radius: 9999px"/></p>
      <p style="font-size: 18px;font-weight: bold;line-height: 22.5px; text-align: center;">Hi, Taishi Kato! You have a new answer on a question you are following.</p>
      <p style="margin: 0;font-size: 16px;font-weight: bold;line-height: 22.5px;">${question.text}</p>
      <div style="padding-top: 10px;">
        <div style="background-color: #c6f6d5; border-left: 3px solid #48bb78; line-height: 1.4em; margin: 0 0 12px; max-width: 640px; padding: 12px 16px;">${answer.content}</div>
        <div>
          This answer was posted by <a href="${answerUserUrl}">${answerUser.customName}</a> in <a href="${questionUrl}">${question.text}</a>.
        </div>
      </div>
      <div style="padding:38px 0">
        <div style="border-top: 1px solid hsl(0,0%,88%);"></div>
      </div>
      </div>`,
  };
  await mg.messages().send(data, (err: any, body: any) => {
    console.log(body);
    if (err) {
      console.error(err);
    }
  });
};
