<script>
import { radix64 } from '../functions/radix64'

export default {
  name: 'WakfuGear',
  methods: {
    atualizarItens () {
      localStorage.removeItem('versao')
      location.reload(true)
    },
    async criarGear (arrayItems) {
      const items = []
      this.$store.state.items.items.forEach(item => {
        if (arrayItems.some(codigo => codigo === item.id)) {
          items.push(item)
        }
      })
      const index = this.$store.state.gears.gears.length
      this.$store.dispatch('gears/adicionarGear', {})
      this.$store.dispatch('gears/selecionarAtual', { index })
      this.$store.dispatch('gears/adicionarItems', { items })
      return index
    },
    podeSerDecrypted (string) {
      if (!string.includes('-')) return false
      const [nome, hash] = string.split('-')
      if (nome.length <= 0 || hash.length <= 0) return false
      return true
    },
    decrypt (string) {
      const [nome, hash] = string.split('-')
      const hashSplited = hash.match(/.{1,3}/g)
      const itemsID = hashSplited.map(e => radix64(e))
      return { nome, itemsID }
    }
  }
}
</script>
