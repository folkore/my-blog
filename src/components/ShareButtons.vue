<script setup>
import { computed } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
});

// 获取当前页面URL（如果未提供）
const pageUrl = computed(() => props.url || window.location.href);

// 编码分享内容
const encodedUrl = computed(() => encodeURIComponent(pageUrl.value));
const encodedTitle = computed(() => encodeURIComponent(props.title));
const encodedDescription = computed(() =>
  encodeURIComponent(props.description)
);

// 分享链接
const shareLinks = computed(() => ({
  twitter: `https://twitter.com/intent/tweet?url=${encodedUrl.value}&text=${encodedTitle.value}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl.value}`,
  linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl.value}`,
  weibo: `https://service.weibo.com/share/share.php?url=${encodedUrl.value}&title=${encodedTitle.value}`,
  wechat: "#wechat-qrcode",
}));

// 复制链接到剪贴板
const copyLink = () => {
  navigator.clipboard
    .writeText(pageUrl.value)
    .then(() => {
      alert("链接已复制到剪贴板");
    })
    .catch((err) => {
      console.error("无法复制链接: ", err);
    });
};

// 打开分享窗口
const openShareWindow = (url) => {
  if (url === "#wechat-qrcode") {
    // 显示微信二维码
    alert("请截图分享到微信");
    return;
  }

  window.open(
    url,
    "分享",
    "width=600,height=400,location=0,menubar=0,toolbar=0,status=0,scrollbars=1,resizable=1"
  );
};
</script>

