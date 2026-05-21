<template>
  <table class="table table-striped table-bordered">
    <!-- 表格标题区域 -->
    <thead>
      <tr>
        <slot name="header"></slot>
      </tr>
    </thead>
    <!-- 表格主体区域 -->
    <tbody>
      <tr v-for="(item, index) in goodsList" :key="item.id">
        <slot name="body" :row="item" :index="index"></slot>
      </tr>
    </tbody>
  </table>
</template>
 
<script setup>
//props 用于接收父组件传递的数据
const props = defineProps({
  goodsList: {
    type: Array,  //  数据类型为数组
    required: true,  // 必填项
    default: []  // 默认值为空数组
  }
})
</script>
