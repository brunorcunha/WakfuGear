<template>
  <v-layout
    column
    fill-height
    overflow-hidden
  >
    <v-flex>
      <v-img
        id="logo"
        src="static/bg.jpg"
        height="165"
      >
        <span class="versao">Versão: {{ versao }}</span>
        <div
          v-if="temAtualizacao"
          class="atualizar"
        >
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-btn
                flat
                icon
                small
                dark
                class="ma-0"
                v-on="on"
                @click="atualizarItens"
              >
                <v-icon size="16">
                  backup
                </v-icon>
              </v-btn>
            </template>
            <span>Atualizar Itens</span>
          </v-tooltip>
        </div>
        <img
          src="static/logo.png"
          width="100%"
        >
      </v-img>

      <v-progress-linear
        :indeterminate="progress"
        color="deep-orange accent-4"
        height="2"
        class="my-0"
      />
    </v-flex>

    <v-flex
      fill-height
      class="scroll"
      pt-1
    >
      <v-flex
        px-3
        mt-2
      >
        <v-autocomplete
          v-model="filtros.nome"
          :label="$t('label.nome')"
          :placeholder="$t('label.nome')"
          :items="itemsList"
          clearable
          dense
        />
      </v-flex>

      <v-flex px-3>
        <drop-box
          v-model="filtros.tipos"
          :items="itemsTipo"
          :label="$t('label.tipo')"
          :placeholder="$t('label.tipo')"
          selecionar-todos-icone="tipo/118.png"
        />
      </v-flex>

      <v-flex px-3>
        <drop-box
          v-model="filtros.raridades"
          :items="itemsRaridade"
          :label="$t('label.raridade')"
          :placeholder="$t('label.raridade')"
          selecionar-todos-icone="raridade/r0.png"
        />
      </v-flex>

      <v-flex px-3>
        <drop-box
          v-model="filtros.bonus"
          :items="itemsBonus"
          :label="$t('label.bonus')"
          :placeholder="$t('label.bonus')"
        />
      </v-flex>

      <v-flex
        px-3
        mb-5
      >
        <label style="font-size: 13px; color: rgba(0,0,0,.54);">{{ $t('label.nivel') }}</label>
        <v-range-slider
          v-model="filtros.niveis"
          ticks
          class="px-2 mt-1"
          thumb-label="always"
          color="deep-orange accent-4"
          :step="1"
          :max="200"
          :min="0"
        />
      </v-flex>

      <v-flex px-3>
        <v-btn
          block
          color="primary"
          large
          @click="emitirFiltros"
        >
          <span class="pl-3">Filtrar</span>
          <v-icon>arrow_right</v-icon>
        </v-btn>
      </v-flex>

      <localStorage v-if="ehDev" />
    </v-flex>

    <v-flex>
      <v-footer class="px-3 foot">
        <small>Bruno Cunha &copy; 2019. Clone o projeto no <a
          href="https://github.com/brunorcunha/wakfu-gear"
          target="_blank"
        >GitHub</a>.</small>
      </v-footer>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import DropBox from './DropBox'
import EventBus from '../event-bus'
import FunctionsMixins from '../mixins/functions'

import { equipType } from '../model/equipType'
import { equipEffects } from '../model/equipEffects'
import { rarity } from '../model/rarity'
import LocalStorage from './LocalStorage'
// import { states } from '../model/states'

export default {
  name: 'Filtros',
  components: { LocalStorage, DropBox },
  mixins: [FunctionsMixins],
  data: () => ({
    filtros: {
      nome: '',
      niveis: [0, 200],
      tipos: [],
      raridades: [],
      bonus: [],
      lang: ''
    },
    itemsRaridade: rarity,
    itemsTipo: equipType,
    itemsBonus: [],
    progress: false
  }),
  computed: {
    ...mapGetters('items', ['itemsList', 'versao']),
    ...mapGetters('filtros', { filtrosLS: 'filtros' }),
    temAtualizacao: function () {
      return localStorage['versao'] !== this.versao
    },
    ehDev: function () {
      return !process.env.build
    }
  },
  async mounted () {
    this.itemsBonus = this.traduzirFx(equipEffects)
    this.itemsRaridade = rarity.sort((a, b) => a[this.$lang].localeCompare(b[this.$lang]))
    this.itemsTipo = equipType.sort((a, b) => a[this.$lang].localeCompare(b[this.$lang]))
    this.filtros = {
      ...this.filtros,
      ...JSON.parse(JSON.stringify(this.filtrosLS)),
      lang: this.$lang
    }

    EventBus.$on('terminouFiltragem', this.terminouFiltragem)
  },
  beforeDestroy () {
    EventBus.$off('terminouFiltragem')
  },
  methods: {
    traduzirFx (val) {
      val.forEach(e => {
        e[this.$lang] = e[this.$lang]
          .replace(/\[el1\]/g, 'Fogo')
          .replace(/\[el2\]/g, 'Água')
          .replace(/\[el3\]/g, 'Terra')
          .replace(/\[el4\]/g, 'Ar')
          .replace(/{\[>2\]\?s:}/g, 's')
          .replace(/{\[>1\]\?s:}/g, 's')
          .replace(/\[#1\]/g, 'x')
          .replace(/\[#2\]/g, 'y')
          .replace(/\[#3\]/g, 'z')
          // .substring(e.desc.lastIndexOf(':') + 1)
      })
      return val
    },
    emitirFiltros () {
      this.progress = true
      EventBus.$emit('filtrar', this.filtros)
      this.$store.dispatch('filtros/salvar', this.filtros)
    },
    terminouFiltragem () {
      this.progress = false
    }
  }
}
</script>

<style>
  #logo img {
    padding: 7px 0;
    filter: drop-shadow(1px 1px 0 #333) drop-shadow(-1px -1px 0 #333) drop-shadow(0px 0px 10px #333);
  }
  .versao {
    position: absolute;
    color: rgba(255, 255, 255, .9);
    font-size: 11px;
    padding: 5px;
    left: 0;
    top: 0;
  }
  .atualizar {
    position: absolute;
    padding: 0 5px;
    right: 0;
    top: 0;
    z-index: 9;
  }
  .v-slider__thumb-label__container { bottom: -70px; top: auto; }
  .v-slider__thumb-label { border-radius: 0 50% 50% 50%; }
  .v-chip--select-multi { margin: 3px 1px 0 0; }
  .scroll { overflow-y: auto; }
  .foot { border-top: 1px solid #C0C0C0; }
  .foot small{ color: rgba(0, 0, 0, .7); font-size: 12px; }
</style>
