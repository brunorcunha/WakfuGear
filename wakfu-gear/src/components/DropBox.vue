<template>
  <v-autocomplete
    v-model="selected"
    multiple
    chips
    deletable-chips
    dense
    clearable
    item-value="id"
    item-avatar="icon"
    :item-text="$lang"
    :items="items"
    :label="label"
    :placeholder="label"
    :disabled="disabled"
    v-on="inputListeners"
  >
    <template #prepend-item>
      <v-list-tile
        ripple
        @click="toggle"
      >
        <v-list-tile-action>
          <v-icon :color="selected.length > 0 ? 'primary' : ''">
            {{ icon }}
          </v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Selecionar Tudo</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action v-if="!!selecionarTodosIcone">
          <img :src="`../../static/${selecionarTodosIcone}`">
        </v-list-tile-action>
      </v-list-tile>
      <v-divider />
    </template>
    <template #selection="data">
      <v-chip
        :selected="data.selected"
        label
        close
        small
        class="chip--select-multi"
        @input="remove(data.item)"
      >
        {{ data.item[$lang] }}
      </v-chip>
    </template>
    <template #item="data">
      <v-list-tile-action>
        <v-icon v-if="selected.includes(data.item.id)">
          check_box
        </v-icon>
        <v-icon v-else>
          check_box_outline_blank
        </v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ data.item[$lang] }}</v-list-tile-title>
      </v-list-tile-content>
      <v-list-tile-action v-if="!!data.item.img">
        <img :src="`../../static/${data.item.img}`">
      </v-list-tile-action>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: 'DropBox',
  props: {
    value: { type: Array, default: () => [] },
    items: { type: Array, default: () => [] },
    label: { type: String, default: '' },
    selecionarTodosIcone: { type: String, default: null },
    placeholder: { type: String, default: '' },
    disabled: { type: Boolean, default: false }
  },
  data: () => ({
    selected: []
  }),
  computed: {
    inputListeners () {
      return { ...this.$listeners }
    },
    likesAll () {
      return this.selected.length === this.items.length
    },
    likesSome () {
      return this.selected.length > 0 && !this.likesAll
    },
    icon () {
      if (this.likesAll) return 'close'
      if (this.likesSome) return 'indeterminate_check_box'
      return 'check_box_outline_blank'
    }
  },
  watch: {
    value: function (val) {
      if (!val) {
        this.selected = []
        return
      }
      this.selected = val
    },
    selected: function (val) {
      this.$emit('input', this.selected)
    }
  },
  created () {},
  methods: {
    toggle () {
      this.$nextTick(() => {
        if (this.likesAll) {
          this.selected = []
        } else {
          this.selected = this.items.map(e => e.id)
        }
      })
    },
    remove (item) {
      const index = this.selected.indexOf(item.id)
      if (index >= 0) this.selected.splice(index, 1)
    }
  }
}
</script>

<style>
  .dropbox .v-list > div {
    border-bottom: 1px dashed silver;
  }
  .dropbox .v-avatar img {
    height: auto;
    width: auto;
    border-radius: 0;
  }
</style>
