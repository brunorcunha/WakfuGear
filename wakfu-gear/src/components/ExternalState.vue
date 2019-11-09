<template>
  <v-dialog
    v-model="dialog"
    max-width="600px"
    hide-overlay
    persistent
    @keydown.esc="cancel()"
  >
    <v-toolbar
      class="cabecalho"
      dark
      dense
      pr-0
      color="deep-orange accent-4"
    >
      <v-toolbar-title class="white--text">
        {{ title }}
      </v-toolbar-title>

      <v-spacer />

      <v-btn
        dark
        flat
        icon
        @click="dialog = false"
      >
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card tile>
      <v-progress-linear
        v-if="loading"
        class="ma-0"
        :indeterminate="true"
      />
      <div
        v-else
        class="linker"
        v-html="html"
      />
    </v-card>
  </v-dialog>
</template>

<script>
import linker from '../api/linker'
import EventBus from '../event-bus'

export default {
  name: 'ExternalState',
  props: {
    value: { type: Number, default: null }
  },
  data: () => ({
    html: '',
    title: '',
    dialog: false,
    loading: true
  }),
  mounted () {
    EventBus.$on('ExternalState', this.open)
  },
  methods: {
    async open (state) {
      if (!this.dialog) this.dialog = true
      this.title = state.text
      this.loading = true

      this.html = await linker.get('state', { id: state.id, level: state.lvl, l: this.$lang })
      this.html = this.html.replace('game/state/42/', 'game/state/64/')
      this.loading = false
    },
    cancel () {
      this.dialog = false
    }
  }
}
</script>

<style scoped>
</style>
