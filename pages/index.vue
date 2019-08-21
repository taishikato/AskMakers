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
      <questions-for-me-card />
      <div class="columns">
        <div class="column is-8">
          <p class="title weight-800 is-4">Makers</p>
          <div class="columns">
            <div class="column is-6">
              <card
                name="Justin Jackson"
                username="mijustin"
                content="The maker of Transistor.fm and Megamaker"
                image="/img/justin.png"
              >
              </card>
            </div>
          </div>
        </div>
      </div>
    </section>
    <footer>
      <div class="flex-container flex-center flex-justify-center">
        <div class="is-size-7 copy-right">
          © AskMakers
        </div>
        <n-link to="/terms-privacy" class="is-size-7 has-text-grey-light">
          Terms of Service & Privacy
        </n-link>
      </div>
    </footer>
  </div>
</template>

<script>
import Card from '~/components/Card'
import QuestionsForMeCard from '~/components/QuestionsForMeCard'

export default {
  name: 'HomePage',

  components: {
    Card,
    QuestionsForMeCard
  }
}
</script>

<style lang="scss" scoped>
.copy-right {
  margin-right: 10px;
}

footer {
  margin-bottom: 20px;
}
</style>
