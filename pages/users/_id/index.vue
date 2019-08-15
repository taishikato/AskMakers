<template>
  <div id="users-id" class="section column is-9 container">
    <div class="columns">
      <div class="column bg-white pd-15rem radius-box">
        <div class="columns">
          <div class="column is-3">
            <figure class="image">
              <img :src="user.picture" class="is-rounded" />
            </figure>
          </div>
          <div class="column">
            <p class="title is-3 weight-800 sp-font">{{ user.customName }}</p>
            <p v-show="user.tagline !== undefined && user.tagline !== ''">
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
            <div
              v-if="user.website !== undefined && user.website !== ''"
              id="website-btn"
            >
              <a
                :href="user.website"
                class="button is-rounded is-success weight-800"
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
      <div class="column is-9">
        <h3 class="title is-5 sp-font">Ask A Question</h3>
        <svg
          ref="svgCard"
          width="1200px"
          height="630px"
          viewBox="0 0  860 520"
          preserveAspectRatio="xMidYMid meet"
        >
          <rect
            id="svgEditorBackground"
            x="0"
            y="0"
            width="1200"
            height="630"
            style="fill: none; stroke: none; fill: #ffffff;"
          />
          <text
            id="e1_texte"
            style="fill:black;font-family:Arial;font-size:50px;"
            x="56"
            y="46"
          >
            {{ newQuestion }}
          </text>
        </svg>
        <div class="field">
          <div class="control">
            <textarea
              v-model="newQuestion"
              class="textarea"
              placeholder="What do you do when you have no power"
            ></textarea>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <button
              v-if="isSaving"
              class="button is-primary is-loading is-rounded"
              disabled
            >
              Ask a Question
            </button>
            <button
              v-else
              class="button is-primary is-rounded"
              :disabled="countNewQuestion === 0"
              @click.prevent="askAQustion"
            >
              Ask a Question
            </button>
          </div>
        </div>
        <div class="is-divider"></div>
        <div id="answered-question-list">
          <h3 class="title is-5 sp-font">Answered Questions</h3>
          <ul>
            <li>
              <answered-question-card
                image="/question-ex.jpg"
                answer="質問ありがとうございます😊 基本的にはEast Hackersサロン( easthackers.com )入ってくれた方に限定で、案内や現地のことについてお話しさせて頂くくつもりです🙌"
              />
            </li>
            <li>
              <answered-question-card
                image="/question-ex.jpg"
                answer="質問ありがとうございます😊 基本的にはEast Hackersサロン( easthackers.com )入ってくれた方に限定で、案内や現地のことについてお話しさせて頂くくつもりです🙌"
              />
            </li>
          </ul>
        </div>
      </div>
      <div id="sidebar" class="column pd-15rem bg-white radius-box">
        <p class="title is-5 sp-font">Product</p>
      </div>
    </div>
  </div>
</template>

<script>
import uuid from 'uuid/v4'
import AnsweredQuestionCard from '~/components/AnsweredQuestionCard'
import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const firestore = firebase.firestore()

export default {
  components: {
    AnsweredQuestionCard
  },
  data() {
    return {
      user: {
        social: {},
        website: ''
      },
      newQuestion: '',
      userId: '',
      isSaving: false
    }
  },
  computed: {
    countNewQuestion() {
      return this.newQuestion.length
    }
  },
  validate({ params }) {
    if (params.id === undefined) {
      return false
    }
    return true
  },
  async created() {
    this.userId = this.$route.params.id
    const userInfo = await firestore
      .collection('users')
      .doc(this.userId)
      .get()
    this.user = userInfo.data()
  },
  methods: {
    askAQustion() {
      this.isSaving = true
      this.svg2imageData(this.$refs.svgCard, async (data) => {
        try {
          const id = uuid()
            .split('-')
            .join('')
          const sRef = firebase.storage().ref()
          const fileRef = sRef.child(`${id}.png`)
          // Firebase Cloud Storageにアップロード
          await fileRef.putString(data, 'data_url')
          const url = await fileRef.getDownloadURL()
          // Firestoreに保存
          await firestore
            .collection('questions')
            .doc(id)
            .set({
              id,
              image: url,
              text: this.newQuestion,
              fromUserId: this.$store.getters.getUserInfo.uid,
              toUserId: this.userId
            })
          this.$toast.open({
            message: 'Successfuly submitted',
            type: 'is-success',
            duration: 4000
          })
          this.newQuestion = ''
          this.$router.push(`/q/${id}`)
        } catch (err) {
          this.$toast.open({
            message: 'Something went wrong...Please try again',
            type: 'is-danger',
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
      canvas.width = 600
      canvas.height = 315
      const ctx = canvas.getContext('2d')
      const image = new Image()
      image.onload = () => {
        ctx.drawImage(image, 0, 0, 600, 315)
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

#website-btn {
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
</style>
