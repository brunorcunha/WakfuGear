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
              {{ $t('label.mostrando', [itemsLimitados.length]) }}
            </div>
            {{ $t('label.qntitens', [itemsFiltrados.length]) }} >
            <div class="caption">
              {{ $t('label.totalitens', [items.length]) }}
            </div>
          </v-flex>

          <v-flex
            ref="items"
            overflow-hidden
          >
            <table id="itemsTable">
              <tr>
                <draggable v-model="itemsLimitados">
                  <template v-for="item in itemsLimitados">
                    <ItemView
                      :key="`iL${item.id}`"
                      :value="item"
                    />
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
import ItemView from './ItemView'

import { equipType } from '../model/equipType'
import { equipEffects } from '../model/equipEffects'
import { states } from '../model/states'

export default {
  name: 'DataTable',
  components: {
    draggable,
    DataValue,
    ItemView
  },
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
    }
  }
}
</script>

<style>
  #dados tr:hover {
    background: #fff4f2;
  }
</style>
