<template>
  <div>
    <a
      class="button is-success is-rounded is-outlined"
      @click.prevent="showModal"
    >
      Log In / Sign Up
    </a>

    <b-modal :active.sync="isModalActive" :width="modalWidth">
      <div id="login-modal" class="has-text-centered">
        <h3 class="title weight-900 sp-font">Log In</h3>
        <button
          class="button twitter color-white weight-900 sp-font"
          @click.prevent="twitterSignin"
        >
          Twitter
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase'
const twitterProvider = new firebase.auth.TwitterAuthProvider()

export default {
  name: 'LoginModal',
  data() {
    return {
      isModalActive: false,
      modalWidth: '500px'
    }
  },
  methods: {
    showModal() {
      this.isModalActive = true
    },
    twitterSignin() {
      firebase.auth().signInWithRedirect(twitterProvider)
    }
  }
}
</script>

<style lang="scss" scoped>
#login-modal {
  color: #ffffff;
  .title {
    color: #ffffff;
  }
  .button {
    width: 200px;
    display: block;
    margin: 10px auto;
  }
}
</style>
