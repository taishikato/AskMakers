<template>
  <div v-if="questions.length > 0" id="questions-for-me-card">
    <p class="title weight-800 is-4">The questions for you</p>
    <div class="columns is-multiline">
      <div v-for="question in questions" :key="question.id" class="column is-4">
        <div id="accepted-questions-wrapper" class="card radius-box">
          <div class="card-image">
            <figure class="image">
              <n-link :to="`/q/${question.id}`">
                <img :src="question.image" :alt="question.text" />
              </n-link>
            </figure>
          </div>
          <div class="card-content">
            <div class="content">
              <div class="has-text-centered">
                <n-link
                  :to="`/q/${question.id}`"
                  class="button is-success is-rounded is-outlined weight-700"
                >
                  Answer this question
                </n-link>
              </div>
              <time
                class="is-size-7 has-text-grey"
                :datetime="$moment.unix(question.created).format('YYYY-MM-DD')"
              >
                {{ $moment.unix(question.created).format('YYYY/MM/DD H:mm') }}
              </time>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const firestore = firebase.firestore()

export default {
  name: 'QuestionsForMeCard',
  data() {
    return {
      questions: []
    }
  },
  async created() {
    if (this.$store.getters.getLoginStatus === false) {
      return
    }
    const questionData = await firestore
      .collection('questions')
      .where('toUserId', '==', this.$store.getters.getUserInfo.uid)
      .orderBy('created', 'desc')
      .get()
    const questionsArray = questionData.docs.map((doc) => {
      return doc.data()
    })
    this.questions = questionsArray.filter((question) => {
      return question.isAnswered !== true
    })
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
</style>
