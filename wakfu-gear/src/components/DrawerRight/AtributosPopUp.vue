<template>
  <v-menu
    open-on-hover
    bottom
    left
    offset-x
    content-class="pointerevent"
  >
    <template #activator="{ on }">
      <slot
        :on="lista && lista.length > 0 ? on : null"
        :nome="nome"
        :total="total"
      />
    </template>
    <v-card>
      <v-list
        dense
        subheader
      >
        <v-subheader class="deep-orange accent-4 white--text">
          {{ nome }}
          <v-spacer />
          <span>{{ total || '0' }}</span>
        </v-subheader>
        <template v-for="(item, index) in lista">
          <div :key="`ia${index}`">
            <v-divider />
            <v-list-tile class="menulist">
              <v-list-tile-action>
                <img
                  :src="`${url}${item.item.iid[0]}.png`"
                  height="30"
                >
              </v-list-tile-action>
              <v-list-tile-content class="fontsmall">
                <v-list-tile-title>{{ item.item.title[$lang] }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-avatar class="fontsmall">
                {{ item.valor }}
              </v-list-tile-avatar>
            </v-list-tile>
          </div>
        </template>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'AtributosPopUp',
  props: {
    nome: { type: String, default: '' },
    total: { type: Number, default: 0 },
    lista: { type: Array, default: () => [] }
  },
  data: () => ({
    url: 'http://s.ankama.com/www/static.ankama.com/wakfu/portal/game/item/42/'
  })
}
</script>

<style scoped>

</style>
