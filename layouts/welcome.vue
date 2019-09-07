<template>
  <div id="welcome-layout">
    <header
      class="flex-container flex-center flex-justify-center sp-font weight-900 has-text-success is-size-5"
    >
      AskMakers
    </header>
    <nuxt />
  </div>
</template>

<script>
export default {
  // middleware: ['welcome']
}
</script>

<style lang="scss" scoped>
header {
  min-height: 3.25rem;
  padding: 30px 0;
}
#welcome-layout {
  background-color: white;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
