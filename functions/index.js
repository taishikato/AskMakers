const functions = require('firebase-functions')
const koaFirebase = require('koa-firebase-functions')
const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const admin = require('firebase-admin')
const axios = require('axios')

// Mailgun
const mailgun = require('mailgun-js')
const mailgunApiKey = '219024a0364649fd1f6e1369ca1fe5c6-19f318b0-8ec2ab52'
const mailgunDomain = 'mail.askmakers.co'
const mg = mailgun({ apiKey: mailgunApiKey, domain: mailgunDomain })

const Twitter = require('twitter')
const sendAnswerNotification = require('./src/sendAnswerNotification')
const addGeneralQuestion = require('./src/addGeneralQuestion')
const shareAnswerRouter = require('./src/shareAnswerRouter')
const sendThankNotification = require('./src/sendThankNotification')
const sendUpvoteNotification = require('./src/sendUpvoteNotification')

app.use(router.routes())
app.use(router.allowedMethods())

admin.initializeApp(functions.config().firebase)

const db = admin.firestore()

const site_name = 'AskMakers'
const title = 'AskMakers'
const meta_description = 'Ask experienced makers a question'
const meta_keywords = [
  'Indie makers, indie hackers, personal project, quora, question'
]
const og_description = meta_description
const og_image_width = 1200
const og_image_height = 630
const fb_appid = ''
const tw_description = og_description
const tw_site = ''
const tw_creator = ''

const genHtml = (question) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="description" content="${meta_description}">
    <meta name="keywords" content="${meta_keywords.join(',')}">
    <meta property="og:locale" content="en_CA">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://askmakers.co/s/${question.id}">
    <meta property="og:title" content="${title}">
    <meta property="og:site_name" content="${site_name}">
    <meta property="og:description" content="${og_description}">
    <meta property="og:image" content="${question.image}">
    <meta property="og:image:width" content="${og_image_width}">
    <meta property="og:image:height" content="${og_image_height}">
    <meta property="fb:app_id" content="${fb_appid}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${tw_description}">
    <meta name="twitter:image" content="${question.image}">
    <meta name="twitter:site" content="${tw_site}">
    <meta name="twitter:creator" content="${tw_creator}">
  </head>
  <body>
    <script>
      location.href = '/q/${question.id}';
    </script>
  </body>
