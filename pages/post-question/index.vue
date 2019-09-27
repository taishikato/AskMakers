<template>
  <section id="post-question" class="section column is-9 container">
    <div id="post-question-wrapper" class="bg-white">
      <h2 class="title">Post a question for everyone</h2>
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
      <div class="field">
        <label class="label">Question</label>
        <div class="control">
          <textarea v-model="newQuestion" class="textarea"></textarea>
        </div>
      </div>
      <b-field>
        <b-checkbox-button v-model="topicGroup" native-value="idea">
          <span>💡 Idea</span>
        </b-checkbox-button>
        <b-checkbox-button v-model="topicGroup" native-value="build">
          <span>🛠 Build</span>
        </b-checkbox-button>
      </b-field>
      <b-field>
        <b-checkbox-button v-model="topicGroup" native-value="launch">
          <span>🚀 Launch</span>
        </b-checkbox-button>
        <b-checkbox-button v-model="topicGroup" native-value="grow">
          <span>🌱 Grow</span>
        </b-checkbox-button>
      </b-field>
      <b-field>
        <b-checkbox-button v-model="topicGroup" native-value="monetize">
          <span>💰 Monetize</span>
        </b-checkbox-button>
        <b-checkbox-button v-model="topicGroup" native-value="automate">
          <span>🤖 Automate</span>
        </b-checkbox-button>
      </b-field>
      <b-field>
        <b-checkbox-button v-model="topicGroup" native-value="exit">
          <span>🚪Exit</span>
        </b-checkbox-button>
      </b-field>
      <div class="field">
        <label class="label">Mode</label>
        <div class="control">
          <div class="select">
            <select v-model="mode">
              <option value="public">
                Public
              </option>
              <option value="anonymous">
                Anonymous
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button
            class="button is-rounded is-medium"
            :disabled="
              countNewQuestion === 0 ||
                countNewQuestion > 280 ||
                tooMuchLine === true
            "
            @click.prevent="askAQustion"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import uuid from 'uuid/v4'
import getUnixTime from '~/plugins/getUnixTime'
import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const firestore = firebase.firestore()

const inproveText = (text) => {
  const textList = text.split(/\n/)
  return textList
}

export default {
  name: 'PostQuestion',
  data() {
    return {
      newQuestion: '',
      tooMuchLine: false,
      topicGroup: [],
      mode: 'public'
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
  methods: {
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
          // Firestoreに保存
          await firestore
            .collection('questions')
            .doc(id)
            .set({
              id,
              image: url,
              text: this.newQuestion,
              fromUserId: this.$store.getters.getUserInfo.uid,
              created: getUnixTime(),
              topics: this.topicGroup,
              isGeneral: true
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
#post-question-wrapper {
  padding: 1.5rem;
  border-radius: 3px;
}
</style>
