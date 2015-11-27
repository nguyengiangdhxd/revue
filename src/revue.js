export default function (Vue, options) {
  const _ = Vue.util
  // bring redux to revue
  _.defineReactive(Vue.prototype, '$revue', options.store)
  // listen for state changes
  _.defineReactive(Vue.prototype, '$subscribe', function () {
    const self = this
    self.unsubscriber = []
    const props = [].slice.call(arguments)
    props.forEach(prop => {
      let currentValue
      function handleChange() {
        let previousValue = currentValue;
        currentValue = options.store.getState()[prop]

        if (previousValue !== currentValue) {
          self.$set(prop, currentValue)
        }
      }
      self.unsubscriber.push(options.store.subscribe(handleChange))
    })
  })
  _.defineReactive(Vue.prototype, '$unsubscribe', function () {
    this.unsubscriber.forEach(un => un())
  })
  // global mixin
  Vue.mixin({
    beforeDestroy () {
      if (this.unsubscriber && this.unsubscriber.length > 0) {
        this.$unsubscribe()
      }
    }
  })
}