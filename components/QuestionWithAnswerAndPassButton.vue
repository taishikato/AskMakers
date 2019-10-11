<template>
  <div class="question-box">
    <p class="content is-size-4 question-title">
      <n-link
        :to="`/q/${question.id}`"
        class="question-text-link has-text-black-bis"
      >
        {{ question.text }}
      </n-link>
    </p>
    <div class="footer-content">
      <div v-if="isPassed === false">
        <n-link :to="`/q/${question.id}`" class="button is-white is-rounded">
          <span class="icon">
            <i class="fas fa-pen"></i>
          </span>
          <span>
            Answer
          </span>
        </n-link>
        <a
          class="button is-white is-rounded has-text-grey-light"
          @click.prevent="pass"
        >
          <span class="icon">
            <i class="fas fa-times"></i>
          </span>
          <span>
            Pass
          </span>
        </a>
      </div>
      <div v-else>
        <p class="is-size-5">
          You passed on this question
        </p>
        <p class="is-size-6 has-text-grey-light">
          You will not see this question again.
        </p>
        <p>
          <a
            id="undo"
            class="is-size-6 has-text-grey-light"
            @click.prevent="undoPass"
          >
            Undo
          </a>
        </p>
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
  name: 'QuestionWithAnswerAndPassButton',
  props: {
    question: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isPassed: false
    }
  },
  methods: {
    async pass() {
      console.log(`question Id: ${this.question.id}`)
      try {
        // passフラグをtrueに
        await firestore
          .collection('questions')
          .doc(this.question.id)
          .update({
            isPassed: true
          })
        this.isPassed = true
      } catch (err) {
        console.log(err)
      }
    },
    async undoPass() {
      console.log(`question Id: ${this.question.id}`)
      try {
        // passフラグをtrueに
        await firestore
          .collection('questions')
          .doc(this.question.id)
          .update({
            isPassed: false
          })
        this.isPassed = false
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.question-box {
  background-color: white;
  border-radius: 3px;
  .question-text-link {
    &:hover {
      text-decoration: underline;
    }
  }
  .question-title {
    background-color: #fafafa;
    padding: 15px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }
  .footer-content {
    padding: 0 15px 15px;
  }
  #undo {
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
