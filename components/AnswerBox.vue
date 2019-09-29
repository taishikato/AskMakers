<template>
  <div class="answer-box bg-white">
    <div class="flex-container flex-center">
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
      <p
        id="answer-text"
        class="is-size-5"
        v-html="sanitizeHtml(answer.answer.content).replace(/\n/g, '<br/>')"
      ></p>
    </div>
    <!-- Begin footer content -->
    <div class="footer-container flex-container">
      <a
        :href="
          `
https://twitter.com/share?url=https://askmakers.co/s/${questionId}&text=Answer by @${answer.user.username} ${answer.answer.content}
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
    questionId: {
      type: String,
      required: true
    }
  },
  methods: {
    copy() {
      copyText(`https://askmakers.co/s/${this.questionId}`)
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
.answer-box {
  border-radius: 3px;
  padding: 15px;
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
