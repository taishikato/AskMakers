<template>
  <div id="users-id" class="section column is-10 container">
    <div class="columns">
      <div id="answer-container" class="column is-10 container">
        <div
          v-show="
            showThankyouBox &&
              answer.answerUserId === $store.getters.getUserInfo.uid
          "
          class="title has-text-centered weight-800 sp-font"
        >
          Thank you for answering!
          <p class="title has-text-centered weight-700">
            Please contanct me if you have something to tell😁
            <a href="https://twitter.com/taishikat0" target="_blank">
              @taishikat0
            </a>
          </p>
        </div>
        <div v-if="isLoading" class="bg-white" style="padding: 15px">
          <facebook-loader />
        </div>
        <answer-box
          v-if="answer.answer !== undefined && isLoading === false"
          :answer="answer"
          :answer-id="aId"
          :show-question="true"
          :simple-mode="false"
          :question-id="answer.question.id"
        />
      </div>
    </div>
    <!-- モーダル -->
    <b-modal :active.sync="showShareModal" :width="showModalWidth">
      <div id="share-modal-wrapper" class="has-text-centered">
        <p class="title is-4">
          Thank you for answering
        </p>
        <p class="subtitle is-6">
          Please share your answer with friends on Twitter.
        </p>
        <a
          class="button twitter is-rounded"
          :href="`https://twitter.com/intent/tweet?text=${shareAnswerText}`"
          target="_blank"
        >
          <span class="icon">
            <i class="fab fa-twitter"></i>
          </span>
          <span>
            Share on Twitter
          </span>
        </a>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { FacebookLoader } from 'vue-content-loader'
import AnswerBox from '~/components/AnswerBox'
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
  components: {
    AnswerBox,
    FacebookLoader
  },
  data() {
    return {
      answer: {},
      aId: '',
      showThankyouBox: false,
      isLoading: true,
      showShareModal: false,
      showModalWidth: '400px',
      shareAnswerText: ''
    }
  },
  validate({ params }) {
    if (params.id === undefined) {
      return false
    }
    return true
  },
  async created() {
    try {
      this.aId = this.$route.params.id
      const answerData = await firestore
        .collection('answers')
        .doc(this.aId)
        .get()
      if (answerData.exists === false) {
        return this.$nuxt.error({
          statusCode: 404,
          message: 'This page could not be found'
        })
      }
      const answer = answerData.data()
      const [questionData, userData] = await Promise.all([
        firestore
          .collection('questions')
          .doc(answer.questionId)
          .get(),
        firestore
          .collection('publicUsers')
          .doc(answer.answerUserId)
          .get()
      ])

      this.answer = {
        answer,
        question: questionData.data(),
        user: userData.data()
      }

      if (this.$route.query.answered === 'true') {
        const shareAnswerText = `${this.answer.answer.content}
https://askmakers.co/sa/${this.aId}
#AskMakers #AskMakersco`
        this.shareAnswerText = encodeURIComponent(shareAnswerText)
        this.showShareModal = true
      }
    } catch (err) {
      console.log(err)
    } finally {
      this.isLoading = false
    }
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

#share-wrappper {
  margin-bottom: 20px;
}

#share-modal-wrapper {
  background-color: white;
  border-radius: 3px;
  padding: 20px 10px;
  .twitter {
    color: white;
  }
}

@media only screen and (max-width: 768px) {
  /* For mobile phones: */
  #answer-container {
    padding: 0 !important;
  }
}
</style>
