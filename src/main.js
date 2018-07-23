import isArray from 'lodash/isArray'
import set from 'lodash/set'
import locale from 'iview/src/locale'
import 'string.prototype.includes'
import includes from 'array-includes'
import i18nConfig from './i18n'

includes.shim()

const install = function (Vue, options) {
  if (install.installed) return

  const vueI18n = Vue.i18n
  if (vueI18n) {
    // mergeLocaleMessage,setLocaleMessage
    vueI18n.mergeLocaleMessage(vueI18n.locale, i18nConfig[vueI18n.locale])
    locale.i18n(function (path, opts) {
      const value = vueI18n.t(path, opts)
      if (value !== null && value !== undefined) return value
      return ''
    })
  }
  let resolvedOptions = {
    langs: options.langs,
    components: {}
  }
  options.components.forEach((component) => {
    if (!isArray(component)) {
      component = [component]
    }
    const opts = component[1] || {}
    // _component用于缓存iview export出来的default对象和其他对象
    const _component = component = component[0]
    component = component && component.hasOwnProperty('default') ? component['default'] : component
    if (!opts.implicit) {
      const name = opts.name || component.name
      if (name) {
        Vue.component(name, component)
      }
      if (opts.global) {
        Vue.prototype[opts.global] = component
      }
      const children = opts.children
      if (children) {
        for (let key in children) {
          const child = children[key]
          // 取name优先级:手动配置 > iview export default > iview export
          const chilComponent = component[key] || _component[key]
          const name = child.name || chilComponent.name
          if (name) {
            Vue.component(name, chilComponent)
          }
          const global = child.global
          if (global) {
            Vue.prototype[global] = chilComponent
          }
        }
      }
    }
    if (opts.id) {
      resolvedOptions.components[opts.id] = opts
    }
  })
  set(Vue, 'udock.plugins.iview.opts', resolvedOptions)
}

export default {
  install
}
