<template>
  <div class="home">
    <section
      class="hero"
      ref="containerRef"
      :style="{
        '--x': '0px',
        '--y': '0px',
      }"
      :class="{ 'is-sunset': isDarkMode }"
    >
      <canvas ref="canvasRef" class="sand-particles" />
      <div
        ref="cursorIndicatorRef"
        class="cursor-indicator"
        :style="{
          transform: 'translate3d(var(--x), var(--y), 0)',
        }"
      ></div>

      <div class="container hero-container">
        <div class="hero-content">
          <div class="hero-headline">
            <h1
              class="hero-title glitch-text"
              data-text="在名为'我'的深海，投下一枚石子。"
            >
              在名为'我'的深海，投下一枚石子。
            </h1>
            <div class="hero-subtitle">
              <span class="typing-text"></span>
              <span class="typing-cursor">|</span>
            </div>
          </div>
          <p class="hero-description">
            你好，岸上的人。我是
            <span class="brand-name">folklore</span
            >。<br />我时常潜入名为"自我"的静寂深海，投下一枚名为"思考"的石子，只为观察那荡开的，名为"理解"的涟漪。这里陈列的，便是我拾起的，一些被浪花冲刷上岸的贝壳。<br />若你恰好路过，愿其中一枚，能让你听见海的声音。
          </p>
          <div class="hero-buttons">
            <router-link to="/blog" class="hero-button primary">
              <span class="button-text">进入博客</span>
              <span class="button-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            </router-link>
            <router-link to="/about" class="hero-button secondary">
              <span class="button-text">关于我</span>
              <span class="button-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </span>
            </router-link>
          </div>
          <div class="hero-social">
            <a
              href="https://github.com"
              target="_blank"
              class="social-link"
              title="GitHub"
            >
              <span class="social-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                  ></path>
                </svg>
              </span>
              <span class="social-hover-text">GitHub</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              class="social-link"
              title="Twitter"
            >
              <span class="social-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
                  ></path>
                </svg>
              </span>
              <span class="social-hover-text">Twitter</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              class="social-link"
              title="LinkedIn"
            >
              <span class="social-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                  ></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </span>
              <span class="social-hover-text">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>

      <div class="scroll-indicator" role="button">
        <div class="scroll-text">向下滚动</div>
        <div class="scroll-arrow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        </div>
      </div>
    </section>

    <!-- Latest Posts Section -->
    <section class="latest-posts">
      <div class="container">
        <h2 class="section-title">{{ t("home.latestPosts.title") }}</h2>
        <div class="posts-list">
          <router-link
            v-for="post in latestPosts"
            :key="post.id"
            :to="`/blog/${post.slug}`"
            custom
            v-slot="{ navigate }"
          >
            <article class="post-item" @click="navigate" role="link">
              <div class="post-item-content">
                <header class="post-item-header">
                  <h3 class="post-item-title">{{ post.title }}</h3>
                  <div class="post-tags">
                    <span
                      v-for="(tag, index) in post.tags"
                      :key="index"
                      class="post-tag"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </header>
                <p class="post-item-excerpt">{{ post.excerpt }}</p>
                <footer class="post-item-footer">
                  <span class="post-date">{{ post.date }}</span>
                  <div class="post-item-arrow">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12H19"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M12 5L19 12L12 19"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </footer>
              </div>
              <div class="post-item-image-wrapper">
                <div class="post-item-image">
                  <img v-lazy="post.cover" :alt="post.title" />
                </div>
              </div>
            </article>
          </router-link>
        </div>
        <div class="view-all">
          <router-link
            to="/blog"
            class="view-all-link"
            @mousemove="handleLinkMouseMove"
          >
            <span>{{ t("home.latestPosts.viewAll") }}</span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 5L19 12L12 19"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 技术栈区域 -->
    <section class="tech-stack">
      <div class="container">
        <h2 class="section-title">技术栈</h2>
        <div class="tech-grid">
          <div
            class="tech-card"
            @mousemove="handleCardMouseMove"
            @mouseleave="handleCardMouseLeave"
          >
            <div class="tech-icon">
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
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <h3>前端框架</h3>
            <p>Vue.js, React, Solid.js</p>
          </div>
          <div
            class="tech-card"
            @mousemove="handleCardMouseMove"
            @mouseleave="handleCardMouseLeave"
          >
            <div class="tech-icon">
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
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <h3>语言与工具</h3>
            <p>TypeScript, Vite, Webpack</p>
          </div>
          <div
            class="tech-card"
            @mousemove="handleCardMouseMove"
            @mouseleave="handleCardMouseLeave"
          >
            <div class="tech-icon">
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
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
              </svg>
            </div>
            <h3>UI & 可视化</h3>
            <p>SCSS, TailwindCSS, D3.js</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { throttle } from "lodash-es";
