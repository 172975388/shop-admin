<template>
  <el-row class="login-container">
    <el-col :lg="16" :md="12" class="left">
      <div class="mx-4">
        <div class="welcome">欢迎光临</div>
        <div class="introduction">
          此站点是《Vue3实战商城后台管理系统开发》视频课程的演示地址，
          点击立即学习
        </div>
      </div>
    </el-col>
    <el-col :lg="8" :md="12" class="right">
      <h2 class="title">欢迎回来</h2>
      <div class="login">
        <span class="line"></span>
        <span>
          账号密码登录
        </span>
        <span class="line"></span>
      </div>
      <el-form
        :model="form"
        class="form"
        :rules="rules"
        ref="ruleFormRef"
        @keyup.enter.native="submitForm(ruleFormRef)"
      >
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            type="password"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-button
          class="w-250px"
          round
          color="#626aef"
          type="primary"
          @click="submitForm(ruleFormRef)"
          :loading="loading"
          >登 录</el-button
        >
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '~/composables/util'
import { useStore } from 'vuex'

// 组件上ref，在js中得这么写才能拿到组件实例。
const ruleFormRef = ref()

// 获取router实例
const router = useRouter()

// 获取store实例
const store = useStore()


const loading = ref(false)

// do not use same name with ref
const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 3, max: 7, message: '用户名长度为3~7个字符', trigger: 'blur' }
  ],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
}

const submitForm = ruleFormRef => {
  ruleFormRef.validate(async valid => {
    if (valid) {
      loading.value = true
      try {
        await store.dispatch('login', form)
        toast('登录成功')
        router.push('/')
      } catch (error) {
        console.log(error)
      } finally {
        loading.value = false
      }
    } else {
      console.log('验证失败')
      return false
    }
  })
}
</script>

<style lang="less" scoped>
.login-container {
  @apply min-h-screen;
  .left {
    @apply flex justify-center items-center bg-indigo-500;
    .welcome {
      @apply mb-4 font-bold text-5xl text-light-50;
    }
    .introduction {
      @apply text-gray-200 text-sm;
    }
  }
  .right {
    @apply flex flex-col justify-center items-center bg-light-50;
    .title {
      @apply font-bold text-3xl text-gray-800;
    }
    .login {
      @apply flex justify-center items-center my-5 space-x-2 text-gray-300;
      .line {
        @apply h-px w-16 bg-gray-200;
      }
    }
    .form {
      @apply w-250px space-y-6;
    }
  }
}
</style>
