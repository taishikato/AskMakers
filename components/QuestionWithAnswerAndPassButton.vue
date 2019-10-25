<template>
  <div class="question-box">
    <p class="is-size-5 question-title has-text-weight-medium">
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
        <n-link
          v-if="answerCount > 0"
          :to="`/q/${question.id}`"
          class="button is-white is-rounded"
        >
          <span class="icon">
            <i class="fas fa-lightbulb"></i>
          </span>
          <span>
            {{ answerCount }}
          </span>
        </n-link>
        <a
          v-if="hasPassBtn"
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
    },
    hasPassBtn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isPassed: false,
      answerCount: 0
    }
  },
  async created() {
    const answersData = await firestore
      .collection('answers')
      .where('questionId', '==', this.question.id)
      .get()
    this.answerCount = answersData.size
  },
  methods: {
    async pass() {
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
  border-bottom: 2px solid #e8d5d5;
  .question-text-link {
    &:hover {
      text-decoration: underline;
    }
  }
  .question-title {
    margin-bottom: 1rem;
    padding: 15px 15px 0;
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
