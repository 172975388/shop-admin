<template>
  <div class="f-menu" :style="{ width: $store.state.asideWidth }">
    <!-- 
      el-menu 菜单容器
      router为true，则以 el-menu-item 的 index 作为 path 进行路由跳转 
     -->
    <el-menu
      class="border-0"
      :router="true"
      :collapse="isCollapse"
      :collapse-transition="false"
      :unique-opened="true"
      :default-active="defaultActive"
    >
      <template v-for="(item, index) in menus" :key="index">
        <!-- el-sub-menu 下放子菜单 -->
        <el-sub-menu
          v-if="item.child && item.child.length > 0"
          :index="index + ''"
        >
          <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <!-- el-menu-item 菜单项。其下无子菜单 -->
          <el-menu-item
            :index="item2.frontpath"
            v-for="(item2, index2) in item.child"
            :key="index2"
            ><el-icon><component :is="item2.icon"></component></el-icon
            >{{ item2.name }}</el-menu-item
          >
        </el-sub-menu>

        <!-- <el-menu-item index="2">
          <el-icon><icon-menu /></el-icon>
          <span>Navigator Two</span>
        </el-menu-item> -->
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'

const store = useStore()
const route = useRoute()

const defaultActive = ref(route.path)

/**
 * defaultActive决定menu项的激活状态，
 * FTagList中的activeTab决定tag的激活状态。
 * 二者的值都是route.path
 * 但是点击menu，不会引发activeTab改变，同理activeTab也不会引发defaultActive的改变。。搞不懂为什么
 * 只能每个都监听onBeforeRouteUpdate，每次改变路由时都手动把两个值修改。
 */
onBeforeRouteUpdate(to => {
  defaultActive.value = to.path
})

// 是否折叠
const isCollapse = computed(() => store.state.asideWidth === '64px')

const menus = store.state.user.menus
</script>

<style lang="scss" scoped>
.f-menu {
  @apply shadow-md fixed top-64px bottom-0  left-0 bg-light-50 overflow-y-auto transition-all;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
}
</style>
