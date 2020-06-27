<template>
  <v-layout
    row
    pa-0
    fill-height
  >
    <v-flex
      xs3
      :class="`${value[0] === 'Frente' ? 'tipescuro' : 'tipclaro'} text-xs-center pt-1`"
    >
      {{ $t(`label.${value[0]}`) }}
    </v-flex>
    <v-flex
      xs3
      :class="`${value[1] === 'ST' ? 'tipescuro' : 'tipclaro'} text-xs-center pt-1`"
    >
      {{ $t(`label.${value[1]}`) }}
    </v-flex>
    <v-flex
      xs3
      :class="`${value[2] === 'CAC' ? 'tipescuro' : 'tipclaro'} text-xs-center pt-1`"
    >
      {{ $t(`label.${value[2]}`) }}
    </v-flex>
    <v-flex
      xs3
      :class="`${value[3] === 'Normal' || value[3] === 'Berserk' ? 'tipescuro' : 'tipclaro'} text-xs-center pt-1`"
    >
      {{ $t(`label.${value[3]}`) }}
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'IndiceDano',
  props: {
    value: { type: Array, default: () => [] }
  }
}
</script>

<style scoped>

</style>
