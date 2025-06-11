<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// 获取当前年份
const currentYear = ref(new Date().getFullYear());

// 社交媒体链接
const socialLinks = [
  {
    name: "GitHub",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
    url: "https://github.com",
  },
  {
    name: "Twitter",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>`,
    url: "https://twitter.com",
  },
  {
    name: "LinkedIn",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`,
    url: "https://linkedin.com",
  },
];

// 导航链接
const navLinks = computed(() => [
  { name: t("nav.home"), path: "/" },
  { name: t("nav.blog"), path: "/blog" },
  { name: t("nav.about"), path: "/about" },
  { name: t("nav.contact"), path: "/contact" },
]);

// 快速链接
const quickLinks = computed(() => [
  { name: t("footer.privacy"), path: "/privacy" },
  { name: t("footer.terms"), path: "/terms" },
  { name: t("footer.rss"), path: "/rss" },
]);
</script>

<template>
  <footer class="footer">
    <div class="footer-gradient"></div>
    <div class="container">
      <!-- 页脚主要内容 -->
      <div class="footer-content">
        <!-- 品牌区域 -->
        <div class="footer-brand">
          <div class="brand-info">
            <div class="logo-container">
              <div class="logo">M</div>
              <h3 class="brand-name">{{ t("brand.name") }}</h3>
            </div>
            <p class="brand-description">{{ t("brand.slogan") }}</p>
          </div>
          <div class="social-links">
            <a
              v-for="link in socialLinks"
              :key="link.name"
              :href="link.url"
              :title="link.name"
              class="social-link"
              target="_blank"
              rel="noopener noreferrer"
              v-html="link.icon"
            ></a>
          </div>
        </div>

        <div class="footer-links-container">
          <!-- 导航链接 -->
          <div class="footer-nav">
            <h4>{{ t("footer.navigation") }}</h4>
            <nav class="footer-links">
              <router-link
                v-for="link in navLinks"
                :key="link.path"
                :to="link.path"
                class="footer-link"
              >
                {{ link.name }}
              </router-link>
            </nav>
          </div>

          <!-- 快速链接 -->
          <div class="footer-quick-links">
            <h4>{{ t("footer.quickLinks") }}</h4>
            <nav class="footer-links">
              <router-link
                v-for="link in quickLinks"
                :key="link.path"
                :to="link.path"
                class="footer-link"
              >
                {{ link.name }}
              </router-link>
            </nav>
          </div>

          <!-- 联系方式 -->
          <div class="footer-contact">
            <h4>{{ t("footer.contact") }}</h4>
            <div class="contact-info">
              <a href="mailto:contact@myblog.com" class="contact-link">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                  ></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>contact@myblog.com</span>
              </a>
              <a href="/rss" class="contact-link">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M4 11a9 9 0 0 1 9 9"></path>
                  <path d="M4 4a16 16 0 0 1 16 16"></path>
                  <circle cx="5" cy="19" r="1"></circle>
                </svg>
                <span>RSS Feed</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- 页脚底部 -->
      <div class="footer-bottom">
        <p class="copyright">
          © {{ currentYear }} {{ t("brand.name") }}. {{ t("footer.rights") }}
        </p>
        <div class="footer-meta">
          <span class="made-with">
            Made with
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="heart-icon"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              ></path>
            </svg>
            & Vue.js
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  background-color: var(--color-secondary-background);
  padding: 5rem 0 2.5rem;
  overflow: hidden;
}

.footer-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    var(--color-primary) 0%,
    var(--color-accent) 50%,
    var(--color-primary) 100%
  );
  opacity: 0.3;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 5rem;
  margin-bottom: 4rem;
}

/* 品牌区域样式 */
.footer-brand {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  max-width: 320px;
}

.brand-info {
  margin-bottom: 2rem;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.logo {
  width: 3rem;
  height: 3rem;
  background: var(--color-primary-gradient);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  background: var(--color-primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.brand-description {
  color: var(--color-secondary-text);
  line-height: 1.7;
  font-size: 0.95rem;
  margin: 0;
}

/* 社交媒体链接样式 */
.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-full);
  background: var(--color-tertiary-background);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s var(--bezier-bounce);
  position: relative;
  overflow: hidden;
}

.social-link::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-primary);
  opacity: 0;
  transition: opacity 0.3s var(--bezier-smooth);
}

.social-link :deep(svg) {
  position: relative;
  z-index: 1;
  transition: all 0.3s var(--bezier-bounce);
  stroke: var(--color-secondary-text);
}

.social-link:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.social-link:hover::before {
  opacity: 1;
}

.social-link:hover :deep(svg) {
  stroke: white;
  transform: scale(1.1);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

.footer-links-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4rem;
  flex: 2;
}

/* 页脚导航样式 */
.footer-nav,
.footer-quick-links,
.footer-contact {
  display: flex;
  flex-direction: column;
}

.footer-nav h4,
.footer-quick-links h4,
.footer-contact h4 {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  color: var(--color-text);
  position: relative;
  display: inline-block;
}

.footer-nav h4::after,
.footer-quick-links h4::after,
.footer-contact h4::after {
  content: "";
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--color-primary-gradient);
  opacity: 0.5;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.footer-link {
  color: var(--color-secondary-text);
  text-decoration: none;
  transition: all 0.3s var(--bezier-bounce);
  width: fit-content;
  position: relative;
  font-size: 0.95rem;
}

.footer-link::before {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--color-primary-gradient);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s var(--bezier-smooth);
}

.footer-link:hover {
  color: var(--color-primary);
  transform: translateX(8px);
}

.footer-link:hover::before {
  transform: scaleX(1);
  transform-origin: left;
}

/* 联系方式样式 */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-secondary-text);
  text-decoration: none;
  transition: all 0.3s var(--bezier-bounce);
  font-size: 0.95rem;
}

.contact-link:hover {
  color: var(--color-primary);
  transform: translateX(8px);
}

.contact-link svg {
  flex-shrink: 0;
  stroke: var(--color-primary);
}

/* 页脚底部样式 */
.footer-bottom {
  padding-top: 2.5rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.footer-bottom::before {
  content: "";
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 25%;
  height: 1px;
  background: var(--color-primary-gradient);
  opacity: 0.3;
}

.copyright {
  color: var(--color-tertiary-text);
  font-size: 0.8rem;
  margin: 0;
}

.footer-meta {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.made-with {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-tertiary-text);
  font-size: 0.8rem;
}

.heart-icon {
  color: #ff4b4b;
  animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes heartbeat {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .footer-content {
    flex-direction: column;
    gap: 3rem;
  }

  .footer-brand {
    max-width: none;
  }

  .footer-links-container {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    width: 100%;
  }
}

@media (max-width: 768px) {
  .footer {
    padding: 4rem 0 2rem;
  }

  .footer-content {
    flex-direction: column;
    gap: 2.5rem;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .footer-meta {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
