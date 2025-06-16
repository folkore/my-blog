<script setup>
// 关于页面组件
</script>

<template>
  <div class="about container">
    <header class="page-header">
      <h1>关于我</h1>
      <p class="subtitle">专注用户体验与前端技术创新</p>
    </header>

    <section class="about-content">
      <div class="profile-section">
        <div class="profile-image">
          <!-- 使用占位图像 -->
          <img src="https://picsum.photos/id/1005/400/400" alt="个人照片" />
        </div>

        <div class="profile-info">
          <h2>你好，我是前端开发工程师</h2>
          <p class="bio">
            我是一名专注于前端开发的工程师，擅长打造富有创意和互动性的用户界面。我热衷于使用现代前端技术栈（Vue、React等）创建流畅、响应式的Web应用，并持续关注前端领域的最新发展。
          </p>
          <div class="social-links">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              >GitHub</a
            >
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              >LinkedIn</a
            >
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              >Twitter</a
            >
          </div>
        </div>
      </div>

      <div class="about-text">
        <h3>我的故事</h3>
        <p>
          我的前端开发之旅始于对用户界面设计的热爱。多年来，我专注于提升用户体验，精进JavaScript、CSS和各类前端框架技能，努力在视觉设计和技术实现之间找到完美平衡。
        </p>
        <p>
          作为一名前端工程师，我深知性能优化和代码质量的重要性。我追求编写优雅、可维护的代码，同时致力于创造流畅、直观的用户体验。我特别关注Web性能优化、响应式设计和现代化构建工具的应用。
        </p>

        <h3>技能与专长</h3>
        <div class="skills">
          <div class="skill-category">
            <h4>核心技能</h4>
            <ul class="skill-list">
              <li>Vue.js (Vue 2 & Vue 3)</li>
              <li>React & React生态</li>
              <li>JavaScript (ES6+)</li>
              <li>TypeScript</li>
              <li>HTML5 & CSS3</li>
              <li>前端性能优化</li>
            </ul>
          </div>

          <div class="skill-category">
            <h4>UI/UX开发</h4>
            <ul class="skill-list">
              <li>响应式设计</li>
              <li>CSS预处理器</li>
              <li>动画与交互</li>
              <li>组件库开发</li>
              <li>设计系统实现</li>
              <li>微前端架构</li>
            </ul>
          </div>

          <div class="skill-category">
            <h4>开发工具</h4>
            <ul class="skill-list">
              <li>Webpack & Vite</li>
              <li>Git 工作流</li>
              <li>Jest & Vitest</li>
              <li>ESLint & Prettier</li>
              <li>前端CI/CD</li>
              <li>浏览器调试工具</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="contact-cta">
      <h3>寻找前端开发合作？</h3>
      <p>
        如果你正在寻找一位经验丰富的前端工程师来协助你的项目，我很乐意与你讨论合作可能。无论是开发新产品还是优化现有项目，我都可以提供专业的技术支持。
      </p>
      <router-link to="/contact" class="button primary-button"
        >联系我</router-link
      >
    </section>
  </div>
</template>

<style scoped>
/* 基础样式 */
.about {
  padding: 60px 0;
  opacity: 0;
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-header h1 {
  font-size: 48px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 16px;
  position: relative;
  display: inline-block;
}

.page-header h1::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: var(--color-link);
  border-radius: 2px;
}

.subtitle {
  font-size: 20px;
  color: var(--color-secondary-text);
  opacity: 0;
  animation: slideUp 0.6s ease-out 0.3s forwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 个人信息部分 */
.profile-section {
  display: flex;
  gap: 40px;
  margin-bottom: 60px;
  align-items: center;
  opacity: 0;
  animation: fadeIn 0.8s ease-out 0.4s forwards;
}

.profile-image {
  flex: 0 0 300px;
  position: relative;
  overflow: hidden;
}

.profile-image::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(var(--color-link-rgb), 0.2),
    transparent
  );
  z-index: 1;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.profile-image:hover::before {
  background: linear-gradient(
    45deg,
    rgba(var(--color-link-rgb), 0.1),
    transparent
  );
}

