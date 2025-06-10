<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  target: {
    type: String,
    default: "body",
  },
  color: {
    type: String,
    default: "var(--primary-color)",
  },
  height: {
    type: String,
    default: "4px",
  },
  position: {
    type: String,
    default: "top", // top, bottom
  },
});

const progress = ref(0);

const calculateProgress = () => {
  const targetElement = document.querySelector(props.target);

  if (!targetElement) return;

  const scrollTop = window.scrollY;
  const scrollHeight = targetElement.scrollHeight - window.innerHeight;

  if (scrollHeight > 0) {
    progress.value = (scrollTop / scrollHeight) * 100;
  } else {
    progress.value = 0;
  }
};

onMounted(() => {
  window.addEventListener("scroll", calculateProgress);
  calculateProgress();
});

onUnmounted(() => {
  window.removeEventListener("scroll", calculateProgress);
});
</script>

<template>
  <div
    class="reading-progress"
    :class="position"
    :style="{
      height,
      background: color,
      width: `${progress}%`,
    }"
  ></div>
</template>

<style scoped>
.reading-progress {
  position: fixed;
  left: 0;
  z-index: 1000;
  transition: width 0.2s ease;
}

.top {
  top: 0;
}

.bottom {
  bottom: 0;
}
</style>
