<template>
  <div class="aside-list-item" :class="{ active }">
    <!-- truncate，文本溢出显示... -->
    <span class="truncate"><slot /></span>
    <!-- 
      flex下的margin-auto。占据所有剩余空间。所以这两个按钮靠右对齐
      父组件模板中监听了click，所以禁止传播
     -->
    <el-button
      type="primary"
      size="small"
      text
      class="ml-auto px-1"
      @click.stop="$emit('edit')"
    >
      <el-icon :size="16"><Edit /></el-icon>
    </el-button>

    <el-popconfirm
      width="180px"
      title="是否要删除该分类？"
      confirm-button-text="确定"
      cancel-button-text="取消"
      @confirm="$emit('delete')"
    >
      <template #reference>
        <el-button type="primary" size="small" text class="px-1">
          <el-icon :size="16"><Close /></el-icon>
        </el-button>
      </template>
    </el-popconfirm>
  </div>
</template>

<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false
  }
})

defineEmits(['edit', 'delete'])
</script>

<style lang="scss" scoped>
.aside-list-item {
  border-bottom: 1px solid #f4f4f4;
  @apply flex justify-center items-center p-3 text-sm text-gray-600 cursor-pointer;
  &:hover,
  &.active {
    @apply bg-blue-50;
  }
}
</style>
