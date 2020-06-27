<template>
  <v-menu
    open-on-hover
    bottom
    left
    offset-x
    content-class="pointerevent"
  >
    <template #activator="{ on: hover }">
      <slot :hover="hover" />
    </template>
    <v-card>
      <v-list
        dense
        subheader
      >
        <v-subheader class="deep-orange accent-4 white--text">
          {{ gear.nome }}
        </v-subheader>
        <template v-for="(item, index) in gear.gear">
          <div
            v-if="!!item"
            :key="`gear${gear.nome}${index}`"
          >
            <v-divider />
            <v-list-tile class="menulist">
              <v-list-tile-action>
                <v-img
                  :src="`${url}${item.iid[0]}.png`"
                  height="30"
                  width="30"
                  lazy-src="/static/erro2.png"
                  contain
                />
              </v-list-tile-action>
              <v-list-tile-content class="fontsmall">
                <v-list-tile-title>
                  {{ item.title[$lang] }}
                </v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-avatar class="fontsmall pr-2">
                {{ $t('label.nv') }}{{ item.lvl }}
              </v-list-tile-avatar>
            </v-list-tile>
          </div>
        </template>
        <template v-if="gear.qntItens === 0">
          <div class="pa-3">
            {{ $t('alert.add_equips') }}
          </div>
        </template>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'GearsPopUp',
  props: {
    gear: { type: Object, default: () => ({}) }
  },
  data: () => ({
    url: 'http://s.ankama.com/www/static.ankama.com/wakfu/portal/game/item/42/'
  })
}
</script>

<style scoped>

</style>