import { createNoise3D } from "simplex-noise";
import { usePostsStore } from "../store";

const { t } = useI18n();

const postsStore = usePostsStore();
const latestPosts = computed(() => postsStore.posts.slice(0, 3));

const containerRef = ref(null);
const canvasRef = ref(null);
const mouseRef = ref({
  x: -10,
  y: 0,
  lx: 0,
  ly: 0,
  sx: 0,
  sy: 0,
  v: 0,
  vs: 0,
  a: 0,
  set: false,
});
const cursorIndicatorRef = ref(null);
const isHoveringInteractive = ref(false);
const rafRef = ref(null);
const boundingRef = ref(null);
const particleColor = ref("#64748b"); // Sand particle color

const circles = ref([]);
const canvasSize = ref({ w: 0, h: 0 });
const context = ref(null);
const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
let typingInterval = null;

let resizeObserver = null;

const isDarkMode = ref(
  document.documentElement.classList.contains("dark-theme")
);

// 观察 <html> 元素 class 变化，以便捕捉主题切换
let htmlClassObserver;
onMounted(() => {
  htmlClassObserver = new MutationObserver(() => {
    isDarkMode.value =
      document.documentElement.classList.contains("dark-theme");
  });
  htmlClassObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
});

onUnmounted(() => {
  if (htmlClassObserver) htmlClassObserver.disconnect();
});

const setSize = () => {
  if (!containerRef.value || !canvasRef.value) return;

  boundingRef.value = containerRef.value.getBoundingClientRect();
  const { width, height } = boundingRef.value;

  // 验证尺寸是否合理，如果异常则重试
  if (width < 100 || height < 100) {
    setTimeout(setSize, 50);
    return;
  }

  canvasSize.value.w = width;
  canvasSize.value.h = height;
  canvasRef.value.width = width * dpr;
  canvasRef.value.height = height * dpr;
  if (context.value) {
    context.value.scale(dpr, dpr);
  }
};

const onMouseMove = (e) => {
  updateMousePosition(e.clientX, e.clientY);
};

const onTouchMove = (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  updateMousePosition(touch.clientX, touch.clientY);
};

const updateMousePosition = (x, y) => {
  // 确保容器存在，如果 boundingRef 不存在则实时获取
  if (!containerRef.value) return;

  boundingRef.value = containerRef.value.getBoundingClientRect();

  const mouse = mouseRef.value;
  mouse.x = x - boundingRef.value.left;
  mouse.y = y - boundingRef.value.top;

  if (!mouse.set) {
    mouse.sx = mouse.x;
    mouse.sy = mouse.y;
    mouse.lx = mouse.x;
    mouse.ly = mouse.y;
    mouse.set = true;
  }

  // 移除这里的CSS变量更新，统一在tick函数中处理
};

const initCanvas = () => {
  resizeCanvas();
  drawParticles();
};

const resizeCanvas = () => {
  if (canvasRef.value && context.value && boundingRef.value) {
    circles.value.length = 0;
    const { width, height } = boundingRef.value;
    canvasSize.value.w = width;
    canvasSize.value.h = height;
    canvasRef.value.width = width * dpr;
    canvasRef.value.height = height * dpr;
    if (context.value) {
      context.value.scale(dpr, dpr);
    }
  }
};

const circleParams = () => {
  const x = Math.floor(Math.random() * canvasSize.value.w);
  const y = Math.floor(Math.random() * canvasSize.value.h);
  const translateX = 0;
  const translateY = 0;
  const pSize = Math.floor(Math.random() * 1.5) + 0.5;
  const alpha = 0;
  const targetAlpha = parseFloat((Math.random() * 0.4 + 0.1).toFixed(1));
  const dx = (Math.random() - 0.5) * 0.05;
  const dy = (Math.random() - 0.5) * 0.05;
  const magnetism = 0.1 + Math.random() * 2;
  return {
    x,
    y,
    translateX,
    translateY,
    size: pSize,
    alpha,
    targetAlpha,
    dx,
    dy,
    magnetism,
  };
};

const hexToRgb = (hex) => {
  hex = hex.replace("#", "");
  const hexInt = parseInt(hex, 16);
  const red = (hexInt >> 16) & 255;
  const green = (hexInt >> 8) & 255;
  const blue = hexInt & 255;
  return [red, green, blue];
};

let rgb;

const drawCircle = (circle, update = false) => {
  if (context.value) {
    const { x, y, translateX, translateY, size, alpha } = circle;
    context.value.translate(translateX, translateY);
    context.value.beginPath();
    context.value.arc(x, y, size, 0, 2 * Math.PI);
    context.value.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
    context.value.fill();
    context.value.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (!update) {
      circles.value.push(circle);
    }
  }
};

