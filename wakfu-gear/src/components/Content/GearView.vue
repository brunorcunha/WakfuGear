<template>
  <td
    v-if="gear"
    class="itemHeader"
  >
    <div class="raridadegear">
      <v-tooltip
        v-if="items.length >= 1"
        bottom
      >
        <template #activator="{ on }">
          <div
            :class="`raridade r${items[0].rarity}`"
            v-on="on"
          />
        </template>
        <span>{{ $t(`raridade[${items[0].rarity}]`) }}</span>
      </v-tooltip>
      <v-tooltip
        v-if="items.length >= 2"
        bottom
      >
        <template #activator="{ on }">
          <div
            :class="`raridade r${items[1].rarity}`"
            v-on="on"
          />
        </template>
        <span>{{ $t(`raridade[${items[1].rarity}]`) }}</span>
      </v-tooltip>
    </div>

    <div class="tipogear">
      <v-tooltip
        v-if="items.length >= 1"
        bottom
      >
        <template #activator="{ on }">
          <div
            :class="`tipo t${items[0].type}`"
            v-on="on"
          />
        </template>
        <span>{{ (equipType.find(e => e.id === items[0].type || e.iid === items[0].type) || {})[$lang] }}</span>
      </v-tooltip>
      <v-tooltip
        v-if="items.length >= 2"
        bottom
      >
        <template #activator="{ on }">
          <div
            :class="`tipo t${items[1].type}`"
            v-on="on"
          />
        </template>
        <span>{{ (equipType.find(e => e.id === items[1].type || e.iid === items[1].type) || {})[$lang] }}</span>
      </v-tooltip>
    </div>

    <div class="imggear">
      <v-img
        v-if="items.length === 0"
        aspect-ratio="1"
        src="/static/erro.png"
        width="70"
        height="70"
      />
      <v-img
        v-if="items.length >= 1"
        aspect-ratio="1"
        lazy-src="/static/erro.png"
        width="70"
        height="70"
        :src="`http://s.ankama.com/www/static.ankama.com/wakfu/portal/game/item/115/${items[0].iid[0]}.png`"
      />
      <v-img
        v-if="items.length >= 2"
        aspect-ratio="1"
        lazy-src="/static/erro.png"
        width="70"
        height="70"
        :src="`http://s.ankama.com/www/static.ankama.com/wakfu/portal/game/item/115/${items[1].iid[0]}.png`"
      />
    </div>

    <v-tooltip bottom>
      <template #activator="{ on }">
        <span
          :class="`nome text-truncate`"
          v-on="on"
        >{{ gear.nome || '' }}</span>
      </template>
      <span>{{ gear.nome || '' }}</span>
    </v-tooltip>

    <v-tooltip
      v-if="nivel > 0"
      bottom
    >
      <template #activator="{ on }">
        <div
          class="nivel"
          v-on="on"
        >
          {{ $t('label.nv') }} {{ nivel }}
        </div>
      </template>
      <span>{{ $t('label.nv') }} {{ nivel }}</span>
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
            {{ gear.nome || '' }}
          </v-subheader>
          <v-divider />
          <v-list-tile @click="abrirGear">
            <v-list-tile-content>
              {{ $t('label.abrirgear') }}
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon small>
                arrow_forward
              </v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>
  </td>
</template>

<script>
import { equipType } from '../../model/equipType'
import EventBus from '../../event-bus'

export default {
  props: {
    value: { type: Object, default: null },
    gid: { type: Number, default: 0 }
  },
  data: () => ({
    vmenu: null,
    gear: null,
    nivel: null,
    items: [],
    equipType
  }),
  watch: {
    value (val) {
      this.getInfos(val)
    }
  },
  mounted () {
    this.getInfos(this.value)
  },
  methods: {
    getInfos (val) {
      this.gear = val
      this.items = []
      this.raridades = []
      let nivel = 0
      Object.keys(this.gear.gear).forEach(item => {
        item = this.gear.gear[item]
        if (item) {
          nivel = item.lvl > nivel ? item.lvl : nivel
          this.items.push(item)
        }
      })
      const ajusteRaridade = raridade => raridade === 5 ? 15 : raridade
      this.items.sort((a, b) => ajusteRaridade(b.rarity) - ajusteRaridade(a.rarity))
      this.nivel = nivel
    },
    abrirGear () {
      EventBus.$emit('abrirGear', this.gid)
    }
  }
}
</script>
