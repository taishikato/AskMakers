<template>
  <div class="columns">
    <div v-show="isLoading" class="column is-10 container">
      <div class="bg-white" style="padding: 15px">
        <facebook-loader />
      </div>
    </div>
    <div
      v-if="isLoading === false && question.question !== undefined"
      class="column is-10 container"
    >
      <p
        v-if="question.question.toUserId === $store.getters.getUserInfo.uid"
        id="question-for-you"
        class="tag is-success"
      >
        The question for you
      </p>
      <article id="this-question">
        <question-box
          :question="question"
          :simple-mode="false"
          :has-bookmark-feature="true"
          :is-bookmarked="isBookmarked"
        />
        <div
          v-if="question.question.toUserId === $store.getters.getUserInfo.uid"
          id="answer-wrapper"
          class="field"
        >
          <div
            v-if="
              question.question.toUserId === $store.getters.getUserInfo.uid &&
                hasexistingAnswer === false
            "
            class="control has-text-centered"
          >
            <textarea v-model="answer" class="textarea"></textarea>
            <label class="checkbox">
              <input
                v-model="$store.getters.getUserInfo.isEnabletoShareOnTwitter"
                type="checkbox"
                @change="onCheckBoxChange()"
              />
              Share on
              <span class="icon is-medium">
                <i class="fab fa-twitter fa-lg"></i>
              </span>
            </label>
          </div>
        </div>
        <div
          v-if="
            question.question.toUserId === $store.getters.getUserInfo.uid &&
              hasexistingAnswer === false
          "
          id="answer-btn"
          class="field"
        >
          <div class="control has-text-centered">
            <button
              v-if="isSubmitting"
              class="button is-success is-loading is-rounded is-medium"
              disabled
            >
              Answer
            </button>
            <button
              v-else
              class="button is-success is-rounded is-medium"
              :disabled="countAnswer === 0"
              @click.prevent="answerQuestion"
            >
              Answer
            </button>
          </div>
        </div>
      </article>
      <!-- Begin No Other Answer -->
      <div v-if="hasOtherAnswers === false">
        <p class="title is-4 weight-700">
          No Other Answers from {{ existingAnswerUser.customName }}
        </p>
        <p class="has-text-centered">
          <img src="~/assets/img/thinking.svg" width="100px" />
        </p>
      </div>
      <!-- Begin Other Answers Section -->
      <div v-else>
        <p class="title is-4">
          Other Answers from {{ existingAnswerUser.customName }}
        </p>
        <div
          v-for="otherAnswer in otherAnswers"
          :key="otherAnswer.answer.id"
          class="other-answer-wrapper"
        >
          <question-box
            :question="otherAnswer"
            :simple-mode="true"
            :has-bookmark-feature="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import uuid from 'uuid/v4'
import { FacebookLoader } from 'vue-content-loader'
import sanitizeHTML from 'sanitize-html'
import QuestionBox from '~/components/QuestionBox'
import getUnixTime from '~/plugins/getUnixTime'
import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const firestore = firebase.firestore()
const twitterProvider = new firebase.auth.TwitterAuthProvider()

