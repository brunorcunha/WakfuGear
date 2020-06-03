<template>
  <v-layout
    column
    fill-height
  >
    <v-flex
      class="bg"
      shrink
    >
      <v-layout
        column
        fill-height
      >
        <v-flex shrink>
          <TitleView />
        </v-flex>
        <v-flex grow>
          <EquipsView />
        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex shrink>
      <v-progress-linear
        :indeterminate="progress"
        color="deep-orange accent-4"
        height="2"
        class="my-0"
      />
    </v-flex>

    <v-flex
      pa-1
      class="scroll"
    >
      <AlertsView />
      <Atributos />
    </v-flex>
  </v-layout>
</template>

<script>
import TitleView from './TitleView'
import EquipsView from './EquipsView'
import AlertsView from './AlertsView'
import Atributos from './Atributos'

export default {
  name: 'Equipamento',
  components: { Atributos, TitleView, EquipsView, AlertsView },
  data: () => ({
    progress: false
  })
}
</script>

<style scoped>
</style>
