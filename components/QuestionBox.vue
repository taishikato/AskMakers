<template>
  <div class="question-box">
    <!-- Login Modal -->
    <b-modal :active.sync="isModalActive" :width="modalWidth">
      <div id="login-modal" class="has-text-centered">
        <h3 class="title weight-900 sp-font">Log In / Sign Up</h3>
        <button
          class="button twitter color-white weight-900 sp-font"
          @click.prevent="twitterSignin"
        >
          Twitter
        </button>
        We'll never post to your Twitter account without your permission.
      </div>
    </b-modal>
    <!-- Login Modal End -->
    <p class="content is-size-5 question-title has-text-weight-medium">
      <n-link
        :to="`/q/${question.question.id}`"
        class="question-text-link has-text-black-bis"
      >
        {{ question.question.text }}
      </n-link>
    </p>
    <div v-if="question.answer !== undefined" class="answer-content">
      <div class="flex-container flex-center">
        <p>✍️ The answer by</p>
        <n-link :to="`/u/${question.user.username}`" class="profile-pic-link">
          <img
            :src="question.user.picture"
            alt="existingAnswerUser.customName"
            class="is-rounded"
            width="35"
          />
        </n-link>
        <n-link
          :to="`/u/${question.user.username}`"
          class="profile-name-link has-text-grey-darker has-text-weight-semibold"
        >
          {{ question.user.customName }}
        </n-link>
      </div>
      <div class="content">
        <p v-if="simpleMode === true" id="answer-text" class="is-size-6">
          <n-link :to="`/a/${question.answer.id}`" class="has-text-grey-darker">
            {{
              question.answer.content.length > 140
                ? `${question.answer.content.substr(0, 140)}…`
                : question.answer.content
            }}
          </n-link>
        </p>
        <div v-else>
          <p
            id="answer-text"
            class="is-size-6"
            v-html="
              sanitizeHtml(question.answer.content).replace(/\n/g, '<br/>')
            "
          ></p>
          <time
            class="is-size-7 has-text-grey"
            :datetime="
              $moment.unix(question.answer.created).format('YYYY-MM-DD')
            "
          >
            {{
              $moment.unix(question.answer.created).format('YYYY/MM/DD H:mm')
            }}
          </time>
        </div>
      </div>
      <div class="footer-container flex-container">
        <a
          :href="
            `
https://twitter.com/share?url=https://askmakers.co/s/${question.question.id}&text=Answer by @${question.user.username} ${question.answer.content}
`
          "
          class="twitter-share"
          target="_blank"
        >
          <span class="icon is-medium">
            <i class="fab fa-twitter fa-lg"></i>
          </span>
        </a>
        <a class="has-text-black-ter" @click.prevent="copy">
          <span class="icon is-medium">
            <i class="far fa-copy fa-lg"></i>
          </span>
        </a>
        <div v-if="hasBookmarkFeature">
          <a v-if="answerIsBookmarked === true" @click.prevent="unbookmark()">
            <span class="icon is-medium">
              <i class="fas fa-bookmark fa-lg"></i>
            </span>
          </a>
          <a v-else @click.prevent="bookmark(question.question.id)">
            <span class="icon is-medium">
              <i class="far fa-bookmark fa-lg"></i>
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sanitizeHTML from 'sanitize-html'
import uuid from 'uuid/v4'
import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const firestore = firebase.firestore()
const twitterProvider = new firebase.auth.TwitterAuthProvider()

const copyText = (string) => {
  const temp = document.createElement('div')
  temp.appendChild(document.createElement('pre')).textContent = string
  const s = temp.style
  s.position = 'fixed'
  s.left = '-100%'
  document.body.appendChild(temp)
  document.getSelection().selectAllChildren(temp)
  const result = document.execCommand('copy')
  document.body.removeChild(temp)
  // true なら実行できている falseなら失敗か対応していないか
  return result
}

export default {
  name: 'QuestionBox',
  props: {
    question: {
      type: Object,
      required: true
    },
    simpleMode: {
      type: Boolean,
      required: true,
      default: false
    },
    hasBookmarkFeature: {
      type: Boolean,
      required: true,
      default: false
    },
    isBookmarked: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isModalActive: false,
      modalWidth: '500px',
      answerIsBookmarked: false
    }
  },
  created() {
    this.answerIsBookmarked = this.isBookmarked
  },
  methods: {
    copy() {
      copyText(`https://askmakers.co/s/${this.question.question.id}`)
      this.$snackbar.open({
        duration: 3000,
        message: 'Copied successfully',
        type: 'is-success',
        position: 'is-top'
      })
    },
    sanitizeHtml(text) {
      return sanitizeHTML(text)
    },
    twitterSignin() {
      firebase.auth().signInWithRedirect(twitterProvider)
    },
    async bookmark(questionId) {
      if (this.$store.getters.getLoginStatus !== true) {
        this.isModalActive = true
        return
      }
      const bookmarkId = uuid()
        .split('-')
        .join('')
      try {
        await firestore
          .collection('bookmarks')
          .doc()
          .set({
            id: bookmarkId,
            questionId,
            answerId: this.question.answer.id,
            userId: this.$store.getters.getUserInfo.uid,
            answerUserId: this.question.user.uid
          })
        this.answerIsBookmarked = true
      } catch (err) {
        console.log(err)
      }
    },
    async unbookmark() {
      try {
        const bookmarkData = await firestore
          .collection('bookmarks')
          .where('answerId', '==', this.question.answer.id)
          .where('userId', '==', this.$store.getters.getUserInfo.uid)
          .get()
        await firestore
          .collection('bookmarks')
          .doc(bookmarkData.docs[0].id)
          .delete()
        this.answerIsBookmarked = false
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.question-box {
  background-color: white;
  border-radius: 3px;
  border-bottom: 2px solid #e8d5d5;
  .question-title {
    padding: 15px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    .question-text-link {
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .answer-content {
    padding: 0 15px 15px;
  }
  .profile-pic-link {
    margin-left: 10px;
  }
  .profile-name-link {
    margin-left: 5px;
    &:hover {
      text-decoration: underline;
    }
  }
}

#login-modal {
  color: #ffffff;
  .title {
    color: #ffffff;
  }
  .button {
    width: 200px;
    display: block;
    margin: 10px auto;
  }
}

.twitter-share {
  color: #00aced;
}

#answer-text {
  a {
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
