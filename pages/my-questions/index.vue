<template>
  <div class="section column is-10 container">
    <div v-show="isLoading" class="has-text-centered">
      <span class="icon is-large">
        <i class="fas fa-spinner fa-3x fa-spin"></i>
      </span>
    </div>
    <div
      v-show="questions.length === 0 && isLoading === false"
      class="has-text-centered"
    >
      <img src="~/assets/img/thinking.svg" width="100px" />
      <p id="no-message" class="is-size-4 has-text-weight-semibold">
        You have posted no question yet!
      </p>
    </div>
    <div
      v-show="questions.length > 0 && isLoading === false"
      class="columns is-multiline"
    >
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
  data() {
    return {
      questions: [],
      isLoading: true
    }
  },
  async created() {
    const questionsData = await firestore
      .collection('questions')
      .where('fromUserId', '==', this.$store.getters.getUserInfo.uid)
      .orderBy('created', 'desc')
      .get()
    this.questions = questionsData.docs.map((doc) => {
      return doc.data()
    })
    this.isLoading = false
  }
}
</script>

<style lang="scss" scoped>
#no-message {
  margin-top: 10px;
}
</style>