const clearContext = () => {
  if (context.value) {
    context.value.clearRect(0, 0, canvasSize.value.w, canvasSize.value.h);
  }
};

const drawParticles = () => {
  // This function is for initial setup, no need to clear here.
  const particleCount = 400;
  for (let i = 0; i < particleCount; i++) {
    const circle = circleParams();
    drawCircle(circle);
  }
};

const drawStoneCursor = () => {
  if (isHoveringInteractive.value) return;
  if (!context.value || !mouseRef.value.set) return;

  const mouse = mouseRef.value;
  const ctx = context.value;

  ctx.save();
  ctx.translate(mouse.sx, mouse.sy);

  const scale = 1 + mouse.vs / 200; // Pulsate based on speed
  ctx.scale(scale, scale);

  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.bezierCurveTo(10, -15, 12, 0, 0, 12);
  ctx.bezierCurveTo(-12, 12, -10, -15, 0, -12);
  ctx.closePath();

  const gradient = ctx.createRadialGradient(0, 0, 2, 0, 0, 12);
  gradient.addColorStop(0, "rgba(220, 220, 220, 0.7)");
  gradient.addColorStop(1, "rgba(180, 180, 180, 0.7)");

  ctx.fillStyle = gradient;
  ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 2;

  ctx.fill();
  ctx.restore();
};

const effects = ref([]);

const createWaterSplash = (x, y) => {
  // Particle splash
  const particleCount = 30 + Math.floor(Math.random() * 20);
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    // Distribute particles outwards, with more energy upwards
    const speed = Math.random() * 4 + 1.5;
    const initialVy = -Math.random() * 7 - 2;

    const newEffect = {
      type: "splashParticle",
      x,
      y,
      dx: Math.cos(angle) * speed * (Math.random() * 0.7 + 0.3),
      dy: initialVy + Math.sin(angle) * speed * 0.5,
      gravity: 0.12 + Math.random() * 0.08,
      size: Math.random() * 1.5 + 1,
      life: 50 + Math.random() * 40,
      opacity: 1,
      initialLife: 0, // Will be set below
    };
    newEffect.initialLife = newEffect.life;
    effects.value.push(newEffect);
  }

  // Ripple waves
  const waveCount = 3;
  for (let i = 0; i < waveCount; i++) {
    setTimeout(() => {
      const maxRadius = 80 + Math.random() * 50;
      effects.value.push({
        type: "rippleWave",
        x,
        y,
        radius: 10,
        maxRadius: maxRadius,
        speed: 0.6 + Math.random() * 0.4,
        opacity: 0.5,
        lineWidth: 1.5 + Math.random(),
        noiseGenerator: createNoise3D(),
      });
    }, i * 100); // Stagger the creation of waves
  }
};

const createSandSplash = (x, y) => {
  const splashParticles = 30;
  for (let i = 0; i < splashParticles; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 1;
    const newCircle = circleParams();

    newCircle.x = x;
    newCircle.y = y;
    newCircle.dx = Math.cos(angle) * speed * 0.2;
    newCircle.dy = Math.sin(angle) * speed * 0.2;
    newCircle.targetAlpha = Math.random() * 0.6 + 0.2;
    newCircle.magnetism = 0; // Splashed particles shouldn't follow mouse

    circles.value.push(newCircle);
  }
};

const onClick = (e) => {
  if (!boundingRef.value) return;

  const w = canvasSize.value.w;
  const h = canvasSize.value.h;
  const x = e.clientX - boundingRef.value.left;
  const y = e.clientY - boundingRef.value.top;

  // Check if inside sand polygon
  if (h * x + 0.1 * w * y - 0.55 * w * h <= 0) {
    createSandSplash(x, y);
  } else {
    createWaterSplash(x, y);
  }
};

