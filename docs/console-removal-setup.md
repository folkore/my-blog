# 生产环境 Console 移除功能

## 概述

本项目已配置了生产环境自动移除 `console.log` 等调试语句的功能，确保生产环境代码的清洁和性能优化。

## 功能特性

- ✅ 仅在生产环境（`NODE_ENV=production`）移除 console 语句
- ✅ 开发环境保留所有 console 语句，便于调试
- ✅ 支持移除多种 console 方法：`log`、`warn`、`error`、`info`、`debug`
- ✅ 使用 Terser 进行安全的语法处理，避免语法错误
- ✅ 同时进行代码压缩和优化

## 配置详情

### Vite 配置

在 `vite.config.js` 中的配置：

```javascript
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  return {
    // ... 其他配置
    build: {
      // 生产环境压缩配置
      minify: isProduction ? 'terser' : false,
      terserOptions: isProduction ? {
        compress: {
          // 移除 console
          drop_console: true,
          drop_debugger: true,
          // 移除无用代码
          dead_code: true,
          // 移除未使用的变量
          unused: true,
        },
        mangle: {
          // 混淆变量名
          toplevel: true,
        },
        format: {
          // 移除注释
          comments: false,
        },
      } : {},
      // ... 其他构建配置
    }
  }
})
```

### 移除的 Console 方法

以下 console 方法会在生产环境中被移除：

- `console.log()`
- `console.warn()`
- `console.error()`
- `console.info()`
- `console.debug()`

## 使用示例

### 开发环境

```javascript
// 开发环境中这些语句会正常输出
console.log('用户登录成功');
console.warn('API 响应时间较长');
console.error('网络请求失败');

function handleUserAction() {
  console.debug('处理用户操作');
  // 业务逻辑
}
```

### 生产环境

构建后，上述所有 console 语句都会被自动移除，不会出现在最终的生产代码中。

## 验证方法

### 1. 构建项目

```bash
pnpm build
```

### 2. 检查构建产物

构建完成后，可以检查 `dist/assets/` 目录下的 JavaScript 文件，确认没有 console 语句：

```bash
# Windows PowerShell
Select-String -Pattern "console\." -Path "dist/assets/*.js"

# Linux/Mac
grep -r "console\." dist/assets/
```

如果配置正确，应该没有找到任何匹配项。

## 注意事项

### 1. 保留必要的 Console

如果某些 console 语句在生产环境中是必需的（如错误报告），可以使用以下方式：

```javascript
// 使用条件语句保护
if (process.env.NODE_ENV !== 'production') {
  console.log('仅在开发环境输出');
}

// 或者使用自定义日志函数
const logger = {
  log: (...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(...args);
    }
  }
};
```

### 2. ESLint 配置

建议在 ESLint 中配置规则，避免在生产代码中意外留下 console 语句：

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  }
}
```

### 3. 构建配置文件排除

构建配置文件（如 `vite.config.js`）中的 console 语句不会被移除，因为它们不参与应用构建。

## 性能优势

- **减小包体积**：移除调试代码减少最终包大小
- **提升性能**：避免不必要的函数调用
- **增强安全性**：防止敏感信息在生产环境中泄露
- **改善用户体验**：减少控制台噪音

## 故障排除

### 构建失败

如果构建过程中出现语法错误，可能是 console 移除导致的语法问题。检查：

1. 确保 Terser 版本兼容
2. 检查是否有复杂的 console 语句嵌套
3. 验证代码语法正确性

### Console 未被移除

如果发现生产环境中仍有 console 语句：

1. 确认构建模式为 `production`
2. 检查 `vite.config.js` 配置
3. 验证 Terser 配置是否正确应用

## 相关依赖

- `terser`: 用于代码压缩和 console 移除
- `vite`: 构建工具，支持 Terser 集成

## 总结

通过配置 Terser 的 `drop_console` 选项，我们实现了生产环境自动移除 console 语句的功能。这不仅提升了代码质量，还优化了性能和安全性。开发者可以在开发过程中自由使用 console 进行调试，而无需担心生产环境的代码清洁问题。
