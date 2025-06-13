export default {
  mounted(el, binding) {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    }
    
    // 获取当前环境的base路径
    const baseUrl = import.meta.env.BASE_URL || '/'
    
    function loadImage() {
      const imageElement = el.tagName === 'IMG' ? el : el.querySelector('img')
      
      if (imageElement) {
        const imgUrl = binding.value
        
        // 设置占位图，使用baseUrl确保路径正确
        imageElement.src = `${baseUrl}placeholder.svg`
        
        // 添加加载动画类
        imageElement.classList.add('image-loading')
        
        // 创建新图片对象预加载
        const img = new Image()
        img.src = imgUrl
        
        img.onload = () => {
          // 图片加载完成后，替换src
          imageElement.src = imgUrl
          // 移除加载动画类，添加已加载类
          imageElement.classList.remove('image-loading')
          imageElement.classList.add('image-loaded')
          observer.unobserve(el)
        }
        
        img.onerror = () => {
          // 加载失败时显示默认图片，使用baseUrl确保路径正确
          imageElement.src = `${baseUrl}placeholder.svg`
          imageElement.classList.remove('image-loading')
          observer.unobserve(el)
        }
      }
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage()
        }
      })
    }, options)
    
    observer.observe(el)
  }
} 