<template>
  <v-content>
    <v-container>
      <canvas ref="canvas" width="500" height="500"/>
    </v-container>
  </v-content>
</template>

<script>
  // import anm from '../../static/json/1.json'

  export default {
    name: 'render',
    data: () => ({
      rotation: 0,
      canvas: null,
      ctx: null,
      img1: null,
      img2: null,
      CharacterClass: ['', 'feca', 'osa', 'enu', 'sram', 'xelor', 'eca', 'eni', 'iop', 'cra', 'sadi', 'sac', 'panda', 'rogue', 'masq', 'ouginak', 'fog', 'elio', 'hupper'],
      CharacterSex: ['male', 'female'],
      CustomHairParts: [-434472426, 1006468258, -434472431, 595393602, -1936755333, -1936755365,
        305687247, -1936755358, -212768807, -1891312795, -148124709, -1799293399,
        -434472434, -434472402, 99257258, -434472430, 99257261, 258742502,
        1527482179, -1936755332, 99257260, -1936755336, -212768830, -1386775672,
        -148124708, -434472427, -1936755359, 1018041093, 65368809, -1936755364,
        -1799293398, -1173770306, -212768834, -1936755361, -616966505, -212768806,
        -1936755360, -212768829, 1494681735, -434472401, -434472433, -1936755335,
        -212768805, -212768833, -1799293397, 749411954, -1713624817, 1796303170,
        -1799293401, 1527482178, 63954806, -1799293400, 305687248, -1936755363,
        -434472428, 43285675, -434472400, -1936755331, -1936755334, -148124707,
        -434472432, 1135923850, -434472404, -1386775670, -1936755366, -212768832,
        305687246, 458580894, 1339152237, -1936755362, 76069493, -434472429,
        -1386775671, -1288184498, -45633279, -212768831, -212768804, 99257259,
        -1936755330, 99257262, -434472403],
      CustomBodyParts: [1006468258, -2078225375, 892321662, -1891312795, 1749427467, 73723264,
        494389220, -172789396, -1380936348, 1483327197, 1018041093, 1327105750,
        1494681735, -2136674192, 2092787, 1483327198, -156683205, -1380936345,
        63954806, 456610759, 1779636034, -1953599098, -723798377]
    }),
    mounted () {
      this.img1 = new Image()
      this.img1.crossOrigin = 'Anonymous'
      this.img1.src = 'https://cellar.services.clever-cloud.com/api-bucket/atlas/players/10_0.png'
      this.img1.onload = () => { requestAnimationFrame(this.step) }

      this.img2 = new Image()
      this.img2.crossOrigin = 'Anonymous'
      this.img2.src = 'https://cellar.services.clever-cloud.com/api-bucket/atlas/players/70_0.png'
      this.img2.onload = () => { requestAnimationFrame(this.step) }
    },
    methods: {
      setRectTexCoords (left, right, top, bottom) { return new Float32Array([left, bottom, left, top, right, bottom, right, bottom, left, top, right, top]) },
      getPlayerGfx (cc, cs) { return (this.CharacterClass.indexOf(cc) * 10 + this.CharacterSex.indexOf(cs)) },
      draw () {
      }
    }
  }
</script>

<style scoped>
  canvas{border:1px solid red}
</style>
