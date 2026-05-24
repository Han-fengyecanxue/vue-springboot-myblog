<template>
  <div class="widebox">
    <div class="carousel" @mouseenter="stopAutoPlay" @mouseleave="startAutoPlay">
      <!-- 图片展示区 -->
      <div class="image-container">
        <img 
          :src="images[currentIndex]" 
          :alt="`Slide ${currentIndex + 1}`"
          class="carousel-image"
        />
      </div>

      <!-- 上一张按钮（多于1张时显示） -->
      <button 
        v-if="totalImages > 1" 
        class="carousel-btn prev" 
        @click="prev"
        aria-label="上一张"
      >
        ❮
      </button>

      <!-- 下一张按钮（多于1张时显示） -->
      <button 
        v-if="totalImages > 1" 
        class="carousel-btn next" 
        @click="next"
        aria-label="下一张"
      >
        ❯
      </button>

      <!-- 指示点（多于1张时显示） -->
      <div v-if="totalImages > 1" class="indicators">
        <span 
          v-for="(_, index) in images" 
          :key="index"
          :class="['indicator-dot', { active: index === currentIndex }]"
          @click="goTo(index)"
        ></span>
      </div>
    </div>

    <!-- 右侧内容区域 -->
    <div class="content">
      <h3>欢迎来到我的博客！</h3>
      <p>这是一个使用Vue.js构建的博客网站。</p>
      <p>在这里你可以找到我的最新文章、项目和想法。</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// 接收图片列表（支持图片URL字符串数组）
const props = defineProps({
  images: {
    type: Array,
    default: () => [
      '/images/photo1.jpg',
      '/images/views/石臼湖 (1).jpg',   // 石臼湖1
      '/images/views/石臼湖 (2).jpg',    // 石臼湖2
      '/images/views/石臼湖 (3).jpg',    // 石臼湖3
    ]
  },
  autoplayInterval: {
    type: Number,
    default: 3000  // 自动轮播间隔（毫秒）
  },
  autoplay: {
    type: Boolean,
    default: true   // 是否自动轮播
  }
})

const currentIndex = ref(0)
const timer = ref(null)
const totalImages = computed(() => props.images.length)

// 停止自动轮播
const stopAutoPlay = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

// 启动自动轮播（仅在多图且autoplay开启时生效）
const startAutoPlay = () => {
  if (!props.autoplay || totalImages.value <= 1) return
  stopAutoPlay()
  timer.value = setInterval(() => {
    next()
  }, props.autoplayInterval)
}

// 切换图片时重启自动轮播定时器（保持节奏）
const resetAutoPlay = () => {
  if (props.autoplay && totalImages.value > 1) {
    startAutoPlay()
  }
}

// 上一张
const prev = () => {
  if (totalImages.value <= 1) return
  currentIndex.value = (currentIndex.value - 1 + totalImages.value) % totalImages.value
  resetAutoPlay()
}

// 下一张
const next = () => {
  if (totalImages.value <= 1) return
  currentIndex.value = (currentIndex.value + 1) % totalImages.value
  resetAutoPlay()
}

// 跳转到指定图片
const goTo = (index) => {
  if (totalImages.value <= 1 || index === currentIndex.value) return
  currentIndex.value = index
  resetAutoPlay()
}

// 监听图片数组变化，重置索引并重启轮播
watch(() => props.images, (newVal) => {
  if (newVal.length === 0) return
  currentIndex.value = 0
  resetAutoPlay()
}, { deep: true })

// 监听总图片数量变化，避免越界
watch(totalImages, (newLen) => {
  if (newLen === 0) {
    stopAutoPlay()
  } else if (currentIndex.value >= newLen) {
    currentIndex.value = 0
    resetAutoPlay()
  }
})

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.widebox {
  display: grid;  
  grid-template-columns: 3fr 2fr; /* 两列布局，平均分配宽度 */
  gap: 20px; /* 列间距 */
  /* 下边距 */
  margin-bottom: 20px;
}

/* 小屏幕适配 */
@media (max-width: 768px) {
  .widebox {
    grid-template-columns: 1fr;
    gap: 16px; /* 可视情况缩小间距 */
  }

  .content {
    margin: 0; /* 移除左右 margin，让内容撑满 */
  }
}

.carousel {
  position: relative;
  width: 100%;  /* 宽度自适应 */
  margin-top: 10px; /* 顶部留出10px */
  overflow: hidden;
  border-radius: 8px;
  background-color: #f0f0f0;
  aspect-ratio: 4 / 3; /* 固定宽高比，避免页面抖动 */
}

.content {
  background-color: #ffffff; /* 背景颜色 */
  margin: 10px;
  padding: 20px;         /* 内边距 */
  border-radius: 8px;    /* 圆角 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  /* 上下居中 */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

h3 {
  text-indent: 5px;
  text-align: center;
}

p {
  text-indent: 2em; /* 首行缩进 */
}

.image-container {
  width: 100%;
  height: 100%;
}

.carousel-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover; /* 保证图片填充容器且不变形 */
}

/* 左右按钮样式 */
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 24px;
  font-weight: bold;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  z-index: 10;
}

.carousel-btn:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.prev {
  left: 16px;
}

.next {
  right: 16px;
}

/* 指示点容器 */
.indicators {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

/* 指示点样式 */
.indicator-dot {
  width: 10px;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator-dot.active {
  background-color: #fff;
  transform: scale(1.2);
}

.indicator-dot:hover {
  background-color: rgba(255, 255, 255, 0.9);
}
</style>