<template>
  <v-flex>
    <v-subheader class="lssub deep-orange accent-4 white--text">
      {{ $t('label.moreinfos') }} (v{{ versao }})
    </v-subheader>
    <div class="pa-2 infolines">
      <v-layout><v-flex>{{ $t('info.itens') }}</v-flex><v-flex>{{ (infos.totalItens || 0) | formatNumber }}</v-flex></v-layout>
      <v-layout><v-flex>{{ $t('info.altonivel') }}</v-flex><v-flex>{{ (infos.highlvl || 0) | formatNumber }}</v-flex></v-layout>
      <v-layout><v-flex>{{ $t('info.reliquias') }}</v-flex><v-flex>{{ (infos.reliquias || 0) | formatNumber }}</v-flex></v-layout>
      <v-layout><v-flex>{{ $t('info.epicos') }}</v-flex><v-flex>{{ (infos.epicos || 0) | formatNumber }}</v-flex></v-layout>
      <v-layout><v-flex>{{ $t('info.lembrancas') }}</v-flex><v-flex>{{ (infos.souveniers || 0) | formatNumber }}</v-flex></v-layout>
      <v-layout><v-flex>{{ $t('info.mascotes') }}</v-flex><v-flex>{{ (infos.pets || 0) | formatNumber }}</v-flex></v-layout>
      <v-layout><v-flex>{{ $t('info.montarias') }}</v-flex><v-flex>{{ (infos.mounts || 0) | formatNumber }}</v-flex></v-layout>
      <v-layout><v-flex>{{ $t('info.sematributos') }}</v-flex><v-flex>{{ (infos.cosmeticos || 0) | formatNumber }}</v-flex></v-layout>
      <v-layout><v-flex>{{ $t('info.comefeitos') }}</v-flex><v-flex>{{ (infos.efeito || 0) | formatNumber }}</v-flex></v-layout>
      <v-layout><v-flex>{{ $t('info.armas') }}</v-flex><v-flex>{{ (infos.armas || 0) | formatNumber }}</v-flex></v-layout>
      <v-layout><v-flex>{{ $t('info.segundamao') }}</v-flex><v-flex>{{ (infos.segunda || 0) | formatNumber }}</v-flex></v-layout>
      <v-layout><v-flex>{{ $t('info.escudos') }}</v-flex><v-flex>{{ (infos.escudos || 0) | formatNumber }}</v-flex></v-layout>
    </div>
  </v-flex>
</template>

<script>
import { mapGetters } from 'vuex'
import { equipType } from '../model/equipType'

export default {
  name: 'MoreInfos',
  data: () => ({
    value: null,
    total: 0,
    limit: 5200000,
    sections: [],
    infos: {}
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
    LS () {
      this.atualizarLS()
    },
    items () {
      this.atualizarInfos()
    }
  },
  mounted () {
    this.atualizarLS()
    this.atualizarInfos()
  },
  methods: {
    atualizarLS () {
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
    },
    atualizarInfos () {
      const totalItens = this.items.length
      let epicos = 0
      let reliquias = 0
      let souveniers = 0
      let pets = 0
      let mounts = 0
      let cosmeticos = 0
      let highlvl = 0
      let efeito = 0
      let armas = 0
      let segunda = 0
      let escudos = 0
      const tipos = equipType.map(e => [e.id, e.iid])
      this.items.forEach(atual => {
        const subtipo = tipos.find(e => e[0] === atual.type)[1]
        epicos += atual.rarity === 7 ? 1 : 0
        reliquias += atual.rarity === 5 ? 1 : 0
        souveniers += atual.rarity === 6 ? 1 : 0
        pets += atual.type === 582 ? 1 : 0
        mounts += atual.type === 611 ? 1 : 0
        cosmeticos += atual.equipEffects.length === 0 ? 1 : 0
        highlvl += atual.lvl >= 200 ? 1 : 0
        efeito += atual.equipEffects.some(e => e.id === 304) ? 1 : 0
        armas += (subtipo === 518 || subtipo === 519) ? 1 : 0
        segunda += (subtipo === 520) ? 1 : 0
        escudos += (atual.type === 189) ? 1 : 0
      })

      this.infos = {
        totalItens,
        epicos,
        reliquias,
        souveniers,
        pets,
        mounts,
        cosmeticos,
        highlvl,
        efeito,
        armas,
        segunda,
        escudos
      }
    }
  }
}
</script>

<style scoped>

</style>
