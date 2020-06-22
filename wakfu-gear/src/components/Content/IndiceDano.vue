<template>
  <v-layout
    row
    pa-0
    fill-height
  >
    <v-flex
      xs3
      :class="`red ${value[0] === 'Frente' ? 'red lighten-1' : 'darken-1'} text-xs-center pt-1`"
    >
      {{ $t(`label.${value[0]}`) }}
    </v-flex>
    <v-flex
      xs3
      :class="`green ${value[1] === 'ST' ? 'accent-4' : 'darken-1'} text-xs-center pt-1`"
    >
      {{ $t(`label.${value[1]}`) }}
    </v-flex>
    <v-flex
      xs3
      :class="`purple ${value[2] === 'CAC' ? 'accent-4' : 'accent-3'} text-xs-center pt-1`"
    >
      {{ $t(`label.${value[2]}`) }}
    </v-flex>
    <v-flex
      xs3
      :class="`blue ${value[3] === 'Normal' || value[3] === 'Berserk' ? 'darken-1' : 'darken-2'} text-xs-center pt-1`"
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
