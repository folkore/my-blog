import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 网络状态检测组合式函数
 * 提供网络连接状态监测和重试机制
 */
export function useNetworkStatus() {
  const isOnline = ref(navigator.onLine)
  const isSlowConnection = ref(false)
  const connectionType = ref('unknown')

  // 检测网络连接类型
  const detectConnectionType = () => {
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      if (connection) {
        connectionType.value = connection.effectiveType || 'unknown'
        // 检测慢速连接
        isSlowConnection.value = ['slow-2g', '2g'].includes(connection.effectiveType)
      }
    }
  }

  // 网络状态变化处理
  const handleOnline = () => {
    isOnline.value = true
    detectConnectionType()
    console.log('🌐 网络连接已恢复')
  }

  const handleOffline = () => {
    isOnline.value = false
    console.log('📵 网络连接已断开')
  }

  // 连接类型变化处理
  const handleConnectionChange = () => {
    detectConnectionType()
    console.log(`🔄 网络连接类型变更: ${connectionType.value}`)
  }

  // 网络请求重试函数
  const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
    let lastError
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        // 检查网络状态
        if (!isOnline.value) {
          throw new Error('网络连接不可用')
        }
        
        const result = await requestFn()
        return result
      } catch (error) {
        lastError = error
        console.warn(`请求失败 (尝试 ${i + 1}/${maxRetries}):`, error.message)
        
        // 如果不是最后一次尝试，等待后重试
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
        }
      }
    }
    
    throw lastError
  }

  // 检测网络延迟
  const checkLatency = async () => {
    if (!isOnline.value) return null
    
    try {
      const start = performance.now()
      await fetch('/favicon.ico', { 
        method: 'HEAD',
        cache: 'no-cache'
      })
      const latency = performance.now() - start
      return latency
    } catch (error) {
      console.warn('延迟检测失败:', error)
      return null
    }
  }

  // 生命周期管理
  onMounted(() => {
    detectConnectionType()
    
    // 监听网络状态变化
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // 监听连接类型变化
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      if (connection) {
        connection.addEventListener('change', handleConnectionChange)
      }
    }
  })

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
    
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange)
      }
    }
  })

  return {
    isOnline,
    isSlowConnection,
    connectionType,
    retryRequest,
    checkLatency
  }
}

/**
 * 网络状态提示组合式函数
 * 提供用户友好的网络状态提示
 */
export function useNetworkNotification() {
  const { isOnline, isSlowConnection, connectionType } = useNetworkStatus()
  
  const getNetworkMessage = () => {
    if (!isOnline.value) {
      return {
        type: 'error',
        message: '网络连接已断开，请检查您的网络设置',
        icon: '📵'
      }
    }
    
    if (isSlowConnection.value) {
      return {
        type: 'warning',
        message: '网络连接较慢，加载可能需要更长时间',
        icon: '🐌'
      }
    }
    
    return {
      type: 'success',
      message: '网络连接正常',
      icon: '🌐'
    }
  }

  const shouldShowNotification = () => {
    return !isOnline.value || isSlowConnection.value
  }

  return {
    isOnline,
    isSlowConnection,
    connectionType,
    getNetworkMessage,
    shouldShowNotification
  }
}
