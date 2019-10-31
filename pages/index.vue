<template>
  <div id="index">
    <section
      v-show="$store.getters.getLoginStatus !== true"
      class="hero is-success has-text-centered"
    >
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
      <div class="columns">
        <div class="column is-8">
          <questions-for-me-card />
          <recent-questions />
          <!-- <recent-answers /> -->
        </div>
        <div class="column">
          <recent-answers />
          <div class="featured-makers">
            <p class="title is-5">Featured Makers</p>
            <div class="columns is-multiline">
              <div class="column is-12 featured-maker-box">
                <card
                  name="Amie Chen"
                  username="hyper_yolo"
                  content="The maker of Spider Pro"
                  image="/img/amie.jpg"
                >
                </card>
              </div>
              <div class="column is-12 featured-maker-box">
                <card
                  name="Hari Krishna Dulipudi"
                  username="1HaKr"
                  content="The maker of VisaList and many products"
                  image="/img/hari.jpg"
                >
                </card>
              </div>
              <div class="column is-12 featured-maker-box">
                <card
                  name="Justin Jackson"
                  username="mijustin"
                  content="The maker of Transistor.fm and Megamaker"
                  image="/img/justin.jpg"
                >
                </card>
              </div>
              <div class="column is-12 featured-maker-box">
                <card
                  name="Jonathan Bull"
                  username="jonathanbull"
                  content="The maker of EmailOctopus"
                  image="/img/jonathan.jpg"
                >
                </card>
              </div>
            </div>
          </div>
          <users />
          <div id="ph-widget" class="column has-text-centered">
            <a
              href="https://www.producthunt.com/posts/askmakers?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-askmakers"
              target="_blank"
            >
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=167850&theme=light"
                alt="AskMakers - Aggregated place for Q&A with experienced makers💡 | Product Hunt Embed"
                style="width: 250px; height: 54px;"
                width="250px"
                height="54px"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
    <footer>
      <div class="flex-container flex-center flex-justify-center">
        <div class="is-size-7 copy-right">
          © AskMakers by
          <a href="https://twitter.com/taishikat0" target="_blank">
            taishikat0
          </a>
        </div>
        <n-link to="/terms-privacy" class="is-size-7 has-text-grey-light">
          Terms of Service & Privacy
        </n-link>
      </div>
    </footer>
  </div>
</template>

<script>
import Users from '~/components/Users'
import Card from '~/components/Card'
import QuestionsForMeCard from '~/components/QuestionsForMeCard'
import RecentAnswers from '~/components/RecentAnswers'
import RecentQuestions from '~/components/RecentQuestions'
import getParam from '~/plugins/getParam'

export default {
  name: 'HomePage',
  layout: 'default',
  components: {
    Users,
    Card,
    QuestionsForMeCard,
    RecentAnswers,
    RecentQuestions
  },
  data() {
    return {
      isCommingSoon: false
    }
  },
  mounted() {
    const presignup = getParam('presignup')
    if (presignup === 'true') {
      this.isCommingSoon = false
    }
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

.featured-makers {
  margin-bottom: 10px;
}

.featured-maker-box {
  background-color: white;
  border-radius: 3px;
  margin-bottom: 10px;
  border-bottom: 2px solid #23d160;
}

#ph-widget {
  margin-top: 20px;
}
</style>
