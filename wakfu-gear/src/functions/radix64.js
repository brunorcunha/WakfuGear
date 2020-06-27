export const radix64 = value => {
  const endex = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'
  const getChars = (num, res) => {
    const mod = num % 64
    const remaining = Math.floor(num / 64)
    const chars = endex.charAt(mod) + res

    if (remaining <= 0) return chars
    return getChars(remaining, chars)
  }

  if (typeof value === 'number') return getChars(Math.abs(value), '')
  if (typeof value === 'string') {
    if (value === '') return NaN
    return value.split('').reverse().reduce((prev, cur, i) => prev + endex.indexOf(cur) * Math.pow(64, i), 0)
  }
}

export const leadingZeros = (num, zeros) => {
  const s = '000000000' + num
  return s.substr(s.length - zeros)
}

export const radixLeading64 = (value, zeros) => leadingZeros(radix64(value), zeros)