</html>
`

const getProfileHtml = (data) => {
  const description = `Let's ask ${data.customName} your question💫`
  const image =
    'https://firebasestorage.googleapis.com/v0/b/ask-makers.appspot.com/o/AskMakers-profile.png?alt=media&token=425482ed-13e5-48cf-8d26-7891954a6652'
  const siteName = `${data.customName}'s profile on AskMakers`
  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>${data.customName}'s profile on AskMakers</title>
      <meta name="description" content="${description}">
      <meta name="keywords" content="${meta_keywords.join(',')}">
      <meta property="og:locale" content="en_CA">
      <meta property="og:type" content="website">
      <meta property="og:url" content="https://askmakers.co/sp/${
        data.username
      }">
      <meta property="og:title" content="${siteName}">
      <meta property="og:site_name" content="${siteName}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${image}">
      <meta property="og:image:width" content="${og_image_width}">
      <meta property="og:image:height" content="${og_image_height}">
      <meta property="fb:app_id" content="${fb_appid}">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${siteName}">
      <meta name="twitter:description" content="${description}">
      <meta name="twitter:image" content="${image}">
      <meta name="twitter:site" content="${tw_site}">
      <meta name="twitter:creator" content="${tw_creator}">
    </head>
    <body>
      <script>
        location.href = '/u/${data.username}';
      </script>
    </body>
  </html>
  `
  return html
}

const getSampleProfileHtml = (data) => {
  const description = `Let's ask ${data.customName} your question💫`
  const image = data.ogpImageUrl
  const siteName = `${data.customName}'s profile on AskMakers`
  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>${data.customName}'s profile on AskMakers</title>
      <meta name="description" content="${description}">
      <meta name="keywords" content="${meta_keywords.join(',')}">
      <meta property="og:locale" content="en_CA">
      <meta property="og:type" content="website">
      <meta property="og:url" content="https://askmakers.co/sp/${
        data.username
      }">
      <meta property="og:title" content="${siteName}">
      <meta property="og:site_name" content="${siteName}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${image}">
      <meta property="og:image:width" content="${og_image_width}">
      <meta property="og:image:height" content="${og_image_height}">
      <meta property="fb:app_id" content="${fb_appid}">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${siteName}">
      <meta name="twitter:description" content="${description}">
      <meta name="twitter:image" content="${image}">
      <meta name="twitter:site" content="${tw_site}">
      <meta name="twitter:creator" content="${tw_creator}">
    </head>
    <body>
      <script>
        location.href = '/u/${data.username}';
      </script>
    </body>
  </html>
  `
  return html
}

router.get('/sp/:id', async (ctx) => {
  // ユーザーデータ取得
  try {
    const userData = await db
      .collection('publicUsers')
      .where('username', '==', ctx.params.id)
      .get()
    const user = userData.docs[0].data()
    const html = getProfileHtml(user)
    ctx.res.set('cache-control', 'public, max-age=3600')
    ctx.response.status = 200
    ctx.body = html
  } catch (err) {
    console.log(err)
  }
})

router.get('/s/:id', async (ctx) => {
  // 質問データ取得
  const questionData = await db
    .collection('questions')
    // .doc(ctx.params.id)
    .where('slug', '==', ctx.params.id)
    .get()
  if (questionData.size === 0) {
    console.log('No such a question')
    return
  }
  const question = questionData.docs[0].data()
  const html = genHtml(question)
  ctx.res.set('cache-control', 'public, max-age=3600')
  ctx.response.status = 200
  ctx.body = html
})

// Share an answer
router.get('/sa/:id', async (ctx) => {
  const html = await shareAnswerRouter(db, ctx.params.id)
  ctx.res.set('cache-control', 'public, max-age=3600')
  ctx.response.status = 200
  ctx.body = html
})

router.get('/tweet/:answerId', async (ctx) => {
  if (ctx.params.answerId === undefined || ctx.params.answerId === '') {
    ctx.response.status = 400
    ctx.body = { result: 'Bad request' }
    return
  }
  const answerData = await db
    .collection('answers')
    .doc(ctx.params.answerId)
    .get()
  if (!answerData.exists) {
    ctx.response.status = 400
    ctx.body = { result: 'Bad request' }
    return
  }
  const answer = answerData.data()

  if (answer.tweeted === true) {
    ctx.response.status = 403
    ctx.body = {
      result: 'Bad request'
    }
    return
  }

  const publicUserData = await db
    .collection('publicUsers')
    .doc(answer.answerUserId)
    .get()
  const publicUser = publicUserData.data()
  if (publicUser.isEnabletoShareOnTwitter !== true) {
    console.log('User opt-outs tweet sharing')
    ctx.response.status = 403
    ctx.body = {
      result: 'Bad request'
    }
    return
  }

  const [questionData, userData] = await Promise.all([
    // 質問データ取得
    db
      .collection('questions')
      .doc(answer.questionId)
      .get(),
    db
      .collection('secretUsers')
      .doc(answer.answerUserId)
      .get()
  ])
  const question = questionData.data()
  const user = userData.data()
  const urlLength = 80
  const hashTag = ' #AskMakers'
  const hashTagLength = hashTag.length
  const tweetLimit = 280 - urlLength - hashTagLength
  let answerContent = answer.content
  if (answerContent.length > tweetLimit) {
    answerContent = answerContent.substr(0, tweetLimit - 3)
    answerContent += '…'
  }
  // TODO そのうちBitlyでやる？
  // try {
  //   const bitlyApi = `https://api-ssl.bitly.com/v4/shorten?access_token=1ef850edebd29655e0d7d5f7a7ab632d1df02f78&longUrl=https://ask-makers.firebaseapp.com/s/${answer.id}`
  //   const { data } = await axios.get(bitlyApi)
  //   console.log(data)
  // } catch (err) {
  //   console.error('hey')
  //   console.error(err)
  // }
  const client = new Twitter({
    consumer_key: '50Eg1RYdG3sqJLE3qJ5JEQ4bR',
    consumer_secret: 'YzxlrsppT6sjEw1EcEvKAY1M8fjohEDVeqNHOXn5onksa8URvU',
    access_token_key: user.twitter.accessToken,
    access_token_secret: user.twitter.secret
  })
  const tweetText = `${answerContent} https://askmakers.co/s/${question.slug}${hashTag}`
  try {
    await client.post('statuses/update', { status: tweetText })
  } catch (err) {
    console.error(err)
  }

  // answerに対してtweeted = trueを設定
  await db
    .collection('answers')
    .doc(ctx.params.answerId)
    .update({
      tweeted: true
    })
  ctx.response.status = 200
  ctx.body = { result: 'success' }
})

