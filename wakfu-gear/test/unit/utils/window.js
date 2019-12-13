const { getComputedStyle } = window
window.getComputedStyle = function getComputedStyleStub (el) {
  return { ...getComputedStyle(el), getPropertyValue: prop => '', transitionDelay: '', transitionDuration: '', animationDelay: '', animationDuration: '' }
}
window.scrollTo = () => true
window.setTimeout = (fn, t) => fn()

window.localStorage = (function () {
  var store = {}
  return {
    getItem (key) {
      return store[key] || null
    },
    setItem (key, value) {
      store[key] = value.toString()
    },
    removeItem (key) {
      delete store[key]
    },
    get length () {
      return Object.keys(store).length
    },
    key (i) {
      var keys = Object.keys(store)
      return keys[i] || null
    },
    clear () {
      store = {}
    }
  }
})()

var app = document.createElement('div')
app.setAttribute('data-app', true)
document.body.appendChild(app)
