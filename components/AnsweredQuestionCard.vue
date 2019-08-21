<template>
  <div class="bg-white pd-15rem radius-box">
    <n-link :to="`/q/${id}`">
      <img :src="image" />
    </n-link>
    <p class="answer-wrapper">{{ answer }}</p>
  </div>
</template>

<script>
export default {
  name: 'AnsweredQuestionCard',
  props: {
    image: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  display: block;
  margin: 0 auto;
  width: 100%;
}

.answer-wrapper {
  margin-top: 10px;
}
</style>
