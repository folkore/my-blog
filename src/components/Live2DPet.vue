<template>
  <!-- 该组件无需实际 DOM 结构，Live2D Widget 会自行挂载到 body -->
  <div>
    <!-- 对话气泡已移除，仅保留占位 -->
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted, computed, reactive, watch } from "vue";

const SCRIPT_SRC = "https://unpkg.com/live2d-widget@3.1.4/lib/L2Dwidget.min.js";

function loadScript(src) {
  return new Promise((resolve, reject) => {
    // 若脚本已存在则直接返回
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

function initWidget() {
  // 避免重复初始化
  if (window.__live2d_initialized) return;

  // 检查是否为移动端
  if (window.innerWidth <= 768) return;

  window.__live2d_initialized = true;

  // @ts-ignore 忽略全局对象类型检查
  window.L2Dwidget.init({
    model: {
      // 可按需更换其他模型 json 地址
      jsonPath:
        "https://unpkg.com/live2d-widget-model-miku@1.0.5/assets/miku.model.json",
      scale: 1,
    },
    display: {
      position: "left",
      width: 150,
      height: 280,
      hOffset: 0,
      vOffset: -20,
    },
    mobile: {
      show: false, // 禁用移动端显示
    },
    react: {
      opacityDefault: 0.8,
      opacityOnHover: 0.2,
    },
  });

  // 防止 Live2D 自带的隐藏动作：监视 canvas 的 display
  const restoreDisplay = () => {
    const canvas =
      document.getElementById("live2dcanvas") ||
      document.querySelector("#live2d-widget canvas, canvas[id^='live2d']");
    if (canvas && canvas.style.display === "none") {
      canvas.style.display = "block";
    }
    if (!canvas) {
      window.__live2d_initialized = false;
      initWidget();
    }
  };
  const dispObserver = new MutationObserver(restoreDisplay);
  dispObserver.observe(document.body, {
    attributes: true,
    subtree: true,
    attributeFilter: ["style"],
  });
}

// ===== 交互逻辑 =====
let hideTimer = null; // 仍用于随机提示节流

// 随机提示语
const messages = [
  "嗨嗨~ 欢迎光临！",
  "今天也要元气满满哦！",
  "有任何问题都可以问我~",
  "记得常来陪我玩！",
  "写代码累了吗？休息一下吧~",
];

function randomMessage() {
  const idx = Math.floor(Math.random() * messages.length);
  // 去掉气泡改用控制台输出
  // eslint-disable-next-line no-console
}

function attachInteractions() {
  let canvas = document.getElementById("live2dcanvas");
  if (!canvas) {
    // 尝试更多选择器匹配
    canvas = document.querySelector(
      "#live2d-widget canvas, canvas[id^='live2d']"
    );
  }

  if (canvas && !canvas.__l2d_interaction_bound) {
    // 确保可交互
    canvas.style.pointerEvents = "auto";
    canvas.__l2d_interaction_bound = true;

    canvas.addEventListener(
      "click",
      (event) => {
        event.stopImmediatePropagation();
        event.preventDefault();
        randomMessage();
      },
      true
    );

    canvas.addEventListener("mouseover", () => {
      // 悬停提示示例
    });
  }

  // 兜底：若仍未找到 canvas，则使用捕获阶段监听 document 点击
  if (!canvas && !window.__l2d_global_listener) {
    window.__l2d_global_listener = true;
    document.addEventListener(
      "click",
      (e) => {
        const target = e.target;
        if (
          target &&
          target.tagName === "CANVAS" &&
          target.id.includes("live2d")
        ) {
          randomMessage();
        }
      },
      true
    );
  }

  // ===== 拖拽功能 =====
  if (canvas && !canvas.__l2d_drag_bound) {
    canvas.__l2d_drag_bound = true;

    let dragging = false;
    let hasMoved = false;
    let startX = 0;
    let startY = 0;
    let initRight = 0;
    let initBottom = 0;

    const startDrag = (e) => {
      dragging = true;
      hasMoved = false;
      startX = e.clientX || e.touches?.[0].clientX;
      startY = e.clientY || e.touches?.[0].clientY;
      const rect = canvas.getBoundingClientRect();
      const vpW = window.innerWidth;
      const vpH = window.innerHeight;
      initRight = vpW - rect.right;
      initBottom = vpH - rect.bottom;
      canvas.style.cursor = "pointer";
      canvas.style.position = "fixed";
      canvas.style.right = `${initRight}px`;
      canvas.style.bottom = `${initBottom}px`;
      canvas.style.left = "auto";
      canvas.style.top = "auto";
    };

    const onDrag = (e) => {
      if (!dragging) return;
      const clientX = e.clientX || e.touches?.[0].clientX;
      const clientY = e.clientY || e.touches?.[0].clientY;
      const deltaX = clientX - startX;
      const deltaY = clientY - startY;
      const newRight = Math.max(0, initRight - deltaX);
      const newBottom = Math.max(0, initBottom - deltaY);
      canvas.style.right = `${newRight}px`;
      canvas.style.bottom = `${newBottom}px`;
      canvas.style.left = "auto";
      canvas.style.top = "auto";
      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        hasMoved = true;
      }
    };

    const endDrag = () => {
      dragging = false;
      canvas.style.cursor = "default";
    };

    canvas.addEventListener("mousedown", startDrag);
    canvas.addEventListener("touchstart", startDrag);
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("touchmove", onDrag);
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchend", endDrag);
  }
}

onMounted(async () => {
  // 动态加载脚本并初始化
  if (!window.L2Dwidget) {
    try {
      await loadScript(SCRIPT_SRC);
      window.__live2d_initialized = false;
      initWidget();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to load live2d widget:", err);
    }
  } else {
    window.__live2d_initialized = false;
    initWidget();
  }

  // 添加窗口大小变化监听
  const handleResize = () => {
    const canvas =
      document.getElementById("live2dcanvas") ||
      document.querySelector("#live2d-widget canvas, canvas[id^='live2d']");

    if (window.innerWidth <= 768) {
      if (canvas) {
        canvas.style.display = "none";
      }
    } else {
      if (!window.__live2d_initialized) {
        initWidget();
      } else if (canvas) {
        canvas.style.display = "block";
      }
    }
  };

  window.addEventListener("resize", handleResize);

  // 在组件卸载时移除监听器
  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
    clearTimeout(hideTimer);
  });
});

// 监听 Live2D 初始化完成后再绑定事件
const observer = new MutationObserver(() => {
  const canvas = document.getElementById("live2dcanvas");
  if (canvas) {
    attachInteractions();
    observer.disconnect();
  }
});
observer.observe(document.body, { childList: true, subtree: true });
</script>

<style scoped>
/* 该组件本身不占位，Live2D Widget 默认固定在右下角 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 保留其他样式，已移除对话气泡样式 */
</style>

<style>
#live2dcanvas,
#live2d-widget canvas {
  pointer-events: auto !important;
}

/* 在移动端隐藏Live2D组件 */
@media (max-width: 768px) {
  #live2dcanvas,
  #live2d-widget canvas {
    display: none !important;
  }
}
</style>
