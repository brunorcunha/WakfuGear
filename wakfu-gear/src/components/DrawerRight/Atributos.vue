<template>
  <v-layout
    column
    class="caract"
  >
    <v-flex>
      <v-layout class="atr">
        <v-flex px-0>
          <div class="titulo">
            <span>{{ $t('label.principais') }}</span>
          </div>
        </v-flex>
      </v-layout>
      <draggable
        v-model="secoes.principal"
        tag="div"
        class="layout row atr big"
      >
        <template v-for="atributo in secoes.principal">
          <AtributosPopUp
            :key="`principal${atributo.id}`"
            v-slot="{ on, nome, total }"
            :lista="itemsComAtributo[atributo.id]"
            :total="atributos[atributo.id]"
            :nome="(equipEffects.find(e => e.id === atributo.id) || {})[$lang]"
          >
            <v-flex v-on="on">
              <div class="py-1">
                <div :class="`icone ${atributo.icone}`" /> {{ total || '0' }}
              </div>
            </v-flex>
          </AtributosPopUp>
        </template>
      </draggable>
    </v-flex>
    <v-flex>
      <v-layout class="atr">
        <v-flex px-0>
          <div class="titulo">
            <span>{{ $t('label.maestrias') }}</span>
          </div>
        </v-flex>
      </v-layout>
      <draggable
        v-model="secoes.maestrias"
        tag="div"
        class="layout row wrap atr big"
      >
        <template v-for="(atributo, index) in secoes.maestrias">
          <v-flex
            :key="`maestria${atributo.id}`"
            xs6
          >
            <v-layout
              row
              :class="`py-1 ${atributo.icone}`"
            >
              <v-flex shrink>
                <div :class="`icone ${atributo.icone}`" />
              </v-flex>

              <AtributosPopUp
                v-slot="{ on, nome, total }"
                :lista="itemsAtributoDanoOrdem[index]"
                :total="somaDanoAtributos(atributo, index)"
                :nome="(equipEffects.find(e => e.id === atributo.id) || {})[$lang]"
              >
                <v-flex v-on="on">
                  <div class="icone damage" /> {{ total }}
                </v-flex>
              </AtributosPopUp>

              <AtributosPopUp
                v-slot="{ on, nome, total }"
                :lista="itemsAtributoResistenciaOrdem[index]"
                :total="somaResistenciaAtributos(atributo, index)"
                :nome="(equipEffects.find(e => e.id === atributo.id2) || {})[$lang]"
              >
                <v-flex v-on="on">
                  <div class="icone resist" /> {{ getResistenciaPorcentagem(total) }}% ({{ total }})
                </v-flex>
              </AtributosPopUp>
            </v-layout>
          </v-flex>
        </template>
      </draggable>
    </v-flex>
    <v-flex>
      <v-layout class="atr">
        <v-flex px-0>
          <div class="titulo">
            <span>{{ $t('label.combate') }}</span>
          </div>
        </v-flex>
      </v-layout>
      <draggable
        v-model="secoes.combate"
        tag="div"
        class="layout row wrap atr"
      >
        <template v-for="atributo in secoes.combate">
          <AtributosPopUp
            :key="`combate${atributo.id}`"
            v-slot="{ on, nome, total }"
            :lista="itemsComAtributo[atributo.id]"
            :total="atributos[atributo.id]"
            :nome="(equipEffects.find(e => e.id === atributo.id) || {})[$lang]"
          >
            <v-flex
              xs6
              v-on="on"
            >
              <v-layout row>
                <div :class="`icone ${atributo.icone}`" />
                <v-flex class="fontsmall pl-1">
                  {{ nome }}
                </v-flex>
                <v-flex shrink>
                  {{ total || '0' }}
                </v-flex>
              </v-layout>
            </v-flex>
          </AtributosPopUp>
        </template>
      </draggable>
    </v-flex>
    <v-flex>
      <v-layout class="atr">
        <v-flex px-0>
          <div class="titulo">
            <span>{{ $t('label.secundarios') }}</span>
          </div>
        </v-flex>
      </v-layout>
      <draggable
        v-model="secoes.secundario"
        tag="div"
        class="layout row wrap atr"
      >
        <template v-for="atributo in secoes.secundario">
          <AtributosPopUp
            :key="`secundario${atributo.id}`"
            v-slot="{ on, nome, total }"
            :lista="itemsComAtributo[atributo.id]"
            :total="atributos[atributo.id]"
            :nome="(equipEffects.find(e => e.id === atributo.id) || {})[$lang]"
          >
            <v-flex
              xs6
              v-on="on"
            >
              <v-layout row>
                <div :class="`icone ${atributo.icone}`" />
                <v-flex class="fontsmall pl-1">
                  {{ nome }}
                </v-flex>
                <v-flex shrink>
                  {{ total || '0' }}
                </v-flex>
              </v-layout>
            </v-flex>
          </AtributosPopUp>
        </template>
      </draggable>
    </v-flex>
  </v-layout>
