<script setup>
import { useScrollToTop } from "../composables/useScrollToTop";

const { showScrollTop, scrollToTop } = useScrollToTop();
</script>

<template>
  <transition name="fade">
    <button
      v-show="showScrollTop"
      class="back-to-top"
      @click="scrollToTop"
      aria-label="返回顶部"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  </transition>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--card-bg);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--card-shadow);
  z-index: 99;
  border: none;
  padding: 0;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.back-to-top:hover {
  transform: translateY(-5px);
  background-color: var(--primary-color);
  color: white;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
