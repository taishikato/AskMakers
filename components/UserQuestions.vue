<template>
  <div id="user-questions" class="columns is-multiline">
    <div v-for="question in questions" :key="question.id" class="column is-6">
      <question-box
        :question="question"
        :has-bookmark-feature="false"
        :simple-mode="false"
      />
    </div>
  </div>
</template>

<script>
import QuestionBox from '~/components/QuestionBox'
import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const db = firebase.firestore()

export default {
  name: 'UserQuestions',
  components: { QuestionBox },
  data() {
    return {
      questions: {}
    }
  },
  async created() {
    const questionsData = await db
      .collection('questions')
      .where('fromUserId', '==', this.$store.getters.getUserInfo.uid)
      .orderBy('created', 'desc')
      .get()
    this.questions = questionsData.docs.map((doc) => {
      return { question: doc.data() }
    })
  }
}
</script>
