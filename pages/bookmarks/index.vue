<template>
  <div class="section column is-10 container">
    <div class="columns is-multiline">
      <div v-for="bookmark in bookmarks" :key="bookmark.id" class="column is-4">
        <div class="card radius-box">
          <div class="card-image">
            <figure class="image">
              <n-link :to="`/q/${bookmark.question.id}`">
                <img
                  :src="bookmark.question.image"
                  :alt="bookmark.question.text"
                />
              </n-link>
            </figure>
          </div>
          <div v-if="hasexistingAnswer" class="card-content">
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <n-link :to="`/u/${bookmark.user.username}`">
                    <img
                      :src="bookmark.user.picture"
                      :alt="bookmark.user.customName"
                      class="is-rounded"
                    />
                  </n-link>
                </figure>
              </div>
              <div class="media-content">
                <n-link :to="`/u/${bookmark.user.username}`">
                  <p class="title is-4">
                    {{ bookmark.user.customName }}
                  </p>
                  <!-- <p class="subtitle is-6">@johnsmith</p> -->
                </n-link>
              </div>
            </div>
            <div class="content">
              <p id="answer-text" class="is-size-5">
                {{ bookmark.answer.content }}
              </p>
              <time
                class="is-size-7 has-text-grey"
                :datetime="
                  $moment.unix(bookmark.answer.created).format('YYYY-MM-DD')
                "
              >
                {{
                  $moment
                    .unix(bookmark.answer.created)
                    .format('YYYY/MM/DD H:mm')
                }}
              </time>
            </div>
            <!-- <div>
              <a v-if="isBookmarked === true" @click.prevent="unbookmark()">
                <span class="icon is-medium">
                  <i class="fas fa-bookmark fa-lg"></i>
                </span>
              </a>
              <a v-else @click.prevent="bookmark(question.id)">
                <span class="icon is-medium">
                  <i class="far fa-bookmark fa-lg"></i>
                </span>
              </a>
            </div> -->
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
  name: 'UBookmarksId',
  data() {
    return {
      bookmarks: [],
      hasexistingAnswer: true
    }
  },
  head() {
    return {
      meta: [{ hid: 'robots', name: 'robots', content: 'noindex' }]
    }
  },
  async created() {
    const bookmarksData = await firestore
      .collection('bookmarks')
      .where('userId', '==', this.$store.getters.getUserInfo.uid)
      .get()
    this.bookmarks = await Promise.all(
      bookmarksData.docs.map(async (doc) => {
        const bookmark = doc.data()
        const [answerData, questionData, userData] = await Promise.all([
          // 答え取得
          firestore
            .collection('answers')
            .doc(bookmark.answerId)
            .get(),
          // 質問取得
          firestore
            .collection('questions')
            .doc(bookmark.questionId)
            .get(),
          // 回答者取得
          firestore
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
  }
}
</script>

<style lang="scss" scoped></style>