const animateAndDrawEffects = () => {
  effects.value.forEach((effect, index) => {
    if (effect.type === "splashParticle") {
      effect.dy += effect.gravity;
      effect.x += effect.dx;
      effect.y += effect.dy;
      effect.life--;

      effect.opacity = Math.max(0, effect.life / effect.initialLife);

      if (effect.life <= 0) {
        effects.value.splice(index, 1);
        return;
      }

      if (context.value) {
        const ctx = context.value;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, effect.size, 0, Math.PI * 2);
        // Use a lighter, more water-like color
        ctx.fillStyle = `rgba(230, 240, 255, ${effect.opacity * 0.85})`;
        ctx.fill();
      }
    } else if (effect.type === "rippleWave") {
      effect.radius += effect.speed;
      if (effect.radius > effect.maxRadius) {
        effects.value.splice(index, 1);
        return;
      }

      if (context.value) {
        const ctx = context.value;
        const currentOpacity =
          effect.opacity * (1 - effect.radius / effect.maxRadius);

        // --- Start of new irregular shape logic ---
        const points = 64;
        const noiseAmount = 20; // How much the radius is distorted
        const noiseSpeed = 0.008;
        const noiseScale = 0.05;

        ctx.beginPath();

        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const noiseVal = effect.noiseGenerator(
            Math.cos(angle) * noiseScale,
            Math.sin(angle) * noiseScale,
            effect.radius * noiseSpeed
          );
          const r = effect.radius + noiseVal * noiseAmount;
          const x = effect.x + r * Math.cos(angle);
          const y = effect.y + r * Math.sin(angle);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        // --- End of new irregular shape logic ---

        // This subtle fill creates a "deep interaction" by lighting up the background
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.15})`;
        ctx.fill();

        // The stroke provides a faint edge to the wave
        ctx.strokeStyle = `rgba(255, 255, 255, ${currentOpacity * 0.3})`;
        ctx.lineWidth = effect.lineWidth;
        ctx.stroke();
      }
    }
  });
};

const animateParticles = () => {
  // clearContext() is now called in tick() to ensure correct render order.
  const mouse = mouseRef.value;
  const ctx = context.value;
  if (!ctx) return;

  ctx.save();

  // Define the clipping path for sand particles
  const clipPath = new Path2D();
  const w = canvasSize.value.w;
  const h = canvasSize.value.h;
  clipPath.moveTo(0, 0);
  clipPath.lineTo(w * 0.55, 0);
  clipPath.lineTo(w * 0.45, h);
  clipPath.lineTo(0, h);
  clipPath.closePath();
  ctx.clip(clipPath);

  circles.value.forEach((circle, i) => {
    circle.x += circle.dx;
    circle.y += circle.dy;
    circle.translateX +=
      (mouse.x / (50 / circle.magnetism) - circle.translateX) / 50;
    circle.translateY +=
      (mouse.y / (50 / circle.magnetism) - circle.translateY) / 50;

    if (circle.alpha < circle.targetAlpha) {
      circle.alpha += 0.01;
    }

    drawCircle(circle, true);

    if (
      circle.x < -circle.size ||
      circle.x > canvasSize.value.w + circle.size ||
      circle.y < -circle.size ||
      circle.y > canvasSize.value.h + circle.size
    ) {
      // Don't replace splashed particles
      if (circle.magnetism > 0) {
        circles.value.splice(i, 1);
        const newCircle = circleParams();
        drawCircle(newCircle);
      } else {
        circles.value.splice(i, 1);
      }
    }
  });

  ctx.restore();
};

const tick = () => {
  const mouse = mouseRef.value;

  // 使用更快的跟踪速度，减少延迟
  mouse.sx += (mouse.x - mouse.sx) * 0.3;
  mouse.sy += (mouse.y - mouse.sy) * 0.3;

  const dx = mouse.x - mouse.lx;
  const dy = mouse.y - mouse.ly;
  const d = Math.hypot(dx, dy);

  mouse.v = d;
  mouse.vs += (d - mouse.vs) * 0.1;
  mouse.vs = Math.min(100, mouse.vs);

  mouse.lx = mouse.x;
  mouse.ly = mouse.y;

  mouse.a = Math.atan2(dy, dx);

  // 更新圆点位置，使用平滑后的位置以获得更流畅的体验
  if (containerRef.value && mouse.set) {
    containerRef.value.style.setProperty("--x", `${mouse.sx}px`);
    containerRef.value.style.setProperty("--y", `${mouse.sy}px`);
  }

  clearContext();
  animateParticles();
  animateAndDrawEffects();
  drawStoneCursor();

  rafRef.value = requestAnimationFrame(tick);
};

const handleLinkMouseMove = (e) => {
  const link = e.currentTarget;
  const rect = link.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  link.style.setProperty("--mouse-x", `${x}px`);
  link.style.setProperty("--mouse-y", `${y}px`);
};

const handleCardMouseMove = (e) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg
  const rotateY = ((x - centerX) / centerX) * 10; // Max 10deg

  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;

  const icon = card.querySelector(".tech-icon");
  const text = card.querySelector("h3");
  const paragraph = card.querySelector("p");

  const moveFactor = 0.08;
  if (icon)
    icon.style.transform = `translateX(${(x - centerX) * moveFactor}px) translateY(${
      (y - centerY) * moveFactor
    }px) translateZ(20px)`;
  if (text)
    text.style.transform = `translateX(${
      (x - centerX) * (moveFactor * 0.8)
    }px) translateY(${(y - centerY) * (moveFactor * 0.8)}px) translateZ(15px)`;
  if (paragraph)
    paragraph.style.transform = `translateX(${
      (x - centerX) * (moveFactor * 0.6)
    }px) translateY(${(y - centerY) * (moveFactor * 0.6)}px) translateZ(10px)`;
};

const handleCardMouseLeave = (e) => {
  const card = e.currentTarget;
  card.style.transform =
    "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";

  const icon = card.querySelector(".tech-icon");
  const text = card.querySelector("h3");
  const paragraph = card.querySelector("p");

  if (icon) icon.style.transform = "translateX(0) translateY(0) translateZ(0)";
  if (text) text.style.transform = "translateX(0) translateY(0) translateZ(0)";
  if (paragraph)
    paragraph.style.transform = "translateX(0) translateY(0) translateZ(0)";
};

// 存储 throttled 函数的引用以便清理
let throttledMouseMove = null;

onMounted(() => {
  // 立即添加鼠标事件监听器，不等待 canvas 初始化
  const setupMouseListeners = () => {
    if (containerRef.value && !throttledMouseMove) {
      throttledMouseMove = throttle(onMouseMove, 16);
      window.addEventListener("mousemove", throttledMouseMove);
      containerRef.value.addEventListener("touchmove", onTouchMove, {
        passive: false,
      });
      containerRef.value.addEventListener("click", onClick);
    }
  };

  // 设置交互元素的悬停事件
  const setupInteractiveElements = () => {
    if (!containerRef.value) return;

    const interactiveElements = containerRef.value.querySelectorAll(
      'a, button, [role="button"], .scroll-indicator'
    );

    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        isHoveringInteractive.value = true;
        if (cursorIndicatorRef.value) {
          cursorIndicatorRef.value.style.opacity = "0";
        }
      });

      element.addEventListener("mouseleave", () => {
        isHoveringInteractive.value = false;
        if (cursorIndicatorRef.value) {
          cursorIndicatorRef.value.style.opacity = "1";
        }
      });
    });
  };

  // 使用更可靠的初始化方法，确保布局完全稳定
  const initializeCanvas = () => {
    if (!containerRef.value || !canvasRef.value) {
      setTimeout(initializeCanvas, 50);
      return;
    }

    // 检查容器是否有合理的尺寸
    const rect = containerRef.value.getBoundingClientRect();
    if (rect.width < 100 || rect.height < 100) {
      setTimeout(initializeCanvas, 50);
      return;
    }

    context.value = canvasRef.value.getContext("2d");
    rgb = hexToRgb(particleColor.value);

    // 确保之前的ResizeObserver已经清理
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }

    resizeObserver = new ResizeObserver(() => {
      // 添加防抖，避免频繁触发
      if (resizeObserver && resizeObserver.timeout) {
        clearTimeout(resizeObserver.timeout);
      }
      if (resizeObserver) {
        resizeObserver.timeout = setTimeout(() => {
          if (containerRef.value && canvasRef.value) {
            setSize();
            initCanvas();
          }
        }, 100);
      }
    });

    if (containerRef.value) {
      resizeObserver.observe(containerRef.value);
    }

    setSize();
    initCanvas();
    setupInteractiveElements(); // 设置交互元素事件
    rafRef.value = requestAnimationFrame(tick);
  };

  // 立即设置鼠标监听器
  requestAnimationFrame(() => {
    setupMouseListeners();
    // 延迟初始化 canvas
    setTimeout(initializeCanvas, 100);
  });

  const postItems = document.querySelectorAll(".post-item");
  const postObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  postItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 100}ms`;
    postObserver.observe(item);
  });

  initTypingEffect();
  initScrollIndicator();
});

