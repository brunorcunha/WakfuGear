export default ({ gear, danoBase, danoBaseCritico, resistencia, danosCausados }) => {
  let Gear, Resistencia, DanoBase, DanoBaseCritico

  const valorDanoFrente = 1
  const valorDanoLado = 1.1
  const valorDanoCostas = 1.25
  const CONSTANTE = 0.800000011920929

  const init = () => {
    Gear = {
      DanosCausados: danosCausados || 0,
      MaestriaElemental: somaAtributosDeDano(gear),
      MaestriaDistancia: gear['1053'] || 0,
      MaestriaCorpoACorpo: gear['1052'] || 0,
      MaestriaAlvoUnico: gear['1051'] || 0,
      MaestriaZona: gear['1050'] || 0,
      MaestriaCritico: gear['149'] || 0,
      MaestriaCostas: gear['180'] || 0,
      MaestriaBerserk: gear['1055'] || 0
    }

    Resistencia = resistencia
    DanoBase = danoBase
    DanoBaseCritico = danoBaseCritico
  }

  const somaAtributosDeDano = gear => {
    const danoElementalFixo = Math.max(gear['122'], gear['123'], gear['124'], gear['125']) || 0
    const danoElementalTotal = gear['120'] || 0
    const danoElementalPrimeiroLista = gear['910681'] || 0
    const danoElementalSegundoLista = gear['910682'] || 0
    const danoElementalTerceiroLista = gear['910683'] || 0
    const danoElementalLista = danoElementalPrimeiroLista + danoElementalSegundoLista + danoElementalTerceiroLista

    return danoElementalFixo + danoElementalTotal + danoElementalLista
  }

  const valorDanosCausados = () => (Gear.DanosCausados + 100) / 100
  const valorResistencia = () => (Resistencia <= 0) ? 1 : (Math.pow(CONSTANTE, Resistencia / 100)).toFixed(2)

  const calcularDano = (posicao, ehCritico, ehBerserk, ehCaC, ehST) => {
    const calculoDano = !ehCritico ? DanoBase : DanoBaseCritico
    const calculoDanosCausados = valorDanosCausados()
    const ehCostas = (posicao === 'costas')
    let calculoPosicao = valorDanoFrente
    if (posicao === 'lado') calculoPosicao = valorDanoLado
    else if (ehCostas) calculoPosicao = valorDanoCostas
    const calculoDominios = calcularDominios(ehCostas, ehBerserk, ehCaC, ehST, ehCritico)
    const calculoResistencia = valorResistencia()
    return Math.ceil(calculoDano * calculoPosicao * calculoDominios * calculoDanosCausados * calculoResistencia)
  }

  const calcularDominios = (ehCostas, ehBerserk, ehCaC, ehST, ehCritico) => {
    const calculoCostas = ehCostas ? Gear.MaestriaCostas : 0
    const calculoCritico = ehCritico ? Gear.MaestriaCritico : 0
    const calculoBerserk = ehBerserk ? Gear.MaestriaBerserk : 0
    const calculoDistancia = ehCaC ? Gear.MaestriaCorpoACorpo : Gear.MaestriaDistancia
    const calculoAlvo = ehST ? Gear.MaestriaAlvoUnico : Gear.MaestriaZona
    return (100 + Gear.MaestriaElemental + calculoCostas + calculoDistancia + calculoAlvo + calculoCritico + calculoBerserk) / 100
  }

  const montarArray = () => {
    const posicoes = ['frente', 'costas']
    const alvos = ['st', 'zona']
    const distancias = ['cac', 'distancia']

    const array = []
    for (const i in posicoes) {
      const posicao = posicoes[i]
      for (const j in distancias) {
        const distancia = distancias[j]
        const ehCaC = distancia === 'cac'
        for (const k in alvos) {
          const alvo = alvos[k]
          const ehST = alvo === 'st'
          const resultadoNormal = calcularDano(posicao, false, false, ehCaC, ehST)
          const resultadoBerserk = calcularDano(posicao, false, true, ehCaC, ehST)
          const resultadoCritico = calcularDano(posicao, true, false, ehCaC, ehST)
          const resultadoBerserkCritico = calcularDano(posicao, true, true, ehCaC, ehST)
          array.push({ posicao, distancia, alvo, resultado: resultadoNormal })
          array.push({ posicao, distancia, alvo, resultado: resultadoCritico })
          array.push({ posicao, distancia, alvo, resultado: resultadoBerserk })
          array.push({ posicao, distancia, alvo, resultado: resultadoBerserkCritico })
        }
      }
    }
    return array
  }

  init()
  return montarArray()
}
