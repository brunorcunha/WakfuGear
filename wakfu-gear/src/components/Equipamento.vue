<template>
  <v-layout
    column
    fill-height
  >
    <v-flex
      class="bg"
      shrink
    >
      <v-layout
        column
        fill-height
      >
        <v-flex shrink>
          <v-layout
            row
            no-wrap
            pb-0
            px-2
          >
            <v-flex>
              <v-text-field
                class="pt-2 mt-0"
                dark
                single-line
                hide-details
                :readonly="!edit"
                :disabled="!edit"
                label="Título do Conjunto"
                :rules="[v => !!v || 'Obrigatório']"
              >
                <v-menu
                  slot="prepend"
                  bottom
                  right
                  transition="slide-x-transition"
                  offset-x
                >
                  <template #activator="{ on: menu }">
                    <v-tooltip
                      bottom
                      mt-0
                    >
                      <template #activator="{ on: tooltip }">
                        <v-btn
                          small
                          icon
                          flat
                          class="ma-0"
                          v-on="{ ...menu, ...tooltip }"
                        >
                          <v-icon>menu</v-icon>
                        </v-btn>
                      </template>
                      <span>Opções</span>
                    </v-tooltip>
                  </template>
                  <v-list dense>
                    <v-list-tile @click="abrirURL(item.type, item.id)">
                      <v-list-tile-title>Abrir no site oficial</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
                <v-tooltip
                  slot="append-outer"
                  bottom
                  mt-0
                >
                  <v-btn
                    slot="activator"
                    icon
                    class="ma-0"
                    dark
                    @click="edit = !edit"
                  >
                    <v-icon>{{ edit ? 'check' : 'edit' }}</v-icon>
                  </v-btn>
                  <span>{{ edit ? 'Gravar Título' : 'Editar Título' }}</span>
                </v-tooltip>
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex grow>
          <v-layout
            align-center
            fill-height
          >
            <v-flex
              xs12
              px-3
              pb-4
              pt-0
              class="text-xs-center"
            >
              <template v-for="(i, k) in gear">
                <v-menu
                  v-if="!!i"
                  :key="`gear${i.iid[0]}${k}`"
                  class="dib"
                  bottom
                  right
                  transition="slide-x-transition"
                  offset-x
                >
                  <template #activator="{ on: menu }">
                    <v-tooltip
                      bottom
                    >
                      <template #activator="{ on: tooltip }">
                        <v-btn
                          dark
                          flat
                          fab
                          small
                          class="mx-1 mb-0"
                          v-on="{ ...menu, ...tooltip }"
                        >
                          <v-img
                            :class="`minirarity r${i.rarity}`"
                            aspect-ratio="1"
                            lazy-src="/static/erro2.png"
                            width="42"
                            height="42"
                            :src="`${url}${i.iid[0]}.png`"
                          />
                        </v-btn>
                      </template>
                      <span>{{ i.title.pt }}</span>
                    </v-tooltip>
                  </template>
                  <v-list
                    dense
                    subheader
                  >
                    <v-subheader class="deep-orange accent-4 white--text">
                      {{ i.title.pt }}
                    </v-subheader>
                    <v-divider />
                    <v-list-tile @click="remover(k)">
                      <v-list-tile-content>
                        Remover
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <v-icon small>
                          delete_forever
                        </v-icon>
                      </v-list-tile-action>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </template>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex shrink>
      <v-progress-linear
        :indeterminate="progress"
        color="deep-orange accent-4"
        height="2"
        class="my-0"
      />
    </v-flex>

    <v-flex
      pa-1
      class="scroll"
    >
      <v-expand-transition>
        <v-alert
          v-show="!somenteUmEpico"
          color="pink lighten-1"
          icon="warning"
          class="py-0"
          :value="true"
        >
          {{ $t('alert.one_epic') }}
        </v-alert>
      </v-expand-transition>
      <v-expand-transition>
        <v-alert
          v-show="!somenteUmaReliquia"
          color="purple lighten-1"
          icon="warning"
          class="py-0"
          :value="true"
        >
          {{ $t('alert.one_relic') }}
        </v-alert>
      </v-expand-transition>
      <v-expand-transition>
        <v-alert
          v-show="!somenteUmUnico"
          color="light-blue lighten-1"
          icon="warning"
          class="py-0"
          :value="true"
        >
          {{ $t('alert.one_unique') }}
        </v-alert>
      </v-expand-transition>

      <Atributos />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import Atributos from './Atributos'
import EventBus from '../event-bus'

export default {
  name: 'Equipamento',
  components: { Atributos },
  data: () => ({
    url: 'http://s.ankama.com/www/static.ankama.com/wakfu/portal/game/item/42/',
    active: false,
    edit: false,
    items: [],
    sets: [],
    ultimoNumero: 1,
    model: null,
    search: null,
    progress: false
  }),
  computed: {
    ...mapGetters('gear', ['gear']),
    somenteUmaReliquia: function () {
      return Object.keys(this.gear).filter(e => this.gear[e] && this.gear[e].rarity === 5).length <= 1
    },
    somenteUmEpico: function () {
      return Object.keys(this.gear).filter(e => this.gear[e] && this.gear[e].rarity === 7).length <= 1
    },
    somenteUmUnico: function () {
      if (!this.gear.LEFT_HAND || !this.gear.RIGHT_HAND) return true
      return this.gear.LEFT_HAND.id !== this.gear.RIGHT_HAND.id
    }
  },
  methods: {
    next () {
      this.active = !this.active
    },
    remover (chave) {
      this.$store.dispatch('gear/removerItem', chave)
    },
    adicionarConjunto () {
      this.sets.push({
        nome: 'Conjunto #' + this.ultimoNumero++
      })
    },
    confirmarExcluir (index) {
      EventBus.$emit('confirm', 'Confirmar', 'Tem certeza que deseja excluir este conjunto?', () => {
        this.sets.splice(index, 1)
      }, () => {})
    }
  }
}
</script>

<style scoped>
  .bg {
    background: url(../../static/bg.jpg) center;
    background-size: 100% 100%;
    min-height: 165px;
    max-height: 165px;
    height: 165px;
  }
  .scroll{
    overflow-y: auto;
    background-color: #F3F2F2;
  }
  .dib {
    display: inline-block;
  }
  .minirarity {
    position: relative;
    display: inline-block;
  }
  .minirarity:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    background: url(../../static/raridade/m1.png) no-repeat center;
    width: 12px;
    height: 12px;
  }
  .minirarity.r2:before { background-image: url(../../static/raridade/m2.png); }
  .minirarity.r3:before { background-image: url(../../static/raridade/m3.png); }
  .minirarity.r4:before { background-image: url(../../static/raridade/m4.png); }
  .minirarity.r5:before { background-image: url(../../static/raridade/m5.png); }
  .minirarity.r7:before { background-image: url(../../static/raridade/m6.png); }
  .minirarity.r6:before { background-image: url(../../static/raridade/m7.png); }
</style>
