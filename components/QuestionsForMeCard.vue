<template>
  <div
    v-if="questions.length > 0 && $store.getters.getLoginStatus"
    id="questions-for-me-card"
  >
    <p class="title is-5">The questions for you</p>
    <div v-show="isLoading === false" class="columns is-multiline">
      <div
        v-for="question in questions"
        :key="question.id"
        class="column is-12"
      >
        <question-with-answer-and-pass-button
          :question="question"
          :has-pass-btn="true"
        />
      </div>
    </div>
    <div v-show="isLoading === true" class="columns">
      <div class="column is-12">
        <div class="bg-white" style="padding: 15px">
          <facebook-loader />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FacebookLoader } from 'vue-content-loader'
import QuestionWithAnswerAndPassButton from '~/components/QuestionWithAnswerAndPassButton'
import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const firestore = firebase.firestore()

export default {
  name: 'QuestionsForMeCard',
  components: {
    FacebookLoader,
    QuestionWithAnswerAndPassButton
  },
  data() {
    return {
      questions: [],
      isLoading: false
    }
  },
  async created() {
    if (this.$store.getters.getLoginStatus === false) {
      return
    }
    this.isLoading = true
    const questionData = await firestore
      .collection('questions')
      .where('toUserId', '==', this.$store.getters.getUserInfo.uid)
      .orderBy('created', 'desc')
      .get()
    const questionsArray = questionData.docs.map((doc) => {
      return doc.data()
    })
    this.questions = questionsArray.filter((question) => {
      return question.isAnswered !== true && question.isPassed !== true
    })
    this.isLoading = false
  }
}
</script>

<style lang="scss" scoped>
#questions-for-me-card {
  margin-bottom: 20px;
}

.card-header {
  background-color: hsl(0, 0%, 96%);
}
time {
  display: block;
  margin-top: 10px;
}

#title-p {
  margin-bottom: 1.5rem;
}
</style>
