<template>
  <v-content :class="`${retrair ? 'retraido' : ''}`">
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
            <div class="texto">
              <div class="caption">
                {{ $t('label.mostrando', [itemsLimitados.length]) }}
              </div>
              {{ $t('label.qntitens', [itemsFiltrados.length]) }} >
              <div class="caption">
                {{ $t('label.totalitens', [items.length]) }}
              </div>
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
                  <tr
                    :key="`atr${index}`"
                    :class="ordenarPor === atributo ? (!!ordemAsc ? 'ordemAscSelecionada' : 'ordemSelecionada') : null"
                    @click="ordenar(atributo)"
                  >
                    <v-tooltip bottom>
                      <template #activator="{ on }">
                        <td
                          :class="`icone i${atributo}`"
                          v-on="on"
                        >
                          <span>{{ traduzir(equipEffects, atributo) }}</span>
                        </td>
                      </template>
                      <span>{{ traduzir(equipEffects, atributo) }}</span>
                    </v-tooltip>
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
                <tr
                  :key="`tr${indAtr}`"
                  :class="ordenarPor === atributo ? 'atributoSelecionado' : null"
                >
                  <template v-for="(item, indIte) in itemsLimitados">
                    <td :key="`i${indAtr}_${indIte}`">
                      <DataValue :value="{ item, atributo }" />
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
import EventBus from '../../event-bus'
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'

import filtros from '../../functions/filtros'
import DataValue from './DataValue'
import ItemView from './ItemView'

import { equipType } from '../../model/equipType'
import { equipEffects } from '../../model/equipEffects'

export default {
  name: 'DataTableEquips',
  components: {
    draggable,
    DataValue,
    ItemView
  },
  props: {
    value: { type: Array, default: () => [] }
  },
  data: () => ({
    retrair: false,
    ordenarPor: null,
    ordemAsc: null,
    itemsFiltrados: [],
    itemsLimitados: [],
    itemsAtributos: [],
    hover: null,
    mostrar: 20,
    progress: true,
    equipEffects,
    equipType
  }),
  computed: {
    ...mapGetters('configs', { retrairSetting: 'retrair' }),
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
    async ordenar (id) {
      this.ordemAsc = !this.ordemAsc
      if (this.ordenarPor !== id) this.ordemAsc = !true
      this.ordenarPor = id
      this.progress = true

      this.itemsOrdenados = await this.ordenarDados(this.itemsFiltrados)
      this.itemsLimitados = await this.limitarDados(this.itemsOrdenados)
      this.itemsAtributos = await this.extrairAtributosDados(this.itemsOrdenados)

      this.progress = false
    },
    async ordenarDados (items) {
      if (this.ordenarPor) {
        items.sort((a, b) => {
          if (a.equipEffects && b.equipEffects) {
            const aTmp = a.equipEffects.find(e => e.id === this.ordenarPor) || { params: [0] }
            const bTmp = b.equipEffects.find(e => e.id === this.ordenarPor) || { params: [0] }
            if (aTmp.params[0] > bTmp.params[0]) return -1
            if (aTmp.params[0] < bTmp.params[0]) return 1
          }
          return 0
        })
      }
      if (this.ordemAsc) items.reverse()
      return items
    },
    async eventoFiltragem (filtros) {
      this.progress = true

      this.itemsFiltrados = await this.filtrarDados(this.items, filtros)
      this.itemsOrdenados = await this.ordenarDados(this.itemsFiltrados)
      this.itemsLimitados = await this.limitarDados(this.itemsOrdenados)
      this.itemsAtributos = await this.extrairAtributosDados(this.itemsOrdenados)

      this.progress = false
      EventBus.$emit('terminouFiltragem')
    },
    async filtrarDados (items, filtro) {
      if (filtros.existeFiltroNome(filtro)) items = filtros.filtroNome(items, filtro)
      else {
        items = filtros.filtroLevel(items, filtro)
        items = filtros.filtroRaridade(items, filtro)
        items = filtros.filtroTipo(items, filtro)
        items = filtros.filtroBonus(items, filtro)
        items = filtros.filtroIgnorarBonus(items, filtro)
      }

      return items
    },
    limitarDados (items) {
      return filtros.filtroLimit(items, { limit: this.mostrar })
    },
    extrairAtributosDados (items) {
      return [
        ...new Set(
          items.map(
            item => item.equipEffects.map(fx => fx.id)
          ).flat()
        )
      ].sort()
    },
    traduzir (array, id) {
      const valor = array.find(e => e.id === id || e.iid.includes(id))
      return valor ? valor[this.$lang] || id : id
    },
    scrolling (evt) {
      this.$refs.atributos.scrollTop = evt.target.scrollTop
      this.$refs.items.scrollLeft = evt.target.scrollLeft

      if (this.retrairSetting) {
        if (evt.target.scrollLeft < 20 && this.$vuetify.breakpoint.lgAndUp) this.retrair = false
        else this.retrair = true
      }
    }
  }
}
</script>

<style>
</style>
