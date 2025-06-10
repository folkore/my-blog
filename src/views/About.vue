<script setup>
// 关于页面组件
</script>

<template>
  <div class="about container">
    <header class="page-header">
      <h1>关于我</h1>
      <p class="subtitle">了解我的故事、技能和经历</p>
    </header>

    <section class="about-content">
      <div class="profile-section">
        <div class="profile-image">
          <!-- 使用占位图像 -->
          <img src="https://picsum.photos/id/1005/400/400" alt="个人照片" />
        </div>

        <div class="profile-info">
          <h2>你好，我是开发者</h2>
          <p class="bio">
            我是一名充满热情的全栈开发者，专注于创建美观、高效且用户友好的Web应用。我热爱解决复杂问题并不断学习新技术。
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
          我的开发之旅始于几年前，当时我对如何创建能够解决问题的应用程序产生了浓厚的兴趣。从那时起，我一直致力于提升我的技能，学习最新的技术和最佳实践。
        </p>
        <p>
          我相信，技术不仅仅是关于代码，更是关于创造能够产生积极影响的解决方案。我专注于编写干净、可维护的代码，同时不忘记最终用户体验的重要性。
        </p>

        <h3>技能与专长</h3>
        <div class="skills">
          <div class="skill-category">
            <h4>前端开发</h4>
            <ul class="skill-list">
              <li>Vue.js (Vue 2 & Vue 3)</li>
              <li>React</li>
              <li>JavaScript (ES6+)</li>
              <li>TypeScript</li>
              <li>HTML5 & CSS3</li>
              <li>响应式设计</li>
            </ul>
          </div>

          <div class="skill-category">
            <h4>后端开发</h4>
            <ul class="skill-list">
              <li>Node.js</li>
              <li>Express</li>
              <li>MongoDB</li>
              <li>PostgreSQL</li>
              <li>RESTful API 设计</li>
              <li>GraphQL</li>
            </ul>
          </div>

          <div class="skill-category">
            <h4>开发工具</h4>
            <ul class="skill-list">
              <li>Git & GitHub</li>
              <li>Docker</li>
              <li>Webpack</li>
              <li>Vite</li>
              <li>Jest</li>
              <li>CI/CD</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="contact-cta">
      <h3>想要合作？</h3>
      <p>
        我始终对新项目和合作机会持开放态度。如果你有项目想要讨论，请随时联系我。
      </p>
      <router-link to="/contact" class="button primary-button"
        >联系我</router-link
      >
    </section>
  </div>
</template>

<style scoped>
.about {
  padding: 60px 0;
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
}

.subtitle {
  font-size: 20px;
  color: var(--color-secondary-text);
}

/* 个人信息部分 */
.profile-section {
  display: flex;
  gap: 40px;
  margin-bottom: 60px;
  align-items: center;
}

.profile-image {
  flex: 0 0 300px;
}

.profile-image img {
  width: 100%;
  height: auto;
  border-radius: 16px;
  box-shadow: 0 10px 30px var(--color-shadow);
}

.profile-info {
  flex: 1;
}

.profile-info h2 {
  font-size: 32px;
  margin-bottom: 20px;
  color: var(--color-text);
}

.bio {
  font-size: 18px;
  line-height: 1.6;
  color: var(--color-secondary-text);
  margin-bottom: 24px;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-link {
  display: inline-block;
  padding: 8px 16px;
  background-color: var(--color-secondary-background);
  color: var(--color-text);
  border-radius: 980px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background-color: var(--color-link);
  color: white;
  transform: translateY(-2px);
}

/* 关于文本部分 */
.about-text {
  margin-bottom: 60px;
}

.about-text h3 {
  font-size: 24px;
  color: var(--color-text);
  margin-bottom: 20px;
  margin-top: 40px;
}

.about-text p {
  font-size: 18px;
  line-height: 1.6;
  color: var(--color-secondary-text);
  margin-bottom: 20px;
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
}

.skill-category h4 {
  font-size: 18px;
  color: var(--color-text);
  margin-bottom: 16px;
  font-weight: 500;
}

.skill-list {
  list-style: none;
  padding: 0;
}

.skill-list li {
  font-size: 16px;
  color: var(--color-secondary-text);
  margin-bottom: 8px;
  position: relative;
  padding-left: 24px;
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
  display: inline-block;
  padding: 12px 24px;
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
}
</style>
