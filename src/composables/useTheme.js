import { ref, watch } from 'vue'

// 主题类型
const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
}

// 获取系统主题偏好
const getSystemTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME.DARK : THEME.LIGHT
}

export function useTheme() {
  // 当前主题模式（light/dark/system）
  const themeMode = ref(localStorage.getItem('theme-mode') || THEME.SYSTEM)
  // 当前实际使用的主题（light/dark）
  const currentTheme = ref(
    themeMode.value === THEME.SYSTEM
      ? getSystemTheme()
      : themeMode.value
  )

  // 监听系统主题变化
  const systemThemeMedia = window.matchMedia('(prefers-color-scheme: dark)')
  const handleSystemThemeChange = (e) => {
    if (themeMode.value === THEME.SYSTEM) {
      currentTheme.value = e.matches ? THEME.DARK : THEME.LIGHT
      applyTheme()
    }
  }
  systemThemeMedia.addEventListener('change', handleSystemThemeChange)

  // 应用主题到文档
  const applyTheme = () => {
    const isDark = currentTheme.value === THEME.DARK
    document.documentElement.classList.toggle('dark-theme', isDark)
    // 添加过渡类，用于主题切换动画
    document.documentElement.classList.add('theme-transition')
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition')
    }, 300)
  }

  // 切换主题模式
  const toggleTheme = () => {
    const modes = [THEME.LIGHT, THEME.DARK, THEME.SYSTEM]
    const currentIndex = modes.indexOf(themeMode.value)
    const nextIndex = (currentIndex + 1) % modes.length
    themeMode.value = modes[nextIndex]
    
    if (themeMode.value === THEME.SYSTEM) {
      currentTheme.value = getSystemTheme()
    } else {
      currentTheme.value = themeMode.value
    }
    
    localStorage.setItem('theme-mode', themeMode.value)
    applyTheme()
  }

  // 监听主题变化
  watch(currentTheme, () => {
    applyTheme()
  })

  // 初始应用主题
  applyTheme()

  // 清理函数
  const cleanup = () => {
    systemThemeMedia.removeEventListener('change', handleSystemThemeChange)
  }

  return {
    themeMode,
    currentTheme,
    toggleTheme,
    cleanup,
    THEME
  }
} 