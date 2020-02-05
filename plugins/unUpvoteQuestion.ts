const handleUnUpvoteQuestion = async (db, loginUser, question) => {
  const upvoteData = await db
    .collection('questionUpvotes')
    .where('userId', '==', loginUser.uid)
    .where('questionId', '==', question.id)
    .get()
  return db
    .collection('questionUpvotes')
    .doc(upvoteData.docs[0].id)
    .delete()
}

export default handleUnUpvoteQuestion
