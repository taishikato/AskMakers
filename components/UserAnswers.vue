<template>
  <div id="user-answers">
    <div v-if="isLoading" class="column is-12">
      <div class="bg-white" style="padding: 15px">
        <facebook-loader />
      </div>
    </div>
    <div
      v-if="isLoading === false && answeredQuestions.length === 0"
      class="columns is-multiline"
    >
      <div class="column is-12">
        No answers yet
      </div>
    </div>
    <div
      v-if="isLoading === false && answeredQuestions.length > 0"
      class="columns is-multiline"
    >
      <div
        v-for="answer in answeredQuestions"
        :key="answer.id"
        class="column is-6"
      >
        <answer-box
          :answer="answer"
          :answer-id="answer.answer.id"
          :question-id="answer.question.id"
          :show-question="true"
          :show-answer="true"
          :simple-mode="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { FacebookLoader } from 'vue-content-loader'
import AnswerBox from '~/components/AnswerBox'
import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const db = firebase.firestore()

export default {
  name: 'UserAnswers',
  components: { AnswerBox, FacebookLoader },
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isLoading: true,
      answeredQuestions: []
    }
  },
  async created() {
    // 回答済み回答習得
    const answerData = await db
      .collection('answers')
      .where('answerUserId', '==', this.user.uid)
      .orderBy('created', 'desc')
      .get()
    if (answerData.size === 0) {
      this.isLoading = false
      return
    }
    this.answeredQuestions = await Promise.all(
      answerData.docs.map(async (doc) => {
        const answer = doc.data()
        const questionData = await db
          .collection('questions')
          .doc(answer.questionId)
          .get()
        return {
          answer,
          question: questionData.data(),
          user: this.user
        }
      })
    )
    this.isLoading = false
  }
}
</script>
