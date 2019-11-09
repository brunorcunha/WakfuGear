<template>
  <v-dialog
    v-model="dialog"
    persistent
    :max-width="opcoes.width"
    @keydown.esc="cancel()"
  >
    <v-toolbar
      class="cabecalho"
      dark
      dense
      :color="opcoes.color"
    >
      <v-toolbar-title
        :class="[(opcoes.color === 'white') ? 'black--text' : 'white--text']"
      >
        {{ title }}
      </v-toolbar-title>
    </v-toolbar>
    <v-card tile>
      <v-card-text v-show="!!message">
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="error"
          text
          @click="cancel()"
        >
          {{ cancelar }}
        </v-btn>
        <v-btn
          color="primary darken-1"
          text
          @click="agree()"
        >
          {{ confirmar }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { i18n } from '../language/lang'

export default {
  name: 'ConfirmDialog',
  props: {
    options: { type: Object, default: () => ({}) },
    confirmar: { type: String, default: i18n.t('dialog.confirmar') },
    cancelar: { type: String, default: i18n.t('dialog.cancelar') }
  },
  data: () => ({
    dialog: false,
    resolve: null,
    message: null,
    title: null,
    opcoes: {
      color: 'deep-orange accent-4',
      width: 390
    }
  }),
  created () {
    this.opcoes = { ...this.opcoes, ...this.options }
  },
  methods: {
    open (title, message) {
      this.dialog = true
      this.title = title
      this.message = message

      return new Promise(resolve => {
        this.resolve = resolve
      })
    },
    agree () {
      this.resolve(true)
      this.dialog = false
    },
    cancel () {
      this.resolve(false)
      this.dialog = false
    }
  }
}
</script>

<style scoped>
  .v-card__text {
    font-size: 15px;
  }
</style>
