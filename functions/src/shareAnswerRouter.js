const shareAnswerRouter = async (db, answerId) => {
  // Get the answer data
  const answerData = await db
    .collection('answers')
    .doc(answerId)
    .get()
  const answer = answerData.data()

  // Get the question data
  const questionData = await db
    .collection('questions')
    .doc(answer.questionId)
    .get()
  const question = questionData.data()

  // Return HTML
  const html = genHtml(answer, question)
  return html
}

const site_name = 'AskMakers'
const title = 'AskMakers'
const meta_keywords = [
  'Indie makers, indie hackers, personal project, quora, question'
]
const fb_appid = ''
const tw_site = ''
const tw_creator = ''

const genHtml = (answer, question) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Answer on ${title}</title>
    <meta name="description" content="${answer.content}">
    <meta name="keywords" content="${meta_keywords.join(',')}">
    <meta property="og:locale" content="en_CA">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://askmakers.co/a/${answer.id}">
    <meta property="og:title" content="Answer on ${title}">
    <meta property="og:site_name" content="Answer on ${site_name}">
    <meta property="og:description" content="${answer.content}">
    <meta property="og:image" content="${question.image}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="fb:app_id" content="${fb_appid}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Answer on ${title}">
    <meta name="twitter:description" content="${answer.content}">
    <meta name="twitter:image" content="${question.image}">
    <meta name="twitter:site" content="${tw_site}">
    <meta name="twitter:creator" content="${tw_creator}">
  </head>
  <body>
    <script>
      location.href = '/a/${answer.id}';
    </script>
  </body>
</html>
`

module.exports = shareAnswerRouter
