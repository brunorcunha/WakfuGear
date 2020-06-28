<template>
  <v-menu
    open-on-hover
    bottom
    left
    offset-x
    class="inlineblock"
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
    </v-card>
  </v-menu>
</template>

<script>
import { equipEffects } from '../../model/equipEffects'

export default {
  name: 'EquipsPopUp',
  props: {
    item: { type: Object, default: () => {} }
  },
  data: () => ({
    equipEffects
  })
}
</script>

<style scoped>

</style>
