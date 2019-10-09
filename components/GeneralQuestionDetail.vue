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
      <p id="question-for-you" class="tag is-black">
        The question for everyone
      </p>
      <article id="this-question">
        <question-box
          :question="question"
          :simple-mode="false"
          :has-bookmark-feature="true"
        />
        <div
          v-if="$store.getters.getLoginStatus"
          id="answer-wrapper"
          class="field"
        >
          <div class="control has-text-centered">
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
        <div v-if="$store.getters.getLoginStatus" id="answer-btn" class="field">
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
        <div v-else class="login-message">
          <login-modal-no-button text="to answer the question" />
        </div>
      </article>
      <section>
        <p class="title is-4">Answers</p>
        <!-- Begin No Other Answer -->
        <div v-if="answers.length === 0">
          <p class="has-text-centered" style="margin-bottom: 15px;">
            <img src="~/assets/img/thinking.svg" width="100px" />
          </p>
          <p class="has-text-centered">
            No answer yet
          </p>
        </div>
        <!-- Begin Other Answers Section -->
        <article v-else>
          <section
            v-for="answer in answers"
            :key="answer.answer.id"
            class="answer-content"
          >
            <answer-box
              :answer="answer"
              :answerId="answer.answer.id"
              :simple-mode="true"
              :questionId="qId"
            />
          </section>
        </article>
      </section>
    </div>
  </div>
</template>

<script>
import uuid from 'uuid/v4'
import { FacebookLoader } from 'vue-content-loader'
import sanitizeHTML from 'sanitize-html'
import LoginModalNoButton from '~/components/LoginModalNoButton'
import AnswerBox from '~/components/AnswerBox'
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
    AnswerBox,
    FacebookLoader,
    LoginModalNoButton
  },
  data() {
    return {
      question: {},
      qId: '',
      answer: '',
      answers: [],
      isSubmitting: false,
      isLoading: true
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
    this.question.question = questionData.data()

    // 回答データ取得
    const answerData = await firestore
      .collection('answers')
      .where('questionId', '==', this.qId)
      .orderBy('created', 'desc')
      .get()
    this.answers = await Promise.all(
      answerData.docs.map(async (doc) => {
        const answer = doc.data()
        // 回答ごとのユーザーデータ取得
        const userData = await firestore
          .collection('publicUsers')
          .where('uid', '==', answer.answerUserId)
          .get()
        return {
          answer,
          user: userData.docs[0].data()
        }
      })
    )

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

.login-message {
  margin-top: 1.5rem;
}

.answer-content {
  margin-bottom: 30px;
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