</template>

<script>
import draggable from 'vuedraggable'
import atributos from '../../functions/atributos'
import { equipEffects } from '../../model/equipEffects'
import { mapGetters } from 'vuex'
import AtributosPopUp from './AtributosPopUp'
import { getResistenciaPorcentagem } from '../../functions/calcularDano'

export default {
  name: 'Atributos',
  components: { AtributosPopUp, draggable },
  data: () => ({
    equipEffects,
    url: 'http://s.ankama.com/www/static.ankama.com/wakfu/portal/game/item/42/',
    secoes: {
      principal: [
        { id: 20, icone: 'hp' },
        { id: 31, icone: 'pa' },
        { id: 41, icone: 'mp' },
        { id: 191, icone: 'wp' },
        { id: 0, icone: 'armor' }
      ],
      maestrias: [
        { id: 122, id2: 82, icone: 'fire' },
        { id: 124, id2: 83, icone: 'water' },
        { id: 123, id2: 84, icone: 'earth' },
        { id: 125, id2: 85, icone: 'air' }
      ],
      combate: [
        { id: 120, icone: 'sword' },
        { id: 80, icone: 'resist' },
        { id: 24, icone: 'heal' },
        { id: 875, icone: 'parade' },
        { id: 150, icone: 'crit' },
        { id: 171, icone: 'init' },
        { id: 160, icone: 'range' },
        { id: 175, icone: 'dodge' },
        { id: 173, icone: 'lock' },
        { id: 166, icone: 'wisdom' },
        { id: 162, icone: 'prosp' },
        { id: 184, icone: 'control' },
        { id: 234, icone: 'kit' },
        { id: 177, icone: 'will' },
        { id: 9999, icone: 'acumulado' }
      ],
      secundario: [
        { id: 149, icone: 'mastcrit' },
        { id: 988, icone: 'critresist' },
        { id: 180, icone: 'mastrear' },
        { id: 71, icone: 'rearresist' },
        { id: 1052, icone: 'melee' },
        { id: 1053, icone: 'dist' },
        { id: 1051, icone: 'single' },
        { id: 1050, icone: 'area' },
        { id: 26, icone: 'heal' },
        { id: 1055, icone: 'berserk' }
      ]
    }
  }),
  computed: {
    ...mapGetters('gears', ['gearAtual']),
    atributos () {
      return atributos.getAtributos(this.gearAtual)
    },
    itemsComAtributo () {
      return atributos.getItems(this.gearAtual)
    },
    itemsAtributoDanoOrdem () {
      const masteries = [[], [], [], []]
      const [maestria1, maestria2, maestria3, maestria4] = this.secoes.maestrias

      this.itemsComAtributo[maestria1.id] && this.itemsComAtributo[maestria1.id].forEach(e => masteries[0].push(e))
      this.itemsComAtributo[maestria2.id] && this.itemsComAtributo[maestria2.id].forEach(e => masteries[1].push(e))
      this.itemsComAtributo[maestria3.id] && this.itemsComAtributo[maestria3.id].forEach(e => masteries[2].push(e))
      this.itemsComAtributo[maestria4.id] && this.itemsComAtributo[maestria4.id].forEach(e => masteries[3].push(e))

      this.itemsComAtributo[120] && this.itemsComAtributo[120].forEach(e => {
        masteries[0].push(e)
        masteries[1].push(e)
        masteries[2].push(e)
        masteries[3].push(e)
      })
      this.itemsComAtributo[910681] && this.itemsComAtributo[910681].forEach(e => {
        masteries[0].push(e)
      })
      this.itemsComAtributo[910682] && this.itemsComAtributo[910682].forEach(e => {
        masteries[0].push(e)
        masteries[1].push(e)
      })
      this.itemsComAtributo[910683] && this.itemsComAtributo[910683].forEach(e => {
        masteries[0].push(e)
        masteries[1].push(e)
        masteries[2].push(e)
      })

      return masteries
    },
    itemsAtributoResistenciaOrdem () {
      const resists = [[], [], [], []]
      const [resist1, resist2, resist3, resist4] = this.secoes.maestrias

      this.itemsComAtributo[resist1.id2] && this.itemsComAtributo[resist1.id2].forEach(e => resists[0].push(e))
      this.itemsComAtributo[resist2.id2] && this.itemsComAtributo[resist2.id2].forEach(e => resists[1].push(e))
      this.itemsComAtributo[resist3.id2] && this.itemsComAtributo[resist3.id2].forEach(e => resists[2].push(e))
      this.itemsComAtributo[resist4.id2] && this.itemsComAtributo[resist4.id2].forEach(e => resists[3].push(e))

      this.itemsComAtributo[80] && this.itemsComAtributo[80].forEach(e => {
        resists[0].push(e)
        resists[1].push(e)
        resists[2].push(e)
        resists[3].push(e)
      })
      this.itemsComAtributo[910691] && this.itemsComAtributo[910691].forEach(e => {
        resists[0].push(e)
      })
      this.itemsComAtributo[910692] && this.itemsComAtributo[910692].forEach(e => {
        resists[0].push(e)
        resists[1].push(e)
      })
      this.itemsComAtributo[910693] && this.itemsComAtributo[910693].forEach(e => {
        resists[0].push(e)
        resists[1].push(e)
        resists[2].push(e)
      })

      return resists
    }
  },
  methods: {
    somaDanoAtributos (item, index) {
      const danoElementalFixo = this.atributos[item.id] || 0
      const danoElementalTotal = this.atributos[120] || 0
      const danoElementalPrimeiroLista = index === 0 ? (this.atributos[910681] || 0) : 0
      const danoElementalSegundoLista = index <= 1 ? (this.atributos[910682] || 0) : 0
      const danoElementalTerceiroLista = index <= 2 ? (this.atributos[910683] || 0) : 0
      const danoElementalLista = danoElementalPrimeiroLista + danoElementalSegundoLista + danoElementalTerceiroLista

      return danoElementalFixo + danoElementalTotal + danoElementalLista
    },
    somaResistenciaAtributos (item, index) {
      const resistenciaElementalFixo = this.atributos[item.id2] || 0
      const resistenciaElementalTotal = this.atributos[80] || 0
      const resistenciaElementalPrimeiroLista = index === 0 ? (this.atributos[910691] || 0) : 0
      const resistenciaElementalSegundoLista = index <= 1 ? (this.atributos[910692] || 0) : 0
      const resistenciaElementalTerceiroLista = index <= 2 ? (this.atributos[910693] || 0) : 0
      const resistenciaElementalLista = resistenciaElementalPrimeiroLista + resistenciaElementalSegundoLista + resistenciaElementalTerceiroLista

      return resistenciaElementalFixo + resistenciaElementalTotal + resistenciaElementalLista
    },
    getResistenciaPorcentagem (resistencia) {
      return getResistenciaPorcentagem(resistencia)
    }
  }
}
</script>

<style scoped>
</style>
