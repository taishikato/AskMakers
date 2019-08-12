<template>
  <div id="index">
    <section class="hero is-success has-text-centered">
      <div class="hero-body">
        <div class="container">
          <h1 class="title weight-800">
            Ask experienced, successful Indie Makers
          </h1>
          <h2 class="subtitle">
            👩‍🏫 👨‍🏫
          </h2>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="column is-9 container">
        <div class="columns is-mobile">
          <div class="column is-4">
            <card
              name="Taishi Kato"
              content="The maker of Quorie"
              image="/takato.jpeg"
            >
              Open source on
              <a href="https://github.com/buefy/buefy">
                GitHub
              </a>
            </card>
          </div>
          <div class="column is-4">
            <card
              name="Taishi Kato"
              content="The maker of Quorie"
              image="/takato.jpeg"
            >
              Open source on
              <a href="https://github.com/buefy/buefy">
                GitHub
              </a>
            </card>
          </div>
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
