<template>
  <v-flex text-xs-center>
    <v-subheader class="lssub deep-orange accent-4 white--text">
      LocalStorage
      <v-spacer />
      <v-btn
        outline
        small
        dark
        class="mx-0"
        @click="limparLS"
      >
        {{ $t('label.limpartudo') }}
      </v-btn>
    </v-subheader>
    <div class="pa-2">
      <vc-donut
        :sections="sections"
        :size="100"
        :thickness="40"
        :background="$vuetify.dark ? '#424242' : '#fff'"
        has-legend
        legend-placement="top"
      >
        <h1>{{ value }}%</h1>
      </vc-donut>
      <v-flex
        text-xs-center
        mt-2
      >
        {{ totalMB }} / {{ limitMB }} MB
      </v-flex>
    </div>
  </v-flex>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'LocalStorage',
  data: () => ({
    value: null,
    total: 0,
    limit: 5200000,
    sections: []
  }),
  computed: {
    ...mapGetters('items', ['items', 'versao']),
    LS () {
      return window.localStorage
    },
    totalMB () {
      return (this.total / 1000000).toFixed(2)
    },
    limitMB () {
      return (this.limit / 1000000).toFixed(2)
    }
  },
  watch: {
    items () {
      this.atualizar()
    },
    versao () {
      this.atualizar()
    }
  },
  mounted () {
    this.atualizar()
  },
  methods: {
    atualizar () {
      this.total = Object.keys(this.LS).map(key => this.LS[key].length).reduce((a, b) => a + b)
      this.value = Math.round((this.total / this.limit) * 100)
      this.getPorcentagens()
    },
    getPorcentagens () {
      const fn = (label, key) => {
        const section = { label, value: 0 }
        if (this.LS.getItem(key)) {
          const tam = this.LS.getItem(key).length
          section.value = Math.round((tam / this.limit) * 100)
        }
        return section
      }
      this.sections = []
      this.sections.push(fn(this.$i18n.t('localstorage.dados'), 'itens'))
      this.sections.push(fn(this.$i18n.t('localstorage.nomes'), 'itensList'))
      this.sections.push(fn(this.$i18n.t('localstorage.filtros'), 'filtros'))
      this.sections.push(fn(this.$i18n.t('localstorage.gears'), 'gears'))
      this.sections.push(fn(this.$i18n.t('localstorage.configs'), 'configs'))
      // const disponivel = this.sections.reduce((total, atual) => total - atual.value, 100)
      // this.sections.push({ label: this.$i18n.t('localstorage.disponivel'), value: disponivel, color: '#eeeeee' })
    },
    async limparLS () {
      try {
        await this.$ConfirmDialog.abrir({
          titulo: this.$i18n.t('dialog.ls.titulo'),
          mensagem: this.$i18n.t('dialog.ls.msg')
        })
        localStorage.clear()
        location.reload(true)
      } catch (e) {}
    }
  }
}
</script>

<style scoped>

</style>
