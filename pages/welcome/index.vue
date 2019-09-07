<template>
  <div id="welcome">
    <div class="column is-10 container">
      <div class="columns">
        <div class="column is-5 is-hidden-mobile left-box">
          <img src="~/assets/img/welcome.png" class="is-rounded" />
        </div>
        <div class="column right-box">
          <p class="title is-1 weight-900">Hi, Maker!</p>
          <div class="content is-size-5 has-text-grey">
            <p>Welcome to AskMakers!</p>
            <p>
              I am Taishi who making AskMakers and I am so so glad you joined
              it!
            </p>
            <p>
              AskMakers is a community to ask experienced makers questions you
              have.
            </p>
            <p>
              Let's ask the question you have and make your idea/product grow 🌱
            </p>
          </div>
          <a href="/" class="button is-success is-rounded is-medium">
            I got it!
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'welcome'
  // mounted() {
  //   location.reload()
  // }
}
</script>

<style lang="scss" scoped>
.left-box img {
  width: 100%;
  max-width: 400px;
}
@media only screen and (max-width: 768px) {
  .right-box {
    text-align: center;
  }
}
</style>