onUnmounted(() => {
  // 清理动画循环
  if (rafRef.value) {
    cancelAnimationFrame(rafRef.value);
    rafRef.value = null;
  }

  // 清理ResizeObserver
  if (resizeObserver) {
    if (containerRef.value) {
      resizeObserver.unobserve(containerRef.value);
    }
    resizeObserver.disconnect();
    resizeObserver = null;
  }

  // 清理鼠标事件监听器
  if (throttledMouseMove) {
    window.removeEventListener("mousemove", throttledMouseMove);
    throttledMouseMove = null;
  }

  // 清理容器事件监听器
  if (containerRef.value) {
    containerRef.value.removeEventListener("touchmove", onTouchMove);
    containerRef.value.removeEventListener("click", onClick);
  }

  // 清理定时器
  if (typingInterval) {
    clearInterval(typingInterval);
    typingInterval = null;
  }

  // 清理滚动监听器（如果存在）
  window.removeEventListener("scroll", () => {});
});

// 打字机效果
const initTypingEffect = () => {
  const typingText = document.querySelector(".typing-text");
  const texts = ["思考者", "探索者", "记录者", "创造者"];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  const type = () => {
    const currentText = texts[textIndex];

    if (isDeleting) {
      typingText.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingText.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 150;
    }

    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      typingSpeed = 1500;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typingSpeed = 500;
    }

    typingInterval = setTimeout(type, typingSpeed);
  };

  if (typingText) {
    typingInterval = setTimeout(type, 1000);
  }
};

