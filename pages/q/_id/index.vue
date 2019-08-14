<template>
  <div id="users-id" class="section column is-9 container">
    <div class="columns">
      <div class="column is-8 container">
        <div id="question-img" class="bg-white radius-box">
          <img src="/question-ex.jpg" />
        </div>

        <div id="answer-wrapper" class="field">
          <div class="control">
            <textarea class="textarea"></textarea>
          </div>
        </div>
        <div class="field">
          <div class="control has-text-centered">
            <button class="button is-success is-rounded is-medium">
              Answer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QId'
}
</script>

<style lang="scss" scoped>
#question-img {
  padding: 10px;
}

#answer-wrapper {
  margin-top: 20px;
}
</style>
