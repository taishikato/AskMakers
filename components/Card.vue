<template>
  <div class="card">
    <div class="card-image">
      <figure class="image is-4by4">
        <img :src="image" class="is-rounded" alt="Placeholder image" />
      </figure>
    </div>
    <div class="card-content">
      <div class="content">
        <p class="title is-4 has-text-centered">{{ name }}</p>
        <p class="subtitle is-6 has-text-centered">{{ content }}s</p>
      </div>
    </div>
    <div class="ask-btn has-text-centered">
      <n-link to="" class="button is-success is-rounded has-text-weight-bold">
        Ask A Question
      </n-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  padding: 10px;
  border-radius: 4px;
  img {
    width: 200px;
    margin: 0 auto;
  }
}
</style>
