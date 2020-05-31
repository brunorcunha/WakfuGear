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
                ref="titulo"
                class="pt-2 mt-0"
                dark
                single-line
                hide-details
                :value="nome"
                :readonly="!edit"
                :disabled="!edit"
                :label="$t('label.tituloconjunto')"
                @change="mudarNome"
                @focus="$event.target.select()"
                @keyup.native.enter="editarTitulo"
                @blur="editarTitulo"
              >
                <v-menu
                  slot="prepend"
                  bottom
                  right
                  transition="slide-y-transition"
                  offset-y
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
                      <span>{{ $t('label.opcoes') }}</span>
                    </v-tooltip>
                  </template>
                  <v-list dense>
                    <v-list-tile @click="novoConjunto">
                      <v-list-tile-content><v-list-tile-title>{{ $t('label.novogear') }}</v-list-tile-title></v-list-tile-content>
                      <v-list-tile-action>
                        <v-icon color="green">
                          add
                        </v-icon>
                      </v-list-tile-action>
                    </v-list-tile>
                    <v-list-tile @click="clonarConjunto">
                      <v-list-tile-content><v-list-tile-title>{{ $t('label.clonar') }}</v-list-tile-title></v-list-tile-content>
                      <v-list-tile-action>
                        <v-icon color="orange">
                          library_add
                        </v-icon>
                      </v-list-tile-action>
                    </v-list-tile>
                    <v-menu
                      open-on-hover
                      right
                      transition="slide-x-transition"
                      offset-x
                      :close-on-content-click="false"
                    >
                      <template #activator="{ on: submenu }">
                        <v-list-tile
                          @click.stop
                          v-on="submenu"
                        >
                          <v-list-tile-content>
                            {{ $t('label.trocargear') }}
                          </v-list-tile-content>
                          <v-list-tile-action>
                            <v-icon small>
                              arrow_forward_ios
                            </v-icon>
                          </v-list-tile-action>
                        </v-list-tile>
                      </template>
                      <ListGears
                        @evento="trocarGear"
                      />
                    </v-menu>
                    <v-list-tile @click="confirmarExcluir">
                      <v-list-tile-content><v-list-tile-title>{{ $t('label.remover') }}</v-list-tile-title></v-list-tile-content>
                      <v-list-tile-action>
                        <v-icon color="red">
                          delete
                        </v-icon>
                      </v-list-tile-action>
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
                    @click="editarTitulo"
                  >
                    <v-icon>{{ edit ? 'check' : 'edit' }}</v-icon>
                  </v-btn>
                  <span>{{ edit ? $t('label.gravartitulo') : $t('label.editartitulo') }}</span>
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
              <template v-if="vazio">
                <span class="msg">{{ $t('msg.adicionarEquip') }}</span>
              </template>
              <template v-for="(i, k) in gearAtual">
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
                    <v-menu
                      open-on-hover
                      bottom
                      left
                      offset-x
                      class="inlineblock"
                    >
                      <template #activator="{ on: hover }">
                        <v-btn
                          dark
                          flat
                          fab
                          small
                          class="mx-1 mb-0"
                          v-on="{ ...menu, ...hover }"
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
                      <v-card>
                        <v-list
                          dense
                          subheader
                        >
                          <v-subheader class="deep-orange accent-4 white--text">
                            {{ i.title[$lang] }}
                          </v-subheader>
                          <template v-for="(item, index) in i.equipEffects">
                            <div :key="`ifx${index}`">
                              <v-divider />
                              <v-list-tile :class="`icone i${item.id} menulist paddingleft`">
                                <v-list-tile-content class="fontsmall">
                                  <v-list-tile-title>{{ equipEffects.find(e => e.id === item.id)[$lang] }}</v-list-tile-title>
                                </v-list-tile-content>
                                <v-list-tile-avatar class="fontsmall">
                                  {{ item.params[0] }}
                                </v-list-tile-avatar>
                              </v-list-tile>
                            </div>
                          </template>
                        </v-list>
                      </v-card>
                    </v-menu>
                  </template>
                  <v-list
                    dense
                    subheader
                  >
                    <v-subheader class="deep-orange accent-4 white--text">
                      {{ i.title[$lang] }}
                    </v-subheader>
                    <v-divider />
                    <v-list-tile @click="remover(k)">
                      <v-list-tile-content>
                        {{ $t('label.remover') }}
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <v-icon small>
                          delete_forever
                        </v-icon>
                      </v-list-tile-action>
                    </v-list-tile>
                    <v-divider />
                    <v-list-tile @click="abrirURL(i.type, i.id)">
                      <v-list-tile-content>
                        {{ $t('label.abrirsiteoficial') }}
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <v-icon small>
                          open_in_new
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
          dismissible
          dark
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
          dismissible
          dark
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
          dismissible
          dark
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
import { equipEffects } from '../model/equipEffects'
import { mapGetters } from 'vuex'
import Atributos from './Atributos'
import ListGears from './ListGears'

