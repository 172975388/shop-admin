<template>
  <div class="f-header">
    <div class="left">
      <span class="logo">
        <el-icon class="mr-2">
          <ElemeFilled />
        </el-icon>
        vue3项目
      </span>

      <el-icon class="icon-button" @click="$store.commit('handleAsideWidth')">
        <Fold v-if="$store.state.asideWidth === '250px'" />
        <Expand v-else />
      </el-icon>

      <el-tooltip effect="dark" content="刷新" placement="bottom">
        <el-icon class="icon-button" @click="refresh">
          <Refresh />
        </el-icon>
      </el-tooltip>
    </div>
    <div class="right">
      <el-tooltip effect="dark" content="全屏" placement="bottom">
        <el-icon class="icon-button" @click="toggle">
          <FullScreen v-if="!isFullscreen" />
          <Aim v-else />
        </el-icon>
      </el-tooltip>

      <!-- 下拉 -->
      <el-dropdown @command="handleCommand">
        <span class="user">
          <el-avatar :size="25" :src="$store.state.user.avatar" />
          <span class="username">{{ $store.state.user.username }}</span>
          <el-icon>
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- /下拉 -->
    </div>

    <form-drawer ref="formDrawerRef" title="修改密码" destroyOnClose @submit="submitForm(ruleFormRef)">
      <el-form :model="form" :rules="rules" ref="ruleFormRef" label-width="80px" size="small">
        <el-form-item prop="oldpassword" label="旧密码">
          <el-input v-model="form.oldpassword" placeholder="请输入旧密码">
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label="新密码">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入新密码">
          </el-input>
        </el-form-item>
        <el-form-item prop="repassword" label="确认密码">
          <el-input v-model="form.repassword" type="password" show-password placeholder="请输入确认密码">
          </el-input>
        </el-form-item>
      </el-form>
    </form-drawer>
  </div>
</template>

<script setup>
import { useFullscreen } from '@vueuse/core'
import FormDrawer from '~/components/FormDrawer.vue'

import { useRepassword, useLogout } from '~/composables/useManager'

const { toggle, isFullscreen } = useFullscreen()

const {
  formDrawerRef,
  ruleFormRef,
  form,
  rules,
  submitForm,
  openRepasswordForm
} = useRepassword()

const { logout } = useLogout()

function refresh() {
  // 刷新页面
  location.reload()
}

function handleCommand(command) {
  if (command === 'rePassword') {
    openRepasswordForm()
  } else if (command === 'logout') {
    logout()
  }
}
</script>

<style lang="scss" scoped>
.f-header {
  @apply flex justify-between bg-indigo-700 text-light-50 fixed top-0 left-0 right-0 h-64px items-center;

  .left {
    @apply flex items-center justify-center;

    .logo {
      @apply flex justify-center items-center text-xl font-thin w-250px cursor-pointer;
    }
  }

  .right {
    @apply flex items-center mr-6;

    .el-dropdown {
      @apply text-light-50;

      .user {
        @apply flex text-light-50 items-center ml-4;

        .username {
          @apply mx-2;
        }
      }
    }
  }

  .icon-button {
    @apply cursor-pointer h-64px w-42px hover: (bg-indigo-600);
  }
}
</style>
