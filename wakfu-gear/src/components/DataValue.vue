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
import EventBus from '../event-bus'

export default {
  name: 'DataValue',
  props: {
    value: { type: Object, default: null }
  },
  methods: {
    abrirDialog () {
      EventBus.$emit('ExternalState', this.value)
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