// 滚动指示器效果
const initScrollIndicator = () => {
  const scrollIndicator = document.querySelector(".scroll-indicator");

  if (scrollIndicator) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        scrollIndicator.classList.add("hidden");
      } else {
        scrollIndicator.classList.remove("hidden");
      }
    });

    scrollIndicator.addEventListener("click", () => {
      const heroHeight = document.querySelector(".hero").offsetHeight;
      window.scrollTo({
        top: heroHeight,
        behavior: "smooth",
      });
    });
  }
};

// 根据深浅模式切换粒子颜色，并立即生效
watch(
  isDarkMode,
  (val) => {
    particleColor.value = val ? "#B08C3C" : "#64748b";
    rgb = hexToRgb(particleColor.value);
  },
  { immediate: true }
);
</script>

<style scoped>
.home {
  min-height: 100vh;
}

/* Hero Section */
.hero {
  position: relative;
  padding: 0;
  overflow: hidden;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    #e8e2d6 0%,
    #d4c8b0 25%,
    #3f88c5 50%,
    #2c5d8a 75%,
    #1a3852 100%
  );
  cursor: none; /* 隐藏默认鼠标指针 */
  /* 突破父容器宽度限制，避免横向滚动条 */
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  width: 100vw;
  max-width: none;
  transition: background 2s ease-in-out;
}

.hero.is-sunset {
  background: linear-gradient(
    135deg,
    #1e253a 0%,
    #24334a 20%,
    #3b3f63 40%,
    #684b71 60%,
    #a57055 80%,
    #c8a273 100%
  );
}

.hero-container {
  display: flex;
  align-items: center;
  gap: 4rem;
  width: 100%;
  position: relative;
  z-index: 5;
}

/* Content Area */
.hero-content {
  flex: 1 1 55%;
  position: relative;
  z-index: 3;
  text-align: left;
  max-width: 650px;
}

.hero-headline {
  margin-bottom: 2rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.3;
  margin-bottom: 1rem;
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-primary-light) 50%,
    var(--color-accent) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  position: relative;
  animation: fadeInUp 0.8s ease-out;
}
.glitch-text {
  position: relative;
}
.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-primary-light) 50%,
    var(--color-accent) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.glitch-text::before {
  animation: glitch-animation 3s infinite linear alternate-reverse;
  left: 2px;
  text-shadow: -1px 0 rgba(var(--color-primary-rgb), 0.3);
  clip-path: polygon(
    0 0,
    100% 0,
    100% 35%,
    0 35%,
    0 45%,
    100% 45%,
    100% 85%,
    0 85%,
    0 100%,
    100% 100%
  );
}

.glitch-text::after {
  animation: glitch-animation 2s infinite linear alternate-reverse;
  left: -2px;
  text-shadow: 1px 0 rgba(var(--color-accent-rgb), 0.3);
  clip-path: polygon(
    0 25%,
    100% 25%,
    100% 30%,
    0 30%,
    0 50%,
    100% 50%,
    100% 70%,
    0 70%,
    0 80%,
    100% 80%
  );
}
@keyframes glitch-animation {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-1px, 1px);
  }
  40% {
    transform: translate(-1px, -1px);
  }
  60% {
    transform: translate(1px, 1px);
  }
  80% {
    transform: translate(1px, -1px);
  }
  100% {
    transform: translate(0);
  }
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  height: 2rem;
  display: flex;
  align-items: center;
  color: var(--color-primary-light);
  margin-top: 0.5rem;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.typing-text {
  display: inline-block;
}
.typing-cursor {
  display: inline-block;
  margin-left: 2px;
  animation: cursor-blink 1s infinite;
}

@keyframes cursor-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.hero-description {
  font-size: 1.1rem;
  color: var(--color-secondary-text);
  margin-bottom: 2.5rem;
  animation: fadeInUp 0.8s ease-out 0.4s both;
  line-height: 1.8;
}

.brand-name {
  position: relative;
  color: var(--color-primary);
  font-weight: 600;
  display: inline-block;
  padding: 0 4px;
}
.brand-name::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(
    90deg,
    rgba(var(--color-primary-rgb), 0.3),
    rgba(var(--color-accent-rgb), 0.3)
  );
  border-radius: 2px;
}

