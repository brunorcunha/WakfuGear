<script>
export default {
  methods: {
    atualizarItens () {
      localStorage.removeItem('versao')
      location.reload(true)
    }
  }
}
</script>
