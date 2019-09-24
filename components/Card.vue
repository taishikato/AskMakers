<template>
  <div class="card-component">
    <div class="columns is-mobile">
      <div class="column is-4">
        <n-link :to="`/u/${username}`">
          <img :src="image" class="is-rounded" :title="name" :alt="name" />
        </n-link>
      </div>
      <div class="column">
        <div class="content">
          <p class="title is-4 has-text-centered">{{ name }}</p>
          <p class="subtitle is-6 has-text-centered">{{ content }}</p>
        </div>
        <div class="ask-btn has-text-centered">
          <n-link
            :to="`/u/${username}`"
            class="button is-success is-rounded has-text-weight-bold"
          >
            Ask A Question
          </n-link>
        </div>
      </div>
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
    },
    username: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.card-component {
  background-color: white;
  border-radius: 3px;
  padding: 1.5rem;
  img {
    width: 100%;
    max-width: 200px;
  }
}
</style>
