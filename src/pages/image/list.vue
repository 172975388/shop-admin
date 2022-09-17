<template>
  <el-container class="image-container">
    <el-header class="image-header">
      <el-button type="primary" size="small" @click="handleOpenCreate"
        >新增图片分类</el-button
      >
      <el-button type="warning" size="small" @click="handleOpenUpload"
        >上传图片</el-button
      >
    </el-header>

    <el-container>
      <ImageAside ref="imageAsideRef" @change="handleAsideChange" />
      <ImageMain ref="imageMainRef" />
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import ImageAside from '~/components/ImageAside.vue'
import ImageMain from '~/components/ImageMain.vue'

const imageAsideRef = ref(null)
const imageMainRef = ref(null)

const handleOpenCreate = () => imageAsideRef.value.handleCreate()
const handleAsideChange = id => imageMainRef.value.loadData(id)
const handleOpenUpload = () => imageMainRef.value.openUploadFile()
</script>

<style lang="scss" scoped>
.image-container {
  @apply bg-white rounded;
  // scss无法处理vh和px的运算。使用calc原生css减法。
  // 头部高度64px，主体内容padding-top 64px。20px用于微调高度。
  // 如果使用js，那么window.innerHeight || document.clientHeight 也可以拿到浏览器窗口的视口（viewport）高度。
  height: calc(100vh - 64px - 64px - 20px);
  .image-header {
    border-bottom: 1px solid #eeeeee;
    @apply flex items-center;
  }
}
</style>
