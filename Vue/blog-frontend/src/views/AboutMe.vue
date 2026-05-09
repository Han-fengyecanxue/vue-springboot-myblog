<!-- src/views/AboutMe.vue -->
<template>
  <div>
    <h2>关于我</h2>
    <p>MBTI类型:ISFP</p>
    <div class="carousel">
        <img src="/images/aboutme/ISFP-report.png" alt="ISFP-report"></img>
    </div>
  </div>
</template>

<style scoped>
.carousel {
  width: 100%;           /* 轮播图容器宽度占满父级 */
  overflow: hidden;      /* 防止溢出 */
}

.carousel img {
  width: 80%;           /* 图片宽度撑满容器 */
  height: auto;          /* 高度自动等比缩放 */
  display: block;        /* 去掉图片下方的空隙 */
  margin: 0 auto;        /* 图片水平居中 */
}
</style>