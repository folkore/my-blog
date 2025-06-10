import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollToTop(threshold = 300) {
  const showScrollTop = ref(false)
  
  // 监听滚动事件
  const handleScroll = () => {
    showScrollTop.value = window.scrollY > threshold
  }
  
  // 返回顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  
  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })
  
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
  
  return {
    showScrollTop,
    scrollToTop
  }
} 