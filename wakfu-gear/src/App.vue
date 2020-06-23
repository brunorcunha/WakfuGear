<template>
  <v-app :dark="darkTheme">
    <router-view />
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters('configs', ['darkTheme'])
  }
}
</script>

<style>
  @import 'App.css';
</style>
