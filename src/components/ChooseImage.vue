<template>
  <div class="choose-image-btn" @click="open">
    <el-image
      v-if="modelValue"
      :src="modelValue"
      fit="cover"
      :lazy="true"
      class="img"
    ></el-image>

    <el-icon v-else :size="25" class="text-gray-500"><Plus /></el-icon>
  </div>
  <el-dialog v-model="dialogVisible" title="图片选择" width="70%" top="5vh">
    <template #default>
      <el-container class="image-container">
        <el-container>
          <ImageAside ref="imageAsideRef" @change="handleAsideChange" />
          <ImageMain
            ref="imageMainRef"
            v-model:url="url"
            :showCheckbox="true"
          />
        </el-container>
      </el-container>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import ImageAside from '~/components/ImageAside.vue'
import ImageMain from '~/components/ImageMain.vue'

const dialogVisible = ref(false)

const open = () => {
  dialogVisible.value = true
}

const imageAsideRef = ref(null)
const imageMainRef = ref(null)

const handleAsideChange = id => imageMainRef.value.loadData(id)

const props = defineProps({
  modelValue: [String, Array]
})

const emit = defineEmits(['update:modelValue'])

const url = ref('')

const submit = () => {
  if (url.value) {
    emit('update:modelValue', url)
  }
  dialogVisible.value = false
}
</script>

<style lang="scss" scoped>
.choose-image-btn {
  @apply w-100px h-100px rounded border flex justify-center items-center cursor-pointer hover:(bg-gray-100);
  .img {
    @apply w-100px h-100px rounded border;
  }
}
.image-container {
  @apply bg-white rounded h-70vh;
  // scss无法处理vh和px的运算。使用calc原生css减法。
  // 头部高度64px，主体内容padding-top 64px。20px用于微调高度。
  // 如果使用js，那么window.innerHeight || document.clientHeight 也可以拿到浏览器窗口的视口（viewport）高度。
  .image-header {
    border-bottom: 1px solid #eeeeee;
    @apply flex items-center;
  }
}
</style>
