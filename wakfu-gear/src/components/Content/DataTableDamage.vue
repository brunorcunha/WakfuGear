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
                {{ $t('label.comparandodanogears') }}
              </div>
              {{ $t('label.qntgears', [qnt]) }} >
              <div class="caption">
                <a
                  class="linkBranco mnr-24"
                  href="https://wakfucalculadora.netlify.app/"
                  target="_blank"
                >
                  {{ $t('label.calculadoradano') }}
                  <v-icon
                    small
                    dark
                    class="ml-1"
                  >
                    launch
                  </v-icon>
                </a>
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
                  v-model="danos"
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
              <template v-for="(indice, index) in indices">
                <tr
                  :key="`atr${index}`"
                  :class="ordenarPor === indice ? (!!ordemAsc ? 'ordemAscSelecionada' : 'ordemSelecionada') : null"
                >
                  <td class="pa-0 indice">
                    <IndiceDano :value="indice" />
                  </td>
                </tr>
              </template>
            </table>
          </v-flex>

          <v-flex
            ref="dados"
            class="scrollX"
            shrink
          >
            <table id="dados">
              <template v-for="(indice, indAtr) in indices">
                <tr
                  :key="`tr${indAtr}`"
                  :class="ordenarPor === indice ? 'atributoSelecionado' : null"
                >
                  <template v-for="(dano, indIte) in danos">
                    <td
                      :key="`i${indAtr}_${indIte}`"
                      :class="definirClasseDano(dano[indAtr], indIte)"
                    >
                      {{ dano[indAtr].resultado | formatNumber }}
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

import GearView from './GearView'
import IndiceDano from './IndiceDano'
import calcularDano from '../../functions/calcularDano'
import atributos from '../../functions/atributos'

export default {
  name: 'DataTableDamage',
  components: {
    draggable,
    IndiceDano,
    GearView
  },
  props: {
    value: { type: Array, default: () => [] }
  },
  data: () => ({
    gears: [],
    atributosGears: [],
    indices: [],
    maiorDano: [],
    segundoMaiorDano: [],
    menorDano: [],
    danos: [],
    retrair: false,
    ordenarPor: null,
    ordemAsc: null,
    hover: null,
    mostrar: 20,
    progress: true
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
    this.organizarIndices()
    this.organizarGears()

    this.$refs.dados.addEventListener('scroll', this.scrolling)
  },
  methods: {
    organizarIndices () {
      this.indices = []
      const posicoes = ['Frente', 'Costas']
      const alvos = ['ST', 'ZONA']
      const distancias = ['CAC', 'DIST']
      const multiplicadores = ['Normal', 'Critico', 'Berserk', 'BskCrit']
      for (var i in posicoes) {
        for (var j in alvos) {
          for (var k in distancias) {
            for (var l in multiplicadores) {
              this.indices.push([posicoes[i], alvos[j], distancias[k], multiplicadores[l]])
            }
          }
        }
      }
    },
    async organizarGears () {
      this.progress = true

      this.gears = JSON.parse(JSON.stringify(this.allGears))
      this.atributosGears = this.gears.map(gear => atributos.getAtributos(gear.gear))
      this.danos = this.calcularDanos(this.atributosGears)
      this.maiorDano = this.definirMaiorDano(this.danos)
      this.segundoMaiorDano = this.definirSegundoMaiorDano(this.danos, this.maiorDano)
      this.menorDano = this.definirMenorDano(this.danos)

      this.progress = false
    },
    calcularDanos (gears) {
      return gears.map(gear => calcularDano({
        gear,
        danoBase: 100,
        danoBaseCritico: 125,
        resistencia: 0,
        danosCausados: 0
      }))
    },
    definirMaiorDano (gears) {
      return gears.map(gear => gear.reduce((total, atual) => Math.max(total, atual.resultado), 0))
    },
    definirSegundoMaiorDano (gears, maioresDanos) {
      return gears.map((gear, index) => gear.reduce((total, atual) => {
        if (atual.resultado === maioresDanos[index]) return total
        return Math.max(total, atual.resultado)
      }, 0))
    },
    definirMenorDano (gears) {
      return gears.map(gear => gear.reduce((total, atual) => Math.min(total, atual.resultado), 99999))
    },
    definirClasseDano (indice, index) {
      if (indice.resultado === this.maiorDano[index]) return 'maiordano'
      if (indice.resultado === this.segundoMaiorDano[index]) return 'segundomaiordano'
      if (indice.resultado === this.menorDano[index]) return 'menordano'
      return ''
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
      this.maiorDano.splice(newIndex, 0, this.maiorDano.splice(oldIndex, 1)[0])
      this.menorDano.splice(newIndex, 0, this.menorDano.splice(oldIndex, 1)[0])
      this.gears.splice(newIndex, 0, this.gears.splice(oldIndex, 1)[0])
    }
  }
}
</script>

<style>
</style>
