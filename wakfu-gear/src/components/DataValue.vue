<template>
  <span v-if="!valor">-</span>
  <span v-else-if="!valor.id">{{ valor.text }}</span>
  <v-tooltip
    v-else
    bottom
  >
    <template #activator="{ on }">
      <small
        class="link"
        v-on="on"
        @click="abrirDialog"
      >{{ valor.text }} ({{ valor.lvl }})</small>
    </template>
    <span>{{ valor.text }} ({{ valor.lvl }})</span>
  </v-tooltip>
</template>

<script>
import { states } from '../model/states'
import { equipEffects } from '../model/equipEffects'

export default {
  name: 'DataValue',
  props: {
    value: { type: Object, default: null }
  },
  data: vm => ({
    valor: null
  }),
  watch: {
    value (val) {
      this.tratarValue(val)
    }
  },
  mounted () {
    this.tratarValue(this.value)
  },
  methods: {
    abrirDialog () {
      this.$LinkerState.abrir(this.value)
    },
    tratarValue (val) {
      const { item, atributo } = val
      const valor = item.equipEffects.find(e => e.id === atributo)
      if (valor && valor.params[0] != null) {
        if (atributo === 304) {
          const efeito = states.find(e => e.id === valor.params[0])
          this.valor = {
            text: efeito[this.$lang],
            id: valor.params[0],
            lvl: valor.params[2]
          }
        } else {
          this.valor = { text: valor.params[0] }
          if (equipEffects.find(e => e.iid.includes(atributo))) this.valor = { text: -valor.params[0] }
        }
      } else {
        this.valor = null
      }
    }
  }
}
</script>

<style scoped>
  .link {
    display: inline-block;
    cursor: pointer;
  }
  .link:hover{
    text-decoration: underline;
  }
</style>
