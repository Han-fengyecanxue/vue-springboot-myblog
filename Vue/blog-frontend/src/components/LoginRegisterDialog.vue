<template>
  <el-dialog v-model="dialogVisible" title="登录/注册" width="400px">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="登录" name="login">
        <el-form :model="loginForm">
          <el-form-item label="用户名">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin">登录</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="注册" name="register">
        <el-form :model="registerForm">
          <el-form-item label="用户名">
            <el-input v-model="registerForm.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleRegister">注册</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const props = defineProps({
  visible: Boolean
})
const emit = defineEmits(['update:visible'])

const dialogVisible = ref(false)
const activeTab = ref('login')
const loginForm = ref({ username: '', password: '' })
const registerForm = ref({ username: '', password: '', confirmPassword: '' })

// 父组件 visible 变化 -> 同步到 dialogVisible
watch(() => props.visible, (val) => {
  dialogVisible.value = val
})

// dialogVisible 变化 -> 同步回父组件
watch(dialogVisible, (val) => {
  emit('update:visible', val)
})

const handleLogin = async() => {
  try {
    // 这里可以调用后端接口进行登录验证
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      username: loginForm.value.username,
      password: loginForm.value.password
    })
    const data = response.data
    if(data.success) {
      ElMessage.success(data.message)
      localStorage.setItem('token', data.token || 'fake-token')
      localStorage.setItem('username', loginForm.value.username)
    //关闭弹窗
    dialogVisible.value = false
    } else {
      ElMessage.error(data.message)
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('请求失败，请确保后端服务已启动')

  }
}

const handleRegister = async() => {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  try {
    // 这里可以调用后端接口进行注册
    const response = await axios.post('http://localhost:8080/api/auth/register', {
      username: registerForm.value.username,
      password: registerForm.value.password
    })
    const data = response.data
    if(data.success) {
      ElMessage.success(data.message)
      dialogVisible.value = false
    } else {
      ElMessage.error(data.message)
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('请求失败，请确保后端服务已启动')
  }
}
</script>