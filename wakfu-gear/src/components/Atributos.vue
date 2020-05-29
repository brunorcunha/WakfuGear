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
        <template v-for="item in secoes.principal">
          <v-flex :key="`principal${item.id}`">
            <v-tooltip bottom>
              <template #activator="{ on }">
                <div
                  class="py-1"
                  v-on="on"
                >
                  <div :class="`icone ${item.icone}`" /> {{ atributos[item.id] || '0' }}
                </div>
              </template>
              <span>{{ equipEffects.find(e => e.id === item.id)[$lang] }}</span>
            </v-tooltip>
          </v-flex>
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
        <template v-for="item in secoes.maestrias">
          <v-flex
            :key="`maestria${item.id}`"
            xs6
          >
            <v-layout
              row
              class="py-1"
            >
              <v-flex shrink>
                <div :class="`icone ${item.icone}`" />
              </v-flex>
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-flex v-on="on">
                    <div class="icone damage" /> 99.999
                  </v-flex>
                </template>
                <span>{{ equipEffects.find(e => e.id === item.id)[$lang] }}</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-flex v-on="on">
                    <div class="icone resist" /> 99.999
                  </v-flex>
                </template>
                <span>{{ equipEffects.find(e => e.id === item.id2)[$lang] }}</span>
              </v-tooltip>
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
        <template v-for="item in secoes.combate">
          <v-flex
            :key="`combate${item.id}`"
            xs6
          >
            <v-layout row>
              <div :class="`icone ${item.icone}`" />
              <v-flex class="fontsmall">
                {{ equipEffects.find(e => e.id === item.id)[$lang] }}
              </v-flex>
              <v-flex shrink>
                {{ atributos[item.id] || '0' }}
              </v-flex>
            </v-layout>
          </v-flex>
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
        <template v-for="item in secoes.secundario">
          <v-flex
            :key="`secundario${item.id}`"
            xs6
          >
            <v-layout row>
              <div :class="`icone ${item.icone}`" />
              <v-flex class="fontsmall">
                {{ equipEffects.find(e => e.id === item.id)[$lang] }}
              </v-flex>
              <v-flex shrink>
                {{ atributos[item.id] || '0' }}
              </v-flex>
            </v-layout>
          </v-flex>
        </template>
      </draggable>
    </v-flex>
  </v-layout>
</template>

<script>
import atributos from '../functions/atributos'
import { equipEffects } from '../model/equipEffects'
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'

export default {
  name: 'Atributos',
  components: { draggable },
  data: () => ({
    equipEffects: equipEffects,
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
        { id: 177, icone: 'will' }
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
    }
  }
}
</script>

<style scoped>
  .atr > .flex {
    padding: 5px 2.5px 0;
    cursor: move;
  }
  .atr > .flex > div {
    border-radius: 5px;
    background: white;
    border: solid 1px darkgrey;
    text-align: left;
    padding: 0 3px;
    padding-right: 8px;
    height: 23px;
    box-shadow: 0 0 2px 0 rgba(0,0,0,.16);
  }
  .atr.big > .flex > div {
    padding: 6px 4px 4px;
    line-height: 27px;
    height: 35px;
    text-align: center;
  }
  .atr > .flex > .titulo > span {
    text-shadow: 0 0 1px #000;
    font-weight: bold;
    display: block;
    font-size: 15px;
    color: #fff;
    position: relative;
  }
  .atr > .flex > .titulo {
    cursor: default;
    position: relative;
    overflow: hidden;
    height: 30px;
    padding: 3px 10px;
    background: #BF361F url(../../static/h1.png) right center no-repeat !important;
    border-color: #dd2c00!important;
  }
  .atr > .flex > .titulo::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 210px;
    height: 48px;
    -webkit-transform: scaleX(-1) scaleY(-1);
    background: #BF361F url(../../static/h1.png) left center no-repeat;
    z-index: 0;
  }
  .atr > .flex img {
    float: left;
    margin-right: 3px;
  }
  .fontsmall {
    font-size: 12px;
    line-height: 22px;
  }
  .icone {
    float: left;
    width: 25px;
    height: 21px;
    background-position: center;
    background-repeat: no-repeat;
  }
  .big .icone {
    width: 24px;
    height: 24px;
  }
  .icone.hp { background-image: url(../../static/atributos/tags_34.png); }
  .icone.mp { background-image: url(../../static/atributos/tags_02.png); }
  .icone.wp { background-image: url(../../static/atributos/tags_28.png); }
  .icone.pa { background-image: url(../../static/atributos/tags_01.png); }
  .icone.armor { background-image: url(../../static/atributos/tags_42.png); }
  .icone.earth { background-image: url(../../static/atributos/mini_12.png); }
  .icone.fire { background-image: url(../../static/atributos/mini_11.png); }
  .icone.water { background-image: url(../../static/atributos/mini_03.png); }
  .icone.air { background-image: url(../../static/atributos/mini_05.png); }
  .icone.damage { background-image: url(../../static/atributos/tags_09.png); }
  .icone.resist { background-image: url(../../static/atributos/tags_03.png); }

  .icone.sword { background-image: url(../../static/atributos/tags_22.png); }
  .icone.heal { background-image: url(../../static/atributos/tags_18.png); }
  .icone.parade { background-image: url(../../static/atributos/tags_24.png); }
  .icone.crit { background-image: url(../../static/atributos/tags_14.png); }
  .icone.init { background-image: url(../../static/atributos/tags_25.png); }
  .icone.range { background-image: url(../../static/atributos/tags_08.png); }
  .icone.dodge { background-image: url(../../static/atributos/tags_16.png); }
  .icone.lock { background-image: url(../../static/atributos/tags_15.png); }
  .icone.wisdom { background-image: url(../../static/atributos/tags_31.png); }
  .icone.prosp { background-image: url(../../static/atributos/tags_36.png); }
  .icone.control { background-image: url(../../static/atributos/tags_29.png); }
  .icone.kit { background-image: url(../../static/atributos/tags_33.png); }
  .icone.will { background-image: url(../../static/atributos/will.png); }

  .icone.mastcrit { background-image: url(../../static/atributos/tags_40.png); }
  .icone.mastrear { background-image: url(../../static/atributos/tags_26.png); }
  .icone.critresist { background-image: url(../../static/atributos/tags_39.png); }
  .icone.rearresist { background-image: url(../../static/atributos/tags_38.png); }
  .icone.melee { background-image: url(../../static/atributos/tags_23.png); }
  .icone.dist { background-image: url(../../static/atributos/tags_20.png); }
  .icone.single { background-image: url(../../static/atributos/tags_19.png); }
  .icone.area { background-image: url(../../static/atributos/tags_21.png); }
  .icone.berserk { background-image: url(../../static/atributos/tags_17.png); }
</style>
