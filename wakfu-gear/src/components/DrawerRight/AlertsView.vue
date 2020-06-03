<template>
  <div>
    <v-expand-transition>
      <v-alert
        v-show="!somenteUmEpico"
        dismissible
        dark
        color="pink lighten-1"
        icon="warning"
        class="py-0"
        :value="true"
      >
        {{ $t('alert.one_epic') }}
      </v-alert>
    </v-expand-transition>
    <v-expand-transition>
      <v-alert
        v-show="!somenteUmaReliquia"
        dismissible
        dark
        color="purple lighten-1"
        icon="warning"
        class="py-0"
        :value="true"
      >
        {{ $t('alert.one_relic') }}
      </v-alert>
    </v-expand-transition>
    <v-expand-transition>
      <v-alert
        v-show="!somenteUmUnico"
        dismissible
        dark
        color="light-blue lighten-1"
        icon="warning"
        class="py-0"
        :value="true"
      >
        {{ $t('alert.one_unique') }}
      </v-alert>
    </v-expand-transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AlertsView',
  computed: {
    ...mapGetters('gears', ['gears', 'gearAtual', 'vazio', 'nome', 'qnt']),
    somenteUmaReliquia () {
      if (!this.gearAtual) return true
      return Object.keys(this.gearAtual).filter(e => this.gearAtual[e] && this.gearAtual[e].rarity === 5).length <= 1
    },
    somenteUmEpico () {
      if (!this.gearAtual) return true
      return Object.keys(this.gearAtual).filter(e => this.gearAtual[e] && this.gearAtual[e].rarity === 7).length <= 1
    },
    somenteUmUnico () {
      if (!this.gearAtual) return true
      if (!this.gearAtual.LEFT_HAND || !this.gearAtual.RIGHT_HAND) return true
      return this.gearAtual.LEFT_HAND.id !== this.gearAtual.RIGHT_HAND.id
    }
  }
}
</script>

<style scoped>

</style>
