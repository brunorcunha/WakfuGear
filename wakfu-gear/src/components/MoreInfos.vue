<template>
  <v-flex>
    <v-subheader class="lssub deep-orange accent-4 white--text">
      {{ $t('label.moreinfos') }} (v{{ versao }})
    </v-subheader>
    <div class="pa-2 infolines">
      <v-layout><v-flex>Items</v-flex><v-flex>9.999</v-flex></v-layout>
      <v-layout><v-flex>Relics</v-flex><v-flex>9.999</v-flex></v-layout>
      <v-layout><v-flex>Epics</v-flex><v-flex>9.999</v-flex></v-layout>
      <v-layout><v-flex>Lembrança</v-flex><v-flex>9.999</v-flex></v-layout>
      <v-layout><v-flex>Pets</v-flex><v-flex>9.999</v-flex></v-layout>
      <v-layout><v-flex>Mounts</v-flex><v-flex>9.999</v-flex></v-layout>
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
    ...mapGetters('items', ['versao']),
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
    LS () {
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
          this.sections.push(section)
        }
      }
      this.sections = []
      fn(this.$i18n.t('localstorage.dados'), 'itens')
      fn(this.$i18n.t('localstorage.nomes'), 'itensList')
      fn(this.$i18n.t('localstorage.filtros'), 'filtros')
      fn(this.$i18n.t('localstorage.gears'), 'gears')
    }
  }
}
</script>

<style scoped>

</style>
