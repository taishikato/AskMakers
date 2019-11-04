<template>
  <div id="users-id" class="section column is-8 container">
    <div class="columns">
      <div class="column bg-white pd-15rem radius-box">
        <div class="columns is-mobile">
          <div class="column is-3">
            <figure class="image">
              <img :src="user.picture" class="is-rounded" />
            </figure>
          </div>
          <div class="column">
            <p class="title is-3 weight-700 sp-font">{{ user.customName }}</p>
            <p
              v-show="user.tagline !== undefined && user.tagline !== ''"
              id="tagline"
            >
              {{ user.tagline }}
            </p>
            <div>
              <a
                v-show="
                  user.social.twitter !== undefined &&
                    user.social.twitter !== ''
                "
                :href="`https://twitter.com/${user.social.twitter}`"
                class="icon twitter-icon"
                target="_blank"
              >
                <i class="fab fa-twitter fa-lg"></i>
              </a>
              <a
                v-show="
                  user.social.productHunt !== undefined &&
                    user.social.productHunt !== ''
                "
                :href="
                  `https://www.producthunt.com/@${user.social.productHunt}`
                "
                class="icon ph-icon"
                target="_blank"
              >
                <i class="fab fa-product-hunt fa-lg "></i>
              </a>
              <a
                v-show="
                  user.social.gitHub !== undefined && user.social.gitHub !== ''
                "
                :href="`https://github.com/${user.social.gitHub}`"
                class="icon gh-icon"
                target="_blank"
              >
                <i class="fab fa-github fa-lg"></i>
              </a>
              <a
                v-show="
                  user.social.patreon !== undefined &&
                    user.social.patreon !== ''
                "
                :href="`https://www.patreon.com/${user.social.patreon}`"
                class="icon patreon-icon"
                target="_blank"
              >
                <i class="fab fa-patreon fa-lg"></i>
              </a>
            </div>
            <a
              class="button is-light is-rounded marginTop weight-700"
              @click.prevent="copy"
            >
              <span class="icon is-medium">
                <i class="far fa-copy fa-lg"></i>
              </span>
              <span>
                Copy the sharing URL
              </span>
            </a>
            <div
              v-if="user.website !== undefined && user.website !== ''"
              class="marginTop"
            >
              <a
                :href="user.website"
                class="button is-rounded is-success weight-700"
                target="_blank"
              >
                <span class="icon">
                  <i class="fas fa-external-link-alt"></i>
                </span>
                <span>
                  {{
                    user.website.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)[1]
                  }}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="profile-main-body" class="columns">
      <div class="column">
        <h3
          v-if="
            userId !== $store.getters.getUserInfo.username &&
              $store.getters.getLoginStatus === true
          "
          class="title is-5 weight-800"
        >
          Ask A Question
        </h3>
        <div
          v-show="newQuestion.length > 0"
          id="question-svg"
          class="has-text-centered"
        >
          <svg
            id="svg-card"
            ref="svgCard"
            data-name="レイヤー 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 630"
          >
            <defs>
              <style>
                .cls-1 {
                  fill: #23d160;
                }
                .cls-2 {
                  fill: #fff;
                }
              </style>
            </defs>
            <title>askmakers</title>
            <rect
              id="background_green_"
              data-name="background(green)"
              class="cls-1"
              width="1200"
              height="630"
            />
            <rect
              id="white-space"
              class="cls-2"
              x="60.062"
              y="60.001"
              width="1079.794"
              height="495.679"
              rx="12"
            />
            <text
              id="newquestion-text"
              x="120"
              y="150"
              style="fill:black;font-family:Arial;font-size:50px;"
            ></text>
            <path
              class="cls-2"
              d="M66.947,598.138,65.8,602.424h-5.66l6.267-22.037h7.522l6.515,22.037H74.375l-1.2-4.286Zm5.2-4.785c-.931-3.463-1.694-6.541-2.143-8.691h-.079c-.459,2.375-1.218,5.52-2.021,8.691Z"
              transform="translate(0.06 -0.001)"
            />
            <path
              class="cls-2"
              d="M89.411,597.244a2.086,2.086,0,0,0,2.265,1.663c1.109,0,1.589-.377,1.589-1.149,0-.824-.664-1.12-2.651-1.619-5.2-1.3-5.949-3.205-5.949-5.574,0-2.452,1.534-5.321,6.694-5.321,4.926,0,6.7,2.8,6.84,5.168h-5.03c-.115-.591-.443-1.443-1.961-1.443-1.007,0-1.37.464-1.37,1.035,0,.657.493.941,2.945,1.55,4.814,1.2,5.85,3.061,5.85,5.7,0,2.989-1.964,5.581-7.13,5.581-4.926,0-6.989-2.619-7.3-5.586Z"
              transform="translate(0.06 -0.001)"
            />
            <path
              class="cls-2"
              d="M109.515,592.062c.893-1.609,2.329-3.89,3.937-6.412h6.3l-4.771,6.285c.506,1.247,4.666,9.275,5.161,10.489h-6.3c-.121-.439-2.673-6.256-2.755-6.559l-1.569,1.781v4.778H103.9V579.243h5.614Z"
              transform="translate(0.06 -0.001)"
            />
            <path
              class="cls-2"
              d="M141.249,595.233c0-3.443.068-7.88.154-10.5h-.154c-.829,4.726-2.164,11.27-3.614,17.689h-4.652c-1.139-6.224-2.441-12.782-3.213-17.686H129.6c.163,2.592.269,6.894.269,10.669v7.017h-5.173V580.387h8.365c.978,4.459,2.121,10.924,2.566,14.18h.1c.51-3.543,1.832-9.39,2.986-14.18h8.126v22.037h-5.584Z"
              transform="translate(0.06 -0.001)"
            />
            <path
              class="cls-2"
              d="M167.3,597.448c0,1.892.085,4.412.181,4.976H162.3a7.951,7.951,0,0,1-.232-1.549c-.718,1.042-1.829,1.955-4.259,1.955-3.385,0-5.214-2.363-5.214-5.349,0-3.942,2.845-5.646,7.454-5.646H161.9v-.928c0-1.075-.344-1.863-1.7-1.863-1.27,0-1.6.648-1.736,1.731h-5.182c.2-2.8,1.7-5.552,7.06-5.531,4.948.021,6.953,2.14,6.953,6.185Zm-5.4-2.469h-1.243c-1.934,0-2.57.753-2.57,1.992a1.59,1.59,0,0,0,1.642,1.778c1.9,0,2.171-1.45,2.171-3.252Z"
              transform="translate(0.06 -0.001)"
            />
            <path
              class="cls-2"
              d="M179.038,592.062c.893-1.609,2.329-3.89,3.937-6.412h6.3l-4.771,6.285c.506,1.247,4.666,9.275,5.161,10.489h-6.3c-.121-.439-2.674-6.256-2.755-6.559l-1.569,1.781v4.778h-5.614V579.243h5.614Z"
              transform="translate(0.06 -0.001)"
            />
            <path
              class="cls-2"
              d="M198.726,595.271c0,1.691.584,3.384,2.238,3.384a1.806,1.806,0,0,0,2-1.509h5.513c-.549,2.229-2.261,5.684-7.6,5.684-5.7,0-7.8-4.266-7.8-8.649,0-5.055,2.407-8.937,7.9-8.937,5.849,0,7.634,4.4,7.634,8.585a13.243,13.243,0,0,1-.058,1.442Zm4.256-3.255c-.018-1.569-.422-2.893-2.029-2.893-1.5,0-2.078,1.229-2.171,2.893Z"
              transform="translate(0.06 -0.001)"
            />
            <path
              class="cls-2"
              d="M213.945,590.465c0-1.605-.01-3.322-.039-4.815h5.488c.067.521.135,1.99.135,2.726a4.7,4.7,0,0,1,4.639-3.132v5.7c-3.176-.151-4.608.655-4.608,4.586v6.892h-5.615Z"
              transform="translate(0.06 -0.001)"
            />
            <path
              class="cls-2"
              d="M233.554,597.244a2.085,2.085,0,0,0,2.264,1.663c1.11,0,1.589-.377,1.589-1.149,0-.824-.664-1.12-2.651-1.619-5.2-1.3-5.949-3.205-5.949-5.574,0-2.452,1.535-5.321,6.7-5.321,4.926,0,6.694,2.8,6.84,5.168h-5.03c-.115-.591-.443-1.443-1.961-1.443-1.007,0-1.37.464-1.37,1.035,0,.657.493.941,2.945,1.55,4.813,1.2,5.849,3.061,5.849,5.7,0,2.989-1.963,5.581-7.129,5.581-4.926,0-6.99-2.619-7.3-5.586Z"
              transform="translate(0.06 -0.001)"
            />
          </svg>
          <span class="tag is-warning">
            Max length is 280
          </span>
        </div>
        <div
          v-if="
            userId !== $store.getters.getUserInfo.username &&
              $store.getters.getLoginStatus === true
          "
        >
          <div class="field">
            <div class="control">
              <textarea
                v-model="newQuestion"
                class="textarea is-success"
              ></textarea>
            </div>
          </div>
          <div id="question-btn" class="field">
            <div class="control has-text-centered">
              <button
                v-if="isSaving"
                class="button is-success is-loading is-rounded is-outlined weight-700 is-medium"
                disabled
              >
                Ask a Question
              </button>
              <button
                v-else
                class="button is-success is-rounded is-outlined weight-700 is-medium"
                :disabled="
                  countNewQuestion === 0 ||
                    countNewQuestion > 280 ||
                    tooMuchLine === true
                "
                @click.prevent="askAQustion"
              >
                Ask a Question
              </button>
            </div>
          </div>
          <div class="is-divider"></div>
        </div>
        <p
          v-show="$store.getters.getLoginStatus === false"
          class="login-message"
        >
          <login-modal-no-button text="to ask a question." />
        </p>
        <div class="tabs">
          <ul>
            <li :class="{ 'is-active': isShowQuestions }">
              <a @click.prevent="showQuestions">
                Questions
              </a>
            </li>
            <li :class="{ 'is-active': isShowAnswers }">
              <a @click.prevent="showAnswers">
                Answers
              </a>
            </li>
          </ul>
        </div>
        <div id="contaniner-wrapper">
          <component :is="component" :user="user" />
          <!-- <user-questions v-if="isShowQuestions" :user="user" />
          <user-answers v-if="isShowAnswers" :user="user" /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import uuid from 'uuid/v4'
