<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  tags: {
    type: Array,
    default: () => [],
  },
  selectedTags: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:selectedTags"]);
const { t } = useI18n();

// 计算每个标签的出现次数
const tagCounts = computed(() => {
  const counts = {};
  props.tags.forEach((tag) => {
    counts[tag] = (counts[tag] || 0) + 1;
  });
  return counts;
});

// 获取所有唯一标签
const uniqueTags = computed(() => {
  return [...new Set(props.tags)];
});

// 切换标签选择状态
const toggleTag = (tag) => {
  const newSelectedTags = [...props.selectedTags];
  const index = newSelectedTags.indexOf(tag);
  if (index === -1) {
    newSelectedTags.push(tag);
  } else {
    newSelectedTags.splice(index, 1);
  }
  emit("update:selectedTags", newSelectedTags);
};

// 清除所有选中标签
const clearTags = () => {
  emit("update:selectedTags", []);
};
</script>

<template>
  <div class="tag-filter">
    <div class="tag-filter-header">
      <h3>{{ t("filter.tags.title") }}</h3>
      <button
        v-if="selectedTags.length > 0"
        class="clear-tags"
        @click="clearTags"
      >
        {{ t("filter.tags.clearAll") }}
      </button>
    </div>
    <div class="tag-list">
      <button
        v-for="tag in uniqueTags"
        :key="tag"
        class="tag-button"
        :class="{ active: selectedTags.includes(tag) }"
        @click="toggleTag(tag)"
        :title="tag"
      >
        <span class="tag-text">{{ tag }}</span>
        <span class="tag-count">({{ tagCounts[tag] }})</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.tag-filter {
  margin-bottom: 2rem;
  background: var(--bg-primary);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.tag-filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.tag-filter-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
  position: relative;
  padding-left: 0.8rem;
}

.tag-filter-header h3::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 1rem;
  background: var(--primary-color);
  border-radius: 2px;
}

.clear-tags {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.clear-tags:hover {
  color: var(--primary-color);
  background: rgba(var(--primary-color-rgb), 0.06);
}

.tag-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
  width: 100%;
}

.tag-button {
  width: 100%;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 2.25rem;
  font-weight: 400;
  position: relative;
}

.tag-button:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: rgba(var(--primary-color-rgb), 0.04);
  transform: translateY(-1px);
}

.tag-button.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(var(--primary-color-rgb), 0.2);
}

.tag-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  padding: 0 0.25rem;
}

.tag-count {
  flex-shrink: 0;
  font-size: 0.75rem;
  opacity: 0.7;
  margin-left: 0.25rem;
  background: rgba(var(--text-secondary-rgb), 0.1);
  padding: 0.125rem 0.375rem;
  border-radius: 10px;
  min-width: 1.5rem;
  text-align: center;
}

.tag-button.active .tag-count {
  opacity: 0.9;
  background: rgba(255, 255, 255, 0.2);
}

/* 响应式布局 */
@media (max-width: 768px) {
  .tag-filter {
    padding: 1.25rem;
  }

  /* 使用 flex 换行布局，避免移动端标签只显示一列 */
  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag-button {
    padding: 0.4rem 0.6rem;
    font-size: 0.8125rem;
    min-height: 2rem;
    flex: 1 0 calc(50% - 0.5rem);
  }

  .tag-count {
    font-size: 0.7rem;
    padding: 0.1rem 0.3rem;
  }
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .tag-filter {
    background: rgba(255, 255, 255, 0.03);
    box-shadow: none;
  }

  .tag-button {
    background: rgba(255, 255, 255, 0.02);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .tag-button:hover {
    background: rgba(var(--primary-color-rgb), 0.1);
  }

  .tag-count {
    background: rgba(255, 255, 255, 0.1);
  }

  .tag-button.active {
    box-shadow: 0 2px 8px rgba(var(--primary-color-rgb), 0.4);
  }
}
</style>
