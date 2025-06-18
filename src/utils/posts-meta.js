/*
 * 自动收集文章 Frontmatter 元数据
 *
 * 通过 import.meta.glob 在构建时一次性加载 /src/posts 目录下的所有 Markdown 文件，
 * 并使用 parseMarkdown 提取 frontmatter。
 * 最终导出一个 postsMeta 数组，供 Pinia Store 使用。
 */

import { parseMarkdown } from './markdown-loader';

// 同步读取所有 Markdown（raw 格式）；eager 使其在构建时完成，避免运行时 I/O
const markdownModules = import.meta.glob('/src/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function generateExcerpt(content, maxLength = 120) {
  if (!content) return '';
  // 去除 Markdown 标记，粗略截取纯文本
  const plain = content
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/<[^>]*>/g, '') // 移除 HTML 标签
    .replace(/[#>*_`~\-\[\]]/g, '') // 移除常见 Markdown 标记
    .trim();
  return plain.slice(0, maxLength) + (plain.length > maxLength ? '…' : '');
}

/**
 * 处理文章内容，提取纯文本用于搜索
 * @param {string} content Markdown 内容
 * @returns {string} 适合搜索的纯文本
 */
function processContentForSearch(content) {
  if (!content) return '';
  
  // 移除代码块，避免代码干扰搜索
  let processed = content.replace(/```[\s\S]*?```/g, '');
  
  // 更彻底地清理HTML标签和属性
  processed = processed.replace(/<\/?[^>]+(>|$)/g, ' ');
  
  // 处理特殊HTML实体
  processed = processed.replace(/&[a-z]+;/g, ' ');
  
  // 移除图片标记
  processed = processed.replace(/!\[.*?\]\(.*?\)/g, '');
  
  // 移除链接标记，但保留文本
  processed = processed.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // 移除Markdown格式标记
  processed = processed
    .replace(/[#>*_`~\-\[\]()]/g, ' ')
    .replace(/\s+/g, ' ') // 移除多余空白
    .trim();
  
  return processed;
}

/**
 * 生成文章元数据列表
 * @returns {Array<object>} posts
 */
function createPostsMeta() {
  const posts = [];
  let idCounter = 1;

  for (const [path, raw] of Object.entries(markdownModules)) {
    const { frontmatter, content } = parseMarkdown(raw);
    const slug = path.split('/').pop().replace('.md', '');

    // 处理文章内容用于搜索
    const plainContent = processContentForSearch(content);
    
    // 从内容中提取关键词
    const extractedKeywords = extractKeywords(plainContent);

    const meta = {
      id: idCounter++,
      slug,
      title: frontmatter.title || slug,
      date: frontmatter.date || new Date().toISOString().split('T')[0],
      tags: frontmatter.tags || [],
      excerpt: frontmatter.description || generateExcerpt(content),
      cover:
        frontmatter.cover || `https://picsum.photos/seed/${encodeURIComponent(slug)}/1200/600`,
      author: frontmatter.author || {
        name: '匿名作者',
        avatar: 'https://picsum.photos/seed/' + encodeURIComponent(slug) + '/200/200',
        bio: ''
      },
      // 添加文章内容和关键词用于搜索
      content: plainContent,
      keywords: extractedKeywords,
      // 保存原始内容长度，用于搜索结果排序参考
      contentLength: content.length
    };

    posts.push(meta);
  }

  // 按日期倒序
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts;
}

/**
 * 从文本中提取关键词
 * @param {string} text 要分析的文本
 * @param {number} limit 最多返回的关键词数量
 * @returns {Array<string>} 关键词列表
 */
function extractKeywords(text, limit = 10) {
  if (!text || typeof text !== 'string') return [];
  
  // 简单的中英文分词
  const words = text
    .toLowerCase()
    .slice(0, 5000) // 只处理前5000个字符避免性能问题
    .split(/\s+|[,.!?;:()，。！？；：（）]/g)
    .filter(word => 
      word.length >= 2 && // 过滤太短的词
      !['的', '了', '和', '在', '是', '有', '与', '或',
        'the', 'and', 'for', 'you', 'this', 'that',
        'with', 'from', 'what', 'have', 'not'].includes(word)
    );
    
  // 词频统计
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  // 按频率排序并返回前N个
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

// 立即生成并导出
export const postsMeta = createPostsMeta(); 