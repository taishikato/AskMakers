const sendAnswerNotification = async (db, mg, snap) => {
  const answer = snap.data()
  // 質問情報取得
  const questionData = await db
    .collection('questions')
    .doc(answer.questionId)
    .get()
  const question = questionData.data()
  // 質問者のユーザー情報取得
  const userData = await db
    .collection('secretUsers')
    .doc(question.fromUserId)
    .get()
  const user = userData.data()
  // メール送信
  if (user.email === undefined || user.email === '') {
    console.log('The user does not have an email')
    return
  }
  const data = {
    from: 'AskMakers <info@mail.askmakers.co>',
    to: [user.email],
    subject: 'You got a new answer 😺',
    text: `You got a new answern 👍 Please check it out! https://askmakers.co/q/${question.id}`,
    html: `<p><strong>You got a new answer 👍</strong><br />Please check it out!</p>
    <p>
      ${question.text}<br />
      <a href="https://askmakers.co/q/${question.id}">https://askmakers.co/q/${question.id}</a>
    </p>`
  }
  const res = await mg.messages().send(data, (err, body) => {
    console.log(body)
    if (err) {
      console.error(err)
    }
  })
}

module.exports = sendAnswerNotification
