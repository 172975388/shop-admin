<template>
  {{ showV }}
</template>

<script setup>  
import { animate } from 'popmotion'
import { ref } from 'vue'

let showV = ref(0)

const props = defineProps({
  v: {
    type: Number,
    default: 0
  }
})

animate({
  from: 0,
  to: props.v,
  onUpdate: latest => (showV.value = Math.floor(latest))
})

</script>

<style lang="scss" scoped></style>
