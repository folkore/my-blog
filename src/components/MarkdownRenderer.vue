<script setup>
import { ref, watch, onMounted } from "vue";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css"; // 导入代码高亮样式

// 可选的 Markdown-it 插件
import markdownItAnchor from "markdown-it-anchor";
import markdownItKatex from "markdown-it-katex";
import "katex/dist/katex.min.css"; // 导入 KaTeX CSS

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  options: {
    type: Object,
    default: () => ({}),
  },
});

const renderedContent = ref("");
const headings = ref([]);

// 初始化 markdown-it 实例，配置代码高亮
const md = new MarkdownIt({
  html: true, // 启用 HTML 标签
  breaks: true, // 转换换行符为 <br>
  linkify: true, // 自动转换 URL 为链接
  typographer: true, // 启用一些语言中立的替换 + 引号美化
  highlight: function (str, lang) {
    // 如果指定了语言且 highlight.js 支持该语言
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          "</code></pre>"
        );
      } catch (__) {}
    }

    // 使用通用的高亮或者不高亮
    return (
      '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>"
    );
  },
});

// 添加插件 - 标题锚点
md.use(markdownItAnchor, {
  permalink: true,
  permalinkSymbol: "§",
  permalinkBefore: true,
  level: [2, 3],
  slugify: (s) =>
    encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, "-")),
});

// 添加 KaTeX 支持
md.use(markdownItKatex);

// 自定义渲染规则
md.renderer.rules.table_open = () => {
  return '<div class="table-container"><table>';
};

md.renderer.rules.table_close = () => {
  return "</table></div>";
};

// 提取标题
const extractHeadings = (content) => {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const matches = [...content.matchAll(headingRegex)];
  return matches.map((match) => ({
    level: match[1].length,
    text: match[2],
    id: encodeURIComponent(match[2].toLowerCase().replace(/\s+/g, "-")),
  }));
};

// 移除 [[toc]] 标记
const removeTableOfContents = (content) => {
  return content.replace(/\[\[toc\]\]/gi, "");
};

// 渲染 Markdown
const renderMarkdown = () => {
  if (props.content) {
    // 提取标题
    headings.value = extractHeadings(props.content);
    // 移除 TOC 标记并渲染内容
    const contentWithoutToc = removeTableOfContents(props.content);
    renderedContent.value = md.render(contentWithoutToc);
  } else {
    renderedContent.value = "";
    headings.value = [];
  }
};

// 监听内容变化
watch(() => props.content, renderMarkdown, { immediate: true });

// 初始渲染
onMounted(renderMarkdown);

// 向父组件暴露标题数据
defineExpose({
  headings,
});
</script>

<template>
  <div class="markdown-body" v-html="renderedContent"></div>
</template>

<style>
.markdown-body {
  font-size: 16px;
  line-height: 1.8;
  color: var(--color-text);
  text-align: left;
  max-width: 100%;
  overflow-wrap: break-word;
}

.markdown-body h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 2.5rem 0 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  line-height: 1.3;
}

.markdown-body h2 {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 2rem 0 1.25rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  line-height: 1.3;
}

.markdown-body h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1.75rem 0 1rem;
  color: var(--color-text);
  line-height: 1.3;
}

.markdown-body h4 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem;
  color: var(--color-text);
  line-height: 1.3;
}

.markdown-body p {
  margin: 0 0 1.25rem 0;
  text-align: justify;
  hyphens: auto;
}

.markdown-body a {
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 1px dashed var(--color-primary-light);
  transition: border-bottom-color var(--transition-fast);
}

.markdown-body a:hover {
  border-bottom-color: var(--color-primary);
}

.markdown-body ul,
.markdown-body ol {
  margin: 0 0 1.25rem 0;
  padding-left: 2rem;
}

.markdown-body li {
  margin-bottom: 0.5rem;
}

.markdown-body li p {
  margin-bottom: 0.75rem;
}

.markdown-body blockquote {
  margin: 1.5rem 0;
  padding: 0.75rem 1.5rem;
  border-left: 4px solid var(--color-primary-light);
  background-color: var(--color-tertiary-background);
  color: var(--color-secondary-text);
  font-style: italic;
}

.markdown-body blockquote p {
  margin-bottom: 0;
}

