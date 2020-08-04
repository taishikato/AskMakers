import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import algoliasearch from 'algoliasearch';
import addGeneralQuestion from './addGeneralQuestion';
import handleAnswerCreated from './onAnswerCreated/handleAnswerCreated';
import onUpvoteCreatedService from './onUpvoteCreated/onUpvoteCreatedService';
import asyncForEach from './asyncForEach';
// import { JSDOM } from 'jsdom';
import * as sharp from 'sharp';

// Mailgun
import * as mailgun from 'mailgun-js';
const mailgunApiKey = 'key-3cecd972cb3c2374f90ec8fb8e591eb1';
const mailgunDomain = 'mail.askmakers.co';
const mg = mailgun({ apiKey: mailgunApiKey, domain: mailgunDomain });

const ALGOLIA_ID = 'XZIR7RVDZD';
const ALGOLIA_ADMIN_KEY = '09fe32ed158af6c36993f32470ffff15';
const ALGOLIA_INDEX_NAME = 'questions';
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
const alIndex = client.initIndex(ALGOLIA_INDEX_NAME);

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const getUnixTime = () => {
  const date = new Date();
  return Math.floor(date.getTime() / 1000);
};

const LIMIT = 5;

/**
 * Make the most upvoted answers ranking
 * Cron job
 */
exports.scheduledSetMostUpvotedAnswersCrontab = functions.pubsub
  .schedule('0 0 * * *')
  .onRun(async (context) => {
    console.log('INFO: START scheduledSetMostUpvotedAnswersCrontab');
    // Fetch all of the upvote data
    const upvotesSnapShot = await db.collection('upvotes').get();

    const answerUpvotecount: any = {};
    await asyncForEach(upvotesSnapShot.docs, async (doc) => {
      const data = doc.data();
      if (answerUpvotecount[data.answerId] === undefined) {
        answerUpvotecount[data.answerId] = 1;
        return;
      }
      answerUpvotecount[data.answerId]++;
    });
    const answerUpvotecountReversed: any = {};
    Object.keys(answerUpvotecount).forEach((key) => {
      if (answerUpvotecountReversed[answerUpvotecount[key]] === undefined) {
        answerUpvotecountReversed[answerUpvotecount[key]] = [];
      }
      answerUpvotecountReversed[answerUpvotecount[key]].push(key);
    });
    const returnObj: any = [];
    Object.keys(answerUpvotecountReversed)
      .sort((a: any, b: any) => b - a)
      .some((count) => {
        // for (let i = 0; i < answerUpvotecountReversed[count].length; i++) {
        for (const element of answerUpvotecountReversed[count]) {
          if (returnObj.length === LIMIT) return true;
          returnObj.push(element);
        }
        return false;
      });
    await db.collection('upvoteAnswerRanking').add({
      ranking: returnObj,
      created: getUnixTime(),
    });
    console.log('INFO: END scheduledSetMostUpvotedAnswersCrontab');
  });

/**
 * 質問コメント追加
 * Algoliaに追加
 * メール通知送信
 */
