<template>
  <!-- 抽屉组件，修改密码 -->
  <el-drawer
    v-model="showDrawer"
    :title="title"
    :size="size"
    :destroy-on-close="destroyOnClose"
  >
    <div class="formDrawer">
      <div class="body">
        <slot></slot>
      </div>
      <div class="actions">
        <el-button type="primary" @click="submit" :loading="loading">{{ confirmText }}</el-button>
        <el-button type="default" @click="close">取消</el-button>
      </div>
    </div>
  </el-drawer>
  <!-- /抽屉组件，修改密码 -->
</template>

<script setup>
import { ref } from 'vue'

const showDrawer = ref(false)
const loading = ref(false)

const open = () => (showDrawer.value = true)
const close = () => (showDrawer.value = false)
const showLoading = () => {
  loading.value = true
}
const hideLoading = () => {
  loading.value = false
}

defineExpose({
  open,
  close,
  showLoading,
  hideLoading
})

const emit = defineEmits(['submit'])

const submit = () => {
  // 提交时需要ajax请求，具体是什么请求，发送什么参数，由父组件决定。
  emit('submit')
}

const props = defineProps({
  title: String,
  size: {
    type: String,
    default: '45%'
  },
  // 控制是否在关闭 Drawer 之后将子元素全部销毁
  destroyOnClose: {
    type: Boolean,
    default: false
  },
  confirmText: {
    type: String,
    default: '提交'
  }
})
</script>

<style lang="scss" scoped>
.formDrawer {
  @apply flex flex-col justify-between text-gray-700 w-full h-full overflow-y-auto;

  .body {
    @apply flex-1;
  }

  .actions {
    @apply h-50px flex items-center;
  }
}
</style>
