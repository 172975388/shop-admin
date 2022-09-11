<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
</script>

<template>
  <button
    class="
      bg-purple-500
      text-indigo-50 
      px-4 py-2 
      rounded-full 
      hover:(bg-purple-900) 
      transition-all duration-500
      focus:(ring-2 ring-purple-900)
      "
  >
    button
  </button>
  <br>
  <br>
  <button class="btn">
    button
  </button>

  <router-view></router-view>
</template>

<style scoped>
.btn {
  /** @apply 指令  后面跟windi 定义的类名  */
  @apply bg-purple-500
      text-indigo-50 
      px-4 py-2 
      rounded-full 
      hover:(bg-purple-900) 
      transition-all duration-500
      focus:(ring-2 ring-purple-900);
}
</style>
