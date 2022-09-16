<template>
  <div class="f-tag-list" :style="{ left: $store.state.asideWidth }">
    <!-- 
      min-width，让左右箭头显示出来 
      v-model，绑定值与el-tab-pane的name对应，表示当前激活的el-tab-pane。要和当前页面的路由对应的标签绑定
      tab-change  v-model绑定的值改变时触发
      tab-remove  点击 tab 移除按钮时触发
    -->
    <el-tabs
      v-model="activeTab"
      @tab-change="changeTab"
      @tab-remove="removeTab"
      type="card"
      style="min-width: 100px"
    >
      <el-tab-pane
        v-for="item in tabList"
        :key="item.path"
        :label="item.title"
        :name="item.path"
        :closable="item.path !== '/'"
      >
      </el-tab-pane>
    </el-tabs>

    <el-dropdown class="tag-btn" @command="handleClose">
      <span class="el-dropdown-link">
        <el-icon>
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="closeOther">关闭其他</el-dropdown-item>
          <el-dropdown-item command="closeAll">全部关闭</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { useTabList } from '~/composables/useTabList'

const { activeTab, tabList, changeTab, removeTab, handleClose } = useTabList()
</script>

<style lang="scss" scoped>
.f-tag-list {
  @apply fixed top-64px right-0 h-44px bg-gray-100 flex items-center justify-between px-2 z-1;
  .tag-btn {
    @apply bg-white rounded flex items-center mr-2;
    .el-dropdown-link {
      // 设置宽高，让整个背景而不是仅仅只有图标被hover时展开下拉框
      @apply w-32px h-32px flex items-center justify-center;
    }
  }
  // 深度作用选择器
  :deep(.el-tabs__header) {
    // 放大放大再放大才能看清有border
    @apply m-0 flex items-center border-0;
    .el-tabs__nav {
      @apply border-0;

      .el-tabs__item {
        @apply border-0 bg-white mx-1 h-32px rounded leading-32px;
      }
    }
    .el-tabs__nav-prev,
    .el-tabs__nav-next {
      @apply leading-34px text-gray-900;
      // 左右箭头移动标签。移动到尽头会自动添加.is-disabled。让其显示不可点击。
      &.is-disabled {
        @apply cursor-not-allowed text-gray-500;
      }
    }
  }
}
</style>
