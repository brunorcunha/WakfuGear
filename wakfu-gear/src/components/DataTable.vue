<template>
  <v-content class="white">
    <v-container
      fluid
      fill-height
      pa-0
      @mouseleave="hover = null"
    >
      <v-layout column>
        <v-layout
          id="header"
          class="alturaInfo"
        >
          <v-flex
            id="info"
            class="larguraInfo"
          >
            <div class="caption">
              Mostrando {{ itemsLimitados.length }} de
            </div>
            {{ itemsFiltrados.length }} itens >
            <div class="caption">
              Total de {{ items.length }} itens
            </div>
          </v-flex>

          <v-flex
            ref="items"
            overflow-hidden
          >
            <table id="itemsTable">
              <tr>
                <draggable v-model="itemsLimitados">
                  <template v-for="(item, index) in itemsLimitados">
                    <td
                      :key="`iL${index}`"
                      class="itemHeader"
                    >
                      <v-img
                        class="img"
                        aspect-ratio="1"
                        lazy-src="/static/erro.png"
                        width="115"
                        height="115"
                        :src="`http://s.ankama.com/www/static.ankama.com/wakfu/portal/game/item/115/${item.iid[0]}.png`"
                      />

                      <v-tooltip bottom>
                        <template #activator="{ on }">
                          <span
                            :class="`nome r${item.rarity} text-truncate`"
                            v-on="on"
                          >{{ item.title[$lang] || '' }}</span>
                        </template>
                        <span>{{ item.title[$lang] || '' }}</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template #activator="{ on }">
                          <div
                            :class="`raridade r${item.rarity}`"
                            v-on="on"
                          />
                        </template>
                        <span>{{ $t(`raridade[${item.rarity}]`) }}</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template #activator="{ on }">
                          <div
                            :class="`tipo t${item.type}`"
                            v-on="on"
                          />
                        </template>
                        <span>{{ equipType.find(e => e.id === item.type)[$lang] }}</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template #activator="{ on }">
                          <div
                            class="nivel"
                            v-on="on"
                          >
                            {{ item.lvl }}
                          </div>
                        </template>
                        <span>Nível {{ item.lvl }}</span>
                      </v-tooltip>

                      <div class="menu">
                        <v-menu
                          bottom
                          right
                          transition="slide-y-transition"
                          offset-y
                        >
                          <template #activator="{ on: menu }">
                            <v-tooltip bottom>
                              <template #activator="{ on: tooltip }">
                                <v-btn
                                  small
                                  icon
                                  flat
                                  v-on="{ ...menu, ...tooltip }"
                                >
                                  <v-avatar size="15">
                                    <img src="/static/atributos/tags_35.png">
                                  </v-avatar>
                                </v-btn>
                              </template>
                              <span>Opções</span>
                            </v-tooltip>
                          </template>
                          <v-list
                            dense
                            subheader
                          >
                            <v-subheader class="deep-orange accent-4 white--text">
                              {{ item.title[$lang] }}
                            </v-subheader>
                            <v-divider />
                            <v-menu
                              open-on-hover
                              right
                              transition="slide-y-transition"
                              offset-x
                              :close-on-content-click="false"
                            >
                              <template v-slot:activator="{ on: submenu }">
                                <v-list-tile
                                  @click.stop
                                  v-on="submenu"
                                >
                                  <v-list-tile-content>
                                    Adicionar ao Gear
                                  </v-list-tile-content>
                                  <v-list-tile-action>
                                    <v-icon small>
                                      arrow_forward_ios
                                    </v-icon>
                                  </v-list-tile-action>
                                </v-list-tile>
                              </template>
                              <v-list dense>
                                <v-list-tile @click="adicionarGear(item)">
                                  <v-list-tile-content>
                                    ATUAL
                                  </v-list-tile-content>
                                </v-list-tile>
                              </v-list>
                            </v-menu>
                            <v-divider />
                            <v-list-tile @click="abrirURL(item.type, item.id)">
                              <v-list-tile-content>
                                Abrir no site oficial
                              </v-list-tile-content>
                              <v-list-tile-action>
                                <v-icon small>
                                  open_in_new
                                </v-icon>
                              </v-list-tile-action>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </div>
                    </td>
                  </template>
                </draggable>
              </tr>
            </table>
          </v-flex>
        </v-layout>

        <v-layout class="progress">
          <v-progress-linear
            :indeterminate="progress"
            height="2"
            class="my-0"
          />
        </v-layout>

        <v-layout overflow-hidden>
          <v-flex
            id="atributos"
            ref="atributos"
            class="larguraInfo sh"
          >
            <table>
              <draggable v-model="itemsAtributos">
                <template v-for="(atributo, index) in itemsAtributos">
                  <tr :key="`atr${index}`">
                    <td>{{ traduzir(equipEffects, atributo) }}</td>
                  </tr>
                </template>
              </draggable>
            </table>
          </v-flex>

          <v-flex
            ref="dados"
            class="scrollX"
            shrink
          >
            <table id="dados">
              <template v-for="(atributo, indAtr) in itemsAtributos">
                <tr :key="`tr${indAtr}`">
                  <template v-for="(item, indIte) in itemsLimitados">
                    <td :key="`i${indAtr}_${indIte}`">
                      <DataValue :value="getValor(item, atributo)" />
                    </td>
                  </template>
                </tr>
              </template>
            </table>
          </v-flex>
        </v-layout>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'

