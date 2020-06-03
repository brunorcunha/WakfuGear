<template>
  <v-layout
    row
    no-wrap
    pb-0
    px-2
  >
    <v-flex>
      <v-text-field
        ref="titulo"
        class="pt-2 mt-0"
        dark
        single-line
        hide-details
        :value="nome"
        :readonly="!edit"
        :disabled="!edit"
        :label="$t('label.tituloconjunto')"
        @change="mudarNome"
        @focus="$event.target.select()"
        @keyup.native.enter="editarTitulo"
        @blur="editarTitulo"
      >
        <v-menu
          slot="prepend"
          bottom
          right
          transition="slide-y-transition"
          offset-y
        >
          <template #activator="{ on: menu }">
            <v-tooltip
              bottom
              mt-0
            >
              <template #activator="{ on: tooltip }">
                <v-btn
                  small
                  icon
                  flat
                  class="ma-0"
                  v-on="{ ...menu, ...tooltip }"
                >
                  <v-icon>menu</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('label.opcoes') }}</span>
            </v-tooltip>
          </template>
          <v-list dense>
            <v-list-tile @click="confirmarClonar">
              <v-list-tile-content><v-list-tile-title>{{ $t('label.clonargear') }}</v-list-tile-title></v-list-tile-content>
              <v-list-tile-action>
                <v-icon color="orange">
                  library_add
                </v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider />
            <v-list-tile @click="confirmarExcluir">
              <v-list-tile-content><v-list-tile-title>{{ $t('label.removergear') }}</v-list-tile-title></v-list-tile-content>
              <v-list-tile-action>
                <v-icon color="red">
                  delete
                </v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider />
            <v-list-tile @click="exportarClipboard">
              <v-list-tile-content><v-list-tile-title>{{ $t('label.exportargear') }}</v-list-tile-title></v-list-tile-content>
              <v-list-tile-action>
                <v-icon color="primary">
                  import_export
                </v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider />
            <v-list-tile @click="novoConjunto">
              <v-list-tile-content><v-list-tile-title>{{ $t('label.novogear') }}</v-list-tile-title></v-list-tile-content>
              <v-list-tile-action>
                <v-icon color="green">
                  add
                </v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider />
            <v-menu
              open-on-hover
              right
              transition="slide-x-transition"
              offset-x
              :close-on-content-click="false"
            >
              <template #activator="{ on: submenu }">
                <v-list-tile
                  @click.stop
                  v-on="submenu"
                >
                  <v-list-tile-content>
                    {{ $t('label.trocargear') }}
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-icon small>
                      arrow_forward_ios
                    </v-icon>
                  </v-list-tile-action>
                </v-list-tile>
              </template>
              <ListGears
                @evento="trocarGear"
              />
            </v-menu>
          </v-list>
        </v-menu>
        <v-tooltip
          slot="append-outer"
          bottom
          mt-0
        >
          <v-btn
            slot="activator"
            icon
            class="ma-0"
            dark
            @click="editarTitulo"
          >
            <v-icon>{{ edit ? 'check' : 'edit' }}</v-icon>
          </v-btn>
          <span>{{ edit ? $t('label.gravartitulo') : $t('label.editartitulo') }}</span>
        </v-tooltip>
      </v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
import ListGears from './ListGears'
import copy from 'copy-text-to-clipboard'

export default {
  name: 'TitleView',
  components: { ListGears },
  data: () => ({
    edit: false,
    nome: ''
  }),
  methods: {
    mudarNome (nome) {
      this.$store.dispatch('gears/setNome', { nome })
    },
    async confirmarClonar () {
      try {
        await this.$ConfirmDialog.abrir({
          titulo: this.$i18n.t('dialog.clonar.titulo'),
          mensagem: this.$i18n.t('dialog.clonar.msg')
        })
        this.clonarConjunto()
      } catch (e) {}
    },
    async confirmarExcluir () {
      try {
        await this.$ConfirmDialog.abrir({
          titulo: this.$i18n.t('dialog.excluir.titulo'),
          mensagem: this.$i18n.t('dialog.excluir.msg')
        })
        this.$store.dispatch('gears/removerGear', {})
      } catch (e) {}
    },
    novoConjunto () {
      const index = this.qnt
      this.$store.dispatch('gears/adicionarGear', {})
      this.$store.dispatch('gears/selecionarAtual', { index })
    },
    clonarConjunto () {
      const index = this.qnt
      this.$store.dispatch('gears/clonarGear', {})
      this.$store.dispatch('gears/selecionarAtual', { index })
      this.$store.dispatch('gears/setNome', { nome: this.$i18n.t('label.clone') })
    },
    trocarGear (gear, index) {
      this.$store.dispatch('gears/selecionarAtual', { index })
    },
    editarTitulo () {
      this.edit = !this.edit
      if (this.edit) setTimeout(() => this.$refs.titulo.focus(), 200)
    },
    exportarClipboard () {
      copy('funcionou!')
    }
  }
}
</script>

<style scoped>

</style>
