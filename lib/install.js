'use strict'

const path = require('path')
const _ = require('lodash')
const parseComponentConfig = require('@udock/vue-plugin-ui/lib/component-config-parser')
const getStylesCode = require('@udock/vue-plugin-ui/lib//get-styles-code')
const getComponentsCode = require('@udock/vue-plugin-ui/lib/get-components-code')
const dependency = require('./components-dependency')
const defaultOptions = require('./components-options')
const pify = require('pify')

module.exports = function (loader, options) {
  const loaderResolve = pify(loader.resolve)
  const defaultTheme = 'iview/src/styles/index.less'
  options = _.merge({
    local: ['zh-CN'],
    theme: defaultTheme,
    'pre-styles': [],
    'post-styles': [],
    components: []
  }, options)
  const langs = '{}'
  options.components = parseComponentConfig(options.components, {defaults: defaultOptions, dependency: dependency})
  return loaderResolve(loader.context, options.theme).then(
    // 将主题路径转换为绝对路径
    (filePath) => (options.theme = filePath),
    () => options.theme
  ).then(() => {
    const conifg = {
      pathHandler: path.resolve(__dirname, 'path-handler.js')
    }
    if (options.theme === defaultTheme) {
      conifg.ignoreThemeFileContent = true
      options['pre-styles'].push('~@udock/vue-plugin-iview/template/iview.less')
    }
    const tasks = []
    // 处理样式代码
    tasks.push(getStylesCode(options.components, options, conifg))
    // 处理JS代码
    tasks.push(getComponentsCode(options.components, {loader: loader, prefix: 'iview/src/components/'}))
    tasks.push(loaderResolve(loader.context, 'iview/src'))
    return Promise.all(tasks)
  }).then((results) => {
    const styles = results[0]
    const components = results[1]
    return {
      install: `Vue.use(
        ${options.$plugin},
        {
          langs: ${langs},
          components: [ ${components} ]
        }),
        [ ${styles} ]`,
      compile: {
        babel: (req) => {
          return req.startsWith(path.resolve(results[2], '..'))
        }
      }
    }
  })
}
