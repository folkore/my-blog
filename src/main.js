import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// 导入自定义指令
import lazyLoad from './directives/lazyLoad'

// 导入国际化
import i18n, { initLanguage } from './i18n'

// 初始化语言设置
initLanguage()

// 创建应用实例
const app = createApp(App)

// 注册全局指令
app.directive('lazy', lazyLoad)

// 使用路由
app.use(router)

// 使用Pinia状态管理
app.use(createPinia())

// 使用国际化
app.use(i18n)

// 挂载应用
app.mount('#app')
