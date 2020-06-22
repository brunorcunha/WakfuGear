<template>
  <v-content :class="`white ${retrair ? 'retraido' : null}`">
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
                {{ $t('label.comparandogears') }}
              </div>
              {{ $t('label.qntgears', [qnt]) }} >
              <div class="caption">
                {{ $t('label.importeouadd') }}
              </div>
            </div>
          </v-flex>

          <v-flex
            ref="items"
            overflow-hidden
          >
            <table id="itemsTable">
              <tr>
                <draggable
                  v-model="atributosGears"
                  @end="onEndDrag"
                >
                  <template v-for="(gear, gid) in gears">
                    <GearView
                      :key="`iG${gid}${gear.nome}`"
                      :value="gear"
                      :gid="gid"
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
              <draggable v-model="atributos">
                <template v-for="(atributo, index) in atributos">
                  <tr
                    :key="`atr${index}`"
                    :class="ordenarPor === atributo ? (!!ordemAsc ? 'ordemAscSelecionada' : 'ordemSelecionada') : null"
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
              <template v-for="(atributo, indAtr) in atributos">
                <tr
                  :key="`tr${indAtr}`"
                  :class="ordenarPor === atributo ? 'atributoSelecionado' : null"
                >
                  <template v-for="(item, indIte) in atributosGears">
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
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import atributos from '../../functions/atributos'

import DataValue from './DataValue'
import GearView from './GearView'

import { equipType } from '../../model/equipType'
import { equipEffects } from '../../model/equipEffects'

export default {
  name: 'DataTableGears',
  components: {
    draggable,
    DataValue,
    GearView
  },
  props: {
    value: { type: Array, default: () => [] }
  },
  data: () => ({
    gears: [],
    atributosGears: [],
    atributos: [],
    retrair: false,
    ordenarPor: null,
    ordemAsc: null,
    hover: null,
    mostrar: 20,
    progress: true,
    equipEffects,
    equipType
  }),
  computed: {
    ...mapGetters('gears', ['allGears', 'qnt'])
  },
  watch: {
    allGears: {
      handler: function () {
        this.organizarGears()
      },
      deep: true
    }
  },
  async mounted () {
    this.organizarGears()

    this.$refs.dados.addEventListener('scroll', this.scrolling)
  },
  methods: {
    async organizarGears () {
      this.progress = true

      this.gears = JSON.parse(JSON.stringify(this.allGears))
      this.atributosGears = this.gears.map(gear => atributos.getAtributos(gear.gear))
      this.atributos = this.extrairAtributosDados(this.atributosGears)

      this.progress = false
    },
    extrairAtributosDados (gears) {
      return [
        ...new Set(
          gears.map(
            gear => Object.keys(gear).map(item => parseInt(item))
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

      if (evt.target.scrollLeft < 240) this.retrair = false
      else this.retrair = true
    },
    onEndDrag (ev) {
      const { oldIndex, newIndex } = ev
      this.gears.splice(newIndex, 0, this.gears.splice(oldIndex, 1)[0])
    }
  }
}
</script>

<style>
</style>
