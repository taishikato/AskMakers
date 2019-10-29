<template>
  <section class="section">
    <p class="title weight-800 is-4">All Answers</p>
    <div class="columns is-multiline">
      <div
        v-for="answer in answers"
        :key="answer.answer.id"
        class="column is-6"
      >
        <answer-box
          :answer="answer"
          :answer-id="answer.answer.id"
          :simple-mode="true"
        />
      </div>
    </div>
  </section>
</template>

<script>
import AnswerBox from '~/components/AnswerBox'
import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const firestore = firebase.firestore()

export default {
  name: 'UBookmarksId',
  components: {
    AnswerBox
  },
  async asyncData({ error }) {
    try {
      const answersData = await firestore
        .collection('answers')
        .orderBy('created', 'desc')
        .get()
      const answers = await Promise.all(
        answersData.docs.map(async (doc) => {
          const answer = doc.data()
          const questionData = await firestore
            .collection('questions')
            .doc(answer.questionId)
            .get()
          const question = questionData.data()
          const userData = await firestore
            .collection('publicUsers')
            .doc(answer.answerUserId)
            .get()
          return {
            answer,
            question,
            user: userData.data()
          }
        })
      )
      return { answers }
    } catch (err) {
      error({ statusCode: 500, message: 'An error occured. Please try again.' })
    }
  }
}
</script>

<style lang="scss" scoped></style>
