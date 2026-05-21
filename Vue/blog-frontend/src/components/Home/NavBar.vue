<template>
  <div class="nav-container">
    <!-- 左圆右方按钮（常驻，带文字） -->
    <button
      class="nav-toggle"
      :class="{ 'is-open': isOpen }"
      @click="isOpen = !isOpen"
      title="导航菜单"
    >
      <span v-if="!isOpen" class="toggle-text">导<br>航<br>栏</span>
      <span v-else class="toggle-text">✕</span>
    </button>

    <!-- 右侧垂直导航栏 -->
    <nav class="nav-bar" :class="{ 'nav-open': isOpen }">
      <ul>
        <li><router-link to="/" @click="closeNav">首页</router-link></li>
        <li><router-link to="/learning" @click="closeNav">学习</router-link></li>
        <li><router-link to="/hobbies" @click="closeNav">爱好</router-link></li>
        <li><router-link to="/aboutme" @click="closeNav">关于我</router-link></li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

const closeNav = () => {
  isOpen.value = false
}
</script>

<style scoped>
/* 外层容器 */
.nav-container {
  position: fixed;
  right: 0;
  top: 62px;
  transform: translateY(-50%);
  z-index: 1000;
  pointer-events: none;
}

/* 左圆右方按钮 */
.nav-toggle {
  position: fixed;
  right: 0;
  top: 0;
  width: 44px;
  height: 70px;               /* 加高以容纳两个字 */
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-right: none;
  border-radius: 50% 0 0 50% / 30% 0 0 30%; /* 左圆右方，高度方向也稍微圆润 */
  cursor: pointer;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              background 0.3s;
  pointer-events: auto;
  padding: 0;
}

.nav-toggle:hover {
  background: rgba(0, 0, 0, 0.75);
}

/* 打开时按钮移动到导航栏左侧 */
.nav-toggle.is-open {
  right: 180px;
}

/* 按钮文字 */
.toggle-text {
  color: white;
  font-size: 16px;
  font-weight: bold;
  line-height: 1.4;
  text-align: center;
  user-select: none;
  transition: transform 0.2s;
}

/* 导航栏 */
.nav-bar {
  position: absolute;
  right: 0;
  top: 0;
  width: 180px;
  background: #f8f8f8;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
  transform: translateX(100%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  padding: 20px 0;
  box-sizing: border-box;
  pointer-events: auto;
}

.nav-bar.nav-open {
  transform: translateX(0);
}

.nav-bar ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.nav-bar li {
  text-align: center;
}

.nav-bar a {
  display: block;
  padding: 16px 20px;
  text-decoration: none;
  color: #333;
  transition: background 0.2s, color 0.2s;
  border-bottom: 1px solid #eee;
}

.nav-bar a:hover {
  color: #22dbdb;
  background: rgba(34, 219, 219, 0.1);
}

.nav-bar a.router-link-active {
  color: #22dbdb;
  font-weight: bold;
  background: rgba(34, 219, 219, 0.05);
}
</style>