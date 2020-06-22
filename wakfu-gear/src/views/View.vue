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
        class="corFundoMenu"
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
              <v-icon v-if="drawer">
                chevron_left
              </v-icon>
              <v-icon v-else>
                chevron_right
              </v-icon>
            </v-btn>
          </template>
          <span>{{ $t('label.filtros') }}</span>
        </v-tooltip>

        <v-flex text-xs-center>
          <v-btn-toggle
            v-model="aba"
            mandatory
          >
            <v-btn
              color="red"
              depressed
              block
              value="equips"
            >
              {{ $t('label.equipamentos') }}
            </v-btn>
            <v-btn
              color="red"
              depressed
              block
              value="gears"
            >
              {{ $t('label.gears') }}
            </v-btn>
            <v-btn
              color="red"
              depressed
              block
              value="calc"
            >
              {{ $t('label.calculadora') }}
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
              <v-icon v-if="!drawerRight">
                chevron_left
              </v-icon>
              <v-icon v-else>
                chevron_right
              </v-icon>
            </v-btn>
          </template>
          <span>{{ $t('label.gears') }}</span>
        </v-tooltip>
      </v-toolbar>

      <v-navigation-drawer
        v-model="drawer"
        fixed
        app
      >
        <Filtros />
      </v-navigation-drawer>

      <DataView v-if="false" />
      <DataTable v-show="aba === 'equips'" />
      <DataTableDamage v-show="aba === 'calc'" />
      <DataTableGears v-show="aba === 'gears'" />
    </template>

    <InputDialog ref="inputDialog" />
    <ConfirmDialog ref="confirmDialog" />
    <ImportDialog ref="importDialog" />
  </v-layout>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import Equipamento from '../components/DrawerRight/Equipamento'
import DataTable from '../components/Content/DataTable'
import DataTableDamage from '../components/Content/DataTableDamage'
import DataView from '../components/Content/DataView'
import DataTableGears from '../components/Content/DataTableGears'
import Filtros from '../components/DrawerLeft/Filtros'
import ConfirmDialog from '../components/ConfirmDialog'
import InputDialog from '../components/InputDialog'
import ImportDialog from '../components/ImportDialog'
import Loading from '../components/Loading'
import EventBus from '../event-bus'

export default {
  name: 'WGView',
  components: {
    Loading,
    Filtros,
    DataTableDamage,
    DataTable,
    DataTableGears,
    DataView,
    Equipamento,
    InputDialog,
    ImportDialog,
    ConfirmDialog
  },
  data: () => ({
    drawer: false,
    drawerRight: false,
    aba: 'equips',
    right: null,
    left: null,
    dados: null
  }),
  computed: {
    ...mapGetters('items', ['existItems', 'versao'])
  },
  watch: {
    async versao (val, oldVal) {
      if (!oldVal) return
      try {
        await this.$ConfirmDialog.abrir({
          titulo: this.$i18n.t('dialog.atualizar.titulo'),
          mensagem: this.$i18n.t('dialog.atualizar.msg')
        })
        this.atualizarItens()
      } catch (e) {}
    }
  },
  created () {
    this.$store.dispatch('items/init', { lang: this.$lang })
    this.$store.dispatch('filtros/init')
    this.$store.dispatch('gears/init')
  },
  mounted () {
    Vue.prototype.$ConfirmDialog = this.$refs.confirmDialog
    Vue.prototype.$ImportDialog = this.$refs.importDialog
    Vue.prototype.$InputDialog = this.$refs.inputDialog

    if (this.$vuetify.breakpoint.lgAndUp) {
      this.drawer = true
      this.abrirDrawerEquipamentos()
    }
    EventBus.$on('addEquip', this.abrirDrawerEquipamentos)
    EventBus.$on('filtrar', this.repassarFiltragem)
    EventBus.$on('abrirGear', this.abrirDrawerEquipamentos)
    EventBus.$on('terminouFiltragem', this.terminouFiltragem)
  },
  beforeDestroy () {
    EventBus.$off('addEquip')
    EventBus.$off('filtrar')
    EventBus.$off('abrirGear')
    EventBus.$off('terminouFiltragem')
  },
  methods: {
    abrirDrawerEquipamentos () {
      this.drawerRight = true
    },
    async repassarFiltragem () {
      if (this.aba !== 'equips') {
        this.aba = 'equips'
      }
    },
    terminouFiltragem () {
      if (this.$vuetify.breakpoint.smAndDown) {
        this.drawer = false
      }
    }
  }
}
</script>

<style scoped></style>
