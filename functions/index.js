const functions = require('firebase-functions')
const koaFirebase = require('koa-firebase-functions')
// const express = require('express')
// const app = express()
const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const admin = require('firebase-admin')
const twitterText = require('twitter-text')
const axios = require('axios')

const Twitter = require('twitter')

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

router.get('/s/:id', async (ctx) => {
  // const answerData = await db
  //   .collection('answers')
  //   .doc(ctx.params.id)
  //   .get()
  // if (!answerData.exists) {
  //   ctx.response.status = 404
  //   ctx.body = '404 Not Found'
  //   return
  // }
  // const answer = answerData.data()

  // 質問データ取得
  const questionData = await db
    .collection('questions')
    .doc(ctx.params.id)
    .get()
  const question = questionData.data()
  const html = genHtml(question)
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
  const tweetLimit = 280 - urlLength
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
  const tweetText = `${answerContent} https://askmakers.co/s/${question.id}`
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

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
