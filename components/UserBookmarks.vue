<template>
  <div id="user-bookmarks">
    <div v-if="isLoading" class="column is-12">
      <div class="bg-white" style="padding: 15px">
        <facebook-loader />
      </div>
    </div>
    <div
      v-if="isLoading === false && bookmarks.length === 0"
      class="columns is-multiline"
    >
      <div class="column is-12">
        <p>No bookmark yet</p>
        <p>
          <n-link to="/all-answers" class="has-text-weight-semibold is-size-5">
            Explore answers
          </n-link>
        </p>
      </div>
    </div>
    <div
      v-if="isLoading === false && bookmarks.length > 0"
      class="columns is-multiline"
    >
      <div v-for="bookmark in bookmarks" :key="bookmark.id" class="column is-6">
        <answer-box
          :answer="bookmark"
          :answer-id="bookmark.answer.id"
          :question-id="bookmark.question.id"
          :show-question="true"
          :show-answer="true"
          :simple-mode="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { FacebookLoader } from 'vue-content-loader'
import AnswerBox from '~/components/AnswerBox'
import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const db = firebase.firestore()

export default {
  name: 'UserBookmarks',
  components: { AnswerBox, FacebookLoader },
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isLoading: true,
      bookmarks: []
    }
  },
  async created() {
    const bookmarksData = await db
      .collection('bookmarks')
      .where('userId', '==', this.user.uid)
      .get()
    if (bookmarksData.size === 0) {
      this.isLoading = false
      return
    }
    this.bookmarks = await Promise.all(
      bookmarksData.docs.map(async (doc) => {
        const bookmark = doc.data()
        const [answerData, questionData, userData] = await Promise.all([
          // 答え取得
          db
            .collection('answers')
            .doc(bookmark.answerId)
            .get(),
          // 質問取得
          db
            .collection('questions')
            .doc(bookmark.questionId)
            .get(),
          // 回答者取得
          db
            .collection('publicUsers')
            .doc(bookmark.answerUserId)
            .get()
        ])
        const answer = answerData.data()
        const question = questionData.data()
        const user = userData.data()

        return {
          answer,
          question,
          user
        }
      })
    )
    this.isLoading = false
  }
}
</script>