export default {
  name: 'QuestionDetail',
  components: {
    QuestionBox,
    FacebookLoader
  },
  data() {
    return {
      question: {},
      qId: '',
      answer: '',
      isBookmarked: false,
      isSubmitting: false,
      existingAnswer: {},
      hasexistingAnswer: false,
      existingAnswerUser: {},
      isLoading: true,
      shareText: '',
      otherAnswers: [],
      hasOtherAnswers: false
    }
  },
  computed: {
    countAnswer() {
      return this.answer.length
    }
  },
  validate({ params }) {
    if (params.id === undefined) {
      return false
    }
    return true
  },
  async created() {
    this.qId = this.$route.params.id
    // 質問データ習得
    const questionData = await firestore
      .collection('questions')
      .doc(this.qId)
      .get()
    // 質問が存在しない場合は404
    if (questionData.exists !== true) {
      return this.$nuxt.error({
        statusCode: 404,
        message: 'This page could not be found'
      })
    }
    this.question.question = questionData.data()

    // 質問されたユーザーの情報を取得
    const toUserData = await firestore
      .collection('publicUsers')
      .doc(this.question.question.toUserId)
      .get()
    const toUser = toUserData.data()
    this.existingAnswerUser = toUser
    this.question.user = toUser

    // 他の回答を取得
    const otherAnswerData = await firestore
      .collection('answers')
      .where('answerUserId', '==', this.question.question.toUserId)
      .limit(3)
      .get()
    if (otherAnswerData.empty === true) {
      // this.noOtherAnswer = true
      this.isLoading = false
      return
    }
    let otherAnswers = otherAnswerData.docs.map((doc) => {
      return doc.data()
    })
    otherAnswers = otherAnswers.filter((answer) => {
      return answer.questionId !== this.qId
    })

    if (otherAnswers.length !== 0) {
      this.otherAnswers = await Promise.all(
        otherAnswers.map(async (answer) => {
          const questionData = await firestore
            .collection('questions')
            .doc(answer.questionId)
            .get()
          return {
            user: toUser,
            answer,
            question: questionData.data()
          }
        })
      )
      this.hasOtherAnswers = true
    }

    // 回答データがあるか確認
    // あれば表示
    const answerData = await firestore
      .collection('answers')
      .where('questionId', '==', this.question.question.id)
      .get()
    if (answerData.empty === true) {
      this.isLoading = false
      return true
    }
    this.hasexistingAnswer = true
    this.existingAnswer = answerData.docs[0].data()
    this.question.answer = answerData.docs[0].data()
    this.shareText = `
Answer by @${this.existingAnswerUser.username} ${this.existingAnswer.content}
${encodeURIComponent(' #AskMakers #AskMakersco')}
`

    if (this.$store.getters.getLoginStatus === false) {
      this.isLoading = false
      return
    }

    const bookmarkData = await firestore
      .collection('bookmarks')
      .where('answerId', '==', this.question.answer.id)
      .where('userId', '==', this.$store.getters.getUserInfo.uid)
      .get()
    if (bookmarkData.empty === false) {
      this.isBookmarked = true
    }
    this.isLoading = false
  },
  methods: {
    twitterSignin() {
      firebase.auth().signInWithRedirect(twitterProvider)
    },
    async onCheckBoxChange() {
      await firestore
        .collection('publicUsers')
        .doc(this.$store.getters.getUserInfo.uid)
        .update({
          isEnabletoShareOnTwitter: this.$store.getters.getUserInfo
            .isEnabletoShareOnTwitter
        })
    },
    sanitizeHtml(text) {
      return sanitizeHTML(text)
    },
    async answerQuestion() {
      this.isSubmitting = true
      const id = uuid()
        .split('-')
        .join('')
      try {
        await Promise.all([
          firestore
            .collection('answers')
            .doc(id)
            .set({
              id,
              questionId: this.qId,
              answerUserId: this.$store.getters.getUserInfo.uid,
              created: getUnixTime(),
              content: this.answer
            }),
          firestore
            .collection('questions')
            .doc(this.qId)
            .update({
              isAnswered: true
            })
        ])
        try {
          await this.$axios.get(`https://askmakers.co/tweet/${id}`)
        } catch (err) {
          console.log(err)
        }
        this.answer = ''
        this.$toast.open({
          message: 'Successfuly submitted',
          type: 'is-success',
          duration: 4000
        })
        this.$router.push(`/a/${id}?answered=true`)
      } catch (err) {
        this.$toast.open({
          message: 'Something went wrong...Please try again',
          type: 'is-danger',
          duration: 4000
        })
      } finally {
        this.isSubmitting = false
      }
    },
    async bookmark(questionId) {
      if (this.$store.getters.getLoginStatus !== true) {
        console.log('not logged in')
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
            answerId: this.existingAnswer.id,
            userId: this.$store.getters.getUserInfo.uid,
            answerUserId: this.existingAnswerUser.uid
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
          .where('questionId', '==', this.qId)
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
#question-img {
  #answer-user-wrapper {
    margin-top: 10px;
    padding: 5px;
    #answer-text {
      margin-top: 10px;
    }
    .answer-user-name {
      margin-left: 10px;
    }
  }
}

#question-for-you {
  margin-bottom: 0.5rem;
}

.margin-bttm {
  margin-bottom: 50px;
}

.other-answer-wrapper {
  margin-bottom: 15px;
}

#answer-wrapper {
  margin-top: 20px;
}

#answer-btn {
  margin-top: 10px;
}

#this-question {
  margin-bottom: 2rem;
}

@media only screen and (max-width: 768px) {
  /* For mobile phones: */
  .section {
    padding: 3rem 0.75rem;
  }
}
</style>
