<template>
  <v-layout
    align-center
    fill-height
  >
    <v-flex
      xs12
      px-3
      pb-4
      pt-0
      class="text-xs-center"
    >
      <template v-if="vazio">
        <span class="msg">{{ $t('msg.adicionarEquip') }}</span>
      </template>
      <template v-for="(i, k) in gearAtual">
        <MenuEquip
          v-if="!!i"
          :key="`gear${i.iid[0]}${k}`"
          v-slot="{ on }"
          :item="i"
          :posicao="k"
        >
          <v-btn
            dark
            flat
            fab
            small
            class="mx-1 mb-0"
            v-on="on"
          >
            <v-img
              :class="`minirarity r${i.rarity}`"
              aspect-ratio="1"
              lazy-src="/static/erro2.png"
              width="42"
              height="42"
              :src="`${url}${i.iid[0]}.png`"
            />
          </v-btn>
        </MenuEquip>
      </template>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import MenuEquip from './MenuEquip'

export default {
  name: 'EquipsView',
  components: { MenuEquip },
  data: () => ({
    url: 'http://s.ankama.com/www/static.ankama.com/wakfu/portal/game/item/42/'
  }),
  computed: {
    ...mapGetters('gears', ['gears', 'gearAtual', 'vazio', 'nome', 'qnt'])
  }
}
</script>

<style scoped>

</style>
