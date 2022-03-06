<template>
  <v-menu
    open-on-hover
    bottom
    left
    offset-x
    class="inlineblock elevation-11"
    content-class="pointerevent"
  >
    <template #activator="{ on: hover }">
      <slot :hover="hover" />
    </template>
    <v-card outlined>
      <v-layout row>
        <v-flex>
          <v-list
            dense
            subheader
          >
            <v-subheader class="deep-orange accent-4 white--text">
              {{ item.title[$lang] }}
              <v-spacer />
              <span>{{ $t('label.nv') }}{{ item.lvl || '0' }}</span>
            </v-subheader>
            <template v-for="(atributo, index) in item.equipEffects">
              <div :key="`ifx${index}`">
                <v-divider />
                <v-list-tile :class="`icone i${atributo.id} menulist paddingleft`">
                  <v-list-tile-content class="fontsmall">
                    <v-list-tile-title>{{ equipEffects.find(e => e.id === atributo.id)[$lang] }}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-avatar class="fontsmall text-xs-right">
                    {{ atributo.params[0] }}
                  </v-list-tile-avatar>
                </v-list-tile>
              </div>
            </template>
          </v-list>
        </v-flex>
        <template v-if="isCompare">
          <v-flex
            v-for="(itemCompare, indexItemCompare) in itemsCompare"
            :key="itemCompare.id"
            style="border-left:1px solid rgba(255,255,255,.2);"
          >
            <v-list
              dense
              subheader
            >
              <v-subheader class="deep-orange darken-4 white--text px-3 justify-center">
                <img
                  width="38"
                  height="38"
                  :src="`${url}${itemsCompare[indexItemCompare].iid[0]}.png`"
                  alt=""
                >
              </v-subheader>
              <template v-for="(atributo, index) in item.equipEffects">
                <div :key="`ifx${index}`">
                  <v-divider />
                  <v-list-tile class="menulist">
                    <div class="pl-2 pr-1 pt-1">
                      <img
                        v-if="fxItems[indexItemCompare][index].type === 'add'"
                        src="/static/atributos/up.png"
                        alt=""
                      >
                      <img
                        v-else-if="fxItems[indexItemCompare][index].type === 'sub'"
                        src="/static/atributos/down.png"
                        alt=""
                      >
                      <img
                        v-else
                        src="/static/atributos/eq.png"
                        alt=""
                      >
                    </div>
                    <v-list-tile-content>
                      <v-list-tile-title class="fontsmall text-xs-center pr-2">
                        <span
                          v-if="fxItems[indexItemCompare][index].type === 'add'"
                          class="green--text"
                        >
                          +{{ fxItems[indexItemCompare][index].value }}
                        </span>
                        <span
                          v-else-if="fxItems[indexItemCompare][index].type === 'sub'"
                          class="red--text"
                        >
                          {{ fxItems[indexItemCompare][index].value }}
                        </span>
                        <span v-else>
                          {{ atributo.params[0] }}
                        </span>
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </div>
              </template>
            </v-list>
          </v-flex>
        </template>
      </v-layout>
    </v-card>
  </v-menu>
</template>

<script>
import { equipEffects } from '../../model/equipEffects'
import { mapGetters } from 'vuex'
import { equipType } from '../../model/equipType'

export default {
  name: 'EquipsPopUp',
  props: {
    item: { type: Object, default: () => ({}) }
  },
  data: () => ({
    url: 'http://s.ankama.com/www/static.ankama.com/wakfu/portal/game/item/42/',
    equipEffects
  }),
  computed: {
    ...mapGetters('gears', ['gearAtual', 'vazio']),
    typesItem () {
      return equipType.find(e => e.id === this.item.type).pos
    },
    itemsCompare () {
      return this.typesItem.map((e) => this.gearAtual[e]).filter((e) => !!e && e.id !== this.item.id)
    },
    isCompare () {
      return !!(!this.vazio && this.itemsCompare.length)
    },
    fxItems () {
      return this.itemsCompare.map((e) => {
        return this.item.equipEffects.map(fx => {
          const original = fx.params[0] || 0
          const valor = e.equipEffects.find((f) => f.id === fx.id)?.params[0] || 0
          const value = original - valor
          const typeEQ = value < 0 ? 'sub' : 'eq'
          const type = value > 0 ? 'add' : typeEQ
          return { type, value }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
