<template>
  <v-layout
    column
    class="caract"
  >
    <v-flex>
      <v-layout class="atr">
        <v-flex px-0>
          <div class="titulo">
            <span>Principais</span>
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
            <div class="py-1">
              <div :class="`icone ${item.icone}`" /> {{ atributos[item.id] || '0' }}
            </div>
          </v-flex>
        </template>
      </draggable>
    </v-flex>
    <v-flex>
      <v-layout class="atr">
        <v-flex px-0>
          <div class="titulo">
            <span>Maestrias</span>
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
              <v-flex><div class="icone damage" /> 99.999</v-flex>
              <v-flex><div class="icone resist" /> 99.999</v-flex>
            </v-layout>
          </v-flex>
        </template>
      </draggable>
    </v-flex>
    <v-flex>
      <v-layout class="atr">
        <v-flex px-0>
          <div class="titulo">
            <span>Combate</span>
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
            <span>Secundários</span>
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
        { id: 20, icone: 'hp', label: '' },
        { id: 31, icone: 'pa', label: '' },
        { id: 41, icone: 'mp', label: '' },
        { id: 191, icone: 'wp', label: '' },
        { id: 0, icone: 'armor', label: '' }
      ],
      maestrias: [
        { id: 1, icone: 'water', label: '' },
        { id: 2, icone: 'earth', label: '' },
        { id: 3, icone: 'air', label: '' },
        { id: 4, icone: 'fire', label: '' }
      ],
      combate: [
        { id: 120, icone: 'sword', label: '' },
        { id: 24, icone: 'heal', label: '' },
        { id: 875, icone: 'parade', label: '' },
        { id: 150, icone: 'crit', label: '' },
        { id: 171, icone: 'init', label: '' },
        { id: 160, icone: 'range', label: '' },
        { id: 175, icone: 'dodge', label: '' },
        { id: 173, icone: 'lock', label: '' },
        { id: 166, icone: 'wisdom', label: '' },
        { id: 162, icone: 'prosp', label: '' },
        { id: 184, icone: 'control', label: '' },
        { id: 234, icone: 'kit', label: '' },
        { id: 177, icone: 'will', label: '' }
      ],
      secundario: [
        { id: 149, icone: 'mastcrit', label: '' },
        { id: 988, icone: 'critresist', label: '' },
        { id: 180, icone: 'mastrear', label: '' },
        { id: 71, icone: 'rearresist', label: '' },
        { id: 1052, icone: 'melee', label: '' },
        { id: 1053, icone: 'dist', label: '' },
        { id: 1051, icone: 'single', label: '' },
        { id: 1050, icone: 'area', label: '' },
        { id: 26, icone: 'heal', label: '' },
        { id: 1055, icone: 'berserk', label: '' }
      ]
    }
  }),
  computed: {
    ...mapGetters('atributos', ['atributos'])
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
  .icone.critresist { background-image: url(../../static/atributos/tags_25.png); }
  .icone.rearresist { background-image: url(../../static/atributos/tags_38.png); }
  .icone.melee { background-image: url(../../static/atributos/tags_23.png); }
  .icone.dist { background-image: url(../../static/atributos/tags_20.png); }
  .icone.single { background-image: url(../../static/atributos/tags_19.png); }
  .icone.area { background-image: url(../../static/atributos/tags_21.png); }
  .icone.berserk { background-image: url(../../static/atributos/tags_17.png); }
</style>
