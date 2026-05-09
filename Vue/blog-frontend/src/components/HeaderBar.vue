//标题栏
<template>
    <div class="header-bar">
        <h1 class="title">枫叶あ残雪的博客</h1>
        <button class="auto-btn" @click="showLoginDialog = true">登录/注册</button>

        <!-- 登录/注册对话框 -->
        <loginRegisterDialog v-model:visible="showLoginDialog" />
    </div>
</template>

<script setup>
import LoginRegisterDialog from './LoginRegisterDialog.vue';
import { ref } from 'vue';

const showLoginDialog = ref(false);
</script>

<style scoped>
.header-bar {
  position: fixed;        /* 固定定位 */
  top: 0;                 /* 距离顶部 0 */
  left: 0;                /* 距离左侧 0 */
  width: 100%;            /* 占满宽度 */
  display: flex;          
  align-items: center;    /* 垂直居中 */
  justify-content: center;  /* 水平居中 */
  background-color: #22dbdb;  
  color: white; /* 文字颜色 */
  padding: 0 30px;  /* 左右内边距 30px，确保按钮不会贴边 */
  height: 60px; /* 固定高度 */
  z-index: 1000;          /* 确保在其他内容之上 */
  box-sizing: border-box; /* 让 padding 包含在宽度内（推荐） */
}

.title {
  flex: 1;                   /* 占满剩余空间，推动按钮靠右 */
  margin: 0;                  /* 去掉默认的外边距 */
  font-size: 24px;            /* 标题字体大小 */
}

.auto-btn {
  position: absolute;          /* 脱离文档流，固定在右侧 */
  right: 30px;                 /* 距离右侧 30px */
  background-color: transparent;
  color: white;
  border: 2px solid white;
  border-radius: 4px; /* 圆角 */
  padding: 8px 16px;  /* 内边距 */
  cursor: pointer;
}

.auto-btn:hover {
  background-color: white;
  color: #22dbdb;
}
</style>