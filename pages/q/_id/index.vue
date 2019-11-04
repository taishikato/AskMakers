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
  head() {
    return {
      title: `${this.question.question.text} - AskMakers`,
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: `${this.question.question.text} - AskMakers`
        }
      ]
    }
  },
  data() {
    return {
      isGeneralQuestion: null,
      question: {
        question: {}
      }
    }
  },
  async asyncData({ params, error }) {
    const slug = params.id
    const qId = slug
    const question = {}
    const questionSlugData = await firestore
      .collection('questions')
      .where('slug', '==', slug)
      .get()
    if (questionSlugData.size > 0) {
      question.question = questionSlugData.docs[0].data()
    } else {
      // 質問データ習得
      const questionData = await firestore
        .collection('questions')
        .doc(qId)
        .get()
      question.question = questionData.data()
    }
    if (question.question === undefined) {
      return error({
        statusCode: 404,
        message: 'This page could not be found'
      })
    }
    let isGeneralQuestion = false
    if (question.question.isGeneral === true) {
      isGeneralQuestion = true
    }
    return {
      question,
      isGeneralQuestion
    }
  },
  validate({ params }) {
    if (params.id === undefined) {
      return false
    }
    return true
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
