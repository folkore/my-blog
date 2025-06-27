<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";

const canvasRef = ref(null);
let animationId = null;
let particles = [];
let gradientAnimation = null;

// 检测深色模式
const isDarkMode = ref(false);

// 粒子类 - 优化为更柔和的效果
class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
    this.setupGSAPAnimation();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.vx = (Math.random() - 0.5) * 0.3; // 减慢移动速度
    this.vy = (Math.random() - 0.5) * 0.2;
    this.size = Math.random() * 1.5 + 0.5; // 减小粒子大小
    this.opacity = Math.random() * 0.3 + 0.1; // 降低透明度
    this.hue = isDarkMode.value
      ? Math.random() * 40 + 200 // 深色模式：蓝色系
      : Math.random() * 30 + 210; // 浅色模式：蓝紫色系
    this.life = 0;
  }

  setupGSAPAnimation() {
    // 使用GSAP创建更缓慢的生命周期动画
    this.lifeAnimation = gsap.to(this, {
      life: 1,
      duration: 8 + Math.random() * 6, // 增加动画时长
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // 边界检查
    if (
      this.x < 0 ||
      this.x > this.canvas.width ||
      this.y < 0 ||
      this.y > this.canvas.height
    ) {
      this.reset();
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity * Math.sin(this.life * Math.PI) * 0.6; // 进一步降低透明度
    ctx.fillStyle = `hsl(${this.hue}, 40%, ${isDarkMode.value ? 65 : 70}%)`; // 降低饱和度
    ctx.shadowBlur = 4; // 减少发光效果
    ctx.shadowColor = `hsl(${this.hue}, 30%, ${isDarkMode.value ? 60 : 65}%)`;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  destroy() {
    if (this.lifeAnimation) {
      this.lifeAnimation.kill();
    }
  }
}

// 检测主题变化
const checkTheme = () => {
  isDarkMode.value = document.documentElement.classList.contains("dark-theme");
};

// 初始化Canvas
const initCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // 设置Canvas尺寸
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // 监听主题变化
  const themeObserver = new MutationObserver(checkTheme);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  // 初始化粒子 - 减少数量
  const particleCount = Math.min(
    40, // 减少粒子数量
    Math.floor((canvas.width * canvas.height) / 20000) // 增加密度阈值
  );
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvas));
  }

  // 创建更柔和的渐变动画对象
  const gradientState = {
    offset1: 0,
    offset2: 0,
    hue1: isDarkMode.value ? 220 : 210, // 深色模式使用更深的蓝色
    hue2: isDarkMode.value ? 240 : 230, // 浅色模式使用柔和的蓝紫色
  };

  // 使用GSAP创建更缓慢的渐变动画
  gradientAnimation = gsap
    .timeline({ repeat: -1 })
    .to(gradientState, {
      offset1: 1,
      offset2: 1,
      duration: 12, // 增加动画时长
      ease: "sine.inOut",
    })
    .to(
      gradientState,
      {
        hue1: isDarkMode.value ? 200 : 200,
        hue2: isDarkMode.value ? 260 : 250,
        duration: 10, // 增加动画时长
        ease: "power1.inOut", // 使用更柔和的缓动
      },
      0
    )
    .to(gradientState, {
      offset1: 0,
      offset2: 0,
      duration: 12,
      ease: "sine.inOut",
    })
    .to(
      gradientState,
      {
        hue1: isDarkMode.value ? 220 : 210,
        hue2: isDarkMode.value ? 240 : 230,
        duration: 10,
        ease: "power1.inOut",
      },
      "-=12"
    );

  // 动画循环
  const animate = () => {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制河流渐变背景（无波纹）
    drawRiverGradient(ctx, canvas, gradientState);

    // 更新和绘制粒子
    particles.forEach((particle) => {
      particle.update();
      particle.draw(ctx);
    });

    animationId = requestAnimationFrame(animate);
  };

  animate();

  return () => {
    window.removeEventListener("resize", resizeCanvas);
    // 清理GSAP动画
    if (gradientAnimation) {
      gradientAnimation.kill();
    }
    particles.forEach((particle) => particle.destroy());
  };
};

