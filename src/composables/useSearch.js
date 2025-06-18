/**
 * 全文搜索 Composable
 * 
 * 使用 Fuse.js 在客户端实现高性能模糊搜索，支持:
 * - 文章全文内容搜索 
 * - 关键词高亮与上下文预览
 * - 按相关度智能排序
 * - 多字段（标题、内容、标签）加权搜索
 */

import { ref, computed, watch, onMounted } from 'vue'
import Fuse from 'fuse.js'
import { usePostsStore } from '../store'
import { useRouter, useRoute } from 'vue-router'

export function useSearch(isInline = false) {
  const postsStore = usePostsStore()
  const router = useRouter()
  const route = useRoute()

  // 搜索状态
  const searchQuery = ref('')
  const searchResults = ref([])
  const isSearching = ref(false)
  const isSearchComplete = ref(false)
  
  // 高级设置
  const searchSettings = ref({
    includeContent: true,    // 是否搜索文章内容
    threshold: 0.4,         // 匹配阈值（0-1，越小越严格）
    minLength: 1,           // 最小搜索字符数
    highlightMatches: true  // 是否高亮匹配结果
  })

  // HTML 字符转义
  const escapeHtml = (unsafe) => {
    if (!unsafe || typeof unsafe !== 'string') return '';
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // 合并重叠或相邻的索引
  const mergeIndices = (indices) => {
    if (indices.length < 2) return indices;

    // 按起始索引排序
    indices.sort((a, b) => a[0] - b[0]);

    const merged = [indices[0]];

    for (let i = 1; i < indices.length; i++) {
        const current = indices[i];
        const last = merged[merged.length - 1];

        if (current[0] <= last[1] + 1) { // 如果重叠或相邻
            last[1] = Math.max(last[1], current[1]);
        } else {
            merged.push(current);
        }
    }
    return merged;
  }

  // 高亮函数
  const highlight = (text, indices) => {
    if (!indices || indices.length === 0 || !text) {
      return escapeHtml(text);
    }
    let result = '';
    let lastIndex = 0;
    const sortedIndices = mergeIndices([...indices]);

    sortedIndices.forEach(([start, end]) => {
      // 确保索引在文本范围内
      if (start > text.length) return;
      // 转义非匹配部分
      result += escapeHtml(text.substring(lastIndex, start));
      // 转义并包裹匹配部分
      result += `<mark>${escapeHtml(text.substring(start, end + 1))}</mark>`;
      lastIndex = end + 1;
    });

    // 转义剩余部分
    result += escapeHtml(text.substring(lastIndex));
    return result;
  };

  // 搜索执行函数
  const performSearch = async () => {
    const query = searchQuery.value.trim()
    
    // 验证搜索条件
    if (!query || query.length < searchSettings.value.minLength) {
      searchResults.value = []
      isSearchComplete.value = false
      return
    }

    isSearching.value = true
    isSearchComplete.value = false

    try {
      // 如果需要搜索内容但文章内容未加载，则预加载
      if (searchSettings.value.includeContent && !postsStore.searchStatus.contentsLoaded) {
        await postsStore.preloadAllContents()
      }
      
      // 如果不包含内容搜索，调整Fuse实例
      const searchOptions = {}
      if (!searchSettings.value.includeContent) {
        searchOptions.keys = ['title', 'tags', 'excerpt', 'keywords']
      }

      // 执行搜索
      const rawResults = fuseInstance.value.search(query, searchOptions)
      
      // 处理结果，添加高亮和摘要
      searchResults.value = rawResults.map(({ item, matches, score }) => {
        // 处理匹配高亮
        let highlightedContent = ''
        let highlightedTitle = escapeHtml(item.title || '') // 默认转义标题
        
        if (searchSettings.value.highlightMatches && matches) {
          // --- 处理内容高亮 ---
          const contentMatch = matches.find(m => m.key === 'content') || matches.find(m => m.key === 'excerpt');
          
          if (contentMatch) {
            const content = item[contentMatch.key];
            if (content && typeof content === 'string') {
              const firstMatchRegion = contentMatch.indices[0] || [0, 10];
              const previewStart = Math.max(0, firstMatchRegion[0] - 60);
              const previewEnd = Math.min(content.length, firstMatchRegion[1] + 60);

              const previewText = content.substring(previewStart, previewEnd);
              
              const allIndicesForKey = matches
                .filter(m => m.key === contentMatch.key)
                .flatMap(m => m.indices);

              const previewIndices = allIndicesForKey
                .map(([start, end]) => [start - previewStart, end - previewStart])
                .filter(([start, end]) => start < previewText.length && end >= 0)
                .map(([start, end]) => [Math.max(0, start), Math.min(end, previewText.length - 1)]);

              highlightedContent = highlight(previewText, previewIndices);

              if (previewStart > 0) highlightedContent = '...' + highlightedContent;
              if (previewEnd < content.length) highlightedContent = highlightedContent + '...';
            }
          }
          
          // --- 处理标题高亮 ---
          const titleMatches = matches.filter(m => m.key === 'title');
          if (titleMatches.length > 0) {
            const allTitleIndices = titleMatches.flatMap(m => m.indices);
            highlightedTitle = highlight(item.title, allTitleIndices);
          }
        }
        
        return {
          id: item.id,
          slug: item.slug,
          title: item.title,
          date: item.date,
          tags: item.tags,
          cover: item.cover,
          excerpt: item.excerpt,
          author: item.author,
          score,
          highlightedTitle: highlightedTitle,
          preview: highlightedContent || escapeHtml(item.excerpt || '')
        }
      })
      
      // 更新URL以保留搜索状态，便于分享
      if (!isInline && route.path === '/blog') {
        try {
          router.replace({ 
            query: { 
              ...route.query, 
              q: encodeURIComponent(query)
            } 
          }).catch(err => console.error('路由更新出错:', err))
        } catch (error) {
          console.error('路由参数处理出错:', error)
        }
      }
    } catch (error) {
      console.error('搜索出错:', error)
    } finally {
      isSearching.value = false
      isSearchComplete.value = true
    }
  }

  // 清除搜索
  const clearSearch = () => {
    searchQuery.value = ''
    searchResults.value = []
    isSearchComplete.value = false
  }

  // --- Start: Re-implementing URL Sync for Global Search ---

  if (!isInline) {
    // 1. Read from URL query param `q` into search state
    watch(() => route.query.q, (newQ) => {
      const newQueryValue = (newQ && typeof newQ === 'string') ? decodeURIComponent(newQ) : '';
      if (searchQuery.value !== newQueryValue) {
        searchQuery.value = newQueryValue;
      }
    }, { immediate: true });

    // 2. Write from search state to URL query param `q`
    watch(searchQuery, (newSearchQuery) => {
      const currentRouteQuery = { ...route.query };
      
      if (newSearchQuery) {
        currentRouteQuery.q = encodeURIComponent(newSearchQuery);
      } else {
        delete currentRouteQuery.q;
      }
      // Use replace to avoid polluting browser history
      router.replace({ query: currentRouteQuery });
    });
  }
  
  // --- End: Re-implementing URL Sync ---

  // Fuse 实例配置（惰性创建索引）
  const fuseInstance = computed(() => {
    // 准备搜索数据：文章元数据 + 内容
    const searchData = postsStore.posts.map(post => {
      // 返回包含全文的搜索数据
      return {
        ...post,
        // 如果直接包含content则使用，否则用空字符串
        content: post.content || ''
      };
    })

    // 配置搜索选项
    return new Fuse(searchData, {
      includeScore: true,
      includeMatches: true,
      threshold: searchSettings.value.threshold,
      minMatchCharLength: 2, // 最小匹配字符长度
      ignoreLocation: true, // 不依赖位置匹配
      useExtendedSearch: true, // 支持高级搜索语法
      keys: [
        { name: 'title', weight: 2 },        // 标题权重最高
        { name: 'tags', weight: 1.5 },       // 标签权重较高
        { name: 'keywords', weight: 1.3 },   // 关键词权重比摘要高
        { name: 'excerpt', weight: 1 },      // 摘要正常权重
        { name: 'content', weight: 0.7 }     // 内容权重较低（减少误判）
      ]
    })
  })

  // 组件挂载时初始化
  onMounted(() => {
    // 如果store未初始化过搜索功能，进行初始化
    if (!postsStore.searchStatus.isInitialized) {
      postsStore.setSearchInitialized(true)
      
      // 异步预加载内容索引
      if (searchSettings.value.includeContent) {
        postsStore.preloadAllContents().catch(err => {
          console.warn('预加载内容索引失败:', err)
        })
      }
    }
  })

  return {
    // 状态
    searchQuery,
    searchResults,
    isSearching,
    isSearchComplete,
    searchSettings,
    
    // 方法
    performSearch,
    clearSearch
  }
} 