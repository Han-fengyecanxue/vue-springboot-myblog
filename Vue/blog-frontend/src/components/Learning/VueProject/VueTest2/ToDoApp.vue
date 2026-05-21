<script setup>
import ToDoHeader from './ToDoHeader.vue';
import ToDoMain from './ToDoMain.vue';
import ToDoFooter from './ToDoFooter.vue';

import { ref,computed } from 'vue';
const list = ref([
  { id :1,name:'晨练', done: false },
  { id :2,name:'练书法', done: true },
])

const addTodo = (name) => {
  list.value.push({
    name,done:false, id:~~(Math.random()*1000000)
  })
}

const delTodo = (id) => {
  list.value = list.value.filter(item => item.id !== id)
}

const lastLength = computed(() => {
  return list.value.filter(item => !item.done).length
})

const status = ref('all')
const showList = computed(() => {
  if(status.value === 'all'){
    return list.value
  }
  if(status.value === 'active'){
    return list.value.filter(item => !item.done)
  }
  if(status.value === 'completed'){
    return list.value.filter(item =>  item.done)
  }
})

const updateStatus = (Status) => {
  status.value = Status
}
</script>

<template>
  <ToDoHeader @addTodo="addTodo"></ToDoHeader>
  <ToDoMain :list="showList" @delTodo="delTodo"></ToDoMain>
  <ToDoFooter :lastLength="lastLength" :status="status" @updateStatus="updateStatus"></ToDoFooter>  
</template>