// 绘制河流渐变背景（柔和版本，支持深浅主题）
const drawRiverGradient = (ctx, canvas, gradientState) => {
  // 创建线性渐变，模拟时间之河的流动效果
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);

  // 使用GSAP动画状态的颜色变化
  const { offset1, offset2, hue1, hue2 } = gradientState;

  if (isDarkMode.value) {
    // 深色主题：使用更深沉的色调
    gradient.addColorStop(
      0,
      `hsl(${hue1 + offset1 * 10}, 35%, ${8 + offset1 * 3}%)`
    ); // 深蓝紫
    gradient.addColorStop(
      0.3,
      `hsl(${hue1 - 10 + offset2 * 8}, 40%, ${12 + offset2 * 3}%)`
    ); // 深蓝
    gradient.addColorStop(
      0.6,
      `hsl(${210 + offset1 * 8}, 45%, ${16 + offset1 * 3}%)`
    ); // 青蓝
    gradient.addColorStop(
      0.8,
      `hsl(${hue2 - 10 + offset2 * 8}, 40%, ${20 + offset2 * 3}%)`
    ); // 深紫
    gradient.addColorStop(
      1,
      `hsl(${hue2 + offset1 * 10}, 35%, ${24 + offset1 * 3}%)`
    ); // 深紫蓝
  } else {
    // 浅色主题：使用柔和的色调
    gradient.addColorStop(
      0,
      `hsl(${hue1 + offset1 * 8}, 25%, ${85 + offset1 * 2}%)`
    ); // 浅蓝紫
    gradient.addColorStop(
      0.3,
      `hsl(${hue1 - 8 + offset2 * 6}, 30%, ${88 + offset2 * 2}%)`
    ); // 浅蓝
    gradient.addColorStop(
      0.6,
      `hsl(${215 + offset1 * 6}, 35%, ${90 + offset1 * 2}%)`
    ); // 浅青蓝
    gradient.addColorStop(
      0.8,
      `hsl(${hue2 - 8 + offset2 * 6}, 30%, ${92 + offset2 * 2}%)`
    ); // 浅紫
    gradient.addColorStop(
      1,
      `hsl(${hue2 + offset1 * 8}, 25%, ${94 + offset1 * 2}%)`
    ); // 浅紫蓝
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 添加微妙的光晕效果
  drawSubtleGlow(ctx, canvas, gradientState);
};

// 绘制微妙的光晕效果（适配深浅主题）
const drawSubtleGlow = (ctx, canvas, gradientState) => {
  ctx.save();
  ctx.globalAlpha = isDarkMode.value ? 0.08 : 0.06; // 进一步降低透明度

  const { offset1, offset2 } = gradientState;

  // 创建径向渐变光晕
  const centerX = canvas.width * (0.4 + offset1 * 0.2); // 减少移动范围
  const centerY = canvas.height * (0.5 + offset2 * 0.1);
  const radius = Math.min(canvas.width, canvas.height) * 0.4;

  const glowGradient = ctx.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    radius
  );

  if (isDarkMode.value) {
    // 深色主题：使用更深的光晕
    glowGradient.addColorStop(0, `hsla(${210 + offset1 * 20}, 50%, 40%, 0.15)`);
    glowGradient.addColorStop(
      0.5,
      `hsla(${230 + offset2 * 15}, 45%, 35%, 0.08)`
    );
    glowGradient.addColorStop(1, "hsla(0, 0%, 0%, 0)");
  } else {
    // 浅色主题：使用更亮的光晕
    glowGradient.addColorStop(0, `hsla(${215 + offset1 * 15}, 30%, 85%, 0.12)`);
    glowGradient.addColorStop(
      0.5,
      `hsla(${235 + offset2 * 12}, 25%, 80%, 0.06)`
    );
    glowGradient.addColorStop(1, "hsla(0, 0%, 100%, 0)");
  }

  ctx.fillStyle = glowGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.restore();
};

onMounted(() => {
  const cleanup = initCanvas();

  onUnmounted(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    if (cleanup) {
      cleanup();
    }
  });
});
</script>

<template>
  <canvas
    ref="canvasRef"
    class="river-background"
    :style="{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1,
      pointerEvents: 'none',
    }"
  />
</template>

<style scoped>
.river-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}
</style>
