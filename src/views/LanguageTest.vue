<script setup>
import { useI18n } from "vue-i18n";
import { ref, watch } from "vue";
import LanguageSwitcher from "../components/LanguageSwitcher.vue";

const { t, locale } = useI18n();

// 监听语言变化
const currentLocale = ref(locale.value);
watch(locale, (newLocale) => {
  currentLocale.value = newLocale;
});
</script>

<template>
  <div class="language-test">
    <h1>{{ t("blog.title") }}</h1>
    <p>当前语言: {{ currentLocale }}</p>

    <div class="language-switcher-container">
      <LanguageSwitcher />
    </div>

    <div class="test-content">
      <h2>导航菜单</h2>
      <ul>
        <li>{{ t("nav.home") }}</li>
        <li>{{ t("nav.blog") }}</li>
        <li>{{ t("nav.about") }}</li>
        <li>{{ t("nav.contact") }}</li>
      </ul>

      <h2>首页内容</h2>
      <p>{{ t("home.hero.title") }}</p>
      <p>{{ t("home.hero.description") }}</p>
      <button>{{ t("home.hero.browseArticles") }}</button>

      <h2>博客内容</h2>
      <p>{{ t("blog.search") }}</p>
      <p>{{ t("blog.filter") }}</p>
      <p>{{ t("blog.noResults") }}</p>

      <h2>评论内容</h2>
      <p>{{ t("comment.title") }}</p>
      <p>{{ t("comment.leaveComment") }}</p>
      <p>{{ t("comment.submit") }}</p>
    </div>
  </div>
</template>

<style scoped>
.language-test {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.language-switcher-container {
  margin: 2rem 0;
}

.test-content {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 8px;
}

h1 {
  color: var(--primary-color);
}

h2 {
  margin-top: 2rem;
  color: var(--text-primary);
}

ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  gap: 1rem;
}

li {
  padding: 0.5rem 1rem;
  background: var(--bg-primary);
  border-radius: 4px;
}

button {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>
