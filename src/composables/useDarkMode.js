import { ref, watch, onMounted } from 'vue'

export default function useDarkMode() {
  // 定义当前主题状态
  const isDark = ref(false)
  
  // 检查本地存储或系统偏好
  onMounted(() => {
    // 先检查本地存储的主题偏好
    const storedTheme = localStorage.getItem('theme')
    
    if (storedTheme) {
      // 如果有本地存储的主题偏好，使用它
      isDark.value = storedTheme === 'dark'
    } else {
      // 否则检查系统偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = prefersDark
      
      // 将初始值保存到本地存储
      localStorage.setItem('theme', prefersDark ? 'dark' : 'light')
    }
    
    // 立即应用主题
    applyTheme()
  })
  
  // 切换主题函数
  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }
  
  // 应用主题到DOM
  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  // 监听系统主题偏好变化
  onMounted(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => {
      // 只有当用户没有手动设置主题时才跟随系统
      const hasUserPreference = localStorage.getItem('theme')
      if (!hasUserPreference) {
        isDark.value = e.matches
        applyTheme()
      }
    }
    
    // 添加监听器
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      // 旧版浏览器支持
      mediaQuery.addListener(handleChange)
    }
  })
  
  return {
    isDark,
    toggleDarkMode
  }
} 