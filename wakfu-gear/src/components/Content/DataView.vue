<template>
  <v-content>
    <v-container
      fluid
      fill-height
      pa-0
      class="scroll"
      @mouseleave="hover = null"
    >
      <v-layout
        column
        class="bgView"
      >
        <div class="bgView">
          <v-layout
            shrink
            class="infoview"
          >
            <v-flex
              xs12
              pt-1
            >
              {{ $t('label.mostrando', [itemsLimitados.length]) }}
              {{ $t('label.qntitens', [itemsFiltrados.length]) }} >
              {{ $t('label.totalitens', [items.length]) }}
            </v-flex>
            <v-spacer />
            <v-flex
              pt-1
              pr-1
            >
              {{ $t('label.mostrar') }}:
            </v-flex>
            <v-btn-toggle
              v-model="mostrar"
              mandatory
            >
              <v-btn
                v-for="qnt in qntMostrar"
                :key="qnt"
                color="primary"
                depressed
                block
                dark
                small
                :value="qnt"
              >
                {{ qnt }}
              </v-btn>
            </v-btn-toggle>
          </v-layout>

          <div class="blockview">
            <div
              v-for="item in itemsLimitados"
              :key="item.id"
              class="itemview"
            >
              <ItemView
                :key="`iL${item.id}`"
                :value="item"
              />
            </div>
          </div>
        </div>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { mapGetters } from 'vuex'

import filtros from '../../functions/filtros'
import EventBus from '../../event-bus'
import ItemView from './ItemView'

import { equipType } from '../../model/equipType'

export default {
  name: 'DataTable',
  components: {
    ItemView
  },
  props: {
    value: { type: Array, default: () => [] }
  },
  data: () => ({
    itemsFiltrados: [],
    itemsLimitados: [],
    equipType: equipType,
    qntMostrar: [20, 40, 80],
    mostrar: 20,
    progress: true
  }),
  computed: {
    ...mapGetters('items', ['items', 'itemsList']),
    ...mapGetters('filtros', ['filtros'])
  },
  watch: {
    async mostrar () {
      this.itemsLimitados = await this.limitarDados()
    }
  },
  async mounted () {
    await this.eventoFiltragem(this.filtros)
    EventBus.$on('filtrar', this.eventoFiltragem)
  },
  beforeDestroy () {
    EventBus.$off('filtrar')
  },
  methods: {
    async eventoFiltragem (filtros) {
      this.itemsFiltrados = await this.filtrarDados(filtros)
      this.itemsLimitados = await this.limitarDados()
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
    limitarDados () {
      this.progress = true
      return new Promise((resolve, reject) => {
        let items = this.itemsFiltrados
        items = filtros.filtroLimit(items, { limit: this.mostrar })
        this.progress = false
        resolve(items)
      })
    }
  }
}
</script>

<style>
</style>
