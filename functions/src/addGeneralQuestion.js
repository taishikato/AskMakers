const addGeneralQuestion = async (db, mg, snap) => {
  // ユーザー全員分のメアド取得
  const userData = await db.collection('secretUsers').get()
  // メアド抽出
  const mailAdressArray = []
  userData.docs.forEach((doc) => {
    const user = doc.data()
    if (
      user.email !== undefined &&
      user.isEmailNewGeneralQuestionNotification !== false
    ) {
      mailAdressArray.push(user.email)
    }
  })
  // メール送信
  const question = snap.data()
  mailAdressArray.forEach(async (email) => {
    const data = {
      from: 'AskMakers <info@mail.askmakers.co>',
      to: [email],
      subject: 'New question alert 😺',
      text: `New question is just posted! Please check it out! https://askmakers.co/q/${question.id}`,
      html: `<p>New question is just posted!<br />Please check it out!</p>
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
  })
}

module.exports = addGeneralQuestion
