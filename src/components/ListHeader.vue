<template>
  <!-- 新增 / 刷新 -->
  <div class="header-bottom">
    <el-button type="primary" size="small" @click="$emit('create')"
      >新增</el-button
    >
    <el-tooltip effect="dark" content="刷新" placement="bottom">
      <el-icon class="icon-button" @click="$emit('refresh')" :size="20">
        <Refresh />
      </el-icon>
    </el-tooltip>
  </div>
</template>

<script setup>
defineEmits(['create', 'refresh'])
</script>

<style lang="scss" scoped>
.header-bottom {
  @apply flex justify-between items-center mb-4;
}
</style>
