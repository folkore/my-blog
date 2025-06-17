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
 * 生成文章元数据列表
 * @returns {Array<object>} posts
 */
function createPostsMeta() {
  const posts = [];
  let idCounter = 1;

  for (const [path, raw] of Object.entries(markdownModules)) {
    const { frontmatter, content } = parseMarkdown(raw);
    const slug = path.split('/').pop().replace('.md', '');

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
      }
    };

    posts.push(meta);
  }

  // 按日期倒序
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts;
}

// 立即生成并导出
export const postsMeta = createPostsMeta(); 