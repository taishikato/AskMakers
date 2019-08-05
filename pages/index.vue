<template>
  <div id="index">
    <section class="hero is-success has-text-centered">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Primary title
          </h1>
          <h2 class="subtitle">
            Primary subtitle
          </h2>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="columns is-mobile">
        <div class="column is-3">
          <card
            name="Shun Yamada"
            content="The maker of East Hackers"
            image="/shun.jpg"
          >
            Open source on
            <a href="https://github.com/buefy/buefy">
              GitHub
            </a>
          </card>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Card from '~/components/Card'

export default {
  name: 'HomePage',

  components: {
    Card
  }
}
</script>
