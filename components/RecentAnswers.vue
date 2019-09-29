<template>
  <div id="recent-answers">
    <p id="title-p">
      <span class="title weight-800 is-4">
        Recent Answers
      </span>
    </p>
    <div v-show="isLoading === false" class="columns is-multiline">
      <div
        v-for="answer in answers"
        :key="answer.answer.id"
        class="column is-12"
      >
        <question-box
          :question="answer"
          :simpleMode="true"
          :hasBookmarkFeature="false"
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
    <n-link
      id="see-all-link"
      to="/all-answers"
      class="button is-dark is-rounded"
    >
      See All
    </n-link>
  </div>
</template>

<script>
import sanitizeHTML from 'sanitize-html'
import { FacebookLoader } from 'vue-content-loader'
import QuestionBox from '~/components/QuestionBox'
import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const firestore = firebase.firestore()

export default {
  name: 'RecentAnswers',
  components: {
    FacebookLoader,
    QuestionBox
  },
  data() {
    return {
      isLoading: true,
      answers: []
    }
  },
  async created() {
    const answersData = await firestore
      .collection('answers')
      .where('created', '<', 1569717736)
      .orderBy('created', 'desc')
      .limit(5)
      .get()
    this.answers = await Promise.all(
      answersData.docs.map(async (doc) => {
        const answer = doc.data()
        const questionData = await firestore
          .collection('questions')
          .doc(answer.questionId)
          .get()
        const question = questionData.data()
        const userData = await firestore
          .collection('publicUsers')
          .doc(question.toUserId)
          .get()
        return {
          answer,
          question,
          user: userData.data()
        }
      })
    )
    this.isLoading = false
  },
  methods: {
    sanitizeHtml(text) {
      return sanitizeHTML(text)
    }
  }
}
</script>

<style lang="scss" scoped>
#title-p {
  margin-bottom: 1.5rem;
}
#see-all-link {
  margin-bottom: 2rem;
}
</style>