export default {
  name: 'Equipamento',
  components: { Atributos, ListGears },
  data: () => ({
    equipEffects,
    url: 'http://s.ankama.com/www/static.ankama.com/wakfu/portal/game/item/42/',
    edit: false,
    model: null,
    search: null,
    progress: false
  }),
  computed: {
    ...mapGetters('gears', ['gears', 'gearAtual', 'vazio', 'nome', 'qnt']),
    somenteUmaReliquia () {
      if (!this.gearAtual) return true
      return Object.keys(this.gearAtual).filter(e => this.gearAtual[e] && this.gearAtual[e].rarity === 5).length <= 1
    },
    somenteUmEpico () {
      if (!this.gearAtual) return true
      return Object.keys(this.gearAtual).filter(e => this.gearAtual[e] && this.gearAtual[e].rarity === 7).length <= 1
    },
    somenteUmUnico () {
      if (!this.gearAtual) return true
      if (!this.gearAtual.LEFT_HAND || !this.gearAtual.RIGHT_HAND) return true
      return this.gearAtual.LEFT_HAND.id !== this.gearAtual.RIGHT_HAND.id
    }
  },
  methods: {
    editarTitulo () {
      this.edit = !this.edit
      if (this.edit) setTimeout(() => this.$refs.titulo.focus(), 200)
    },
    mudarNome (nome) {
      this.$store.dispatch('gears/setNome', { nome })
    },
    remover (posicao) {
      this.$store.dispatch('gears/removerItem', { posicao })
    },
    novoConjunto () {
      const index = this.qnt
      this.$store.dispatch('gears/adicionarGear', {})
      this.$store.dispatch('gears/selecionarAtual', { index })
    },
    clonarConjunto () {
      const index = this.qnt
      this.$store.dispatch('gears/clonarGear', {})
      this.$store.dispatch('gears/selecionarAtual', { index })
    },
    trocarGear (gear, index) {
      this.$store.dispatch('gears/selecionarAtual', { index })
    },
    abrirURL (type, id) {
      if (this.$i18n.locale === 'pt') {
        window.open(`https://www.wakfu.com/pt/mmorpg/enciclopedia/armas/${id}-${type}`)
      } else {
        window.open(`https://www.wakfu.com/en/mmorpg/encyclopedia/armors/${id}-${type}`)
      }
    },
    async confirmarExcluir () {
      try {
        await this.$ConfirmDialog.abrir({
          titulo: this.$i18n.t('dialog.excluir.titulo'),
          mensagem: this.$i18n.t('dialog.excluir.msg')
        })
        this.$store.dispatch('gears/removerGear', {})
      } catch (e) {}
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
  .msg {
    font-size: 22px;
    color: rgba(255,255,255,.4);
  }
  .inlineblock { display: inline-block; }
  .paddingleft { padding-left: 15px; }
</style>
