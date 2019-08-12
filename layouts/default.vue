<template>
  <div>
    <navbar />
    <nuxt />
  </div>
</template>

<script>
import Navbar from '~/components/Navbar'
export default {
  middleware: ['setLoginUser'],
  components: {
    Navbar
  }
}
</script>
