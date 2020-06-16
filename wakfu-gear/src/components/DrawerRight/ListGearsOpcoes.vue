<template>
  <v-list subheader>
    <v-divider />
    <template v-for="(gear, index) in allGears">
      <div
        :key="`${index}${gear}`"
        class="gearsList"
      >
        <GearsPopUp
          v-slot="{ hover }"
          :gear="gear"
        >
          <v-list-tile class="corFundoBranco">
            <v-list-tile-content
              @click="goToGear(index)"
              v-on="hover"
            >
              {{ gear.nome }}
            </v-list-tile-content>
            <v-list-tile-avatar>
              <v-menu
                bottom
                left
                offset-x
              >
                <template #activator="{ on: menu }">
                  <v-tooltip
                    bottom
                    mt-0
                  >
                    <template #activator="{ on: tooltip }">
                      <v-btn
                        icon
                        flat
                        v-on="{ ...menu, ...tooltip }"
                      >
                        <v-icon>menu</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('label.opcoes') }}</span>
                  </v-tooltip>
                </template>
                <v-list
                  dense
                  subheader
                >
                  <v-subheader class="deep-orange accent-4 white--text">
                    {{ gear.nome }}
                  </v-subheader>
                  <v-divider />
                  <v-list-tile @click="trocarNome(gear, index)">
                    <v-list-tile-content><v-list-tile-title>{{ $t('label.editartitulo') }}</v-list-tile-title></v-list-tile-content>
                    <v-list-tile-action>
                      <v-icon color="info">
                        edit
                      </v-icon>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-divider />
                  <v-list-tile @click="confirmarClonar(gear, index)">
                    <v-list-tile-content><v-list-tile-title>{{ $t('label.clonargear') }}</v-list-tile-title></v-list-tile-content>
                    <v-list-tile-action>
                      <v-icon color="orange">
                        library_add
                      </v-icon>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-divider />
                  <v-list-tile @click="confirmarExcluir(gear, index)">
                    <v-list-tile-content><v-list-tile-title>{{ $t('label.removergear') }}</v-list-tile-title></v-list-tile-content>
                    <v-list-tile-action>
                      <v-icon color="red">
                        delete
                      </v-icon>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-divider />
                  <v-list-tile @click="exportarClipboard(gear, index)">
                    <v-list-tile-content><v-list-tile-title>{{ $t('label.exportargear') }}</v-list-tile-title></v-list-tile-content>
                    <v-list-tile-action>
                      <v-icon color="primary">
                        import_export
                      </v-icon>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-list-tile-avatar>
          </v-list-tile>
        </GearsPopUp>
        <v-divider />
      </div>
    </template>
  </v-list>
</template>

<script>
import { mapGetters } from 'vuex'
import GearsPopUp from './GearsPopUp'

export default {
  name: 'ListGearsOpcoes',
  components: { GearsPopUp },
  computed: {
    ...mapGetters('gears', ['allGears', 'indexAtual', 'qnt'])
  },
  methods: {
    goToGear (index) {
      this.$emit('selecionar')
      this.$store.dispatch('gears/selecionarAtual', { index })
    },
    async trocarNome (gear, index) {
      try {
        const novoNome = await this.$InputDialog.abrir({
          titulo: this.$i18n.t('dialog.editarNome.titulo'),
          mensagem: this.$i18n.t('dialog.editarNome.msg', { nome: gear.nome }),
          label: this.$i18n.t('dialog.editarNome.label'),
          placeholder: gear.nome
        })
        this.$store.dispatch('gears/setNome', { nome: novoNome, index })
      } catch (e) {}
    },
    async confirmarClonar (gear, index) {
      try {
        await this.$ConfirmDialog.abrir({
          titulo: this.$i18n.t('dialog.clonar.titulo'),
          mensagem: this.$i18n.t('dialog.clonar.msg', { nome: gear.nome })
        })
        this.clonarConjunto(index)
      } catch (e) {}
    },
    async confirmarExcluir (gear, index) {
      try {
        await this.$ConfirmDialog.abrir({
          titulo: this.$i18n.t('dialog.excluir.titulo'),
          mensagem: this.$i18n.t('dialog.excluir.msg', { nome: gear.nome })
        })
        this.$store.dispatch('gears/removerGear', { index })
      } catch (e) {}
    },
    clonarConjunto (index) {
      this.$store.dispatch('gears/clonarGear', { index })
      this.$store.dispatch('gears/setNome', { nome: this.$i18n.t('label.clone'), index })
    },
    exportarClipboard (gear, index) {}
  }
}
</script>

<style scoped>

</style>
