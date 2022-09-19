<template>
  <el-icon v-if="modelValue" size="20px" class="mr-2">
    <component :is="modelValue"></component>
  </el-icon>
  <el-select v-model="modelValue" placeholder="请选择图标" @change="selectIcon" filterable >
    <el-option
      v-for="iconName in iconList"
      :key="iconName"
      :label="iconName"
      :value="iconName"
    >
      <span style="float: left">
        <el-icon size="20px">
          <component :is="iconName"></component>
        </el-icon>
      </span>
      <span
        style="
          float: right;
          color: var(--el-text-color-secondary);
          font-size: 12px;
        "
        >{{ iconName }}</span
      >
    </el-option>
  </el-select>
</template>

<script setup>
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

// element plus 所有内置图标数组。
const iconList = Object.keys(ElementPlusIconsVue)

const selectIcon = iconName => {
  emit('update:modelValue', iconName)
}
</script>

<style lang="scss" scoped></style>
