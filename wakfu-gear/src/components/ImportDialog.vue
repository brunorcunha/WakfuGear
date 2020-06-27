<template>
  <v-dialog
    v-model="dialog"
    max-width="800px"
    transition="dialog-bottom-transition"
    @keydown.esc="cancelar"
  >
    <v-card>
      <v-toolbar
        class="cabecalho"
        dark
        dense
        pr-0
        color="deep-orange accent-4"
      >
        <v-toolbar-title class="white--text">
          {{ $t('label.importartitulo') }}
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
      <v-progress-linear
        v-if="loading"
        class="ma-0"
        indeterminate
      />
      <v-layout
        row
        wrap
        py-3
        px-4
      >
        <v-flex
          xs12
          lg9
        >
          <v-text-field
            ref="campo"
            v-model="linkZenith"
            :disabled="loading"
            label="Zenith Wakfu Builder"
            placeholder="https://zenithwakfu.com/builder/xxxxx"
            hide-details
            dense
          >
            <template #prepend>
              <img
                src="static/zenith.png"
                height="25"
              >
            </template>
          </v-text-field>
        </v-flex>
        <v-flex
          xs12
          lg3
          :pl-4="!$vuetify.breakpoint.smAndDown"
        >
          <v-btn
            block
            large
            color="primary"
            :disabled="loading"
            @click="importarZenith"
          >
            {{ $t('label.importar') }} <v-icon>import_export</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-divider />
      <div class="ou">
        <span>
          {{ $t('label.ou') }}
        </span>
      </div>
      <v-layout
        py-2
        px-4
        wrap
      >
        <v-flex xs12>
          <v-text-field
            v-model="codigo"
            :disabled="loading"
            :label="$t('label.wgcode')"
            placeholder="19699-19879-20218-20213-19859-25076-19710-20169-14147-20365-19884-26865"
          />
        </v-flex>
        <v-flex v-if="alertCodigo">
          <v-alert
            :value="true"
            :type="alertCodigo.tipo"
          >
            {{ alertCodigo.msg }}
          </v-alert>
        </v-flex>
        <v-flex xs12>
          <v-btn
            block
            large
            color="primary"
            :disabled="loading"
            @click="importar"
          >
            {{ $t('label.importar') }} <v-icon>import_export</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import API from '../api/items'

export default {
  name: 'ImportDialog',
  data: vm => ({
    dialog: false,
    loading: false,
    codigo: '',
    linkZenith: '',
    linkMethod: '',
    alertCodigo: null
  }),
  computed: {
    ...mapGetters('gears', ['qnt']),
    ...mapGetters('items', ['items'])
  },
  methods: {
    abrir () {
      this.dialog = true
      this.linkZenith = ''
      this.codigo = ''
      this.linkMethod = ''
      this.focarCampo()
    },
    cancelar () {
      this.dialog = false
    },
    erro (msg) {
      this.alertCodigo = {
        type: 'error',
        msg
      }
    },
    async importarZenith () {
      this.linkZenith = this.linkZenith.replace('www.', '')
      if (!this.linkZenith.includes('https://zenithwakfu.com/builder/')) return this.erro('Link errado!')
      this.loading = true
      const getID = encodeURIComponent(this.linkZenith.replace('https://zenithwakfu.com/builder/', ''))
      try {
        const json = await API.getZenith(getID)
        await this.criarGear(json.gear)
        this.$store.dispatch('gears/setNome', { nome: json.titulo })
        this.dialog = false
      } catch (e) {
        this.erro('Ocorreu um erro!')
      }

      this.loading = false
    },
    async importarMethod () {},
    async importar () {
      this.loading = true

      const itemsCodigo = this.codigo.match(/\d+/g)
      await this.$nextTick()
      await this.criarGear(itemsCodigo.map(e => parseInt(e)))
      this.$store.dispatch('gears/setNome', { nome: this.$i18n.t('label.importado') })

      this.loading = false
      this.dialog = false
    },
    async focarCampo () {
      await this.$nextTick()
      this.$refs.campo.focus()
    }
  }
}
</script>

<style scoped>

</style>
