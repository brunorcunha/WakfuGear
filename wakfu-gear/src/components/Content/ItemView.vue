<template>
  <td
    v-if="item"
    class="itemHeader"
    @dblclick="adicionarAoGear"
  >
    <v-img
      class="img"
      aspect-ratio="1"
      lazy-src="/static/erro.png"
      width="115"
      height="115"
      :src="`http://s.ankama.com/www/static.ankama.com/wakfu/portal/game/item/115/${item.iid[0]}.png`"
    />

    <v-tooltip bottom>
      <template #activator="{ on }">
        <span
          :class="`nome r${item.rarity} text-truncate`"
          v-on="on"
        >{{ item.title[$lang] || '' }}</span>
      </template>
      <span>{{ item.title[$lang] || '' }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template #activator="{ on }">
        <div
          :class="`raridade r${item.rarity}`"
          v-on="on"
        />
      </template>
      <span>{{ $t(`raridade[${item.rarity}]`) }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template #activator="{ on }">
        <div
          :class="`tipo t${item.type}`"
          v-on="on"
        />
      </template>
      <span>{{ (equipType.find(e => e.id === item.type || e.iid === item.type) || {})[$lang] }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template #activator="{ on }">
        <div
          class="nivel"
          v-on="on"
        >
          {{ item.lvl }}
        </div>
      </template>
      <span>{{ $t('label.nivel') }} {{ item.lvl }}</span>
    </v-tooltip>

    <div class="menu">
      <v-menu
        v-model="vmenu"
        bottom
        right
        transition="slide-y-transition"
        offset-y
      >
        <template #activator="{ on: menu }">
          <v-tooltip bottom>
            <template #activator="{ on: tooltip }">
              <v-btn
                small
                icon
                flat
                v-on="{ ...menu, ...tooltip }"
              >
                <v-avatar size="15">
                  <img src="/static/atributos/tags_35.png">
                </v-avatar>
              </v-btn>
            </template>
            <span>{{ $t('label.opcoes') }}</span>
          </v-tooltip>
        </template>
        <v-list
          dense
          subheader
        >
          <v-subheader class="deep-orange accent-4 white--text">
            {{ item.title[$lang] }}
          </v-subheader>
          <v-divider />
          <v-menu
            open-on-hover
            right
            transition="slide-x-transition"
            offset-x
            :close-on-content-click="true"
          >
            <template #activator="{ on: submenu }">
              <v-list-tile
                @click.stop
                v-on="submenu"
              >
                <v-list-tile-content>
                  {{ $t('label.adicionaraogear') }}
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon small>
                    arrow_forward_ios
                  </v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </template>
            <ListGears
              @evento="adicionarAoGear"
            />
          </v-menu>
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
    </div>
  </td>
</template>

<script>
import { mapGetters } from 'vuex'
import { equipType } from '../../model/equipType'
import ListGears from '../DrawerRight/ListGears'
import EventBus from '../../event-bus'

export default {
  components: { ListGears },
  props: {
    value: { type: Object, default: null }
  },
  data: () => ({
    vmenu: false,
    item: null,
    equipType
  }),
  computed: {
    ...mapGetters('gears', ['gears', 'indexAtual'])
  },
  mounted () {
    this.item = this.value
  },
  methods: {
    abrirURL (type, id) {
      const lang = this.$i18n.locale === 'pt' ? 'pt' : 'en'
      const enciclopedia = lang === 'pt' ? 'enciclopedia' : 'encyclopedia'
      const armor = lang === 'pt' ? 'armas' : 'armors'
      const url = `https://www.wakfu.com/${lang}/mmorpg/${enciclopedia}/${armor}/${id}-${type}`
      window.open(url)
    },
    adicionarAoGear (gear, index) {
      this.$store.dispatch('gears/adicionarItem', { item: this.item, index })
      EventBus.$emit('addEquip')
      this.vmenu = false
    }
  }
}
</script>
