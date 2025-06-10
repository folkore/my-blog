<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goBack = () => {
  router.go(-1);
};

const goHome = () => {
  router.push("/");
};
</script>

<template>
  <div class="not-found container">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>页面未找到</h2>
      <p>抱歉，您访问的页面不存在或已被移动到其他位置。</p>

      <div class="actions">
        <button @click="goBack" class="button secondary-button">
          返回上一页
        </button>
        <button @click="goHome" class="button primary-button">回到首页</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  text-align: center;
}

.not-found-content {
  max-width: 500px;
}

h1 {
  font-size: 120px;
  font-weight: 700;
  color: var(--color-link);
  margin: 0;
  line-height: 1;
}

h2 {
  font-size: 36px;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 20px;
}

p {
  font-size: 18px;
  color: var(--color-secondary-text);
  margin-bottom: 40px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}

@media (max-width: 768px) {
  h1 {
    font-size: 80px;
  }

  h2 {
    font-size: 28px;
  }

  .actions {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
