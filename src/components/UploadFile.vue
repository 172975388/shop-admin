<template>
  <!-- 
    http-request，覆盖默认的上传方式。
   -->
  <el-upload drag multiple :http-request="upload">
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      将文件拖到此处，或 <em>点击上传</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        只能上传jpg/png文件，且不超过500kb
      </div>
    </template>
  </el-upload>
</template>

<script setup>
import { uploadImage } from '~/api/image'
import { toast } from '~/composables/util'

const props = defineProps({
  id: {
    required: true
  }
})

async function upload (options) {
  let formData = new FormData()
  formData.append('img', options.file)
  formData.append('image_class_id', props.id)
  await uploadImage(formData)
  toast('上传成功')
  // 没上传成功没必要刷新页面
  emit('upload-done')
}

const emit = defineEmits(['upload-done'])
</script>

<style lang="scss" scoped></style>
