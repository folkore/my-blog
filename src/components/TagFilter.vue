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
    <h3>{{ t("filter.tags.title") }}</h3>
    <div class="tag-list">
      <button
        v-for="tag in uniqueTags"
        :key="tag"
        class="tag-button"
        :class="{ active: selectedTags.includes(tag) }"
        @click="toggleTag(tag)"
      >
        {{ tag }}
        <span class="tag-count">({{ tagCounts[tag] }})</span>
      </button>
    </div>
    <button
      v-if="selectedTags.length > 0"
      class="clear-button"
      @click="clearTags"
    >
      {{ t("filter.tags.clearAll") }}
    </button>
  </div>
</template>

<style scoped>
.tag-filter {
  margin-bottom: 2rem;
}

.tag-filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tag-filter-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.clear-tags {
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-button {
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.8rem;
  border-radius: 30px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-button:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.tag-button.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.tag-count {
  margin-left: 0.4rem;
  font-size: 0.8rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 0.1rem 0.4rem;
}

.tag-button.active .tag-count {
  background: rgba(255, 255, 255, 0.2);
}
</style>
