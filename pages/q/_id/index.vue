<template>
  <div id="users-id" class="section column is-9 container">
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
      </div>
    </b-modal>
    <!-- Login Modal End -->
    <div class="columns">
      <div v-show="isLoading" class="column has-text-centered">
        <span class="icon is-large">
          <i class="fas fa-spinner fa-3x fa-spin"></i>
        </span>
      </div>
      <div v-show="isLoading === false" class="column is-8 container">
        <div class="margin-bttm">
          <div id="question-img" class="">
            <div class="card radius-box">
              <div class="card-image">
                <figure class="image">
                  <img :src="question.image" :alt="question.text" />
                </figure>
              </div>
              <div v-if="hasexistingAnswer" class="card-content">
                <div class="media">
                  <div class="media-left">
                    <figure class="image is-48x48">
                      <n-link :to="`/u/${existingAnswerUser.username}`">
                        <img
                          :src="existingAnswerUser.picture"
                          alt="existingAnswerUser.customName"
                          class="is-rounded"
                        />
                      </n-link>
                    </figure>
                  </div>
                  <div class="media-content">
                    <n-link :to="`/u/${existingAnswerUser.username}`">
                      <p class="title is-4">
                        {{ existingAnswerUser.customName }}
                      </p>
                    </n-link>
                  </div>
                </div>

                <div class="content">
                  <p
                    id="answer-text"
                    class="is-size-5"
                    v-html="
                      sanitizeHtml(existingAnswer.content).replace(
                        /\n/g,
                        '<br/>'
                      )
                    "
                  ></p>
                  <time
                    class="is-size-7 has-text-grey"
                    :datetime="
                      $moment.unix(existingAnswer.created).format('YYYY-MM-DD')
                    "
                  >
                    {{
                      $moment
                        .unix(existingAnswer.created)
                        .format('YYYY/MM/DD H:mm')
                    }}
                  </time>
                </div>
                <!-- Footer -->
                <div class="flex-container">
                  <div>
                    <a
                      v-if="isBookmarked === true"
                      @click.prevent="unbookmark()"
                    >
                      <span class="icon is-medium">
                        <i class="fas fa-bookmark fa-lg"></i>
                      </span>
                    </a>
                    <a v-else @click.prevent="bookmark(question.id)">
                      <span class="icon is-medium">
                        <i class="far fa-bookmark fa-lg"></i>
                      </span>
                    </a>
                  </div>
                  <div>
                    <a
                      :href="
                        `https://twitter.com/share?url=https://askmakers.co/s/${qId}&text=${shareText}`
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

          <div
            v-if="question.toUserId === $store.getters.getUserInfo.uid"
            id="answer-wrapper"
            class="field"
          >
            <div
              v-if="
                question.toUserId === $store.getters.getUserInfo.uid &&
                  hasexistingAnswer === false
              "
              class="control has-text-centered"
            >
              <textarea v-model="answer" class="textarea"></textarea>
              <label class="checkbox">
                <input
                  type="checkbox"
                  @change="onCheckBoxChange()"
                  v-model="$store.getters.getUserInfo.isEnabletoShareOnTwitter"
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
              question.toUserId === $store.getters.getUserInfo.uid &&
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
        </div>
        <!-- Begin No Other Answer -->
        <div v-show="noOtherAnswer">
          <p class="title is-4 weight-700">
            <span class="sp-font">
              No Other Answers from
            </span>
            {{ existingAnswerUser.customName }}
          </p>
          <p class="has-text-centered">
            <img src="~/assets/img/thinking.svg" width="100px" />
          </p>
        </div>
        <!-- Begin Other Answers Section -->
        <div v-show="hasOtherAnswers">
          <p class="title is-4 weight-700">
            <span class="sp-font">
              Other Answers from
            </span>
            {{ existingAnswerUser.customName }}
          </p>
          <div
            v-for="otherAnswer in otherAnswers"
            :key="otherAnswer.answer.id"
            class="other-answer-wrapper"
          >
            <div class="card radius-box">
              <div class="card-image">
                <n-link :to="`/q/${otherAnswer.question.id}`">
                  <figure class="image">
                    <img
                      :src="otherAnswer.question.image"
                      :alt="otherAnswer.question.text"
                    />
                  </figure>
                </n-link>
              </div>
              <div class="card-content">
                <div class="media">
                  <div class="media-left">
                    <figure class="image is-48x48">
                      <n-link :to="`/u/${existingAnswerUser.username}`">
                        <img
                          :src="existingAnswerUser.picture"
                          alt="existingAnswerUser.customName"
                          class="is-rounded"
                        />
                      </n-link>
                    </figure>
                  </div>
                  <div class="media-content">
                    <n-link :to="`/u/${existingAnswerUser.username}`">
                      <p class="title is-4">
                        {{ existingAnswerUser.customName }}
                      </p>
                    </n-link>
                  </div>
                </div>

                <div class="content">
                  <p
                    id="answer-text"
                    class="is-size-5"
                    v-html="
                      sanitizeHtml(otherAnswer.answer.content).replace(
                        /\n/g,
                        '<br/>'
                      )
                    "
                  ></p>
                </div>
                <!-- Footer -->
                <!-- <div class="flex-container">
                  <div v-if="$store.getters.getLoginStatus">
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
                  </div>
                  <div>
                    <a
                      :href="
                        `https://twitter.com/share?url=https://askmakers.co/s/${qId}&text=${shareText}`
                      "
                      class="twitter-share"
                      target="_blank"
                    >
                      <span class="icon is-medium">
                        <i class="fab fa-twitter fa-lg"></i>
                      </span>
                    </a>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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

export default {
  name: 'QId',
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
      hasOtherAnswers: false,
      noOtherAnswer: false,
      isModalActive: false,
      modalWidth: '500px'
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
    this.question = questionData.data()

    // 質問されたユーザーの情報を取得
    const toUserData = await firestore
      .collection('publicUsers')
      .doc(this.question.toUserId)
      .get()
    this.existingAnswerUser = toUserData.data()

    // 他の回答を取得
    const otherAnswerData = await firestore
      .collection('answers')
      .where('answerUserId', '==', this.question.toUserId)
      .limit(3)
      .get()
    if (otherAnswerData.empty === true) {
      this.noOtherAnswer = true
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
      .where('questionId', '==', this.question.id)
      .get()
    if (answerData.empty === true) {
      this.isLoading = false
      return true
    }
    this.hasexistingAnswer = true
    this.existingAnswer = answerData.docs[0].data()

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
      .where('questionId', '==', this.question.id)
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

.twitter-share,
.fa-twitter {
  color: #00aced;
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

@media only screen and (max-width: 768px) {
  /* For mobile phones: */
  .section {
    padding: 3rem 0.75rem;
  }
}
</style>