.hero-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: flex-start;
  animation: fadeInUp 0.8s ease-out 0.6s both;
}
.hero-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.85rem 1.75rem;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  z-index: 1;
}
.button-text {
  position: relative;
  z-index: 2;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.button-icon {
  position: relative;
  z-index: 2;
  width: 20px;
  height: 20px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  opacity: 0.8;
}
.hero-button.primary {
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-primary-light) 100%
  );
  color: white;
  box-shadow: 0 10px 20px -10px rgba(var(--color-primary-rgb), 0.5);
}
.hero-button.primary::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    var(--color-primary-light) 0%,
    var(--color-primary) 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 1;
}
.hero-button.primary:hover::before {
  opacity: 1;
}
.hero-button.secondary {
  background: rgba(var(--color-tertiary-background-rgb), 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--color-text);
  border: 1px solid rgba(var(--color-border-rgb), 0.2);
}
.hero-button.secondary::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(var(--color-primary-rgb), 0.05);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 1;
}
.hero-button.secondary:hover::before {
  opacity: 1;
}
.hero-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px -10px rgba(var(--color-primary-rgb), 0.3);
}
.hero-button:hover .button-icon {
  transform: translateX(4px);
}

.hero-social {
  display: flex;
  gap: 1.5rem;
  justify-content: flex-start;
  margin-top: 3rem;
  animation: fadeInUp 0.8s ease-out 0.8s both;
}
.social-link {
  position: relative;
  color: var(--color-secondary-text);
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: rgba(var(--color-tertiary-background-rgb), 0.5);
  border: 1px solid rgba(var(--color-border-rgb), 0.2);
  overflow: hidden;
}
.social-icon {
  position: relative;
  z-index: 2;
  width: 24px;
  height: 24px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.social-hover-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-primary);
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 1;
}
.social-link:hover {
  color: var(--color-primary);
  transform: translateY(-5px);
  box-shadow: 0 10px 20px -5px rgba(var(--color-primary-rgb), 0.2);
}
.social-link:hover .social-icon {
  transform: translateY(-120%);
}
.social-link:hover .social-hover-text {
  opacity: 1;
  transform: translateY(0);
}

/* The new animated background styles */
.sand-particles {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  /* clip-path is now handled programmatically in animateParticles() */
}

.cursor-indicator {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  width: 1rem;
  height: 1rem;
  margin-left: -0.5rem;
  margin-top: -0.5rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  pointer-events: none;
  will-change: transform;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(2px);
  transition: opacity 0.2s ease;
  display: none !important;
}

/* 在可交互元素上恢复默认鼠标指针 */
.hero a,
.hero button,
.hero [role="button"],
.hero .scroll-indicator {
  cursor: pointer !important;
}

/* Scroll Indicator */
.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-secondary-text);
  opacity: 0.7;
  transition: all 0.5s ease;
  z-index: 10;
  cursor: pointer;
  animation:
    fadeInUp 0.8s ease-out 1.2s both,
    bounce 2s ease-in-out infinite 2s;
}

.scroll-indicator.hidden {
  opacity: 0;
  transform: translate(-50%, 20px);
  pointer-events: none;
}

.scroll-text {
  font-size: 0.9rem;
  margin-bottom: 5px;
  font-weight: 500;
}

