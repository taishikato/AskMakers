<template>
  <div id="users">
    <p class="title weight-800 is-4">Joined Recently</p>
    <contentLoader v-show="isLoadng" />
    <div id="users-wrapper" class="columns is-multiline is-mobile">
      <div v-for="user in users" :key="user.uid" class="column is-3">
        <!-- {{ user }} -->
        <n-link :to="`/u/${user.username}`">
          <img :src="user.picture" width="70px" class="is-rounded" />
        </n-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ContentLoader } from 'vue-content-loader'
import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const db = firebase.firestore()

export default {
  name: 'Users',
  components: {
    ContentLoader
  },
  data() {
    return {
      isLoadng: true,
      users: []
    }
  },
  async created() {
    const usersData = await db
      .collection('publicUsers')
      .orderBy('created', 'desc')
      .limit(8)
      .get()
    this.users = usersData.docs.map((doc) => {
      return doc.data()
    })
    this.isLoadng = false
  }
}
</script>

<style lang="scss" scoped>
#users-wrapper {
  background-color: white;
  border-radius: 4px;
  border: 1px solid hsl(141, 71%, 48%);
}
</style>
