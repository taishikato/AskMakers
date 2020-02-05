import getUnixTime from './getUnixTime'

const postAnswer = (db, loginUser, question, id, answerValue) => {
  return db
    .collection('answers')
    .doc(id)
    .set({
      id,
      answerUserId: loginUser.uid,
      content: answerValue,
      created: getUnixTime(),
      questionId: question.id
    })
}

export default postAnswer