exports.func = functions.https.onRequest(koaFirebase(app))

/**
 * 質問新規追加
 * 質問を送られたユーザーにメールを送信
 */
exports.onQuestionCreated = functions.firestore
  .document('questions/{questionsId}')
  .onCreate(async (snap, context) => {
    // Get the note document
    const questions = snap.data()

    if (questions.isGeneral === true) {
      console.log('This is a general question')
      await addGeneralQuestion(db, mg, snap)
      return
    }

    // 質問を送られたユーザー情報を取得
    const toUserId = questions.toUserId
    const toUserData = await db
      .collection('publicUsers')
      .doc(toUserId)
      .get()
    const toUser = toUserData.data()
    if (toUser.isEmailNewQuestionNotification === false) {
      console.log('User opt-outs email notification')
      return
    }

    const toUserSecretData = await db
      .collection('secretUsers')
      .doc(toUserId)
      .get()
    const toSecretUser = toUserSecretData.data()

    const data = {
      from: 'AskMakers <info@mail.askmakers.co>',
      to: [toSecretUser.email],
      subject: "You've gotten a new question 😺",
      text: `You've gotten a new question 👍 Please check it out! https://askmakers.co/q/${questions.slug}`,
      html: `<p><strong>You've gotten a new question 👍</strong></p>
      <p>Please check it out!</p>
      <a href="https://askmakers.co/q/${questions.slug}">https://askmakers.co/q/${questions.slug}</a>`
    }
    const res = await mg.messages().send(data, (err, body) => {
      console.log(body)
      if (err) {
        console.error(err)
      }
    })
  })

/**
 * 回答新規追加
 * 質問をしたユーザーにメールを送信
 */
exports.onAnswerCreated = functions.firestore
  .document('answers/{answerId}')
  .onCreate(async (snap, context) => {
    console.log('Start onAnswerCreated function')
    try {
      await sendAnswerNotification(db, mg, snap)
    } catch (err) {
      console.log(err)
    }
  })

/**
 * Thank新規追加
 * Thankをもらったユーザーにメールを送信
 */
exports.onThankCreated = functions.firestore
  .document('thanks/{thankId}')
  .onCreate(async (snap, context) => {
    console.info('Start onThankCreated function')
    try {
      await sendThankNotification(db, mg, snap)
    } catch (err) {
      console.error(err)
    }
  })

/**
 * Upvote新規追加
 * Upvoteをもらったユーザーにメールを送信
 */
exports.onUpvoteCreated = functions.firestore
  .document('upvotes/{upvoteId}')
  .onCreate(async (snap, context) => {
    console.info('Start onUpvoteCreated function')
    try {
      await sendUpvoteNotification(db, mg, snap)
    } catch (err) {
      console.error(err)
    }
  })
