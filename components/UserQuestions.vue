<template>
  <div id="user-questions">
    <div v-if="isLoading" class="column is-12">
      <div class="bg-white" style="padding: 15px">
        <facebook-loader />
      </div>
    </div>
    <div
      v-if="isLoading === false && questions.length === 0"
      class="columns is-multiline"
    >
      <div class="column is-12">
        No questions yet
      </div>
    </div>
    <div
      v-if="isLoading === false && questions.length > 0"
      class="columns is-multiline"
    >
      <div v-for="question in questions" :key="question.id" class="column is-6">
        <question-box
          :question="question"
          :has-bookmark-feature="false"
          :simple-mode="false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { FacebookLoader } from 'vue-content-loader'
import QuestionBox from '~/components/QuestionBox'
import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const db = firebase.firestore()

export default {
  name: 'UserQuestions',
  components: { QuestionBox, FacebookLoader },
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isLoading: true,
      questions: []
    }
  },
  async created() {
    const questionsData = await db
      .collection('questions')
      .where('fromUserId', '==', this.user.uid)
      .orderBy('created', 'desc')
      .get()
    if (questionsData.size === 0) {
      this.isLoading = false
      return
    }
    this.questions = questionsData.docs.map((doc) => {
      return { question: doc.data() }
    })
    this.isLoading = false
  }
}
</script>
