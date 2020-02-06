const functions = require('firebase-functions')
const algoliasearch = require('algoliasearch')

const ALGOLIA_ID = 'XZIR7RVDZD'
const ALGOLIA_ADMIN_KEY = '09fe32ed158af6c36993f32470ffff15'
const ALGOLIA_INDEX_NAME = 'questions'
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY)
const alIndex = client.initIndex(ALGOLIA_INDEX_NAME)

/**
 * 質問新規追加
 * Algoliaに追加
 */
exports.onQuestionCreated = functions.firestore
  .document('questions/{questionsId}')
  .onCreate(async (snap, context) => {
    // Get the note document
    const data = snap.data()

    const saveData = {
      text: data.text,
      slug: data.slug,
      created: data.created,
      objectID: data.id
    }
    if (data.body === undefined) {
      saveData.body = ''
    } else {
      saveData.body = data.body
    }
    alIndex.saveObject(saveData)
    console.info('[info]: Saved a question on Algolia')
  })

/**
 * 質問削除
 * Algolia上でも削除
 */
exports.onQuestionDeleted = functions.firestore
  .document('questions/{questionsId}')
  .onDelete(async (snap, context) => {
    // Get the note document
    const data = snap.data()
    alIndex.deleteObject(data.id)
    console.info('[info]: Deleted a question on Algolia')
  })

/**
 * 質問編集
 * Algolia上でも編集
 */
exports.onQuestionUpdated = functions.firestore
  .document('questions/{questionsId}')
  .onUpdate(async (change, context) => {
    // Get the document
    const data = change.after.data()

    const saveData = {
      text: data.text,
      slug: data.slug,
      created: data.created,
      objectID: data.id
    }
    if (data.body === undefined) {
      saveData.body = ''
    } else {
      saveData.body = data.body
    }
    alIndex.saveObject(saveData)
    console.info('[info]: Updated a question on Algolia')
  })
