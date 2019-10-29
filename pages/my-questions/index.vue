<template>
  <div class="section column is-10 container">
    <div v-show="questions.length === 0" class="has-text-centered">
      <img src="~/assets/img/thinking.svg" width="100px" />
      <p id="no-message" class="is-size-4 has-text-weight-semibold">
        You have posted no question yet!
      </p>
    </div>
    <div v-show="questions.length > 0" class="columns is-multiline">
      <div v-for="question in questions" :key="question.id" class="column is-4">
        <figure class="image">
          <n-link :to="`/q/${question.id}`">
            <img :src="question.image" :alt="question.text" />
          </n-link>
        </figure>
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
  name: 'MyQuestions',
  head() {
    return {
      meta: [{ hid: 'robots', name: 'robots', content: 'noindex' }]
    }
  },
  validate({ store }) {
    if (store.getters.getLoginStatus === false) {
      return false
    }
    return true
  },
  async asyncData({ store }) {
    const questionsData = await firestore
      .collection('questions')
      .where('fromUserId', '==', store.getters.getUserInfo.uid)
      .orderBy('created', 'desc')
      .get()
    if (questionsData.empty === true) {
      return { questions: [] }
    }
    const questions = questionsData.docs.map((doc) => {
      return doc.data()
    })
    return { questions }
  }
}
</script>

<style lang="scss" scoped>
#no-message {
  margin-top: 10px;
}
</style>
