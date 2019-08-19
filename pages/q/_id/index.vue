<template>
  <div id="users-id" class="section column is-9 container">
    <div class="columns">
      <div class="column is-8 container">
        <div id="question-img" class="bg-white radius-box">
          <img :src="question.image" />

          <div v-if="hasexistingAnswer" id="answer-user-wrapper">
            <div class="flex-container flex-center">
              <n-link :to="`/u/${existingAnswerUser.uid}`">
                <img
                  :src="existingAnswerUser.picture"
                  class="is-rounded"
                  width="50px"
                  height="50px"
                />
              </n-link>
              <p class="is-size-5 weight-800 answer-user-name">
                <n-link :to="`/u/${existingAnswerUser.uid}`">
                  {{ existingAnswerUser.customName }}
                </n-link>
              </p>
            </div>
            <p id="answer-text" class="is-size-5">
              {{ existingAnswer.content }}
            </p>
          </div>
        </div>

        <div
          v-if="question.toUserId === $store.getters.getUserInfo.uid"
          id="answer-wrapper"
          class="field"
        >
          <div
            v-if="
              question.toUserId === $store.getters.getUserInfo.uid &&
                hasexistingAnswer === false
            "
            class="control"
          >
            <textarea v-model="answer" class="textarea"></textarea>
          </div>
        </div>
        <div
          v-if="
            question.toUserId === $store.getters.getUserInfo.uid &&
              hasexistingAnswer === false
          "
          id="answer-btn"
          class="field"
        >
          <div class="control has-text-centered">
            <button
              v-if="isSubmitting"
              class="button is-success is-loading is-rounded is-medium"
              disabled
            >
              Answer
            </button>
            <button
              v-else
              class="button is-success is-rounded is-medium"
              :disabled="countAnswer === 0"
              @click.prevent="answerQuestion"
            >
              Answer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import uuid from 'uuid/v4'
import getUnixTime from '~/plugins/getUnixTime'
import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const firestore = firebase.firestore()

export default {
  name: 'QId',
  data() {
    return {
      question: {},
      qId: '',
      answer: '',
      isSubmitting: false,
      existingAnswer: {},
      hasexistingAnswer: false,
      existingAnswerUser: {}
    }
  },
  computed: {
    countAnswer() {
      return this.answer.length
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
    this.question = questionData.data()

    // 回答データがあるか確認
    // あれば表示
    const answerData = await firestore
      .collection('answers')
      .where('questionId', '==', this.question.id)
      .get()
    if (answerData.empty === true) {
      return true
    }
    this.hasexistingAnswer = true
    this.existingAnswer = answerData.docs[0].data()
    const existingAnswerUserData = await firestore
      .collection('publicUsers')
      .doc(this.existingAnswer.answerUserId)
      .get()
    this.existingAnswerUser = existingAnswerUserData.data()
  },
  methods: {
    async answerQuestion() {
      this.isSubmitting = true
      const id = uuid()
        .split('-')
        .join('')
      try {
        await firestore
          .collection('answers')
          .doc(id)
          .set({
            id,
            questionId: this.qId,
            answerUserId: this.$store.getters.getUserInfo.uid,
            created: getUnixTime(),
            content: this.answer
          })
        try {
          await this.$axios.get(`https://askmakers.co/tweet/${id}`)
        } catch (err) {
          console.log(err)
        }
        this.answer = ''
        this.$toast.open({
          message: 'Successfuly submitted',
          type: 'is-success',
          duration: 4000
        })
        this.$router.push(`/a/${id}?answered=true`)
      } catch (err) {
        this.$toast.open({
          message: 'Something went wrong...Please try again',
          type: 'is-danger',
          duration: 4000
        })
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#question-img {
  padding: 10px;
  #answer-user-wrapper {
    margin-top: 10px;
    padding: 5px;
    #answer-text {
      margin-top: 10px;
    }
    .answer-user-name {
      margin-left: 10px;
    }
  }
}

#answer-wrapper {
  margin-top: 20px;
}

#answer-btn {
  margin-top: 10px;
}
</style>
