<script setup>
import Carousel from '@/components/Home/Carousel.vue';
import ContentPanel from '@/components/Home/ContentPanel.vue';

import axios from 'axios';

const fetchHello = async () => {
  try {
    const response = await axios.get('http://localhost:8080/hello');
    alert(response.data);    /* 显示后端返回的字符串 */
  } catch (error) {
    console.error(error);
    alert('调用失败');
  }
};
</script>

<template>
    <div>
        <Carousel />
        <ContentPanel />
        <a href="https://space.bilibili.com/498997286" target="_blank">我的B站主页</a>
         |
        <button class="api-btn" @click="fetchHello">调用后端</button>
    </div>
</template>

<style>
    .carousel,
    .content-panel1{
      margin-bottom: 10px; /* 下边距 */
    }
    .api-btn {
      margin-top: 20px;
      padding: 8px 16px;
      background-color: #42b983;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
</style>