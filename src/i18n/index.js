import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN.json'
import enUS from './locales/en-US.json'

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
  legacy: false, // 使用 Composition API 模式
  globalInjection: true, // 全局注入 $t 方法
  locale: getStoredLanguage(),
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

// 设置语言并保存到本地存储
export const setLanguage = (lang) => {
  i18n.global.locale.value = lang
  localStorage.setItem('language', lang)
  document.querySelector('html').setAttribute('lang', lang)
  
  // 强制重新渲染页面上的所有组件
  window.dispatchEvent(new Event('language-changed'))
}

// 初始化语言设置
export const initLanguage = () => {
  const lang = getStoredLanguage()
  document.querySelector('html').setAttribute('lang', lang)
}

export default i18n 