import filtros from '../functions/filtros'
import EventBus from '../event-bus'
import DataValue from './DataValue'

import { equipType } from '../model/equipType'
import { equipEffects } from '../model/equipEffects'
import { states } from '../model/states'

export default {
  name: 'DataTable',
  components: { draggable, DataValue },
  props: {
    value: { type: Array, default: () => [] }
  },
  data: () => ({
    itemsFiltrados: [],
    itemsLimitados: [],
    itemsAtributos: [],
    equipEffects: equipEffects,
    equipType: equipType,
    hover: null,
    mostrar: 20,
    progress: true
  }),
  computed: {
    ...mapGetters('items', ['items', 'itemsList']),
    ...mapGetters('filtros', ['filtros'])
  },
  async mounted () {
    await this.eventoFiltragem(this.filtros)

    this.$refs.dados.addEventListener('scroll', this.scrolling)
    EventBus.$on('filtrar', this.eventoFiltragem)
  },
  beforeDestroy () {
    EventBus.$off('filtrar')
  },
  methods: {
    async eventoFiltragem (filtros) {
      this.itemsFiltrados = await this.filtrarDados(filtros)
      // this.itemsFiltrados = await this.ordenarDados()
      this.itemsLimitados = await this.limitarDados()
      this.itemsAtributos = await this.extrairAtributosDados()
    },
    traduzir (array, id) {
      const valor = array.find(e => e.id === id || e.iid.includes(id))
      return valor ? valor[this.$lang].replace('{[>2]?s:}', 's').replace('[#1]', '') : '-'
    },
    getValor (item, atributo) {
      const valor = item.equipEffects.find(e => e.id === atributo)
      if (valor && valor.params[0] != null) {
        if (atributo === 304) {
          const efeito = states.find(e => e.id === valor.params[0])
          return {
            text: efeito[this.$lang],
            id: valor.params[0],
            lvl: valor.params[2]
          }
        } else {
          if (equipEffects.find(e => e.iid.includes(atributo))) return { text: -valor.params[0] }
          return { text: valor.params[0] }
        }
      }
      return null
    },
    scrolling (evt) {
      this.$refs.atributos.scrollTop = evt.target.scrollTop
      this.$refs.items.scrollLeft = evt.target.scrollLeft
    },
    async getItems () {
      this.progress = true
      if (!localStorage['itens']) {
        const dados = await this.$http.get(`${this.$endpoint}/items?lang=pt`)
        const itens = dados.body.sort((a, b) => a.lvl - b.lvl)
        const itensList = itens.filter(e => e.title).map(e => e.title[this.$lang])
        localStorage.setItem('itens', JSON.stringify(itens))
        localStorage.setItem('itensList', JSON.stringify(itensList))
      }
      this.progress = false
      return JSON.parse(localStorage.getItem('itens'))
    },
    filtrarDados (filtro) {
      this.progress = true
      return new Promise((resolve, reject) => {
        let items = this.items
        items = filtros.filtroNome(items, filtro)
        items = filtros.filtroLevel(items, filtro)
        items = filtros.filtroRaridade(items, filtro)
        items = filtros.filtroTipo(items, filtro)
        items = filtros.filtroBonus(items, filtro)
        this.progress = false
        EventBus.$emit('terminouFiltragem')
        resolve(items)
      })
    },
    ordenarDados (campo) {
      this.progress = true
      return new Promise((resolve, reject) => {
        const items = this.itemsFiltrados
        if (campo) items.sort((a, b) => a[campo] - b[campo])
        this.progress = false
        resolve(items)
      })
    },
    limitarDados () {
      this.progress = true
      return new Promise((resolve, reject) => {
        let items = this.itemsFiltrados
        items = filtros.filtroLimit(items, { limit: this.mostrar })
        this.progress = false
        resolve(items)
      })
    },
    extrairAtributosDados () {
      this.progress = true
      return new Promise((resolve, reject) => {
        const atributos = [
          ...new Set(
            this.itemsLimitados.map(
              item => item.equipEffects.map(fx => fx.id)
            ).flat()
          )
        ]
        this.progress = false
        resolve(atributos)
      })
    },
    abrirURL (type, id) {
      window.open(`https://www.wakfu.com/pt/mmorpg/enciclopedia/armas/${id}-${type}`)
    },
    adicionarGear (item) {
      this.$store.dispatch('gear/adicionarItem', item)
    }
  }
}
</script>

<style>
  #dados tr:hover {
    background: #fff4f2;
  }
</style>
