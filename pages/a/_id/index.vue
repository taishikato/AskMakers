<template>
  <div id="users-id" class="section column is-9 container">
    <div class="columns">
      <div class="column is-8 container">
        <p
          v-show="
            showThankyouBox &&
              answer.answerUserId === $store.getters.getUserInfo.uid
          "
          class="title has-text-centered weight-800 sp-font"
        >
          Thank you for answering!
        </p>
        <div id="question-img" class="bg-white radius-box">
          <p id="answer-text">{{ answer.content }}</p>
          <img :src="question.image" />
          <div class="is-divider"></div>
          <div id="share-wrappper">
            <p class="title is-4 weight-800 has-text-centered">
              Share the answer
            </p>
            <ul class="flex-container flex-center">
              <li>
                <a
                  :href="`http://www.facebook.com/share.php?u=${shareUrl}`"
                  class="button facebook is-rounded weight-700"
                  target="_blank"
                >
                  <span class="icon">
                    <i class="fab fa-facebook-f"></i>
                  </span>
                  <span>
                    Facebook
                  </span>
                </a>
              </li>
              <li>
                <a
                  class="button is-rounded is-white weight-700"
                  @click.prevent="copyUrl"
                >
                  <span class="icon">
                    <i class="fas fa-copy"></i>
                  </span>
                  <span>
                    Copy Sharing URL
                  </span>
                </a>
              </li>
            </ul>
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
  name: 'AId',
  data() {
    return {
      answer: {},
      question: {},
      aId: '',
      showThankyouBox: false,
      shareUrl: ''
    }
  },
  validate({ params }) {
    if (params.id === undefined) {
      return false
    }
    return true
  },
  async created() {
    this.aId = this.$route.params.id
    const answerData = await firestore
      .collection('answers')
      .doc(this.aId)
      .get()
    this.answer = answerData.data()
    this.shareUrl = `https://askmakers.co/s/${this.answer.id}`
    const questionData = await firestore
      .collection('questions')
      .doc(this.answer.questionId)
      .get()
    this.question = questionData.data()
  },
  mounted() {
    const answeredParam = this.getParam('answered')
    if (answeredParam === 'true') {
      this.showThankyouBox = true
    }
  },
  methods: {
    getParam(name, url) {
      if (!url) url = window.location.href
      name = name.replace(/[[\]]/g, '\\$&')
      const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`)
      const results = regex.exec(url)
      if (!results) return null
      if (!results[2]) return ''
      return decodeURIComponent(results[2].replace(/\+/g, ' '))
    },
    copyUrl() {
      copyText(this.shareUrl)
    }
  }
}
</script>

<style lang="scss" scoped>
#answer-text {
  margin-bottom: 10px;
}

#question-img {
  padding: 10px;
}

.facebook {
  margin-right: 20px;
}

#share-wrappper {
  margin-bottom: 20px;
}
</style>
