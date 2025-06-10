import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

// 获取浏览器语言设置
const getBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage
  return browserLang.startsWith('zh') ? 'zh-CN' : 'en-US'
}

// 获取存储的语言设置或使用浏览器语言
const getStoredLanguage = () => {
  return localStorage.getItem('language') || getBrowserLanguage()
}

// 创建i18n实例
const i18n = createI18n({
  legacy: false, // 使用组合式API
  locale: getStoredLanguage(),
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  },
  // 确保语言改变时重新渲染
  sync: true,
  // 避免警告信息
  silentTranslationWarn: true,
  // 使用HTML内容
  warnHtmlMessage: false
})

// 设置语言并保存到本地存储
export const setLanguage = (lang) => {
  if (i18n.global.locale.value === lang) return
  
  i18n.global.locale.value = lang
  localStorage.setItem('language', lang)
  document.querySelector('html').setAttribute('lang', lang)
  
  // 强制重新渲染页面上的所有组件
  // 这是一个比较激进的方法，但对于确保所有组件更新很有效
  window.dispatchEvent(new Event('language-changed'))
}

// 初始化语言设置
export const initLanguage = () => {
  const lang = getStoredLanguage()
  document.querySelector('html').setAttribute('lang', lang)
}

export default i18n 