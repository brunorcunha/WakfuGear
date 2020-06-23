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
        class="corFundo"
      >
        <span class="versao">{{ $t('label.versao', [versao]) }}</span>
        <div class="lang">
          <Idioma />
        </div>
        <div class="atualizar">
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-btn
                flat
                icon
                small
                dark
                class="ma-0"
                v-on="on"
                @click="abrirConfigs"
              >
                <v-icon size="16">
                  settings
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('label.configs') }}</span>
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
          @change="emitirFiltros"
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
        <v-layout>
          <v-flex px-2>
            <v-text-field
              v-model="filtros.niveis[0]"
              :label="$t('label.minimo')"
              type="number"
            />
          </v-flex>
          <v-flex px-2>
            <v-text-field
              v-model="filtros.niveis[1]"
              :label="$t('label.maximo')"
              type="number"
            />
          </v-flex>
        </v-layout>
        <v-range-slider
          v-model="filtros.niveis"
          ticks
          class="px-2 mt-0"
          thumb-label="always"
          color="deep-orange accent-4"
          :step="1"
          :max="215"
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
          <span class="pl-3">{{ $t('label.filtrar') }}</span>
          <v-icon>arrow_right</v-icon>
        </v-btn>
      </v-flex>
    </v-flex>

    <v-flex>
      <v-footer class="px-3 foot">
        <small>Bruno Cunha &copy; 2019.
          <i18n
            path="label.fork"
            tag="label"
          >
            <a
              href="https://github.com/brunorcunha/WakfuGear/tree/master/wakfu-gear"
              target="_blank"
            >GitHub</a>
          </i18n>
        </small>
      </v-footer>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import DropBox from '../DropBox'
import Idioma from './Idioma'
import EventBus from '../../event-bus'

import { equipType } from '../../model/equipType'
import { equipEffects } from '../../model/equipEffects'
import { rarity } from '../../model/rarity'

export default {
  name: 'Filtros',
  components: { DropBox, Idioma },
  data: () => ({
    filtros: {
      nome: '',
      niveis: [0, 215],
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
    temAtualizacao () {
      return localStorage['versao'] !== this.versao
    },
    ehDev () {
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
      return val
    },
    async emitirFiltros () {
      this.progress = true
      EventBus.$emit('trocarTab')
      EventBus.$emit('filtrar', this.filtros)
      this.$store.dispatch('filtros/salvar', this.filtros)
    },
    terminouFiltragem () {
      this.progress = false
    },
    abrirConfigs () {
      this.$ConfigDialog.abrir()
    }
  }
}
</script>

<style>
</style>
