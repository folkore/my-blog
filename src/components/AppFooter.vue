<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import tiktokIcon from "@/assets/icons/tiktok.svg";
import wechatIcon from "@/assets/icons/wechat.svg";

const { t } = useI18n();

// 获取当前年份
const currentYear = ref(new Date().getFullYear());

// 社交媒体链接
const socialLinks = ref([
  {
    name: "抖音",
    icon: tiktokIcon,
    url: "https://www.douyin.com",
  },
  {
    name: "微信",
    icon: wechatIcon,
    url: "weixin://",
  },
]);

// 导航链接
const navLinks = computed(() => [
  { name: t("nav.blog"), path: "/blog" },
  { name: t("nav.about"), path: "/about" },
  { name: t("nav.contact"), path: "/contact" },
]);

// 法律链接
const legalLinks = computed(() => [
  { name: t("footer.privacy"), path: "/privacy" },
  { name: t("footer.terms"), path: "/terms" },
]);
</script>

<template>
  <footer class="footer">
    <div class="footer-content container">
      <!-- 品牌区域 -->
      <div class="footer-brand">
        <div class="brand-info">
          <div class="logo-integrated">
            <span class="logo-text">Memoir</span>
            <span class="logo-separator"></span>
            <span class="logo-tagline">Stories in Time</span>
          </div>
        </div>
      </div>

      <!-- 链接区域 -->
      <div class="footer-links">
        <nav class="nav-group">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="footer-link"
          >
            {{ link.name }}
          </router-link>
        </nav>
        <nav class="nav-group">
          <router-link
            v-for="link in legalLinks"
            :key="link.path"
            :to="link.path"
            class="footer-link"
          >
            {{ link.name }}
          </router-link>
        </nav>
      </div>

      <!-- 社交媒体链接 -->
      <div class="social-links">
        <a
          v-for="link in socialLinks"
          :key="link.name"
          :href="link.url"
          :title="link.name"
          class="social-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img :src="link.icon" :alt="link.name" class="social-icon" />
        </a>
      </div>
    </div>

    <!-- 版权信息 -->
    <div class="footer-bottom container">
      <p class="copyright">© {{ currentYear }} {{ t("brand.name") }}</p>
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
          & Folklore
        </span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  background-color: var(--color-secondary-background);
  padding: 2rem 0 1.5rem;
  margin-top: 2rem;
}

.footer::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 1px;
  background: var(--color-primary-gradient);
  opacity: 0.2;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

/* 品牌区域样式 */
.footer-brand {
  flex: 1;
}

.logo-integrated {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-text {
  font-family: "Cormorant Garamond", "Times New Roman", serif;
  font-weight: 600;
  font-size: 1.25rem;
  letter-spacing: 0.5px;
  color: var(--color-text);
  transition: all 0.4s ease;
}

.logo-separator {
  width: 1px;
  height: 16px;
  background: var(--color-border);
  margin: 0 8px;
  opacity: 0.5;
}

.logo-tagline {
  font-family: "Poppins", sans-serif;
  font-weight: 300;
  font-size: 0.75rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--color-secondary-text);
  opacity: 0.8;
}

/* 链接区域样式 */
.footer-links {
  display: flex;
  gap: 2rem;
}

.nav-group {
  display: flex;
  gap: 1.5rem;
}

.footer-link {
  color: var(--color-secondary-text);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  opacity: 0.8;
}

.footer-link:hover {
  color: var(--color-primary);
  opacity: 1;
}

/* 社交媒体链接样式 */
.social-links {
  display: flex;
  gap: 0.75rem;
  margin-left: 2rem;
}

.social-link {
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-full);
  background: var(--color-tertiary-background);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s var(--bezier-bounce);
  opacity: 0.8;
}

.social-link:hover {
  transform: translateY(-2px);
  opacity: 1;
  background: transparent;
}

.social-icon {
  width: 20px;
  height: 20px;
  transition: all 0.3s var(--bezier-bounce);
}

.social-link:hover .social-icon {
  transform: scale(1.1);
}

/* 底部版权区域样式 */
.footer-bottom {
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0.8;
}

.copyright {
  color: var(--color-tertiary-text);
  font-size: 0.75rem;
  margin: 0;
}

.footer-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.made-with {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-tertiary-text);
  font-size: 0.75rem;
}

.heart-icon {
  width: 12px;
  height: 12px;
  color: #ff4b4b;
  opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer {
    padding: 1.5rem 0 1rem;
  }

  .footer-content {
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
    text-align: center;
  }

  .footer-brand {
    display: flex;
    justify-content: center;
  }

  .footer-links {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .nav-group {
    flex-direction: row;
    justify-content: center;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>
