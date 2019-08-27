<template>
  <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <n-link class="navbar-item sp-font weight-700 has-text-success" to="/">
          AskMakers
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
              <!-- <n-link class="navbar-item weight-800" to="/users/products/id">
                <span class="icon">
                  <i class="fas fa-rocket"></i>
                </span>
                <span>
                  Products
                </span>
              </n-link> -->
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
            <span
              v-if="isCommingSoon"
              id="csMessage"
              class="weight-800 has-text-warning sp-font"
            >
              Coming Soon!
            </span>
            <login-modal v-else />
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import firebase from '~/plugins/firebase'
import LoginModal from '~/components/LoginModal'
import getParam from '~/plugins/getParam'

export default {
  name: 'Navbar',
  components: {
    LoginModal
  },
  data() {
    return {
      isCommingSoon: true
    }
  },
  mounted() {
    const presignup = getParam('presignup')
    if (presignup === 'true') {
      this.isCommingSoon = false
    }
  },
  methods: {
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

<style lang="scss" scoped></style>
