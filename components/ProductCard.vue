<template>
  <div class="card">
    <div v-if="image !== ''" class="card-image">
      <figure class="image is-4by4">
        <img src="/crisp.png" alt="Placeholder image" class="is-rounded" />
      </figure>
    </div>
    <div class="card-content">
      <div class="content">
        <p class="title is-4">
          {{ name }}
        </p>
        <p class="subtitle is-6">
          {{ pitch }}
        </p>
      </div>
    </div>
    <footer class="card-footer">
      <a
        href="https://taishikato.com/"
        target="_blank"
        class="card-footer-item"
      >
        <span class="icon">
          <i class="fas fa-link"></i>
        </span>
        <span>
          {{ website }}
        </span>
      </a>
      <a href="#" class="card-footer-item">
        <span class="icon">
          <i class="fas fa-pen"></i>
        </span>
        <span>
          Edit
        </span>
      </a>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    name: {
      type: String,
      required: true
    },
    pitch: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    website: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  border-radius: 4px;
  padding-top: 10px;
  img {
    width: 150px;
    margin: 0 auto;
  }
}
</style>
