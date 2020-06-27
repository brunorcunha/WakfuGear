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
              class="px-4"
              value="equips"
            >
              <img
                src="../../static/tipo/-2.png"
                class="mr-2"
              >
              {{ $t('label.equipamentos') }}
            </v-btn>
            <v-btn
              color="red"
              depressed
              block
              class="px-4"
              value="gears"
            >
              <img
                src="../../static/tipo/604.png"
                class="mr-2"
              >
              {{ $t('label.gears') }}
            </v-btn>
            <v-btn
              color="red"
              depressed
              block
              class="px-4"
              value="calc"
            >
              <img
                src="../../static/tipo/571.png"
                class="mr-2"
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
    <ExportDialog ref="exportDialog" />
    <ConfigDialog ref="configDialog" />
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
import ConfigDialog from '../components/ConfigDialog'
import ConfirmDialog from '../components/ConfirmDialog'
import InputDialog from '../components/InputDialog'
import ImportDialog from '../components/ImportDialog'
import ExportDialog from '../components/ExportDialog'
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
    ExportDialog,
    ConfigDialog,
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
    },
    existItems (val) {
      if (this.$route.redirectedFrom) {
        const [, gearHash] = this.$route.redirectedFrom.split('/')
        if (val && gearHash) this.importarGear(gearHash)
      }
    }
  },
  created () {
    this.$store.dispatch('items/init', { lang: this.$lang })
    this.$store.dispatch('filtros/init')
    this.$store.dispatch('gears/init')
    this.$store.dispatch('configs/init')
  },
  mounted () {
    Vue.prototype.$ConfirmDialog = this.$refs.confirmDialog
    Vue.prototype.$ImportDialog = this.$refs.importDialog
    Vue.prototype.$ExportDialog = this.$refs.exportDialog
    Vue.prototype.$InputDialog = this.$refs.inputDialog
    Vue.prototype.$ConfigDialog = this.$refs.configDialog

    if (this.$vuetify.breakpoint.lgAndUp) {
      this.drawer = true
      this.abrirDrawerEquipamentos()
    }

    EventBus.$on('addEquip', this.abrirDrawerEquipamentos)
    EventBus.$on('trocarTab', this.repassarFiltragem)
    EventBus.$on('abrirGear', this.abrirDrawerEquipamentos)
    EventBus.$on('terminouFiltragem', this.terminouFiltragem)
  },
  beforeDestroy () {
    EventBus.$off('addEquip')
    EventBus.$off('trocarTab')
    EventBus.$off('abrirGear')
    EventBus.$off('terminouFiltragem')
  },
  methods: {
    abrirDrawerEquipamentos () {
      this.drawerRight = true
    },
    abrirAbaGears () {
      this.aba = 'gears'
    },
    abrirAbaEquips () {
      this.aba = 'equips'
    },
    async repassarFiltragem () {
      if (this.aba !== 'equips') this.abrirAbaEquips()
    },
    terminouFiltragem () {
      if (this.$vuetify.breakpoint.smAndDown) {
        this.drawer = false
      }
    },
    async importarGear (gearHash) {
      if (this.podeSerDecrypted(gearHash)) {
        this.abrirDrawerEquipamentos()
        this.abrirAbaGears()
        const { nome, itemsID } = this.decrypt(gearHash)
        const index = await this.criarGear(itemsID)
        this.$store.dispatch('gears/setNome', { nome })

        EventBus.$emit('abrirGear', index)
      }
    }
  }
}
</script>

<style scoped></style>
