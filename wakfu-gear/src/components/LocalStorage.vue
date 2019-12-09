<template>
  <v-flex
    pt-4
    text-xs-center
  >
    <v-flex text-xs-center>
      LocalStorage
    </v-flex>
    <vc-donut
      :sections="sections"
      :size="100"
      :thickness="40"
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
  </v-flex>
</template>

<script>
export default {
  name: 'LocalStorage',
  data: () => ({
    value: null,
    total: 0,
    limit: 5200000,
    sections: []
  }),
  computed: {
    LS: function () {
      return window.localStorage
    },
    totalMB: function () {
      return (this.total / 1000000).toFixed(2)
    },
    limitMB: function () {
      return (this.limit / 1000000).toFixed(2)
    }
  },
  watch: {
    LS: function () {
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
      fn('Item Data', 'itens')
      fn('Item Name', 'itensList')
      fn('Filters', 'filtros')
      fn('Gears', 'gears')
    }
  }
}
</script>

<style scoped>

</style>
