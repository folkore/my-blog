// 将测试 Markdown 样式的文章添加到列表中
posts.push({
  id: posts.length + 1,
  slug: 'test-markdown-styles',
  title: 'Markdown 样式测试',
  date: '2024-04-01',
  excerpt: '这是一个用于测试 Markdown 渲染样式的文档，包含了各种 Markdown 元素。',
  content: '', // 内容将从外部 Markdown 文件加载
  tags: ['Markdown', '样式测试', '文档'],
  author: {
    name: '博客作者',
    avatar: '/images/avatar.jpg',
  },
  comments: []
}); 