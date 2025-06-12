---
title: Markdown 样式测试
date: 2024-04-01
tags: ['Markdown', '样式测试', '文档']
description: 这是一个用于测试 Markdown 渲染样式的文档，包含了各种 Markdown 元素。
---

# Markdown 样式测试

这是一个用于测试 Markdown 渲染样式的文档，包含了各种 Markdown 元素。

[[toc]]

## 1. 文本格式化

这是普通文本。

**这是粗体文本**

*这是斜体文本*

***这是粗斜体文本***

~~这是删除线文本~~

`这是行内代码`

> 这是引用文本
> 
> 引用可以有多行
> 
> > 这是嵌套引用

## 2. 列表

### 无序列表

* 项目 1
* 项目 2
  * 子项目 2.1
  * 子项目 2.2
* 项目 3

### 有序列表

1. 第一步
2. 第二步
   1. 子步骤 2.1
   2. 子步骤 2.2
3. 第三步

### 任务列表

- [x] 已完成任务
- [ ] 未完成任务
- [ ] 更多未完成任务

## 3. 代码块

这是行内代码 `const greeting = 'Hello, World!';`

这是没有语法高亮的代码块：

```
function greet() {
  console.log('Hello, World!');
}
```

这是有语法高亮的 JavaScript 代码块：

```javascript
// 这是一个简单的 JavaScript 函数
function greet(name) {
  return `Hello, ${name}!`;
}

// 使用箭头函数
const sum = (a, b) => a + b;

// 类定义
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  sayHello() {
    console.log(`Hello, my name is ${this.name}`);
  }
}

// 使用异步函数
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
```

HTML 代码示例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Hello, World!</h1>
    <p>This is a sample HTML document.</p>
  </div>
</body>
</html>
```

CSS 代码示例：

```css
/* 主样式 */
.markdown-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 文本样式 */
h1, h2, h3 {
  color: #333;
  border-bottom: 1px solid #eee;
}

p {
  line-height: 1.6;
  color: #444;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .markdown-container {
    padding: 10px;
  }
}
```

## 4. 表格

### 简单表格

| 姓名 | 年龄 | 职业 |
|------|------|------|
| 张三 | 25 | 工程师 |
| 李四 | 30 | 设计师 |
| 王五 | 28 | 产品经理 |

### 对齐方式

| 左对齐 | 居中对齐 | 右对齐 |
|:-------|:--------:|-------:|
| 单元格 | 单元格 | 单元格 |
| 单元格 | 单元格 | 单元格 |

### 复杂表格

| 功能 | 基础版 | 高级版 | 专业版 |
|------|:------:|:------:|:------:|
| **核心功能** | ✓ | ✓ | ✓ |
| **扩展功能** | ✗ | ✓ | ✓ |
| **高级分析** | ✗ | ✗ | ✓ |
| **支持** | 邮件 | 邮件 + 聊天 | 24/7 专人 |
| **价格** | ¥99/月 | ¥199/月 | ¥299/月 |

## 5. 链接和图片

### 链接

[这是一个链接](https://example.com)

[带标题的链接](https://example.com "链接标题")

自动链接: https://example.com

### 图片

![这是一张图片](https://via.placeholder.com/150)

## 6. 水平线

下面是一条水平线

---

这是水平线之后的内容

## 7. 数学公式

行内公式: $E=mc^2$

块级公式:

$$
\frac{d}{dx}e^x = e^x
$$

$$
\int_{a}^{b} f(x) \, dx = F(b) - F(a)
$$

## 8. 脚注

这里有一个脚注[^1]。

[^1]: 这是脚注的内容。

## 9. 定义列表

术语 1
: 定义 1

术语 2
: 定义 2a
: 定义 2b

## 10. 警告和提示

> [!NOTE]
> 这是一个普通提示信息。

> [!TIP]
> 这是一个小技巧。

> [!WARNING]
> 这是一个警告信息。

> [!IMPORTANT]
> 这是一个重要信息。

> [!CAUTION]
> 这是一个需要注意的信息。

## 总结

这个文档展示了 Markdown 的各种元素和格式，可以用来测试渲染效果和样式。 