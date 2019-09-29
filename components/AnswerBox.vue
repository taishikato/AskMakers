<template>
  <div class="answer-box bg-white">
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
        <p id="answer-text" class="is-size-5">
          {{
            answer.answer.content.length > 140
              ? `${answer.answer.content.substr(0, 140)}…`
              : answer.answer.content
          }}
        </p>
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
          <a v-else @click.prevent="bookmark(answer.question.id)">
            <span class="icon is-medium">
              <i class="far fa-bookmark fa-lg"></i>
            </span>
          </a>
        </div>
      </div>
    </div>
    <!-- End footer content -->
  </div>
</template>

<script>
import uuid from 'uuid/v4'
import sanitizeHTML from 'sanitize-html'
import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const firestore = firebase.firestore()

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
    showQuestion: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isBookmarked: false
    }
  },
  async beforeCreate() {
    const bookmarkData = await firestore
      .collection('bookmarks')
      .where('answerId', '==', this.$route.params.id)
      .where('userId', '==', this.$store.getters.getUserInfo.uid)
      .get()
    if (bookmarkData.empty === false) {
      this.isBookmarked = true
    }
  },
  methods: {
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
</style>
