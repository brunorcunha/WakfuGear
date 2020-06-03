<template>
  <v-menu
    v-if="!!value"
    v-model="menu"
    open-on-hover
    bottom
    right
    offset-y
  >
    <template #activator="{ on }">
      <small
        class="link"
        v-on="on"
      >{{ value.text }}</small>
    </template>
    <v-card tile>
      <v-progress-linear
        v-if="loading"
        class="ma-0"
        indeterminate
      />
      <div
        v-else
        class="linker"
        v-html="html"
      />
    </v-card>
  </v-menu>
</template>

<script>
import linker from '../../api/linker'

export default {
  name: 'ExternalState',
  props: {
    value: { type: Object, default: null }
  },
  data: () => ({
    html: null,
    menu: false,
    loading: false
  }),
  watch: {
    menu (val) {
      if (val && !this.loading) this.abrir()
    }
  },
  methods: {
    async abrir () {
      if (!this.value || this.html) return
      this.loading = true
      this.html = await linker.get('state', { id: this.value.id, level: this.value.lvl, l: this.$lang })
      this.loading = false
    }
  }
}
</script>

<style scoped>
</style>
