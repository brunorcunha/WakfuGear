<template>
  <div id="overlayloading">
    <div id="loading">
      <transition name="slide-y-reverse-transition">
        <p
          :key="texto"
          class="loadingText"
        >
          {{ texto }}
        </p>
      </transition>
    </div>
  </div>
</template>

<script>
import { i18n } from '../language/lang'

export default {
  name: 'Loading',
  data: () => ({
    interval: null,
    texto: ''
  }),
  beforeDestroy () {
    clearInterval(this.interval)
  },
  mounted () {
    this.loadingText()
  },
  methods: {
    loadingText () {
      this.texto = i18n.t('loading[0]') + '...'
      this.interval = setInterval(() => {
        this.texto = i18n.t(`loading[${this.aleatorio()}]`) + '...'
      }, 3000)
    },
    aleatorio (min = 1, max = 41) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
  }
}
</script>

<style>
</style>
