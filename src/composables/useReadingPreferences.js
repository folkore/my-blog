import { ref, reactive, watch, nextTick } from 'vue'

// 默认设置
const DEFAULT_FONT_SETTINGS = {
  fontSize: 16,        // 12-24px
  lineHeight: 1.6,     // 1.4-2.0
  fontFamily: 'system' // 'system', 'serif', 'sans-serif'
}

const DEFAULT_BRIGHTNESS_SETTINGS = {
  brightness: 1.0      // 0.6-1.0
}

// 工具函数：安全的 localStorage 操作
const safeLocalStorage = {
  getItem(key) {
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.warn('localStorage getItem failed:', error)
      return null
    }
  },
  
  setItem(key, value) {
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.warn('localStorage setItem failed:', error)
    }
  },
  
  removeItem(key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn('localStorage removeItem failed:', error)
    }
  }
}

// 防抖函数
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function useReadingPreferences() {
  // ==================== 阅读进度管理 ====================
  const readingProgress = ref({})
  
  // 加载阅读进度数据
  const loadReadingProgress = () => {
    const saved = safeLocalStorage.getItem('reading-progress')
    if (saved) {
      try {
        readingProgress.value = JSON.parse(saved)
      } catch (error) {
        console.warn('Failed to parse reading progress:', error)
        readingProgress.value = {}
      }
    }
  }
  
  // 保存阅读进度
  const saveReadingProgress = debounce(() => {
    safeLocalStorage.setItem('reading-progress', JSON.stringify(readingProgress.value))
  }, 1000)
  
  // 更新文章阅读进度
  const updateReadingProgress = (articleSlug, progress, scrollPosition, title) => {
    if (!articleSlug || progress < 0) return
    
    readingProgress.value[articleSlug] = {
      progress: Math.round(progress * 100) / 100, // 保留两位小数
      scrollPosition: Math.round(scrollPosition),
      timestamp: Date.now(),
      title: title || ''
    }
    saveReadingProgress()
  }
  
  // 获取文章阅读进度
  const getReadingProgress = (articleSlug) => {
    return readingProgress.value[articleSlug] || null
  }
  
  // 清除文章阅读进度
  const clearReadingProgress = (articleSlug) => {
    if (readingProgress.value[articleSlug]) {
      delete readingProgress.value[articleSlug]
      saveReadingProgress()
    }
  }
  
  // ==================== 字体设置管理 ====================
  const fontSettings = reactive({ ...DEFAULT_FONT_SETTINGS })
  
  // 加载字体设置
  const loadFontSettings = () => {
    const saved = safeLocalStorage.getItem('font-settings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        Object.assign(fontSettings, { ...DEFAULT_FONT_SETTINGS, ...parsed })
      } catch (error) {
        console.warn('Failed to parse font settings:', error)
      }
    }
  }
  
  // 保存字体设置
  const saveFontSettings = () => {
    safeLocalStorage.setItem('font-settings', JSON.stringify(fontSettings))
  }
  
  // 应用字体设置到 CSS
  const applyFontSettings = () => {
    const root = document.documentElement
    root.style.setProperty('--reading-font-size', `${fontSettings.fontSize}px`)
    root.style.setProperty('--reading-line-height', fontSettings.lineHeight)
    
    // 字体家族映射
    const fontFamilyMap = {
      system: 'var(--font-sans)',
      serif: 'Georgia, "Times New Roman", Times, serif',
      'sans-serif': '"Helvetica Neue", Helvetica, Arial, sans-serif'
    }
    
    root.style.setProperty('--reading-font-family', fontFamilyMap[fontSettings.fontFamily] || fontFamilyMap.system)
  }
  
  // 更新字体设置
  const updateFontSettings = (newSettings) => {
    Object.assign(fontSettings, newSettings)
    applyFontSettings()
    saveFontSettings()
  }
  
  // 重置字体设置
  const resetFontSettings = () => {
    Object.assign(fontSettings, DEFAULT_FONT_SETTINGS)
    applyFontSettings()
    saveFontSettings()
  }
  
  // ==================== 亮度控制管理 ====================
  const brightnessSettings = reactive({ ...DEFAULT_BRIGHTNESS_SETTINGS })
  
  // 加载亮度设置
  const loadBrightnessSettings = () => {
    const saved = safeLocalStorage.getItem('brightness-settings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        Object.assign(brightnessSettings, { ...DEFAULT_BRIGHTNESS_SETTINGS, ...parsed })
      } catch (error) {
        console.warn('Failed to parse brightness settings:', error)
      }
    }
  }
  
  // 保存亮度设置
  const saveBrightnessSettings = () => {
    safeLocalStorage.setItem('brightness-settings', JSON.stringify(brightnessSettings))
  }
  
  // 应用亮度设置到 CSS
  const applyBrightnessSettings = () => {
    const root = document.documentElement
    root.style.setProperty('--reading-brightness', brightnessSettings.brightness)
  }
  
  // 更新亮度设置
  const updateBrightnessSettings = (brightness) => {
    brightnessSettings.brightness = Math.max(0.6, Math.min(1.0, brightness))
    applyBrightnessSettings()
    saveBrightnessSettings()
  }
  
  // ==================== 书签管理 ====================
  const bookmarks = ref({})
  
  // 加载书签数据
  const loadBookmarks = () => {
    const saved = safeLocalStorage.getItem('bookmarks')
    if (saved) {
      try {
        bookmarks.value = JSON.parse(saved)
      } catch (error) {
        console.warn('Failed to parse bookmarks:', error)
        bookmarks.value = {}
      }
    }
  }
  
  // 保存书签数据
  const saveBookmarks = () => {
    safeLocalStorage.setItem('bookmarks', JSON.stringify(bookmarks.value))
  }
  
  // 添加书签
  const addBookmark = (articleSlug, articleData) => {
    if (!articleSlug || !articleData) return false
    
    bookmarks.value[articleSlug] = {
      title: articleData.title || '',
      date: articleData.date || '',
      tags: articleData.tags || [],
      excerpt: articleData.excerpt || '',
      bookmarkedAt: Date.now(),
      category: articleData.category || ''
    }
    saveBookmarks()
    return true
  }
  
  // 移除书签
  const removeBookmark = (articleSlug) => {
    if (bookmarks.value[articleSlug]) {
      delete bookmarks.value[articleSlug]
      saveBookmarks()
      return true
    }
    return false
  }
  
  // 检查是否已收藏
  const isBookmarked = (articleSlug) => {
    return !!bookmarks.value[articleSlug]
  }
  
  // 获取所有书签（按时间排序）
  const getBookmarksList = () => {
    return Object.entries(bookmarks.value)
      .map(([slug, data]) => ({ slug, ...data }))
      .sort((a, b) => b.bookmarkedAt - a.bookmarkedAt)
  }
  
  // 切换书签状态
  const toggleBookmark = (articleSlug, articleData) => {
    if (isBookmarked(articleSlug)) {
      return removeBookmark(articleSlug)
    } else {
      return addBookmark(articleSlug, articleData)
    }
  }
  
  // ==================== 初始化和清理 ====================
  
  // 初始化所有设置
  const initializePreferences = async () => {
    loadReadingProgress()
    loadFontSettings()
    loadBrightnessSettings()
    loadBookmarks()
    
    // 等待 DOM 更新后应用设置
    await nextTick()
    applyFontSettings()
    applyBrightnessSettings()
  }
  
  // 监听设置变化
  watch(fontSettings, () => {
    applyFontSettings()
    saveFontSettings()
  }, { deep: true })
  
  watch(brightnessSettings, () => {
    applyBrightnessSettings()
    saveBrightnessSettings()
  }, { deep: true })
  
  // 清除所有数据
  const clearAllPreferences = () => {
    readingProgress.value = {}
    Object.assign(fontSettings, DEFAULT_FONT_SETTINGS)
    Object.assign(brightnessSettings, DEFAULT_BRIGHTNESS_SETTINGS)
    bookmarks.value = {}
    
    safeLocalStorage.removeItem('reading-progress')
    safeLocalStorage.removeItem('font-settings')
    safeLocalStorage.removeItem('brightness-settings')
    safeLocalStorage.removeItem('bookmarks')
    
    applyFontSettings()
    applyBrightnessSettings()
  }
  
  return {
    // 阅读进度
    readingProgress,
    updateReadingProgress,
    getReadingProgress,
    clearReadingProgress,
    
    // 字体设置
    fontSettings,
    updateFontSettings,
    resetFontSettings,
    applyFontSettings,
    
    // 亮度控制
    brightnessSettings,
    updateBrightnessSettings,
    applyBrightnessSettings,
    
    // 书签管理
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    getBookmarksList,
    toggleBookmark,
    
    // 工具方法
    initializePreferences,
    clearAllPreferences
  }
}
