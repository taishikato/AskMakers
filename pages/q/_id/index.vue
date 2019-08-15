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
          <div class="control">
            <textarea class="textarea"></textarea>
          </div>
        </div>
        <div id="answer-btn" class="field">
          <div class="control has-text-centered">
            <button class="button is-success is-rounded is-medium">
              Answer
            </button>
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
  name: 'QId',
  data() {
    return {
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
    const qId = this.$route.params.id
    const questionData = await firestore
      .collection('questions')
      .doc(qId)
      .get()
    this.question = questionData.data()
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
