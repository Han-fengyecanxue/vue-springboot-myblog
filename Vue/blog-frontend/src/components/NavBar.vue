<template>
  <div class="nav-bar">
    <ul>
      <li><router-link to="/">首页</router-link></li>
      <li><router-link to="/learning">学习</router-link></li>
      <li><router-link to="/hobbies">爱好</router-link></li>
      <li><router-link to="/aboutme">关于我</router-link></li>
    </ul>
  </div>
</template>

<style scoped>
.nav-bar {
  position: fixed;
  top: 60px;
  left: 0;
  width: 100%;
  height: 40px;
  background-color: #f8f8f8;
  padding: 0 20px;        /* 改为左右内边距，上下由 flex 控制 */
  z-index: 999;
  box-sizing: border-box;
  /* 关键：让 ul 在垂直方向居中 */
  display: flex;
  align-items: center;
}

.nav-bar ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;            /* 占满父容器宽度 */
  height: 100%;           /* 继承父容器高度，便于内部 li 垂直居中 */
}

.nav-bar li {
  flex: 1;                /* 均分宽度 */
  text-align: center;
  /* 让 li 内部也使用 flex 居中 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-bar a {
  text-decoration: none;
  color: #333;
  /* 让链接填满整个 li，同时保持文字居中 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.nav-bar a:hover {
  color: #22dbdb;
}
</style>
