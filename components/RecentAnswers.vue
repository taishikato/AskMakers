<template>
  <div id="recent-answers">
    <p class="title weight-800 is-4">Recent Asnwers</p>
    <div v-show="isLoading === false" class="columns is-multiline">
      <div
        v-for="answer in answers"
        :key="answer.answer.id"
        class="column is-4"
      >
        <div class="card radius-box">
          <div class="card-image">
            <n-link :to="`/q/${answer.question.id}`">
              <figure class="image">
                <img :src="answer.question.image" :alt="answer.question.text" />
              </figure>
            </n-link>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <n-link :to="`/u/${answer.user.username}`">
                    <img
                      :src="answer.user.picture"
                      alt="existingAnswerUser.customName"
                      class="is-rounded"
                    />
                  </n-link>
                </figure>
              </div>
              <div class="media-content">
                <n-link :to="`/u/${answer.user.username}`">
                  <p class="title is-4">
                    {{ answer.user.customName }}
                  </p>
                </n-link>
              </div>
            </div>
            <div class="content">
              <p id="answer-text" class="is-size-5">
                {{
                  answer.answer.content.length > 140
                    ? `${answer.answer.content.substr(0, 140)}…`
                    : answer.answer.content
                }}
              </p>
            </div>
            <!-- Footer -->
            <div class="flex-container">
              <!-- <div v-if="$store.getters.getLoginStatus">
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
              <div>
                <a
                  :href="
                    `
https://twitter.com/share?url=https://askmakers.co/s/${answer.question.id}&text=Answer by @${answer.user.username} ${answer.answer.content}
`
                  "
                  class="twitter-share"
                  target="_blank"
                >
                  <span class="icon is-medium">
                    <i class="fab fa-twitter fa-lg"></i>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="isLoading === true" class="columns">
      <div class="column is-4">
        <content-loader />
      </div>
      <div class="column is-4">
        <content-loader />
      </div>
      <div class="column is-4">
        <content-loader />
      </div>
    </div>
  </div>
</template>

<script>
import sanitizeHTML from 'sanitize-html'
import { ContentLoader } from 'vue-content-loader'
import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const firestore = firebase.firestore()

export default {
  name: 'RecentAnswers',
  components: {
    ContentLoader
  },
  data() {
    return {
      isLoading: true,
      answers: []
    }
  },
  async created() {
    const answersData = await firestore
      .collection('answers')
      .orderBy('created', 'desc')
      .get()
    this.answers = await Promise.all(
      answersData.docs.map(async (doc) => {
        const answer = doc.data()
        const questionData = await firestore
          .collection('questions')
          .doc(answer.questionId)
          .get()
        const question = questionData.data()
        const userData = await firestore
          .collection('publicUsers')
          .doc(question.toUserId)
          .get()
        return {
          answer,
          question,
          user: userData.data()
        }
      })
    )
    this.isLoading = false
  },
  methods: {
    sanitizeHtml(text) {
      return sanitizeHTML(text)
    }
  }
}
</script>