/* 添加对警告和提示框的样式 */
.markdown-body blockquote p:first-of-type:not(:only-of-type) {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

/* 自定义警告样式 */
.markdown-body blockquote.note {
  background-color: rgba(13, 131, 255, 0.1);
  border-left-color: #0d83ff;
}

.markdown-body blockquote.tip {
  background-color: rgba(46, 204, 113, 0.1);
  border-left-color: #2ecc71;
}

.markdown-body blockquote.warning {
  background-color: rgba(255, 152, 0, 0.1);
  border-left-color: #ff9800;
}

.markdown-body blockquote.important {
  background-color: rgba(244, 67, 54, 0.1);
  border-left-color: #f44336;
}

.markdown-body blockquote.caution {
  background-color: rgba(213, 63, 140, 0.1);
  border-left-color: #d53f8c;
}

.markdown-body img {
  max-width: 100%;
  border-radius: 8px;
  margin: 1.5rem 0;
  display: block;
}

.markdown-body hr {
  height: 1px;
  background-color: var(--color-border);
  border: none;
  margin: 2rem 0;
}

/* 表格增强样式 */
.markdown-body .table-container {
  width: 100%;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.markdown-body table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  display: table;
}

.markdown-body th,
.markdown-body td {
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  text-align: left;
}

.markdown-body th {
  background-color: var(--color-secondary-background);
  font-weight: 600;
}

.markdown-body tr:nth-child(even) {
  background-color: var(--color-tertiary-background);
}

/* 数学公式样式 */
.markdown-body .katex-display {
  margin: 1.5rem 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.5rem 0;
}

.markdown-body .katex {
  font-size: 1.1em;
}

/* 代码高亮样式 */
.markdown-body pre {
  background-color: #282c34; /* 与 atom-one-dark 主题匹配 */
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.5rem 0;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  word-wrap: normal;
}

.markdown-body code {
  font-family: "JetBrains Mono", "Fira Code", Consolas, Monaco, "Andale Mono",
    monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  tab-size: 4;
}

.markdown-body pre code {
  padding: 0;
  background-color: transparent;
  color: #abb2bf; /* 默认代码文本颜色 */
  white-space: pre;
  display: block;
  text-align: left;
}

.markdown-body p code,
.markdown-body li code {
  background-color: var(--color-tertiary-background);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
  color: var(--color-text);
  word-break: break-word;
}

/* 标题锚点链接样式 */
.markdown-body .header-anchor {
  margin-right: 0.5em;
  opacity: 0.2;
  text-decoration: none;
  border-bottom: none;
}

.markdown-body h2:hover .header-anchor,
.markdown-body h3:hover .header-anchor,
.markdown-body h4:hover .header-anchor {
  opacity: 1;
}

/* 脚注样式 */
.markdown-body .footnotes {
  margin-top: 2rem;
  font-size: 0.9em;
  color: var(--color-secondary-text);
}

.markdown-body .footnotes hr {
  margin: 1rem 0;
}

.markdown-body .footnotes ol {
  padding-left: 1.5rem;
}

.markdown-body .footnote-ref,
.markdown-body .footnote-backref {
  font-size: 0.75em;
  position: relative;
  top: -0.5em;
  border-bottom: none;
}

/* 定义列表样式 */
.markdown-body dl {
  margin: 1.5rem 0;
}

.markdown-body dt {
  font-weight: bold;
  margin-top: 0.75rem;
}

.markdown-body dd {
  margin-left: 1.5rem;
  margin-bottom: 0.75rem;
}

/* 代码块中的行号（如果需要） */
.markdown-body pre.line-numbers {
  position: relative;
  padding-left: 3.8rem;
  counter-reset: linenumber;
}

.markdown-body pre.line-numbers > code {
  position: relative;
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .markdown-body pre {
    background-color: #1a1a1a;
  }

  .markdown-body p code,
  .markdown-body li code {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .markdown-body {
    font-size: 15px;
  }

  .markdown-body h1 {
    font-size: 1.75rem;
  }

  .markdown-body h2 {
    font-size: 1.5rem;
  }

  .markdown-body h3 {
    font-size: 1.25rem;
  }

  .markdown-body h4 {
    font-size: 1.1rem;
  }

  .markdown-body pre {
    padding: 0.75rem;
  }

  .markdown-body code {
    font-size: 0.85rem;
  }

  .markdown-body .katex {
    font-size: 1em;
  }
}
</style>
