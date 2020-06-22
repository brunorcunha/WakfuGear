<template>
  <span v-if="!valor">-</span>
  <span v-else-if="!valor.id">{{ valor.text }}</span>
  <ExternalState
    v-else
    :value="valor"
  />
</template>

<script>
import { states } from '../../model/states'
import { equipEffects } from '../../model/equipEffects'
import ExternalState from './ExternalState'

export default {
  name: 'DataValue',
  components: { ExternalState },
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
    tratarValue (val) {
      const { item, atributo } = val
      const valor = !item.equipEffects ? item[atributo] : item.equipEffects.find(e => e.id === atributo)
      if (valor != null) {
        const param = !valor.params ? valor : valor.params[0]
        const paramlvl = !valor.params ? null : valor.params[2]
        if (param != null) {
          if (atributo === 304) {
            const efeito = states.find(e => e.id === param)
            this.valor = {
              text: efeito[this.$lang],
              id: param,
              lvl: paramlvl
            }
          } else {
            this.valor = { text: param }
            if (equipEffects.find(e => e.iid.includes(atributo))) this.valor = { text: -param }
          }
        }
        return
      }
      this.valor = null
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