const checkIfGetNewCommentEmailNotification = async (
  uid: string,
  database: FirebaseFirestore.Firestore
) => {
  const settingSnapShot = await database
    .collection('publicUsers')
    .doc(uid)
    .collection('settings')
    .doc('notifications')
    .get();
  if (!settingSnapShot.exists) return true;
  const settings = settingSnapShot.data();
  if (settings!.getNewCommentNotification === undefined) return true;
  if (settings!.getNewCommentNotification === true) return true;
  return false;
};
exports.onCommentCreated = functions.firestore
  .document('comments/{commentId}')
  .onCreate(async (snap, context) => {
    const comment = snap.data();
    const answerSnapShot = await db
      .collection('answers')
      .doc(comment.answerId)
      .get();
    const answer = answerSnapShot.data();
    const questionSnapShot = await db
      .collection('questions')
      .doc(answer!.questionId)
      .get();
    const question = questionSnapShot.data();
    const [commentUserSnap, publicSnap, secretSnap] = await Promise.all([
      db.collection('publicUsers').doc(comment.userId).get(),
      db.collection('publicUsers').doc(answer!.answerUserId).get(),
      db.collection('secretUsers').doc(answer!.answerUserId).get(),
    ]);
    const commentUser = commentUserSnap.data();
    const publicUser = publicSnap.data();
    const secret = secretSnap.data();

    const mailList = ['taishi.k0903@gmail.com'];

    const ifGetNotification = await checkIfGetNewCommentEmailNotification(
      publicUser!.uid,
      db
    );
    if (ifGetNotification) mailList.push(secret!.email);

    const url = `https://askmakers.co/answers/${question!.slug}/${answer!.id}`;
    const commentUserUrl = `https://askmakers.co/${commentUser!.username}`;

    for (const mail of mailList) {
      const data = {
        from: 'AskMakers <community@mail.askmakers.co>',
        to: [mail],
        subject: `${
          commentUser!.customName
        } commented on your answer 💬 | AskMakers`,
        text: `${
          commentUser!.customName
        } commented on your answer! Please check it out! ${url}`,
        html: `<div style="max-width:600px; margin: 0 auto;">
        <p style="text-align: center;"><img src="https://askmakers.co/askmakers-300.png" width="80px" style="border-radius: 9999px"/></p>
        <p style="font-size: 18px;font-weight: bold;line-height: 22.5px; text-align: center;">Hi, ${
          publicUser!.customName
        }! You have a new comment on AskMakers.</p>
        <div style="padding-top: 10px;">
          <div style="background-color: #c6f6d5; border-left: 3px solid #48bb78; line-height: 1.4em; margin: 0 0 12px; max-width: 640px; padding: 12px 16px;">${
            comment.content
          }</div>
          <div>
            This comment was posted by <a href="${commentUserUrl}">${
          commentUser!.customName
        }</a> in <a href="${url}">your answer</a>.
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
  });

/**
 * Upvote新規追加
 * メール通知送信
 */
exports.onUpvoteCreated = functions.firestore
  .document('upvotes/{upvoteId}')
  .onCreate(async (snap, context) => {
    console.info('[info]: START onUpvoteCreated');
    await onUpvoteCreatedService(db, mg, snap);
    console.info('[info]: END onUpvoteCreated');
  });

/**
 * 回答新規追加
 * メール通知送信
 */
exports.onAnswerCreated = functions.firestore
  .document('answers/{answerId}')
  .onCreate(async (snap, context) => {
    await handleAnswerCreated(db, mg, snap);
  });

/**
 * 質問新規追加
 * Algoliaに追加
 * メール通知送信
 */
interface IsaveData {
  text: string;
  slug: string;
  created: number;
  objectID: string;
  body?: string;
}
exports.onQuestionCreated = functions.firestore
  .document('questions/{questionsId}')
  .onCreate(async (snap, context) => {
    // Get the note document
    const data = snap.data();

    const saveData: IsaveData = {
      text: data.text,
      slug: data.slug,
      created: data.created,
      objectID: data.id,
    };
    if (data.body === undefined) {
      saveData.body = '';
    } else {
      saveData.body = data.body;
    }
    alIndex.saveObject(saveData);

    // Send emails
    await addGeneralQuestion(db, mg, snap);

    console.info('[info]: Saved a question on Algolia');
  });

/**
 * 質問削除
 * Algolia上でも削除
 */
exports.onQuestionDeleted = functions.firestore
  .document('questions/{questionsId}')
  .onDelete(async (snap, context) => {
    // Get the note document
    const data = snap.data();
    alIndex.deleteObject(data.id);
    console.info('[info]: Deleted a question on Algolia');
  });

/**
 * 質問編集
 * Algolia上でも編集
 */
exports.onQuestionUpdated = functions.firestore
  .document('questions/{questionsId}')
  .onUpdate(async (change, context) => {
    // Get the document
    const data = change.after.data();

    const saveData: IsaveData = {
      text: data.text,
      slug: data.slug,
      created: data.created,
      objectID: data.id,
    };
    if (data.body === undefined) {
      saveData.body = '';
    } else {
      saveData.body = data.body;
    }
    alIndex.saveObject(saveData);
    console.info('[info]: Updated a question on Algolia');
  });

exports.generateOGP = functions.https.onRequest(async (req: any, res: any) => {
  const svgString = Buffer.from(
    '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="800px" height="600px" viewBox="0 0 800 600" enable-background="new 0 0 800 600" xml:space="preserve">  <g id="111"> <rect x="130" y= "130" height="320" width="550" id="rect1" fill="blue" stroke="blue" >Hello</rect></g></svg>'
  );
  try {
    const imageBuffer = await sharp(svgString).png().toBuffer();
    const imageByteArray = new Uint8Array(imageBuffer);
    const bucket = admin.storage().bucket();
    const file = bucket.file(`ogp/test.png`);
    await file.save(imageByteArray, {
      metadata: { contentType: 'image/png' },
    });
    const urls = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2500',
    });
    const url = urls[0];
    return res.status(200).send({ url });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});
