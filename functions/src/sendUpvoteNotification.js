const sendUpvoteNotification = async (db, mg, snap) => {
  const upvote = snap.data()
  const [
    senderData,
    answerUserSecretData,
    answerUserPublicData
  ] = await Promise.all([
    // 送り主
    db
      .collection('publicUsers')
      .doc(upvote.senderId)
      .get(),
    // 送られたユーザー
    db
      .collection('secretUsers')
      .doc(upvote.answerUserId)
      .get(),
    db
      .collection('publicUsers')
      .doc(upvote.answerUserId)
      .get()
  ])
  const sender = senderData.data()
  const answerUserSecret = answerUserSecretData.data()
  const answerUserPublic = answerUserPublicData.data()
  // メール送信
  if (answerUserSecret.email === undefined || answerUserSecret.email === '') {
    console.log('The answer user does not have an email')
    return
  }
  const data = {
    from: 'AskMakers <info@mail.askmakers.co>',
    to: [answerUserSecret.email],
    subject: 'You got a new upvote 🙏',
    text: `You got a new upvote for your answer 🙏`,
    html: `<p>Hi, ${answerUserPublic.customName}!</p>
    <p>
      <img src="${sender.picture}" width="30px" style="border-radius: 50%;vertical-align:middle;" /><a href="https://askmakers.co/u/${sender.uid}" style="margin-left:5px;">${sender.customName}</a> upvoted your answer!
    </p>
    <div>
      <p>✍️Your answer</p>
      <a href="https://askmakers.co/a/${upvote.answerId}">https://askmakers.co/a/${upvote.answerId}</a>
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

module.exports = sendUpvoteNotification
