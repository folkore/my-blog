import { ref } from 'vue'

export function useScrollLock() {
  const isLocked = ref(false)
  let scrollPosition = 0

  const lock = () => {
    if (window.innerWidth <= 768 && !isLocked.value) {
      scrollPosition = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${scrollPosition}px`
      isLocked.value = true
    }
  }

  const unlock = () => {
    if (isLocked.value) {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      window.scrollTo(0, scrollPosition)
      isLocked.value = false
    }
  }

  const cleanup = () => {
    if (isLocked.value) {
      unlock()
    }
  }

  return {
    isLocked,
    lock,
    unlock,
    cleanup
  }
}