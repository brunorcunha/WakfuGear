<template>
  <v-tabs-items v-model="tab">
    <v-tab-item>
      <v-toolbar
        flat
        dense
      >
        <v-btn
          outline
          small
          class="pr-4"
          color="success"
          @click="novoConjunto"
        >
          <v-icon left>
            add
          </v-icon>
          {{ $t('label.novogear') }}
        </v-btn>
        <v-btn
          outline
          small
          class="pr-4"
          color="info"
          @click="abrirImportar"
        >
          <v-icon left>
            import_export
          </v-icon>
          {{ $t('label.importar') }}
        </v-btn>
      </v-toolbar>

      <ListGearsOpcoes
        @selecionar="tab = 1"
      />
    </v-tab-item>

    <v-tab-item>
      <v-layout
        column
        fill-height
      >
        <v-flex
          class="bg"
          shrink
        >
          <v-layout
            column
            fill-height
          >
            <v-flex shrink>
              <v-layout
                row
                style="max-width: 390px;"
              >
                <v-flex shrink>
                  <v-tooltip
                    bottom
                    mt-0
                  >
                    <template #activator="{ on }">
                      <v-btn
                        dark
                        icon
                        flat
                        v-on="on"
                        @click="tab = 0"
                      >
                        <v-icon>menu</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('label.opcoes') }}</span>
                  </v-tooltip>
                </v-flex>
                <v-flex grow>
                  <h1
                    class="tituloGear"
                    @click="trocarNome"
                  >
                    {{ nome }}
                  </h1>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex grow>
              <EquipsView />
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex shrink>
          <v-progress-linear
            :indeterminate="progress"
            color="deep-orange accent-4"
            height="2"
            class="my-0"
          />
        </v-flex>

        <v-flex
          pa-1
          class="scroll"
        >
          <AlertsView />
          <Atributos />
        </v-flex>
      </v-layout>
    </v-tab-item>
  </v-tabs-items>
</template>

<script>
import { mapGetters } from 'vuex'
import EquipsView from './EquipsView'
import AlertsView from './AlertsView'
import Atributos from './Atributos'
import ListGearsOpcoes from './ListGearsOpcoes'
import EventBus from '../../event-bus'

export default {
  name: 'Equipamento',
  components: { Atributos, EquipsView, AlertsView, ListGearsOpcoes },
  data: () => ({
    progress: false,
    tab: null
  }),
  computed: {
    ...mapGetters('gears', ['qnt', 'nome', 'indexAtual'])
  },
  mounted () {
    EventBus.$on('abrirGear', this.abrirGear)
  },
  methods: {
    abrirImportar () {
      this.$ImportDialog.abrir()
    },
    novoConjunto () {
      const index = this.qnt
      this.$store.dispatch('gears/adicionarGear', {})
      this.$store.dispatch('gears/setNome', { nome: this.$i18n.t('label.gearnovo'), index })
    },
    async trocarNome () {
      try {
        const novoNome = await this.$InputDialog.abrir({
          titulo: this.$i18n.t('dialog.editarNome.titulo'),
          mensagem: this.$i18n.t('dialog.editarNome.msg', { nome: this.nome }),
          label: this.$i18n.t('dialog.editarNome.label'),
          placeholder: this.nome
        })
        this.$store.dispatch('gears/setNome', { nome: novoNome, index: this.indexAtual })
      } catch (e) {}
    },
    abrirGear (index) {
      this.tab = 1
      this.$store.dispatch('gears/selecionarAtual', { index })
    }
  }
}
</script>

<style scoped>
</style>
