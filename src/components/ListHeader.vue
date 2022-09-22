<template>
  <!-- 新增 / 刷新 -->
  <div class="header-bottom">
    <div>
      <el-button
        v-if="btns.includes('create')"
        type="primary"
        size="small"
        @click="$emit('create')"
        >新增</el-button

      >
      <el-popconfirm
        v-if="btns.includes('delete')"
        width="200px"
        title="是否要删除选中记录？"
        confirm-button-text="确定"
        cancel-button-text="取消"
        @confirm="$emit('delete')"
      >
        <template #reference>
          <el-button
            type="danger"
            size="small"
            :disabled="selectionDisabled"
            >批量删除</el-button
          >
        </template>
      </el-popconfirm>
    </div>
    <el-tooltip
      v-if="btns.includes('refresh')"
      effect="dark"
      content="刷新"
      placement="bottom"
    >
      <el-icon class="icon-button" @click="$emit('refresh')" :size="20">
        <Refresh />
      </el-icon>
    </el-tooltip>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineEmits(['create', 'refresh', 'delete'])
const props = defineProps({
  layout: {
    type: String,
    default: 'create,refresh'
  },
  selectionDisabled: {
    type: Boolean,
    default: true
  }
})

const btns = computed(() => props.layout.split(','))
</script>

<style lang="scss" scoped>
.header-bottom {
  @apply flex justify-between items-center mb-4;
}
</style>
