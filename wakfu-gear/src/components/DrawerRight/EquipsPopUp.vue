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
          {{ nome }}
        </v-subheader>
        <template v-for="(item, index) in lista">
          <div :key="`ifx${index}`">
            <v-divider />
            <v-list-tile :class="`icone i${item.id} menulist paddingleft`">
              <v-list-tile-content class="fontsmall">
                <v-list-tile-title>{{ equipEffects.find(e => e.id === item.id)[$lang] }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-avatar class="fontsmall text-xs-right">
                {{ item.params[0] }}
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
    nome: { type: String, default: '' },
    lista: { type: Array, default: () => [] }
  },
  data: () => ({
    equipEffects
  })
}
</script>

<style scoped>

</style>