.profile-image img {
  width: 100%;
  height: auto;
  border-radius: 16px;
  box-shadow: 0 10px 30px var(--color-shadow);
  transition: transform 0.3s ease;
}

.profile-image:hover img {
  transform: scale(1.02);
}

.profile-info {
  flex: 1;
}

.profile-info h2 {
  font-size: 32px;
  margin-bottom: 20px;
  color: var(--color-text);
  opacity: 0;
  animation: slideUp 0.6s ease-out 0.6s forwards;
}

.bio {
  font-size: 18px;
  line-height: 1.6;
  color: var(--color-secondary-text);
  margin-bottom: 24px;
  opacity: 0;
  animation: slideUp 0.6s ease-out 0.8s forwards;
}

.social-links {
  display: flex;
  gap: 16px;
  opacity: 0;
  animation: slideUp 0.6s ease-out 1s forwards;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 24px;
  background-color: var(--color-background);
  color: var(--color-text);
  border-radius: 980px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid var(--color-border);
  font-weight: 500;
  min-width: 100px;
}

.social-link:hover {
  background-color: var(--color-link);
  color: var(--text-primary);
  transform: translateY(-2px);
  border-color: var(--color-link);
  box-shadow: 0 4px 12px rgba(var(--color-link-rgb), 0.2);
  font-weight: 600;
}

/* 关于文本部分 */
.about-text {
  margin-bottom: 60px;
  opacity: 0;
  animation: fadeIn 0.8s ease-out 0.8s forwards;
}

.about-text h3 {
  font-size: 24px;
  color: var(--color-text);
  margin-bottom: 20px;
  margin-top: 40px;
  position: relative;
  padding-left: 16px;
}

.about-text h3::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: var(--color-link);
  border-radius: 2px;
}

.about-text p {
  font-size: 18px;
  line-height: 1.6;
  color: var(--color-secondary-text);
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.about-text p:hover {
  transform: translateX(8px);
}

/* 技能部分 */
.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-top: 24px;
}

.skill-category {
  flex: 1;
  min-width: 200px;
  background: var(--color-secondary-background);
  padding: 24px;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.skill-category:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 30px var(--color-shadow);
}

.skill-category h4 {
  font-size: 18px;
  color: var(--color-text);
  margin-bottom: 16px;
  font-weight: 500;
  position: relative;
  padding-bottom: 12px;
}

.skill-category h4::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background: var(--color-link);
  border-radius: 1px;
}

.skill-list {
  list-style: none;
  padding: 0;
}

.skill-list li {
  font-size: 16px;
  color: var(--color-secondary-text);
  margin-bottom: 12px;
  position: relative;
  padding-left: 24px;
  transition: all 0.3s ease;
}

.skill-list li:hover {
  color: var(--color-link);
  transform: translateX(8px);
}

.skill-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--color-link);
  font-size: 20px;
  line-height: 1;
}

/* 联系CTA部分 */
.contact-cta {
  background-color: var(--color-secondary-background);
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: 0;
  animation: fadeIn 0.8s ease-out 1s forwards;
}

.contact-cta h3 {
  font-size: 24px;
  color: var(--color-text);
  margin-bottom: 16px;
}

.contact-cta p {
  font-size: 18px;
  color: var(--color-secondary-text);
  margin-bottom: 24px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 32px;
  background: var(--color-link);
  color: var(--text-primary);
  border-radius: 980px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid var(--color-link);
  min-width: 120px;
}

.primary-button:hover {
  background-color: var(--color-background);
  color: var(--color-link);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(var(--color-link-rgb), 0.2);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .profile-section {
    flex-direction: column;
    text-align: center;
  }

  .profile-image {
    margin-bottom: 24px;
  }

  .social-links {
    justify-content: center;
  }

  .skills {
    flex-direction: column;
  }

  .about-text h3::before {
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 4px;
    top: auto;
    bottom: -8px;
  }

  .about-text h3 {
    padding-left: 0;
    padding-bottom: 20px;
    text-align: center;
  }

  .skill-category:hover {
    transform: translateY(-4px);
  }

  .skill-list li:hover {
    transform: translateX(4px);
  }
}
</style>
