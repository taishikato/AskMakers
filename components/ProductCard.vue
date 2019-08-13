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
      <a class="card-footer-item" @click.prevent="showEditModal">
        <span class="icon">
          <i class="fas fa-pen"></i>
        </span>
        <span>
          Edit
        </span>
      </a>
    </footer>

    <!-- Edit Modal -->
    <b-modal
      :active.sync="isEditProductModalActive"
      :width="modalEditProductWidth"
    >
      <div class="bg-white radius-box pd-15rem">
        <p class="is-size-4 has-text-weight-bold sp-font">
          Edit A Product
        </p>
        <div class="field">
          <label class="label">What's this product called?</label>
          <div class="control">
            <input v-model="name" class="input" type="text" />
          </div>
        </div>

        <div class="field">
          <label class="label">What's the pitch?</label>
          <div class="control">
            <input v-model="pitch" class="input" type="text" />
          </div>
        </div>

        <div class="field">
          <label class="label">Website?</label>
          <div class="control">
            <input
              v-model="website"
              class="input"
              type="url"
              placeholder="https://askmakers.co"
            />
          </div>
        </div>

        <div class="is-divider"></div>
        <div class="field-body">
          <div class="field">
            <div class="control has-text-right">
              <button
                v-if="isLoading"
                class="button is-success is-loading is-medium is-rounded"
                disabled
              >
                <span class="icon">
                  <i class="fas fa-plus-circle"></i>
                </span>
                <span>
                  Update
                </span>
              </button>
              <button
                v-else
                class="button is-medium is-success is-rounded"
                @click.prevent="addProduct"
              >
                <span class="icon">
                  <i class="fas fa-plus-circle"></i>
                </span>
                <span>
                  Update
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
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
  },
  data() {
    return {
      isLoading: false,
      isEditProductModalActive: false,
      modalEditProductWidth: '500px'
    }
  },
  methods: {
    showEditModal() {
      console.log('showEditModal')
      this.isEditProductModalActive = true
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

input {
  border: 0;
  background-color: #f2f3f9;
  font-size: 1.5em;
}
</style>
