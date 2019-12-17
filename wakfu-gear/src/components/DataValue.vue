<template>
  <span v-if="!value">-</span>
  <span v-else-if="!value.id">{{ value.text }}</span>
  <v-tooltip
    v-else
    bottom
  >
    <template #activator="{ on }">
      <small
        class="link"
        v-on="on"
        @click="abrirDialog"
      >{{ value.text }} ({{ value.lvl }})</small>
    </template>
    <span>{{ value.text }} ({{ value.lvl }})</span>
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
          return {
            text: efeito[this.$lang],
            id: valor.params[0],
            lvl: valor.params[2]
          }
        } else {
          if (equipEffects.find(e => e.iid.includes(atributo))) return { text: -valor.params[0] }
          return { text: valor.params[0] }
        }
      }
      return null
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
