<template>
  <div id="users-settings" class="section">
    <h2 class="has-text-centered is-size-2 has-text-weight-bold">
      Products
    </h2>
    <div class="has-text-centered">
      <a
        class="button is-success is-rounded"
        @click.prevent="showAddProductModal"
      >
        Add A Product
      </a>
    </div>
    <section class="section">
      <div class="columns is-multiline">
        <div v-for="product in products" :key="product.id" class="column is-4">
          <product-card
            :id="product.name"
            :name="product.name"
            :pitch="product.pitch"
            :image="product.image"
            :website="product.website"
          />
        </div>
      </div>
    </section>

    <!-- Model -->
    <b-modal
      :active.sync="isAddProductModalActive"
      :width="modalAddProductWidth"
    >
      <div class="bg-white radius-box pd-15rem">
        <p class="is-size-4 has-text-weight-bold sp-font">
          Add A Product
        </p>
        <div class="field">
          <label class="label">What's this product called?</label>
          <div class="control">
            <input v-model="newProduct.name" class="input" type="text" />
          </div>
        </div>

        <div class="field">
          <label class="label">What's the pitch?</label>
          <div class="control">
            <input v-model="newProduct.pitch" class="input" type="text" />
          </div>
        </div>

        <div class="field">
          <label class="label">Website?</label>
          <div class="control">
            <input
              v-model="newProduct.website"
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
                  Save
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
                  Save
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
import uuid from 'uuid/v4'
import getUnixTime from '~/plugins/getUnixTime'
import ProductCard from '~/components/ProductCard'
import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const firestore = firebase.firestore()

export default {
  components: {
    ProductCard
  },
  data() {
    return {
      isLoading: false,
      modalAddProductWidth: '500px',
      isAddProductModalActive: false,
      user: {},
      newProduct: {},
      products: []
    }
  },
  async created() {
    this.user = this.$store.getters.getUserInfo
    const productData = await firestore
      .collection('products')
      .where('userId', '==', this.user.uid)
      .orderBy('created', 'desc')
      .get()
    this.products = productData.docs.map((doc) => {
      return doc.data()
    })
  },
  methods: {
    showAddProductModal() {
      this.isAddProductModalActive = true
    },
    async addProduct() {
      this.isLoading = true
      const id = uuid()
        .split('-')
        .join('')
      this.newProduct.userId = this.$store.getters.getUserInfo.uid
      this.newProduct.id = id
      this.newProduct.created = getUnixTime()
      if (this.newProduct.image === undefined) {
        this.newProduct.image = ''
      }
      try {
        await firestore
          .collection('products')
          .doc(id)
          .set(this.newProduct)
        this.$toast.open({
          message: 'Successfuly saved',
          type: 'is-success',
          duration: 4000
        })
        this.products.unshift(this.newProduct)
        this.newProduct = {}
        this.isAddProductModalActive = false
      } catch (err) {
        console.log(err)
        this.$toast.open({
          message: 'Something went wrong...Please try again',
          type: 'is-danger',
          duration: 4000
        })
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.label {
  font-weight: 400;
}

input {
  border: 0;
  background-color: #f2f3f9;
  font-size: 1.5em;
}
</style>
