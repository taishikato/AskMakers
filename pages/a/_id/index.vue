<template>
  <div id="users-id" class="section column is-9 container">
    <div class="columns">
      <div class="column is-8 container">
        <p
          v-show="showThankyouBox"
          class="title has-text-centered weight-800 sp-font"
        >
          Thank you for answering!
        </p>
        <div id="question-img" class="bg-white radius-box">
          <p id="answer-text">{{ answer.content }}</p>
          <img src="/question-ex.jpg" />
          <div class="is-divider"></div>
          <div id="share-wrappper">
            <p class="title is-4 weight-800 has-text-centered">
              Share the answer
            </p>
            <ul class="flex-container flex-center">
              <li>
                <a href="" class="button facebook is-rounded weight-700">
                  <span class="icon">
                    <i class="fab fa-facebook-f"></i>
                  </span>
                  <span>
                    Facebbok
                  </span>
                </a>
              </li>
              <li>
                <a href="" class="button is-rounded is-white weight-700">
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

export default {
  name: 'AId',
  data() {
    return {
      answer: {},
      aId: '',
      showThankyouBox: false
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
  },
  mounted() {
    const answeredParam = this.getParam('answered')
    console.log(answeredParam)
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
