<template>
  <div>
    <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
      <div class="container">
        <div class="navbar-brand">
          <n-link
            class="navbar-item sp-font weight-700 has-text-success"
            to="/"
          >
            AskMakers
          </n-link>

          <a
            role="button"
            class="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
          <div class="navbar-end">
            <div class="navbar-item">
              <login-modal />
            </div>
          </div>
        </div>
      </div>
    </nav>

    <nuxt />
  </div>
</template>

<script>
import LoginModal from './components/LoginModal'
export default {
  // middleware: ['setLoginUser'],
  components: {
    LoginModal
  }
}
</script>
