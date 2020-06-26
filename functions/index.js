const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');
const admin = require('firebase-admin');

const ALGOLIA_ID = 'XZIR7RVDZD';
const ALGOLIA_ADMIN_KEY = '09fe32ed158af6c36993f32470ffff15';
const ALGOLIA_INDEX_NAME = 'questions';
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
const alIndex = client.initIndex(ALGOLIA_INDEX_NAME);

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const getUnixTime = () => {
  const date = new Date();
  return Math.floor(date.getTime() / 1000);
};

const LIMIT = 5;

exports.scheduledSetMostUpvotedAnswersCrontab = functions.pubsub
  .schedule('0 0 * * *')
  .onRun(async (context) => {
    console.log('INFO: START scheduledSetMostUpvotedAnswersCrontab');
    // Fetch all of the upvote data
    const upvotesSnapShot = await db.collection('upvotes').get();

    const answerUpvotecount = {};
    await asyncForEach(upvotesSnapShot.docs, async (doc) => {
      const data = doc.data();
      if (answerUpvotecount[data.answerId] === undefined) {
        answerUpvotecount[data.answerId] = 1;
        return;
      }
      answerUpvotecount[data.answerId]++;
    });
    const answerUpvotecountReversed = {};
    Object.keys(answerUpvotecount).forEach((key) => {
      if (answerUpvotecountReversed[answerUpvotecount[key]] === undefined) {
        answerUpvotecountReversed[answerUpvotecount[key]] = [];
      }
      answerUpvotecountReversed[answerUpvotecount[key]].push(key);
    });
    const returnObj = [];
    Object.keys(answerUpvotecountReversed)
      .sort((a, b) => b - a)
      .some((count) => {
        for (let i = 0; i < answerUpvotecountReversed[count].length; i++) {
          if (returnObj.length === LIMIT) return true;
          returnObj.push(answerUpvotecountReversed[count][i]);
        }
      });
    await db.collection('upvoteAnswerRanking').add({
      ranking: returnObj,
      created: getUnixTime(),
    });
    console.log('INFO: END scheduledSetMostUpvotedAnswersCrontab');
  });

/**
 * 質問新規追加
 * Algoliaに追加
 */
exports.onQuestionCreated = functions.firestore
  .document('questions/{questionsId}')
  .onCreate(async (snap, context) => {
    // Get the note document
    const data = snap.data();

    const saveData = {
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

    const saveData = {
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
