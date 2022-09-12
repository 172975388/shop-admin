<template>
  <div>
    {{ $store.state.user.username }}
    <button @click="logout">logout</button>
    <hr>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { toast, showModal } from '~/composables/util'

const store = useStore()
const router = useRouter()

function logout () {
  showModal('确定退出？').then(async () => {
    await store.dispatch('logout')
    router.push('/login')
    toast('退出登录', 'success')
  })
}
</script>

<style lang="less" scoped></style>
