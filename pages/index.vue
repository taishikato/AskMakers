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
    <section
      v-if="isCommingSoon && $store.getters.getLoginStatus === false"
      class="hero has-text-centered"
    >
      <div class="hero-body">
        <div class="container">
          <h2 class="title weight-800 is-2">
            AskMakers coming soon!
          </h2>
          <p class="subtitle weight-700">
            Please register with the waiting list ✉️
          </p>
          <!-- Begin Mailchimp Signup Form -->
          <link
            href="//cdn-images.mailchimp.com/embedcode/classic-10_7.css"
            rel="stylesheet"
            type="text/css"
          />
          <style type="text/css">
            #mc_embed_signup {
              clear: left;
              width: 100%;
              max-width: 500px;
              text-align: center;
              font: 14px Helvetica, Arial, sans-serif;
              margin: 0 auto;
            }
            /* Add your own Mailchimp form style overrides in your site stylesheet or in this style block.
              We recommend moving this block and the preceding CSS link to the HEAD of your HTML file. */
          </style>
          <div id="mc_embed_signup">
            <form
              id="mc-embedded-subscribe-form"
              action="https://gmail.us3.list-manage.com/subscribe/post?u=2b130e92de55bfb420515aa1c&amp;id=d0c60cb2e5"
              method="post"
              name="mc-embedded-subscribe-form"
              class="validate"
              target="_blank"
              novalidate
            >
              <div id="mc_embed_signup_scroll">
                <h2>Subscribe</h2>
                <div class="indicates-required">
                  <span class="asterisk">*</span>
                  indicates required
                </div>
                <div class="mc-field-group">
                  <label for="mce-EMAIL">
                    Email Address <span class="asterisk">*</span>
                  </label>
                  <input
                    id="mce-EMAIL"
                    type="email"
                    value=""
                    name="EMAIL"
                    class="required email"
                  />
                </div>
                <div id="mce-responses" class="clear">
                  <div
                    id="mce-error-response"
                    class="response"
                    style="display:none"
                  ></div>
                  <div
                    id="mce-success-response"
                    class="response"
                    style="display:none"
                  ></div>
                </div>
                <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
                <div
                  style="position: absolute; left: -5000px;"
                  aria-hidden="true"
                >
                  <input
                    type="text"
                    name="b_2b130e92de55bfb420515aa1c_d0c60cb2e5"
                    tabindex="-1"
                    value=""
                  />
                </div>
                <div class="clear">
                  <input
                    id="mc-embedded-subscribe"
                    type="submit"
                    value="Subscribe"
                    name="subscribe"
                    class="button"
                  />
                </div>
              </div>
            </form>
          </div>
          <script
            type="text/javascript"
            src="//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js"
          ></script>
          <script type="text/javascript">
            ;(function($) {
              window.fnames = new Array()
              window.ftypes = new Array()
              fnames[0] = 'EMAIL'
              ftypes[0] = 'email'
              fnames[1] = 'FNAME'
              ftypes[1] = 'text'
              fnames[2] = 'LNAME'
              ftypes[2] = 'text'
              fnames[3] = 'ADDRESS'
              ftypes[3] = 'address'
              fnames[4] = 'PHONE'
              ftypes[4] = 'phone'
              fnames[5] = 'BIRTHDAY'
              ftypes[5] = 'birthday'
            })(jQuery)
            var $mcj = jQuery.noConflict(true)
          </script>
          <!--End mc_embed_signup-->
        </div>
      </div>
    </section>
    <section class="section">
      <div class="columns">
        <div class="column is-9">
          <questions-for-me-card />
          <recent-answers />
          <div class="columns">
            <div class="column is-8">
              <p class="title weight-800 is-4">Featured Makers</p>
              <div class="columns">
                <div class="column is-6">
                  <card
                    name="Amie Chen"
                    username="hyper_yolo"
                    content="The maker of Spider Pro"
                    image="/img/amie.jpg"
                  >
                  </card>
                </div>
                <div class="column is-6">
                  <card
                    name="Hari Krishna Dulipudi"
                    username="1HaKr"
                    content="The maker of VisaList and many products"
                    image="/img/hari.jpg"
                  >
                  </card>
                </div>
                <div class="column is-6">
                  <card
                    name="Justin Jackson"
                    username="mijustin"
                    content="The maker of Transistor.fm and Megamaker"
                    image="/img/justin.jpg"
                  >
                  </card>
                </div>
                <div class="column is-6">
                  <card
                    name="Jonathan Bull"
                    username="jonathanbull"
                    content="The maker of EmailOctopus"
                    image="https://pbs.twimg.com/profile_images/860439311879155713/szwSvKLt.jpg"
                  >
                  </card>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column">
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
import getParam from '~/plugins/getParam'

export default {
  name: 'HomePage',
  components: {
    Users,
    Card,
    QuestionsForMeCard,
    RecentAnswers
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

#ph-widget {
  margin-top: 20px;
}
</style>
