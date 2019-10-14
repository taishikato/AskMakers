<template>
  <div class="answer-box bg-white">
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
    <p v-if="showQuestion" class="content is-size-4 question-title">
      <n-link
        :to="`/q/${answer.question.id}`"
        class="question-text-link has-text-black-bis"
      >
        {{ answer.question.text }}
      </n-link>
    </p>
    <div class="answer-content" :class="{ paddingTop: showQuestion === false }">
      <div class="flex-container flex-center author-section">
        <p>✍️ by</p>
        <n-link :to="`/u/${answer.user.username}`" class="profile-pic-link">
          <img
            :src="answer.user.picture"
            :alt="answer.user.customName"
            class="is-rounded"
            width="35"
          />
        </n-link>
        <n-link
          :to="`/u/${answer.user.username}`"
          class="profile-name-link has-text-grey-darker has-text-weight-semibold"
        >
          {{ answer.user.customName }}
        </n-link>
      </div>
      <div class="content">
        <p v-if="simpleMode" id="answer-text" class="is-size-5">
          {{
            answer.answer.content.length > 140
              ? `${answer.answer.content.substr(0, 140)}…`
              : answer.answer.content
          }}
        </p>
        <p
          v-else
          id="answer-text"
          class="is-size-5"
          v-html="sanitizeHtml(answer.answer.content).replace(/\n/g, '<br/>')"
        ></p>
        <n-link :to="`/a/${answer.answer.id}`">
          <time
            class="is-size-7 has-text-grey"
            :datetime="$moment.unix(answer.answer.created).format('YYYY-MM-DD')"
          >
            {{ $moment.unix(answer.answer.created).format('YYYY/MM/DD H:mm') }}
          </time>
        </n-link>
      </div>
      <!-- Begin footer content -->
      <div class="footer-container flex-container">
        <a
          :href="
            `
  https://twitter.com/share?url=https://askmakers.co/sa/${answerId}&text=Answer by @${answer.user.username} ${answer.answer.content}
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
        <div>
          <a v-if="isBookmarked === true" @click.prevent="unbookmark()">
            <span class="icon is-medium">
              <i class="fas fa-bookmark fa-lg"></i>
            </span>
          </a>
          <a v-else @click.prevent="bookmark(questionId)">
            <span class="icon is-medium">
              <i class="far fa-bookmark fa-lg"></i>
            </span>
          </a>
        </div>
        <b-dropdown aria-role="list">
          <a class="button is-white is-rounded" slot="trigger">
            <span class="icon">
              <i class="fas fa-ellipsis-h"></i>
            </span>
          </a>
          <div class="dropdown-item">
            <span v-if="isThaked">
              Thanked
            </span>
            <a v-else @click.prevent="sendThank">
              <span class="icon">
                <i class="far fa-kiss-beam"></i>
              </span>
              <span>
                Thank
              </span>
            </a>
          </div>
        </b-dropdown>
      </div>
    </div>
    <!-- End footer content -->
  </div>
</template>

<script>
import uuid from 'uuid/v4'
import sanitizeHTML from 'sanitize-html'
import getUnixTime from '~/plugins/getUnixTime'
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
  props: {
    answer: {
      type: Object,
      required: true
    },
    answerId: {
      type: String,
      required: true
    },
    questionId: {
      type: String,
      required: false
    },
    showQuestion: {
      type: Boolean,
      default: false
    },
    simpleMode: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      isModalActive: false,
      modalWidth: '500px',
      isBookmarked: false,
      isThaked: false
    }
  },
  async beforeCreate() {
    if (this.$store.getters.getLoginStatus !== true) {
      return
    }

    // ブックマークデータ
    const bookmarkData = await firestore
      .collection('bookmarks')
      .where('answerId', '==', this.$route.params.id)
      .where('userId', '==', this.$store.getters.getUserInfo.uid)
      .get()
    if (bookmarkData.empty === false) {
      this.isBookmarked = true
    }

    // Thankデータ
    const thankData = await firestore
      .collection('thanks')
      .where('answerId', '==', this.answer.answer.id)
      .where('senderId', '==', this.$store.getters.getUserInfo.uid)
      .get()
    if (thankData.empty === false) {
      this.isThaked = true
    }
  },
  methods: {
    async sendThank() {
      await firestore.collection('thanks').add({
        answerId: this.answer.answer.id,
        answerUserId: this.answer.answer.answerUserId,
        senderId: this.$store.getters.getUserInfo.uid,
        created: getUnixTime()
      })
      this.$snackbar.open({
        message: 'Thank sent',
        type: 'is-success',
        position: 'is-top',
        duration: 5000
      })
      this.isThaked = true
    },
    copy() {
      copyText(`https://askmakers.co/sa/${this.answerId}`)
      this.$toast.open({
        duration: 3000,
        message: 'Copied!',
        type: 'is-success'
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
            answerId: this.answer.answer.id,
            userId: this.$store.getters.getUserInfo.uid,
            answerUserId: this.answer.user.uid
          })
        this.isBookmarked = true
      } catch (err) {
        console.log(err)
      }
    },
    async unbookmark() {
      try {
        const bookmarkData = await firestore
          .collection('bookmarks')
          .where('answerId', '==', this.answer.answer.id)
          .where('userId', '==', this.$store.getters.getUserInfo.uid)
          .get()
        await firestore
          .collection('bookmarks')
          .doc(bookmarkData.docs[0].id)
          .delete()
        this.isBookmarked = false
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.answer-box {
  border-radius: 3px;
  .paddingTop {
    padding: 15px !important;
  }
  .author-section {
    margin-bottom: 1rem;
  }
  .question-title {
    background-color: hsl(0, 0%, 98%);
    padding: 15px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
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

.dropdown-item {
  a {
    display: block;
  }
}
</style>
