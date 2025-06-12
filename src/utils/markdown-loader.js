/**
 * Markdown 文件加载工具
 * 
 * 负责从 posts 目录中加载 Markdown 文件内容
 */

// 使用 import.meta.glob 预加载所有 Markdown 文件（如果可用）
let markdownFiles = {};
try {
  markdownFiles = import.meta.glob('/src/posts/*.md', { query: '?raw', import: 'default', eager: true });
  console.log('预加载的 Markdown 文件:', Object.keys(markdownFiles));
} catch (error) {
  console.error('无法预加载 Markdown 文件:', error);
}

/**
 * 加载指定 slug 的 Markdown 文件内容
 * @param {string} slug - 文章的 slug
 * @returns {Promise<string>} - 返回文章内容
 */
export async function loadMarkdownContent(slug) {
  try {
    // 首先尝试从预加载的文件中获取内容
    const filePath = `/src/posts/${slug}.md`;
    if (markdownFiles[filePath]) {
      console.log(`通过 import.meta.glob 成功加载: ${filePath}`);
      return markdownFiles[filePath];
    }
    
    // 如果预加载失败，尝试通过 fetch 直接加载文件
    console.log(`尝试通过 fetch 加载: ${slug}`);
    const response = await fetch(`/src/posts/${slug}.md`);
    
    if (response.ok) {
      const content = await response.text();
      console.log('通过 fetch 成功加载文件');
      return content;
    } else {
      // 如果还是失败，尝试相对路径
      console.log('尝试相对路径...');
      const altResponse = await fetch(`./posts/${slug}.md`);
      
      if (altResponse.ok) {
        const content = await altResponse.text();
        console.log('通过相对路径成功加载文件');
        return content;
      }
      
      // 如果都失败，输出错误信息
      console.error(`无法加载 Markdown 文件: ${slug}.md`);
      return null;
    }
  } catch (error) {
    console.error('加载 Markdown 文件出错:', error);
    return null;
  }
}

/**
 * 解析 Markdown 文件中的 frontmatter 和内容
 * @param {string} markdown - Markdown 文件内容
 * @returns {Object} - 包含 frontmatter 和 content 的对象
 */
export function parseMarkdown(markdown) {
  if (!markdown) return { frontmatter: {}, content: '' };
  
  let frontmatter = {};
  let content = markdown;
  
  // 检查是否有 frontmatter
  if (markdown.startsWith('---')) {
    const endOfFrontmatter = markdown.indexOf('---', 3);
    if (endOfFrontmatter !== -1) {
      const frontmatterStr = markdown.substring(3, endOfFrontmatter).trim();
      // 简单解析 frontmatter
      frontmatterStr.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
          const value = valueParts.join(':').trim();
          // 解析 tags 数组
          if (key.trim() === 'tags') {
            try {
              frontmatter[key.trim()] = JSON.parse(value.replace(/'/g, '"'));
            } catch (e) {
              // 如果解析失败，将其作为字符串处理
              frontmatter[key.trim()] = value;
            }
          } else {
            frontmatter[key.trim()] = value;
          }
        }
      });
      
      // 提取正文内容
      content = markdown.substring(endOfFrontmatter + 3).trim();
    }
  }
  
  return { frontmatter, content };
} 