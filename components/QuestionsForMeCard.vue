<template>
  <div
    v-if="questions.length > 0 && $store.getters.getLoginStatus"
    id="questions-for-me-card"
  >
    <p class="title weight-800 is-4">The questions for you</p>
    <div v-show="isLoading === false" class="columns is-multiline">
      <div
        v-for="question in questions"
        :key="question.id"
        class="column is-12"
      >
        <div class="question-box">
          <p class="content is-size-4 question-title">
            <n-link
              :to="`/q/${question.id}`"
              class="question-text-link has-text-black-bis"
            >
              {{ question.text }}
            </n-link>
          </p>
          <div class="footer-content">
            <n-link
              :to="`/q/${question.id}`"
              class="button is-white is-rounded"
            >
              <span class="icon">
                <i class="fas fa-pen"></i>
              </span>
              <span>
                Answer
              </span>
            </n-link>
          </div>
        </div>
      </div>
    </div>
    <div v-show="isLoading === true" class="columns">
      <div class="column is-12">
        <div class="bg-white" style="padding: 15px">
          <facebook-loader />
        </div>
      </div>
    </div>
    <!-- <div class="columns is-multiline">
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
    </div> -->
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
      return question.isAnswered !== true
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
