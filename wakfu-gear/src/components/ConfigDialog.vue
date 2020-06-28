<template>
  <v-dialog
    v-model="dialog"
    scrollable
    transition="dialog-bottom-transition"
    max-width="900"
    @keydown.esc="fechar"
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
            dark
            flat
            @click="salvar"
          >
            <v-icon class="mr-1">
              save
            </v-icon>
            <span>{{ $t('label.salvar') }}</span>
          </v-btn>
          <v-btn
            icon
            dark
            class="mr-0"
            @click="fechar"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="scrolldialog">
        <v-layout row>
          <v-flex
            class="borderRight"
          >
            <v-list
              three-line
              subheader
            >
              <v-list-tile
                avatar
                @click="atualizarItens"
              >
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ $t('label.atualizaritens') }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    {{ $t('msg.atualizaritens') }}
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon x-large>
                    cloud_upload
                  </v-icon>
                </v-list-tile-action>
              </v-list-tile>

              <v-divider />

              <v-subheader>
                {{ $t('label.geral') }}
              </v-subheader>

              <v-divider />

              <v-list-tile
                avatar
                @click="trocarTema"
              >
                <v-list-tile-action>
                  <v-icon v-if="!darkTheme">
                    check_box_outline_blank
                  </v-icon>
                  <v-icon
                    v-else
                    color="primary"
                  >
                    check_box
                  </v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ $t('label.temaescuro') }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    {{ $t('msg.temaescuro') }}
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon x-large>
                    invert_colors
                  </v-icon>
                </v-list-tile-action>
              </v-list-tile>

              <v-divider />

              <v-list-tile
                avatar
                disabled
              >
                <v-list-tile-action>
                  <v-checkbox
                    disabled
                    color="primary"
                  />
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ $t('label.tabelatransposta') }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    {{ $t('msg.tabelatransposta') }}
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon x-large>
                    rotate_90_degrees_ccw
                  </v-icon>
                </v-list-tile-action>
              </v-list-tile>

              <v-divider />

              <v-list-tile
                avatar
                @click="setRetrair"
              >
                <v-list-tile-action>
                  <v-icon v-if="!retrair">
                    check_box_outline_blank
                  </v-icon>
                  <v-icon
                    v-else
                    color="primary"
                  >
                    check_box
                  </v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ $t('label.tabelaretrair') }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    {{ $t('msg.tabelaretrair') }}
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon x-large>
                    menu_open
                  </v-icon>
                </v-list-tile-action>
              </v-list-tile>

              <v-divider />

              <v-subheader>
                {{ $t('label.calculodano') }}
              </v-subheader>

              <v-divider />
            </v-list>

            <v-layout
              v-if="!!calculoDano"
              row
              wrap
              px-3
            >
              <v-flex
                xs6
                pr-2
              >
                <v-text-field
                  v-model="danoBase"
                  :mask="'####'"
                  :label="$t('label.basedano')"
                  placeholder="100"
                >
                  <template #append>
                    <img src="../../static/atributos/tags_09.png">
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex
                xs6
                pr-2
              >
                <v-text-field
                  v-model="criticoBase"
                  :mask="'####'"
                  :label="$t('label.basecritico')"
                  placeholder="125"
                  @change="setCalculoDano('criticoBase', $event)"
                >
                  <template #append>
                    <img src="../../static/atributos/tags_14.png">
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex
                xs6
                pr-2
              >
                <v-text-field
                  v-model="resistencia"
                  :mask="'####'"
                  :label="$t('label.resistencia')"
                  placeholder="0"
                  @change="setCalculoDano('resistencia', $event)"
                >
                  <template #append>
                    <img src="../../static/atributos/mini_29.png">
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex
                xs6
                pr-2
              >
                <v-text-field
                  disabled
                  :label="$t('label.resistenciap')"
                  placeholder="0%"
                  :value="`${resistenciaPorcentagem}%`"
                >
                  <template #append>
                    <img src="../../static/atributos/tags_031.png">
                  </template>
                </v-text-field>
              </v-flex>
            </v-layout>

            <v-divider />

            <v-list subheader>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ $t('label.posicaoconjurador') }}
                  </v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn-toggle
                    v-model="posicoes"
                    dark
                    mandatory
                    multiple
                  >
                    <v-btn
                      class="px-3"
                      color="deep-orange accent-4"
                      value="Frente"
                    >
                      <img
                        src="../../static/atributos/tags_09.png"
                        class="mr-1"
                      >
                      <span>{{ $t('label.frente') }}</span>
                    </v-btn>
                    <v-btn
                      class="px-3"
                      color="deep-orange accent-4"
                      value="Costas"
                    >
                      <img
                        src="../../static/atributos/tags_26.png"
                        class="mr-1"
                      >
                      <span>{{ $t('label.costas') }}</span>
                    </v-btn>
                  </v-btn-toggle>
                </v-list-tile-action>
              </v-list-tile>

              <v-divider />

              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ $t('label.alvofeitico') }}
                  </v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn-toggle
                    v-model="alvos"
                    dark
                    mandatory
                    multiple
                  >
                    <v-btn
                      class="px-3"
                      color="deep-orange accent-4"
                      value="ST"
                    >
                      <img
                        src="../../static/atributos/tags_19.png"
                        class="mr-1"
                      >
                      <span>{{ $t('label.alvounico') }}</span>
                    </v-btn>
                    <v-btn
                      class="px-3"
                      color="deep-orange accent-4"
                      value="ZONA"
                    >
                      <img
                        src="../../static/atributos/tags_21.png"
                        class="mr-1"
                      >
                      <span>{{ $t('label.zona') }}</span>
                    </v-btn>
                  </v-btn-toggle>
                </v-list-tile-action>
              </v-list-tile>

              <v-divider />

              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ $t('label.distanciaalvo') }}
                  </v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn-toggle
                    v-model="distancias"
                    dark
                    mandatory
                    multiple
                  >
                    <v-btn
                      class="px-3"
                      color="deep-orange accent-4"
                      value="CAC"
                    >
                      <img
                        src="../../static/atributos/tags_22.png"
                        class="mr-1"
                      >
                      <span>{{ $t('label.cac') }}</span>
                    </v-btn>
                    <v-btn
                      class="px-3"
                      color="deep-orange accent-4"
                      value="DIST"
                    >
                      <img
                        src="../../static/atributos/tags_20.png"
                        class="mr-1"
                      >
                      <span>{{ $t('label.distancia') }}</span>
                    </v-btn>
                  </v-btn-toggle>
                </v-list-tile-action>
              </v-list-tile>

              <v-divider />

              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ $t('label.multiplicadores') }}
                  </v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn-toggle
                    v-model="multiplicadores"
                    dark
                    multiple
                  >
                    <v-btn
                      class="px-3"
                      color="deep-orange accent-4"
                      value="Critico"
                    >
                      <img
                        src="../../static/atributos/tags_14.png"
                        class="mr-1"
                      >
                      <span>{{ $t('label.critico') }}</span>
                    </v-btn>
                    <v-btn
                      class="px-3"
                      color="deep-orange accent-4"
                      value="Berserk"
                    >
                      <img
                        src="../../static/atributos/tags_17.png"
                        class="mr-1"
                      >
                      <span>{{ $t('label.berserk') }}</span>
                    </v-btn>
                  </v-btn-toggle>
                </v-list-tile-action>
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
    dialog: false,
    danoBase: 0,
    criticoBase: 0,
    resistencia: 0,
    posicoes: [],
    alvos: [],
    distancias: [],
    multiplicadores: []
  }),
  computed: {
    ...mapGetters('configs', ['darkTheme', 'calculoDano', 'showDano', 'retrair']),
    resistenciaPorcentagem () {
      if (!this.resistencia || this.resistencia <= 0) return 0
      return Math.round((1 - Math.pow(0.800000011920929, this.resistencia / 100)) * 100)
    }
  },
  methods: {
    abrir () {
      this.getValores()
      this.dialog = true
    },
    salvar () {
      this.setValores()
      this.fechar()
    },
    fechar () {
      this.dialog = false
    },
    trocarTema () {
      this.$store.dispatch('configs/setDarkTheme', !this.darkTheme)
    },
    setRetrair () {
      this.$store.dispatch('configs/setRetrair', !this.retrair)
    },
    getValores () {
      this.danoBase = this.calculoDano.danoBase
      this.criticoBase = this.calculoDano.criticoBase
      this.resistencia = this.calculoDano.resistencia

      this.posicoes = this.showDano.posicoes
      this.alvos = this.showDano.alvos
      this.distancias = this.showDano.distancias
      this.multiplicadores = this.showDano.multiplicadores
    },
    setValores () {
      this.$store.dispatch('configs/setDanos', {
        calculoDano: {
          danoBase: parseInt(this.danoBase),
          criticoBase: parseInt(this.criticoBase),
          resistencia: parseInt(this.resistencia)
        },
        showDanos: {
          posicoes: this.posicoes,
          alvos: this.alvos,
          distancias: this.distancias,
          multiplicadores: this.multiplicadores
        }
      })
    }
  }
}
</script>

<style scoped></style>