import UserQuestions from '~/components/UserQuestions'
import UserAnswers from '~/components/UserAnswers'
import LoginModalNoButton from '~/components/LoginModalNoButton'
import getUnixTime from '~/plugins/getUnixTime'
import generateSlug from '~/plugins/generateSlug'
import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const firestore = firebase.firestore()

const inproveText = (text) => {
  const textList = text.split(/\n/)
  return textList
}

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
  name: 'UserId',
  layout: 'white',
  components: {
    LoginModalNoButton,
    UserQuestions,
    UserAnswers
  },
  head() {
    return {
      title: `${this.user.customName} - AskMakers`,
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: `${this.user.customName} - AskMakers`
        }
      ]
    }
  },
  data() {
    return {
      user: {
        social: {},
        website: ''
      },
      newQuestion: '',
      userId: '',
      isSaving: false,
      isLoading: true,
      tooMuchLine: false,
      isShowQuestions: true,
      isShowAnswers: false,
      component: ''
    }
  },
  computed: {
    countNewQuestion() {
      return this.newQuestion.length
    }
  },
  watch: {
    newQuestion(val) {
      this.tooMuchLine = false
      const textList = inproveText(val)
      const elm = document.getElementById('newquestion-text')
      const x = 120
      let i = 0
      elm.innerHTML = ''
      textList.forEach((text) => {
        this.tooMuchLine = false
        const limitText = 40
        const lineCount = text.length / limitText
        let y = 0
        if (lineCount >= 1) {
          for (let k = 0; k < lineCount; k++) {
            y = 150 + 60 * i
            let slicedText = text.substr(limitText * k, limitText)
            if (slicedText.slice(0, 1) === ' ') {
              slicedText = slicedText.slice(1)
            }
            elm.insertAdjacentHTML(
              'beforeend',
              `<tspan x="${x}" y="${y}">${slicedText}</tspan>`
            )
            i++
            if (i > 7) {
              this.tooMuchLine = true
            }
          }
        } else {
          if (text.slice(0, 1) === ' ') {
            text = text.slice(1)
          }
          y = 150 + 60 * i
          elm.insertAdjacentHTML(
            'beforeend',
            `<tspan x="${x}" y="${y}">${text}</tspan>`
          )
          i++
          if (i > 7) {
            this.tooMuchLine = true
          }
        }
      })
    }
  },
  validate({ params }) {
    if (params.id === undefined) {
      return false
    }
    return true
  },
  async asyncData({ params, error }) {
    // maybe slug
    const slug = params.id
    // Slugとして扱ってDBを走査
    const userInfo = await firestore
      .collection('publicUsers')
      .where('username', '==', slug)
      .get()
    // ユーザーが存在しない場合は404
    if (userInfo.empty === true) {
      return error({
        statusCode: 404,
        message: 'This page could not be found'
      })
    }
    const user = userInfo.docs[0].data()
    return { user }
  },
  created() {
    this.component = UserQuestions
    this.isLoading = false
  },
  methods: {
    showQuestions() {
      this.component = UserQuestions
      this.isShowQuestions = true
      this.isShowAnswers = false
    },
    showAnswers() {
      this.component = UserAnswers
      this.isShowQuestions = false
      this.isShowAnswers = true
    },
    copy() {
      copyText(`https://askmakers.co/sp/${this.userId}`)
      this.$snackbar.open({
        message: 'Copied successfully',
        type: 'is-success',
        position: 'is-top',
        duration: 3000
      })
    },
    askAQustion() {
      this.isSaving = true
      // SVGの大きさをOGPに最適なサイズにしておく
      this.svg2imageData(this.$refs.svgCard, async (data) => {
        try {
          const id = uuid()
            .split('-')
            .join('')
          const sRef = firebase.storage().ref()
          const fileRef = sRef.child(`questions/${id}.png`)
          // Firebase Cloud Storageにアップロード
          await fileRef.putString(data, 'data_url')
          const url = await fileRef.getDownloadURL()
          const slug = await generateSlug(this.newQuestion)
          // Firestoreに保存
          await firestore
            .collection('questions')
            .doc(id)
            .set({
              id,
              image: url,
              text: this.newQuestion,
              fromUserId: this.$store.getters.getUserInfo.uid,
              slug,
              toUserId: this.user.uid,
              created: getUnixTime(),
              isGeneral: false
            })
          this.$snackbar.open({
            message: 'Successfuly submitted',
            type: 'is-success',
            position: 'is-top',
            duration: 3000
          })
          this.newQuestion = ''
          this.$router.push(`/q/${slug}`)
        } catch (err) {
          this.$snackbar.open({
            message: 'Something went wrong...Please try again',
            type: 'is-danger',
            position: 'is-top',
            duration: 4000
          })
        } finally {
          this.isSaving = false
        }
      })
    },
    // pngに変換
    svg2imageData(svgElement, successCallback, errorCallback) {
      const canvas = document.createElement('canvas')
      canvas.width = 1200
      canvas.height = 630
      const ctx = canvas.getContext('2d')
      const image = new Image()
      image.onload = () => {
        ctx.drawImage(image, 0, 0, 1200, 630)
        successCallback(canvas.toDataURL())
      }
      image.onerror = (e) => {
        errorCallback(e)
      }
      const svgData = new XMLSerializer().serializeToString(svgElement)
      image.src =
        'data:image/svg+xml;charset=utf-8;base64,' +
        btoa(unescape(encodeURIComponent(svgData)))
    }
  }
}
</script>

<style lang="scss" scoped>
.title.sp-font,
#tagline {
  margin-bottom: 0.5rem;
}
.login-message {
  margin-bottom: 1.5rem;
}
.twitter-icon {
  color: #00aced;
  &:hover {
    color: #00aced;
  }
}

.ph-icon {
  color: #da552f;
  &:hover {
    color: #da552f;
  }
}

.gh-icon {
  color: #333;
  &:hover {
    color: #333;
  }
}

.patreon-icon {
  color: #e64413;
  &:hover {
    color: #e64413;
  }
}

.marginTop {
  margin-top: 1.5rem;
}

#profile-main-body {
  margin-top: 20px;
  #sidebar {
    height: 100%;
  }
  #answered-question-list {
    li {
      margin-top: 1.5rem;
    }
  }
}

textarea.is-success {
  border-width: 2px;
}

#question-btn {
  .is-outlined {
    background-color: #ffffff;
    &:hover {
      background-color: #23d160;
    }
  }
}
</style>
