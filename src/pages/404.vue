<template>
  <el-row>
    <el-result icon="error" title="404" sub-title="你来到了荒原~">
      <template #extra>
        <el-button type="primary" @click="$router.push('/')">回到首页</el-button>
      </template>
    </el-result>
  </el-row>
</template>
<script>
export default {}
</script>

<style lang="less" scoped></style>
