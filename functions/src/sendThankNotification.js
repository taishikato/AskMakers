/**
 * *  thank = {
 * *    answerId,
 * *    answerUserId,
 * *    created,
 * *    senderId
 * *  }
 */
const sendThankNotification = async (db, mg, snap) => {
  const thank = snap.data()
  const [
    senderData,
    answerUserSecretData,
    answerUserPublicData,
    answerData
  ] = await Promise.all([
    // 送り主
    db
      .collection('publicUsers')
      .doc(thank.senderId)
      .get(),
    // 送られたユーザー
    db
      .collection('secretUsers')
      .doc(thank.answerUserId)
      .get(),
    db
      .collection('publicUsers')
      .doc(thank.answerUserId)
      .get(),
    // 回答
    db
      .collection('answers')
      .doc(thank.answerId)
      .get()
  ])
  const sender = senderData.data()
  const answerUserSecret = answerUserSecretData.data()
  const answerUserPublic = answerUserPublicData.data()
  const answer = answerData.data()
  // メール送信
  if (answerUserSecret.email === undefined || answerUserSecret.email === '') {
    console.log('The answer user does not have an email')
    return
  }
  const data = {
    from: 'AskMakers <info@mail.askmakers.co>',
    to: [answerUserSecret.email],
    bcc: ['taishi.k0903@gmail.com'],
    subject: 'You got a new thank 🙏',
    text: `You got a new thank for your answer 🙏`,
    html: `<p>Hi, ${answerUserPublic.customName}!</p>
    <p>You got a new thank for your answer from <img src="${sender.picture}" width="30px" style="border-radius: 50%;vertical-align:middle;" /><a href="https://askmakers.co/u/${sender.uid}" style="margin-left:5px;">${sender.customName}</a>.
    </p>
    <div>
      <p>✍️Your answer</p>
      ${answer.content}<br />
      <a href="https://askmakers.co/a/${answer.id}">https://askmakers.co/a/${answer.id}</a>
    </div>
    <p style="font-size: 20px;">Big thank you for your answering and contributing to the community!!</p>
    <p>
      <a href="https://askmakers.co/u/taishikat0">
        Taishi
      </a>
    </p>`
  }
  const res = await mg.messages().send(data, (err, body) => {
    console.log(body)
    if (err) {
      console.error(err)
    }
  })
}

module.exports = sendThankNotification
