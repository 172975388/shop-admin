<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="text-sm">{{ title }}</span>
        <el-tag type="danger" effect="plain">{{ tip }}</el-tag>
      </div>
    </template>
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in btns" :key="index">
        <el-card shadow="hover" class="card-body">
          <div class="card-body-item">
            <span class="num">{{ item.value }}</span
            ><span class="state">{{ item.label }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
/**
 * 组件的数据不应该写死。所以组件的数据应该由props传入。
 * IndexChart，这个组件写的有问题，数据是自身获取。由于图表组件没有复用，所以倒也行。但不建议。如果需要展示其他，那么就要修改组件源文件了。
 */

defineProps({
  title: String,
  tip: String,
  btns: Array
})
</script>

<style lang="scss" scoped>
.card-header {
  @apply flex items-center justify-between;
}
.card-body {
  @apply border-0 bg-light-400;
  .card-body-item {
    @apply flex flex-col items-center justify-center;
    .num {
      @apply text-xl mb-2;
    }
    .state {
      @apply text-xs to-gray-500;
    }
  }
}
</style>
