<template>
  <v-dialog
    v-model="dialog"
    max-width="800px"
    transition="dialog-bottom-transition"
    @keydown.esc="cancelar"
  >
    <v-card class="pb-2">
      <v-toolbar
        class="cabecalho"
        dark
        dense
        pr-0
        color="deep-orange accent-4"
      >
        <v-toolbar-title class="white--text">
          {{ $t('label.exportargear') }}
        </v-toolbar-title>

        <v-spacer />

        <v-btn
          dark
          flat
          icon
          :disabled="loading"
          @click="dialog = false"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-layout
        py-2
        px-4
        wrap
      >
        <v-flex xs12>
          <v-text-field
            v-model="codigo"
            readonly
            hide-details
            :label="$t('label.wgcode')"
            @click="copiar(codigo, 1)"
          />
        </v-flex>
      </v-layout>

      <v-alert
        outline
        dismissible
        :value="alert === 1"
        type="success"
        transition="slide-y-transition"
        class="mx-4 py-1"
      >
        {{ $t('msg.copy') }}
      </v-alert>

      <v-divider />

      <v-layout
        py-2
        px-4
        wrap
      >
        <v-flex xs12>
          <v-text-field
            v-model="url"
            readonly
            hide-details
            :label="$t('label.url')"
            @click="copiar(url, 2)"
          />
        </v-flex>
      </v-layout>

      <v-alert
        outline
        dismissible
        :value="alert === 2"
        type="success"
        transition="slide-y-transition"
        class="mx-4 py-1"
      >
        {{ $t('msg.copy') }}
      </v-alert>
    </v-card>
  </v-dialog>
</template>

<script>
import { radixLeading64 } from '../functions/radix64'
import copy from 'copy-text-to-clipboard'

export default {
  name: 'ExportDialog',
  data: vm => ({
    dialog: false,
    loading: false,
    alert: null,
    gear: null
  }),
  computed: {
    ids () {
      if (!this.gear) return []
      return Object.entries(this.gear.gear).filter(e => !!e[1]).map(e => e[1].id)
    },
    hash () {
      if (!this.gear) return ''
      return this.ids.map(e => radixLeading64(parseInt(e), 3)).join('')
    },
    codigo () {
      if (!this.gear) return ''
      return `${this.gear.nome.replace('-', ' ')}-${this.hash}`
    },
    url () {
      return `${location.origin}/${this.codigo}`
    }
  },
  methods: {
    abrir (gear) {
      this.dialog = true
      this.gear = gear
    },
    cancelar () {
      this.dialog = false
    },
    copiar (texto, n) {
      copy(texto)
      this.alert = n
      setTimeout(() => {
        this.alert = null
      }, 6000)
    }
  }
}
</script>

<style scoped>

</style>
