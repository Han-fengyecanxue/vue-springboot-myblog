
<script setup>
import HeaderBar from './components/HeaderBar.vue';
import NavBar from './components/NavBar.vue';
</script>

<template>
  <!-- 首页组件 -->
  <div class="container">
    <HeaderBar />
    <NavBar />
    <router-view />  <!-- 路由出口，显示当前路由对应的组件 -->
  </div>

</template>

<style>
    /* 全局样式 */
    .container {
      width: 90vw;
      max-width: 1200px; /* 最大宽度，适应大屏幕 */
      padding: 0 10px;    /* 内边距，防止内容贴边 */
      box-sizing: border-box; /* 让 padding 包含在宽度内（推荐） */
      margin-top: 100px; /* 给顶部留出空间，避免被标题栏遮挡 */
    }

</style>
