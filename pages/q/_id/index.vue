<template>
  <div id="users-id" class="section column is-9 container">
    <div class="columns">
      <div class="column is-8 container">
        <div id="question-img" class="bg-white radius-box">
          <img :src="question.image" />
        </div>

        <div
          v-if="question.toUserId === $store.getters.getUserInfo.uid"
          id="answer-wrapper"
          class="field"
        >
          <div
            v-if="question.toUserId === $store.getters.getUserInfo.uid"
            class="control"
          >
            <textarea v-model="answer" class="textarea"></textarea>
          </div>
        </div>
        <div
          v-if="question.toUserId === $store.getters.getUserInfo.uid"
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
      isSubmitting: false
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
    const questionData = await firestore
      .collection('questions')
      .doc(this.qId)
      .get()
    this.question = questionData.data()
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
        // TODO あとで本番ドメインに書き換え
        try {
          await this.$axios.get(`http://localhost:5000/tweet/${id}`)
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
}

#answer-wrapper {
  margin-top: 20px;
}

#answer-btn {
  margin-top: 10px;
}
</style>
