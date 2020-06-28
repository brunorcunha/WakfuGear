<template>
  <v-menu
    class="dib"
    bottom
    right
    transition="slide-x-transition"
    offset-x
  >
    <template #activator="{ on: menu }">
      <EquipsPopUp
        v-slot="{ hover }"
        :item="item"
      >
        <slot
          :on="{ ...menu, ...hover }"
        />
      </EquipsPopUp>
    </template>
    <v-list
      dense
      subheader
    >
      <v-subheader class="deep-orange accent-4 white--text">
        {{ item.title[$lang] }}
        <v-spacer />
        <span>{{ $t('label.nv') }}{{ item.lvl || '0' }}</span>
      </v-subheader>
      <v-divider />
      <v-list-tile @click="remover(posicao)">
        <v-list-tile-content>
          {{ $t('label.remover') }}
        </v-list-tile-content>
        <v-list-tile-action>
          <v-icon
            small
            color="red"
          >
            delete_forever
          </v-icon>
        </v-list-tile-action>
      </v-list-tile>
      <v-divider />
      <v-list-tile @click="abrirURL(item.type, item.id)">
        <v-list-tile-content>
          {{ $t('label.abrirsiteoficial') }}
        </v-list-tile-content>
        <v-list-tile-action>
          <v-icon small>
            open_in_new
          </v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
import EquipsPopUp from './EquipsPopUp'

export default {
  name: 'MenuEquip',
  components: { EquipsPopUp },
  props: {
    item: { type: Object, default: () => ({}) },
    posicao: { type: String, default: '' }
  },
  methods: {
    remover (posicao) {
      this.$store.dispatch('gears/removerItem', { posicao })
    },
    abrirURL (type, id) {
      const lang = this.$i18n.locale === 'pt' ? 'pt' : 'en'
      const enciclopedia = lang === 'pt' ? 'enciclopedia' : 'encyclopedia'
      const armor = lang === 'pt' ? 'armas' : 'armors'
      const url = `https://www.wakfu.com/${lang}/mmorpg/${enciclopedia}/${armor}/${id}-${type}`
      window.open(url)
    }
  }
}
</script>

<style scoped>

</style>
