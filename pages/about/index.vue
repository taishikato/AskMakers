<template>
  <div id="about" class="section">
    <div class="columns">
      <div class="column is-10 container">
        <div id="about-wrapper" class="bg-white pd-15rem content">
          <div class="columns">
            <div class="column is-6 has-text-weight-medium">
              <h3 class="title">
                About
              </h3>
              <p>
                AskMakers is the community of indie makers to ask
                experienced/successful makers your questions.
              </p>
              <p>
                My dream is to make AskMakers the Quora for makers.
              </p>
            </div>
            <div id="team" class="column">
              <h3 class="title">
                Team
              </h3>
              <div class="columns flex-center is-mobile">
                <div class="column is-3">
                  <img
                    src="~/assets/img/taishi.jpeg"
                    class="is-rounded"
                    alt="Taishi profile image"
                  />
                </div>
                <div class="column">
                  <p>
                    <span class="has-text-weight-bold">Taishi Kato</span>
                    <br />
                    <a href="https://twitter.com/taishikat0" target="_blank">
                      @taishikat0
                    </a>
                    <br />
                    <a href="https://taishikato.com/" target="_blank">
                      taishikato.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style lang="scss" scoped>
#about-wrapper {
  border-radius: 4px;
}

#team {
  img {
    width: 100%;
  }
}

@media only screen and (max-width: 768px) {
  .section {
    padding: 3rem 0.75rem;
  }
}
</style>
