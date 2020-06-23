<template>
  <v-dialog
    v-model="dialog"
    scrollable
    transition="dialog-bottom-transition"
    max-width="900"
  >
    <v-card>
      <v-toolbar
        dark
        flat
        class="cabecalho"
      >
        <v-toolbar-title>
          <v-icon
            dark
            left
          >
            settings
          </v-icon>
          {{ $t('label.configs') }}
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="scrolldialog">
        <v-layout>
          <v-flex grow class="borderRight">
            <v-list
              three-line
              subheader
            >
              <v-subheader>
                Geral
              </v-subheader>

              <v-divider />

              <v-list-tile avatar @click="trocarTema">
                <v-list-tile-action>
                  <v-checkbox :value="darkTheme" color="primary" />
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>
                    Tema Escuro
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    Alterna entre o tema branco e o tema mais escuro.
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon x-large>
                    invert_colors
                  </v-icon>
                </v-list-tile-action>
              </v-list-tile>

              <v-divider />

              <v-list-tile avatar disabled @click="sound = !sound">
                <v-list-tile-action>
                  <v-checkbox :value="sound" disabled color="primary" />
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>
                    Tabela Transposta
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    Alterna entre as exibições de tabela em linha ou coluna.
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon x-large>
                    rotate_90_degrees_ccw
                  </v-icon>
                </v-list-tile-action>
              </v-list-tile>

              <v-divider />
            </v-list>

            <v-list
              three-line
              subheader
            >
              <v-subheader>
                Cálculo de Danos
              </v-subheader>

              <v-divider />

              <v-list-tile avatar @click="widgets = !widgets">
                <v-list-tile-action>
                  <v-checkbox :value="widgets" color="primary" />
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>
                    Auto-add widgets
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    Automatically add home screen widgets
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-divider />
            </v-list>
          </v-flex>
          <v-flex shrink>
            <v-card
              flat
              width="300"
              class="outlined ma-2 mr-2"
            >
              <localStorage />
            </v-card>
            <v-card
              flat
              width="300"
              class="outlined ma-2 mr-2"
            >
              <MoreInfos />
            </v-card>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import LocalStorage from './LocalStorage'
import MoreInfos from './MoreInfos'

export default {
  name: 'ConfigDialog',
  components: { LocalStorage, MoreInfos },
  data: () => ({
    dialog: true,
    sound: false,
    widgets: false
  }),
  computed: {
    ...mapGetters('configs', ['darkTheme'])
  },
  methods: {
    abrir () {
      this.dialog = true
    },
    trocarTema () {
      this.$store.dispatch('configs/setDarkTheme', !this.darkTheme)
    }
  }
}
</script>

<style scoped>

</style>
