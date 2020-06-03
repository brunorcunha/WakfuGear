<template>
  <v-menu offset-y>
    <template #activator="{ on: menu }">
      <v-tooltip bottom>
        <template #activator="{ on: tooltip }">
          <v-btn
            flat
            icon
            small
            dark
            class="ma-0"
            v-on="{ ...tooltip, ...menu }"
          >
            <img :src="`static/flags/${$i18n.locale}.png`">
          </v-btn>
        </template>
        <span>{{ $t('label.trocaridioma') }}</span>
      </v-tooltip>
    </template>
    <v-list
      dense
      subheader
    >
      <v-subheader>{{ $t('label.trocaridioma') }}</v-subheader>
      <v-divider />
      <template v-for="lang in langs">
        <v-list-tile
          :key="lang.locale"
          @click="mudarIdioma(lang)"
        >
          <v-list-tile-action
            style="min-width: auto;"
            class="mr-2"
          >
            <img :src="`static/flags/${lang.locale}.png`">
          </v-list-tile-action>
          <v-list-tile-content>{{ lang.nome }}</v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  data: () => ({
    langs: [
      { locale: 'pt', nome: 'Português' },
      { locale: 'en', nome: 'English' }
    ]
  }),
  methods: {
    mudarIdioma (lang) {
      if (this.$i18n.locale === lang.locale) return
      this.$store.dispatch('filtros/salvar', { ...this.filtros, lang: lang.locale })
      this.atualizarItens()
    }
  }
}
</script>
