<template>
  <div id="recent-answers">
    <p id="title-p">
      <span class="title is-5">
        Recent Questions
      </span>
    </p>
    <div v-show="isLoading === false" class="columns is-multiline">
      <div
        v-for="question in questions"
        :key="question.id"
        class="column is-12"
      >
        <question-with-answer-and-pass-button
          :question="question"
          :has-pass-btn="false"
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
import sanitizeHTML from 'sanitize-html'
import { FacebookLoader } from 'vue-content-loader'
import QuestionWithAnswerAndPassButton from '~/components/QuestionWithAnswerAndPassButton'
import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const firestore = firebase.firestore()

export default {
  name: 'RecentAnswers',
  components: {
    FacebookLoader,
    QuestionWithAnswerAndPassButton
  },
  data() {
    return {
      isLoading: true,
      questions: []
    }
  },
  async created() {
    const questionsData = await firestore
      .collection('questions')
      .where('isGeneral', '==', true)
      .orderBy('created', 'desc')
      .limit(5)
      .get()
    this.questions = await Promise.all(
      questionsData.docs.map((doc) => {
        return doc.data()
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

.question-box {
  background-color: white;
  border-radius: 3px;
  .question-text-link {
    &:hover {
      text-decoration: underline;
    }
  }
  .question-title {
    background-color: #fafafa;
    padding: 15px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }
  .footer-content {
    padding: 0 15px 15px;
  }
}
</style>
