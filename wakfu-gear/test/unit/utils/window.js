const { getComputedStyle } = window
window.getComputedStyle = function getComputedStyleStub (el) {
  return { ...getComputedStyle(el), getPropertyValue: prop => '', transitionDelay: '', transitionDuration: '', animationDelay: '', animationDuration: '' }
}
window.scrollTo = () => true
window.setTimeout = (fn, t) => fn()

window.localStorage = (function () {
  var store = {}
  return {
    getItem: function (key) {
      return store[key] || null
    },
    setItem: function (key, value) {
      store[key] = value.toString()
    },
    removeItem: function (key) {
      delete store[key]
    },
    get length () {
      return Object.keys(store).length
    },
    key: function (i) {
      var keys = Object.keys(store)
      return keys[i] || null
    },
    clear: function () {
      store = {}
    }
  }
})()

var app = document.createElement('div')
app.setAttribute('data-app', true)
document.body.appendChild(app)
