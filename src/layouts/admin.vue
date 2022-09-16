<template>
  <el-container>
    <el-header>
      <f-header></f-header>
    </el-header>
    <el-container>
      <el-aside :width="$store.state.asideWidth">
        <f-menu></f-menu>
      </el-aside>
      <!-- 
        f-tag-list是固定定位，所以给父级添加padding-top，不让f-tag-list压住下面的盒子
       -->
      <el-main class="pt-64px">
        <f-tag-list></f-tag-list>
        <!-- vue-router v4语法 https://router.vuejs.org/zh/guide/migration/index.html#router-view-%E3%80%81-keep-alive-%E5%92%8C-transition -->
        <router-view v-slot="{ Component }">
          <transition
            name="fade"
            enter-active-class="animate__animated animate__fadeIn"
            leave-active-class="animate__animated animate__fadeOut"
          >
            <keep-alive :max="10">
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import FHeader from './components/FHeader.vue'
import FMenu from './components/FMenu.vue'
import FTagList from './components/FTagList.vue'

import 'animate.css'
</script>

<style lang="scss" scoped>
.el-aside {
  @apply transition-all;
}

.animate__animated.animate__fadeIn {
  /**
    查看源码可得.animate__animated设置了animation-duration: 1s; 所以给进入的动画类设置delay 1s。让离开的动画先执行完。
    查看文档可知有预定义延迟类。这里就直接自己写了。
  */
  animation-delay: 0.2s;
}

.animate__animated {
  animation-duration: 0.2s;
}

/**
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

// 没必要写，元素本身就是这个样式
// .fade-enter-to, .fade-leave-from {
//   opacity: 1;
// }
.fade-enter-active, .fade-leave-active {
  transition: all 0.2s;
}

// 由于切换导航，造成a组件不显示，b组件显示，所以如果没有delay，那么a组件消失的过程中b组件显示。所以要让b组件的显示delay，先让a组件消失
.fade-enter-active {
  transition-delay: 0.2s;
}
*/
</style>
