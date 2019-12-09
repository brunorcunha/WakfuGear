<template>
  <v-layout fill-height>
    <Loading v-if="!existItems" />

    <template v-else>
      <v-navigation-drawer
        v-model="drawerRight"
        fixed
        app
        right
        width="450"
      >
        <Equipamento />
      </v-navigation-drawer>

      <v-toolbar
        id="cabecalho"
        color="deep-orange accent-4"
        dark
        fixed
        dense
        app
        flat
      >
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn
              icon
              v-on="on"
              @click.stop="drawer = !drawer"
            >
              <v-icon>filter_list</v-icon>
            </v-btn>
          </template>
          <span>Filter</span>
        </v-tooltip>

        <v-flex text-xs-center>
          <v-btn-toggle mandatory>
            <v-btn
              color="red"
              depressed
              block
              value="left"
            >
              Equipments
            </v-btn>
            <v-btn
              color="red"
              depressed
              block
              value="center"
              disabled
            >
              Gears
            </v-btn>
          </v-btn-toggle>
        </v-flex>

        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn
              class="mr-0"
              icon
              v-on="on"
              @click.stop="drawerRight = !drawerRight"
            >
              <v-icon>business_center</v-icon>
            </v-btn>
          </template>
          <span>Sets</span>
        </v-tooltip>
      </v-toolbar>

      <v-navigation-drawer
        v-model="drawer"
        fixed
        app
      >
        <Filtros />
      </v-navigation-drawer>

      <DataTable />
    </template>

    <ConfirmDialog ref="confirm" />
    <ExternalState />
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import Equipamento from './Equipamento'
import DataTable from './DataTable'
import Filtros from './Filtros'
import ConfirmDialog from './ConfirmDialog'
import ExternalState from './ExternalState'
import Loading from './Loading'
import FunctionsMixins from '../mixins/functions'
import EventBus from '../event-bus'

export default {
  name: 'WGView',
  components: { Loading, Filtros, DataTable, Equipamento, ConfirmDialog, ExternalState },
  mixins: [FunctionsMixins],
  data: () => ({
    drawer: true,
    drawerRight: true,
    right: null,
    left: null,
    dados: null
  }),
  computed: {
    ...mapGetters('items', ['existItems', 'versao'])
  },
  watch: {
    versao: async function (val, oldVal) {
      if (!oldVal) return
      const confirm = await this.$refs.confirm.open('Maintain Items', 'A new version of the items has been found. Do you want to update?')
      if (confirm) this.atualizarItens()
    }
  },
  created () {
    this.$store.dispatch('items/init', this.$lang)
    this.$store.dispatch('filtros/init', this.$lang)
  },
  mounted () {
    EventBus.$on('confirm', this.abrirConfirm)
  },
  beforeDestroy () {
    EventBus.$off('confirm')
  },
  methods: {
    async abrirConfirm (titulo, pergunta, callbackSucesso, callbackCancelar) {
      const confirm = await this.$refs.confirm.open(titulo, pergunta)
      if (confirm) callbackSucesso()
      else callbackCancelar()
    }
  }
}
</script>

<style scoped></style>
