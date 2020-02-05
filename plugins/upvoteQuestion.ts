import uuid from 'uuid/v4'
import getUnixTime from './getUnixTime'

const upvoteQuestion = (db, loginUser, question) => {
  const id = uuid().split('-').join('')
  return db
    .collection('questionUpvotes')
    .doc(id)
    .set({
      id,
      userId: loginUser.uid,
      questionId: question.id,
      created: getUnixTime(),
    })
}

  export default upvoteQuestion
