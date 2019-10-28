<template>
  <nav
    class="navbar is-fixed-top has-shadow"
    role="navigation"
    aria-label="main navigation"
  >
    <b-modal :active.sync="isModalActive" :width="modalWidth">
      <div id="login-modal" class="has-text-centered">
        <h3 class="title weight-900 sp-font">Log In / Sign Up</h3>
        <button
          class="button twitter color-white weight-900 sp-font"
          @click.prevent="twitterSignin"
        >
          Twitter
        </button>
        We'll never post to your Twitter account without your permission.
      </div>
    </b-modal>
    <div class="container">
      <div class="navbar-brand">
        <n-link class="navbar-item sp-font weight-700 has-text-success" to="/">
          AskMakers
        </n-link>
        <n-link to="/about" class="navbar-item has-text-weight-semibold">
          About
        </n-link>
        <a
          role="button"
          class="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          @click="toggleBurger"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div id="nabvar-top" class="navbar-menu">
        <div class="navbar-end">
          <!-- <div class="navbar-item"> -->
          <a
            class="weight-800 navbar-item"
            @click.prevent="goToPostQuestionPage"
          >
            <span class="icon">
              <i class="fas fa-pen"></i>
            </span>
            <span>
              Post a question
            </span>
          </a>
          <!-- </div> -->
          <div
            v-if="$store.getters.getLoginStatus === true"
            class="navbar-item has-dropdown is-hoverable"
          >
            <a class="navbar-link">
              <img
                id="nav-profile-image"
                slot="trigger"
                :src="$store.getters.getUserInfo.picture"
                class="is-rounded"
              />
            </a>
            <div class="navbar-dropdown">
              <n-link
                class="navbar-item weight-800"
                :to="`/u/${$store.getters.getUserInfo.username}`"
              >
                <span class="icon">
                  <i class="fas fa-user-circle"></i>
                </span>
                <span>
                  You
                </span>
              </n-link>
              <n-link class="navbar-item weight-800" to="/my-questions">
                <span class="icon">
                  <i class="fas fa-question"></i>
                </span>
                <span>
                  My Questions
                </span>
              </n-link>
              <n-link class="navbar-item weight-800" to="/bookmarks">
                <span class="icon">
                  <i class="fas fa-bookmark"></i>
                </span>
                <span>
                  Bookmarks
                </span>
              </n-link>
              <n-link class="navbar-item weight-800" to="/u/settings">
                <span class="icon">
                  <i class="fas fa-tools"></i>
                </span>
                <span>
                  Settings
                </span>
              </n-link>
              <a class="navbar-item weight-800" @click.prevent="signOut">
                <span class="icon">
                  <i class="fas fa-sign-out-alt"></i>
                </span>
                <span>
                  Sign Out
                </span>
              </a>
            </div>
          </div>
          <div v-else class="navbar-item">
            <a
              class="button is-warning is-rounded weight-800"
              @click.prevent="showModal"
            >
              <span class="icon">
                <i class="fas fa-sign-in-alt"></i>
              </span>
              <span>
                Log In / Sign Up
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import getParam from '~/plugins/getParam'
import firebase from '~/plugins/firebase'
const twitterProvider = new firebase.auth.TwitterAuthProvider()

export default {
  name: 'Navbar',
  data() {
    return {
      isModalActive: false,
      modalWidth: '500px'
    }
  },
  mounted() {
    const presignup = getParam('presignup')
    if (presignup === 'true') {
      this.isCommingSoon = false
    }
  },
  methods: {
    showModal() {
      this.isModalActive = true
    },
    goToPostQuestionPage() {
      if (this.$store.getters.getLoginStatus === false) {
        this.isModalActive = true
        return
      }
      this.$router.push('/post-question')
    },
    twitterSignin() {
      firebase.auth().signInWithRedirect(twitterProvider)
    },
    async signOut() {
      await firebase.auth().signOut()
      // Firestoreとアンバインド
      await this.$store.dispatch('UNBIND_USER')
      // CommitでVuexの値を変更
      this.$store.commit('changeUser', {
        user: {}
      })
      this.$store.commit('changeLoginStatus', {
        status: false
      })
      this.$router.push('/')
    },
    toggleBurger() {
      const burgerIcon = document.querySelector('.navbar-burger')
      const dropMenu = document.getElementById('nabvar-top')
      burgerIcon.classList.toggle('is-active')
      dropMenu.classList.toggle('is-active')
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
