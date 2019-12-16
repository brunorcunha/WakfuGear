<template>
  <v-list dense>
    <v-list-tile
      v-for="(gear, index) in gears"
      :key="`${index}${gear}`"
      @click="$emit('evento', gear, index)"
    >
      <v-list-tile-content>
        {{ gear }}
        <template v-if="indexAtual === index">
          ({{ $t('label.atual') }})
        </template>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ListGears',
  computed: {
    ...mapGetters('gears', ['gears', 'indexAtual'])
  }
}
</script>

<style scoped>

</style>