.scroll-arrow {
  width: 24px;
  height: 24px;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design Adjustments */
@media (max-width: 992px) {
  .hero-container {
    flex-direction: column;
    padding-top: 5rem;
    padding-bottom: 5rem;
    text-align: center;
  }
  .hero-content {
    max-width: 100%;
    text-align: center;
  }
  .hero-buttons,
  .hero-social {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.2rem;
  }
  .hero-subtitle {
    font-size: 1.2rem;
    height: 1.6rem;
  }
  .hero-description {
    font-size: 1rem;
  }
  .hero-buttons {
    flex-direction: column;
    gap: 1rem;
  }
  .hero-button {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .hero-container {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
  .hero-title {
    font-size: 2rem;
  }
  .hero-subtitle {
    font-size: 1.1rem;
  }
  .hero-social {
    gap: 1rem;
  }
  .social-link {
    width: 40px;
    height: 40px;
  }
}

/* Latest Posts Section (and below) styles remain unchanged */
.latest-posts {
  padding: 6rem 0;
  background-color: var(--color-background);
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 3rem;
  position: relative;
  display: block;
  text-align: left;
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: -0.75rem;
  left: 0;
  transform: translateX(0);
  width: 80px;
  height: 3px;
  background: var(--color-primary-gradient);
}

.posts-list {
  display: flex;
  flex-direction: column;
  margin-bottom: 3rem;
}

.post-item {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2.5rem 1.5rem;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  border-bottom: 1px solid var(--color-border);
  transition:
    background-color 0.3s ease,
    transform 0.3s ease,
    box-shadow 0.3s ease,
    opacity 0.5s ease;
  border-radius: var(--radius-lg);
  opacity: 0;
  transform: translateY(20px);
}

.post-item.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.post-item:first-child {
  border-top: 1px solid var(--color-border);
}

.post-item:hover {
  background-color: var(--color-secondary-background);
  transform: translateY(-4px);
  box-shadow: 0 10px 30px -10px rgba(var(--color-primary-rgb), 0.1);
}

.post-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.post-item-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.post-item-title {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text);
  transition: color 0.3s ease;
}

.post-item:hover .post-item-title {
  color: var(--color-primary);
}

.post-item-excerpt {
  color: var(--color-secondary-text);
  line-height: 1.7;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-item-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.post-date {
  color: var(--color-tertiary-text);
  font-size: 0.875rem;
  letter-spacing: 0.05em;
}

.post-tags {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.post-tag {
  color: var(--color-secondary-text);
  font-size: 0.875rem;
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  font-weight: 500;
}

.post-item-image-wrapper {
  width: 240px;
  flex-shrink: 0;
}

.post-item-image {
  aspect-ratio: 4/3;
  overflow: hidden;
  border-radius: var(--radius-md);
}

.post-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s var(--bezier-smooth);
}

.post-item:hover .post-item-image img {
  transform: scale(1.05);
}

.post-item-arrow {
  color: var(--color-tertiary-text);
  opacity: 0;
  transform: translateX(-10px);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.post-item:hover .post-item-arrow {
  opacity: 1;
  transform: translateX(0);
}

.view-all {
  text-align: center;
  margin-top: 3rem;
}

.view-all-link {
  --transition-duration: 0.4s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--color-secondary-text);
  text-decoration: none;
  position: relative;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-full);
  transition: color var(--transition-duration) ease;
  background: transparent;
  z-index: 1;
}

.view-all-link:hover {
  color: var(--color-primary);
}

.view-all-link::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  background: radial-gradient(
    200px circle at var(--mouse-x) var(--mouse-y),
    rgba(var(--color-primary-rgb), 0.2) 0%,
    rgba(var(--color-accent-rgb), 0.15) 50%,
    transparent 80%
  );
  filter: blur(20px);
  opacity: 0;
  transition: opacity var(--transition-duration) ease;
  z-index: -1;
}

.view-all-link:hover::before {
  opacity: 1;
}

.view-all-link span,
.view-all-link svg {
  z-index: 1;
}

.view-all-link svg {
  transition: transform var(--transition-duration) ease;
  margin-left: 0.25rem;
}

.view-all-link:hover svg {
  transform: translateX(4px);
}

/* Tech Stack Section */
.tech-stack {
  padding: 3.5rem 0;
  background: var(--color-background);
  position: relative;
  overflow: hidden;
}

.tech-stack::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: radial-gradient(
    circle at 80% 20%,
    rgba(var(--color-primary-rgb), 0.05) 0%,
    transparent 50%
  );
  z-index: 0;
}

.tech-stack .container {
  position: relative;
  z-index: 1;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.25rem;
}

.tech-card {
  padding: 1.25rem;
  border-radius: var(--radius-xl, 16px);
  text-align: center;
  transition:
    transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    background 0.3s ease,
    border-color 0.3s ease;
  position: relative;
  background: var(--color-secondary-background);
  border: 1px solid transparent;
  overflow: hidden;
  transform-style: preserve-3d;
}

.tech-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(255, 255, 255, 0.03),
    transparent 35%
  );
  box-shadow: inset 0 0 30px rgba(var(--color-primary-rgb), 0.07);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.tech-card:hover::before {
  opacity: 1;
}

.tech-card:hover {
  background: linear-gradient(
    145deg,
    var(--color-tertiary-background),
    var(--color-secondary-background)
  );
  box-shadow: 0 20px 40px -15px rgba(var(--color-primary-rgb), 0.15);
}

.tech-icon,
.tech-card h3,
.tech-card p {
  transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
}

.tech-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 0.75rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--color-primary-rgb), 0.1);
  color: var(--color-primary);
  z-index: 1;
}

.tech-card:hover .tech-icon {
  background: rgba(var(--color-primary-rgb), 0.15);
  box-shadow: 0 0 20px rgba(var(--color-primary-rgb), 0.2);
  transform: scale(1.1) rotate(-4deg);
  color: var(--color-primary-light);
}

.tech-card h3 {
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  transition: all 0.4s ease;
  position: relative;
  z-index: 1;
}

.tech-card:hover h3 {
  background: var(--color-primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.tech-card p {
  color: var(--color-secondary-text);
  font-size: 0.9rem;
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
}

.tech-card:hover p {
  color: var(--color-text);
}

@media (max-width: 768px) {
  .tech-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .tech-card {
    padding: 1.25rem;
  }
}
</style>