<template>
  <div class="share-buttons">
    <h4>分享文章</h4>
    <div class="share-icons">
      <!-- Twitter -->
      <button
        class="share-button twitter"
        @click="openShareWindow(shareLinks.twitter)"
        title="分享到Twitter"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
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
      </button>

      <!-- Facebook -->
      <button
        class="share-button facebook"
        @click="openShareWindow(shareLinks.facebook)"
        title="分享到Facebook"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
          ></path>
        </svg>
      </button>

      <!-- LinkedIn -->
      <button
        class="share-button linkedin"
        @click="openShareWindow(shareLinks.linkedin)"
        title="分享到LinkedIn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
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
      </button>

      <!-- 微博 -->
      <button
        class="share-button weibo"
        @click="openShareWindow(shareLinks.weibo)"
        title="分享到微博"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 1024 1024"
          fill="currentColor"
        >
          <path
            d="M851.4 590.193c-22.196-66.233-90.385-90.422-105.912-91.863-15.523-1.442-29.593-9.94-19.295-27.505 10.302-17.566 29.304-68.684-7.248-104.681-36.564-36.14-116.512-22.462-173.094 0.866-56.434 23.327-53.39 7.055-51.65-8.925 1.89-16.848 32.355-111.02-60.791-122.395C311.395 220.86 154.85 370.754 99.572 457.15 16 587.607 29.208 675.873 29.208 675.873h0.58c10.009 121.819 190.787 218.869 412.328 218.869 190.5 0 350.961-71.853 398.402-169.478 0 0 0.143-0.433 0.575-1.156 4.938-10.506 8.71-21.168 11.035-32.254 6.668-26.205 11.755-64.215-0.728-101.66z m-436.7 251.27c-157.71 0-285.674-84.095-285.674-187.768 0-103.671 127.82-187.76 285.674-187.76 157.705 0 285.673 84.089 285.673 187.76 0 103.815-127.968 187.768-285.673 187.768z"
          />
          <path
            d="M803.096 425.327c2.896 1.298 5.945 1.869 8.994 1.869 8.993 0 17.7-5.328 21.323-14.112 5.95-13.964 8.993-28.793 8.993-44.205 0-62.488-51.208-113.321-114.181-113.321-15.379 0-30.32 3.022-44.396 8.926-11.755 4.896-17.263 18.432-12.335 30.24 4.933 11.662 18.572 17.134 30.465 12.238 8.419-3.46 17.268-5.33 26.41-5.33 37.431 0 67.752 30.241 67.752 67.247 0 9.068-1.735 17.857-5.369 26.202a22.832 22.832 0 0 0 12.335 30.236l0.01 0.01z"
          />
          <path
            d="M726.922 114.157c-25.969 0-51.65 3.744-76.315 10.942-18.423 5.472-28.868 24.622-23.5 42.91 5.509 18.29 24.804 28.657 43.237 23.329a201.888 201.888 0 0 1 56.578-8.064c109.253 0 198.189 88.271 198.189 196.696 0 19.436-2.905 38.729-8.419 57.16-5.508 18.289 4.79 37.588 23.212 43.053 3.342 1.014 6.817 1.442 10.159 1.442 14.943 0 28.725-9.648 33.37-24.48 7.547-24.906 11.462-50.826 11.462-77.175-0.143-146.588-120.278-265.813-267.973-265.813z"
          />
          <path
            d="M388.294 534.47c-84.151 0-152.34 59.178-152.34 132.334 0 73.141 68.189 132.328 152.34 132.328 84.148 0 152.337-59.182 152.337-132.328 0-73.15-68.19-132.334-152.337-132.334zM338.53 752.763c-29.454 0-53.39-23.755-53.39-52.987 0-29.228 23.941-52.989 53.39-52.989 29.453 0 53.39 23.76 53.39 52.989 0 29.227-23.937 52.987-53.39 52.987z m99.82-95.465c-6.382 11.086-19.296 15.696-28.726 10.219-9.43-5.323-11.75-18.717-5.37-29.803 6.386-11.09 19.297-15.7 28.725-10.224 9.43 5.472 11.755 18.864 5.37 29.808z"
          />
        </svg>
      </button>

      <!-- 微信 -->
      <button
        class="share-button wechat"
        @click="openShareWindow(shareLinks.wechat)"
        title="分享到微信"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 1024 1024"
          fill="currentColor"
        >
          <path
            d="M692.677 347.838c11.392 0 22.785 0.853 34.177 2.133-30.72-143.36-183.808-249.813-358.4-249.813-194.987 0-354.133 133.12-354.133 300.8 0 97.28 53.333 177.067 142.08 238.933l-35.413 106.667 123.733-61.867c44.373 8.533 79.787 17.493 124.16 17.493 11.093 0 22.187-0.427 33.28-1.28a267.947 267.947 0 0 1-11.093-76.8c-0.427-159.147 136.533-276.48 301.653-276.48z m-190.293-97.28c26.453 0 44.373 17.493 44.373 44.373 0 26.453-17.92 44.373-44.373 44.373-26.453 0-53.333-17.92-53.333-44.373 0-26.88 26.88-44.373 53.333-44.373z m-248.96 88.747c-26.453 0-53.333-17.92-53.333-44.373 0-26.88 26.88-44.373 53.333-44.373 26.453 0 44.373 17.493 44.373 44.373 0 26.453-17.92 44.373-44.373 44.373z"
          />
          <path
            d="M1010.347 629.331c0-141.653-142.08-257.707-301.653-257.707-168.96 0-302.08 116.053-302.08 257.707 0 141.653 133.12 257.707 302.08 257.707 35.413 0 71.253-8.96 106.667-17.92l97.28 53.333-26.88-88.747c71.68-53.76 124.587-124.587 124.587-204.373z m-399.36-44.373c-17.92 0-35.84-17.92-35.84-35.84 0-17.92 17.92-35.84 35.84-35.84 26.88 0 44.373 17.92 44.373 35.84 0 17.92-17.493 35.84-44.373 35.84z m195.413 0c-17.92 0-35.413-17.92-35.413-35.84 0-17.92 17.493-35.84 35.413-35.84 26.453 0 44.373 17.92 44.373 35.84 0 17.92-17.92 35.84-44.373 35.84z"
          />
        </svg>
      </button>

      <!-- 复制链接 -->
      <button class="share-button copy" @click="copyLink" title="复制链接">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path
            d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.share-buttons {
  margin: 2rem 0;
}

.share-buttons h4 {
  margin-bottom: 0.8rem;
  font-size: 1rem;
  color: var(--text-primary);
}

.share-icons {
  display: flex;
  gap: 0.8rem;
}

.share-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
}

.share-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.twitter {
  background-color: #1da1f2;
}

.facebook {
  background-color: #4267b2;
}

.linkedin {
  background-color: #0077b5;
}

.weibo {
  background-color: #e6162d;
}

.wechat {
  background-color: #07c160;
}

.copy {
  background-color: #6c757d;
}
</style>
