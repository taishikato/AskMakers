<template>
  <div id="question-id" class="section column is-10 container">
    <general-question-detail v-if="isGeneralQuestion === true" />
    <question-detail v-if="isGeneralQuestion === false" />
  </div>
</template>

<script>
import QuestionDetail from '~/components/QuestionDetail'
import GeneralQuestionDetail from '~/components/GeneralQuestionDetail'
import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const firestore = firebase.firestore()

export default {
  name: 'QId',
  components: {
    QuestionDetail,
    GeneralQuestionDetail
  },
  data() {
    return {
      isGeneralQuestion: null,
      question: {}
    }
  },
  validate({ params }) {
    if (params.id === undefined) {
      return false
    }
    return true
  },
  async created() {
    this.qId = this.$route.params.id
    // 質問データ習得
    const questionData = await firestore
      .collection('questions')
      .doc(this.qId)
      .get()
    // 質問が存在しない場合は404
    if (questionData.exists !== true) {
      return this.$nuxt.error({
        statusCode: 404,
        message: 'This page could not be found'
      })
    }
    this.question.question = questionData.data()

    if (this.question.question.isGeneral === true) {
      this.isGeneralQuestion = true
    } else {
      this.isGeneralQuestion = false
    }
  }
}
</script>

<style lang="scss" scoped>
@media only screen and (max-width: 768px) {
  /* For mobile phones: */
  .section {
    padding: 3rem 0.75rem;
  }
}
</style>
