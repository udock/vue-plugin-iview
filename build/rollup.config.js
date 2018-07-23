module.exports = {
  external: (id) => /^(iview\/src\/locale(|\/.*)|lodash\/.*)$/.test(id),
  globals: {
    'iview/src/locale': 'iview.locale',
    'iview/src/locale/lang/en-US': 'iview.locale.lang.en-US',
    'iview/src/locale/lang/zh-CN': 'iview.locale.lang.zh-CN',
    'iview/src/locale/lang/es-ES': 'iview.locale.lang.es-ES',
    'iview/src/locale/lang/ja-JP': 'iview.locale.lang.ja-JP',
    'iview/src/locale/lang/tr-TR': 'iview.locale.lang.tr-TR',
    'iview/src/locale/lang/zh-TW': 'iview.locale.lang.zh-TW',
    'lodash/isArray': '_.isArray',
    'lodash/set': '_.set'
  }
}
