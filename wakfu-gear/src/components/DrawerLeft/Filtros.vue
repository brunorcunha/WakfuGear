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
      class="scroll corFundoBranco"
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
        <label class="minilabel">{{ $t('label.tipo') }}</label>
        <v-btn-toggle
          v-model="filtros.tipos"
          multiple
          class="transparent preencher wrap mb-3 mt-1"
        >
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-btn
                flat
                :input-value="null"
                v-on="on"
                @click="toggleTodosTipos"
              >
                <img src="../../../static/tipo/-1.png">
              </v-btn>
            </template>
            <span>{{ $t('label.selecionartudo') }}</span>
          </v-tooltip>

          <template v-for="tipo in itemsTipo">
            <v-tooltip
              :key="`tipo${tipo.id}`"
              bottom
            >
              <template #activator="{ on }">
                <v-btn
                  flat
                  :value="tipo.id"
                  v-on="on"
                >
                  <img :src="`../../../static/${tipo.img}`">
                </v-btn>
              </template>
              <span>{{ tipo[$lang] }}</span>
            </v-tooltip>
          </template>
        </v-btn-toggle>
      </v-flex>

      <v-flex px-3>
        <label class="minilabel">{{ $t('label.raridade') }}</label>
        <v-btn-toggle
          v-model="filtros.raridades"
          multiple
          class="transparent preencher mb-3 mt-1"
        >
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-btn
                flat
                :input-value="null"
                v-on="on"
                @click="toggleTodasRaridades"
              >
                <img src="../../../static/raridade/r0.png">
              </v-btn>
            </template>
            <span>{{ $t('label.selecionartudo') }}</span>
          </v-tooltip>

          <template v-for="rarity in itemsRaridade">
            <v-tooltip
              :key="`rarity${rarity.id}`"
              bottom
            >
              <template #activator="{ on }">
                <v-btn
                  flat
                  v-on="on"
                >
                  <img :src="`../../../static/${rarity.img}`">
                </v-btn>
              </template>
              <span>{{ rarity[$lang] }}</span>
            </v-tooltip>
          </template>
        </v-btn-toggle>
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
        px-2
        mb-5
      >
        <v-layout>
          <v-flex px-2>
            <v-text-field
              v-model="filtros.niveis[0]"
              :label="$t('label.nivelminimo')"
              type="number"
            />
          </v-flex>
          <v-flex px-2>
            <v-text-field
              v-model="filtros.niveis[1]"
              :label="$t('label.nivelmaximo')"
              type="number"
            />
          </v-flex>
        </v-layout>
        <v-range-slider
          v-model="filtros.niveis"
          ticks
          class="px-3 mt-0"
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
        <small>Bruno Cunha &copy; {{ (new Date()).getFullYear() }}.
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
    itemsRaridade: [],
    itemsTipo: [],
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
  watch: {
    'filtros.raridades' (val) {
      const index = this.filtros.raridades.indexOf(0)
      if (val.length <= 7 && index !== -1) this.filtros.raridades.splice(index, 1)
      else if (val.length === 7 && index === -1) this.filtros.raridades.unshift(0)
    }
  },
  async mounted () {
    this.itemsBonus = this.traduzirFx(equipEffects)
    this.itemsRaridade = rarity.sort((a, b) => a.id - b.id)
    this.itemsTipo = equipType.filter(e => e.iid !== 518 && e.iid !== 519).sort((a, b) => a.id - b.id)
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
    },
    async toggleTodosTipos () {
      await this.$nextTick()
      if (this.filtros.tipos.length < this.itemsTipo.length) {
        this.filtros.tipos = this.itemsTipo.map(e => e.id)
        this.filtros.tipos.unshift(0)
      } else {
        this.filtros.tipos = []
      }
    },
    async toggleTodasRaridades () {
      await this.$nextTick()
      if (this.filtros.raridades.length < this.itemsRaridade.length) {
        this.filtros.raridades = this.itemsRaridade.map(e => e.id)
        this.filtros.raridades.unshift(0)
      } else {
        this.filtros.raridades = []
      }
    }
  }
}
</script>

<style>
</style>
