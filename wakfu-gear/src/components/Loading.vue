<template>
  <v-dialog
    :value="true"
    persistent
    width="500"
    content-class="elevation-0"
  >
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
  </v-dialog>
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
  #loading {
    position: relative;
    background: url(../../static/load1.png) no-repeat center -3px;
    width: 500px;
    height: 300px;
  }
  #loading:after {
    content: '';
    position: absolute;
    width: 53px;
    height: 216px;
    top: 0;
    left: 223px;
    background: url(../../static/load2.png) no-repeat center;

    animation:spin 1s linear infinite;
  }
  .loadingText {
    color: #fff;
    text-align: center;
    bottom: 50px;
    position: absolute;
    margin: auto;
    left:0; right: 0;
  }

  @-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
  @keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }
</style>
