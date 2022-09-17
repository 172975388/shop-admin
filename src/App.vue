<script setup></script>

<template>
  <router-view></router-view>
</template>

<style lang="scss">
body {
  @apply bg-gray-100;
}
#nprogress .bar {
  background-color: #f4f4f4 !important;
  height: 3px !important;
}

// 滚动条整个外层容器
::-webkit-scrollbar {
  width: 4px;
}
// 滑块
::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background-color: rgba(0, 0, 0, 0.2);
}
// 滚动条轨道
::-webkit-scrollbar-track {
  // 默认透明
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
