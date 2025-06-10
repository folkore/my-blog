<script setup>
import { ref } from "vue";

// 定义props
defineProps({
  isDark: {
    type: Boolean,
    default: false,
  },
});

// 获取当前年份
const currentYear = ref(new Date().getFullYear());
</script>

<template>
  <footer class="footer">
    <div class="container footer-container">
      <!-- 页脚上部分 -->
      <div class="footer-top">
        <div class="footer-section">
          <h3>关于博客</h3>
          <p>
            这是一个基于Vue3和Vite开发的个人博客，设计风格参考苹果官网，支持暗黑模式。
          </p>
        </div>

        <div class="footer-section">
          <h3>导航</h3>
          <ul class="footer-links">
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/blog">博客</router-link></li>
            <li><router-link to="/about">关于</router-link></li>
            <li><router-link to="/contact">联系我</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>社交媒体</h3>
          <ul class="footer-links social-links">
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer">GitHub</a>
            </li>
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
            </li>
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </li>
          </ul>
        </div>
      </div>

      <!-- 页脚下部分 -->
      <div class="footer-bottom">
        <p class="copyright">© {{ currentYear }} MyBlog. 保留所有权利。</p>
        <div class="footer-legal">
          <router-link to="/privacy">隐私政策</router-link>
          <span class="separator">|</span>
          <router-link to="/terms">服务条款</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--color-secondary-background);
  color: var(--color-text);
  padding: 60px 0 30px;
  margin-top: 40px;
  transition: all var(--transition-duration);
}

.footer-container {
  display: flex;
  flex-direction: column;
}

/* 页脚上部分 */
.footer-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 40px;
}

.footer-section {
  flex: 1;
  min-width: 250px;
  margin-bottom: 30px;
  margin-right: 20px;
}

.footer-section:last-child {
  margin-right: 0;
}

.footer-section h3 {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 16px;
  color: var(--color-text);
}

.footer-section p {
  font-size: 15px;
  line-height: 1.5;
  color: var(--color-secondary-text);
}

/* 页脚链接 */
.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: var(--color-secondary-text);
  text-decoration: none;
  font-size: 15px;
  transition: color var(--transition-duration);
}

.footer-links a:hover {
  color: var(--color-link);
  text-decoration: none;
}

/* 社交媒体链接 */
.social-links {
  display: flex;
  flex-wrap: wrap;
}

.social-links li {
  margin-right: 15px;
}

/* 页脚下部分 */
.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
}

.copyright {
  font-size: 14px;
  color: var(--color-secondary-text);
  margin: 0;
}

.footer-legal {
  display: flex;
  align-items: center;
}

.footer-legal a {
  font-size: 14px;
  color: var(--color-secondary-text);
  text-decoration: none;
  transition: color var(--transition-duration);
}

.footer-legal a:hover {
  color: var(--color-link);
}

.separator {
  margin: 0 10px;
  color: var(--color-secondary-text);
}

/* 响应式布局 */
@media (max-width: 768px) {
  .footer-top {
    flex-direction: column;
  }

  .footer-section {
    margin-right: 0;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }

  .copyright {
    margin-bottom: 15px;
  }
}
</style>
