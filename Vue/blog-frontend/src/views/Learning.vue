<!-- src/views/Learning.vue -->
<template>
  <div class="directory">
    <button @click="showDirectory = !showDirectory">☰ 目录</button>

    <!-- 左侧目录面板 -->
    <div class="directory-panel" v-if="showDirectory">
      <button @click="showDirectory = !showDirectory">☰ 目录</button>
      <h3>文章 / 项目</h3>
      <ul>
        <li
          v-for="item in menuItems"
          :key="item.id"
          @mouseenter="item.showSub = true"
          @mouseleave="item.showSub = false"
          class="menu-item"
        >
          {{ item.title }}
          <ul v-if="item.subItems && item.showSub" class="sub-menu">
            <li v-for="sub in item.subItems" :key="sub.id" @click="switchComponent(sub)">
              {{ sub.title }}
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <!-- 右侧动态内容区域 -->
    <div class="content-panel">
      <component :is="currentComponent" v-bind="currentProps" />
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
// 导入所有可能用到的子组件
import tableApp from '../components/Learning/VueProject/VueTest3/tableApp.vue'
import ToDoApp from '../components/Learning/VueProject/VueTest2/ToDoApp.vue'
import VueTest1 from '../components/Learning/VueProject/VueTest1/VueTest1.vue'
import SpringBoot1 from '../components/Learning/SpringBootLearing/SpringBoot1.vue'
// 预留其他组件占位，可以后续按需导入
const EmptyComponent = { template: '<div class="placeholder-content">请从左侧选择要查看的内容</div>' }

// 定义菜单数据结构，每个子项增加 component 和 props 字段
const menuItems = ref([
  {
    id: 1,
    title: 'Vue前端开发',
    showSub: false,
    subItems: [
      { id: 11, title: 'Vue项目之学习计划表', component: VueTest1, props: {} },
      { id: 12, title: 'ToDoList', component: ToDoApp, props: {} },
      { id: 13, title: '商品表格组件', component: tableApp, props: {} }
    ]
  },
  {
    id: 2,
    title: 'Spring Boot',
    showSub: false,
    subItems: [
      { id: 21, title: 'Spring Boot 学习第一节', component: SpringBoot1, props: {} },
      { id: 22, title: '什么都木有', component: EmptyComponent, props: { message: 'Spring Boot 项目待更新' } }
    ]
  }
  // 其他菜单同理...
])

// 当前显示的组件和属性
const currentComponent = shallowRef(EmptyComponent)
const currentProps = ref({})

// 切换组件的方法
function switchComponent(subItem) {
  currentComponent.value = subItem.component || EmptyComponent
  currentProps.value = subItem.props || {}
  // 可选：关闭左侧面板（移动端体验）
  // showDirectory.value = false
}

// 默认显示占位
switchComponent({ component: EmptyComponent, props: { message: '欢迎来到学习中心' } })

// 控制左侧面板显示隐藏
const showDirectory = ref(false)
</script>

<style scoped>
/* 保留原有样式，适当调整右侧面板高度等 */
.directory { position: relative; }  
.directory-panel {
  position: fixed; left: 0; top: 80px; width: 210px;
  background: #f9f9f9; border: 1px solid #ddd; padding: 15px; z-index: 100;
}
.content-panel {
  margin-left: 20px; padding: 20px; border: 1px solid #eee;
  min-height: 500px;
}
.menu-item {
  position: relative; cursor: pointer;margin: 10px 0; 
  color: blue; text-decoration: underline;
}
.sub-menu {
  position: absolute; left: 65%; top: 0; background: white;
  border: 1px solid #ccc; padding: 8px 0; min-width: 180px;
  box-shadow: 2px 2px 8px rgba(0,0,0,0.1); z-index: 200;
}
.sub-menu li {
  padding: 6px 12px; list-style: none; cursor: pointer;
}
.sub-menu li:hover { background: #f0f0f0; }
.placeholder-content {
  color: #666; font-style: italic; padding: 20px; text-align: center;
}
</style>