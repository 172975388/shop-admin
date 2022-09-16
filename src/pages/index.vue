<template>
  <div>
    <!-- 
      el-skeleton 骨架屏容器
      #template    自定义骨架屏显示
      #default       dom结果
      el-skeleton-item 骨架屏item
     -->
    <el-skeleton animated :loading="loading">
      <template #template>
        <el-row :gutter="20">
          <el-col :span="6" v-for="i in 4" :key="i">
            <el-card shadow="hover" class="border-0">
              <template #header>
                <div class="card-header">
                  <el-skeleton-item variant="text" style="width: 20%;" />
                  <el-skeleton-item variant="text" style="width: 40%;" />
                </div>
              </template>
              <el-skeleton-item variant="text" style="width: 20%;" />
              <el-divider />
              <div class="card-footer">
                <el-skeleton-item variant="text" style="width: 20%;" />
                <el-skeleton-item variant="text" style="width: 20%;" />
              </div> </el-card></el-col
        ></el-row>
      </template>
      <template #default>
        <el-row :gutter="20">
          <el-col :span="6" v-for="(panel, index) in panels" :key="index"
            ><el-card shadow="hover" class="border-0">
              <template #header>
                <div class="card-header">
                  <span class="text-sm">{{ panel.title }}</span>
                  <el-tag class="ml-2" :type="panel.unitColor">{{
                    panel.unit
                  }}</el-tag>
                </div>
              </template>
              <p class="card-body"><CountTo :v="panel.value"></CountTo></p>
              <el-divider />
              <div class="card-footer">
                <span>{{ panel.subTitle }}</span>
                <span>{{ panel.subValue }}</span>
              </div>
            </el-card>
          </el-col></el-row
        >
      </template>
    </el-skeleton>
    <IndexNavs></IndexNavs>
    <el-row :gutter="20" class="mt-5">
      <el-col :span="12">
        <IndexChart v-permission="['getStatistics3,GET']"/>
      </el-col>
      <el-col :span="12">
        <IndexCard
          title="店铺及商品提示"
          tip="店铺及商品提示"
          :btns="goods"
          class="mb-4"
        />
        <IndexCard
          title="交易提示"
          tip="需要立即处理的交易订单"
          :btns="order"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { getStatistics1, getStatistics2 } from '~/api/index'
import { ref } from 'vue'
import CountTo from '~/components/CountTo.vue'
import IndexNavs from '~/components/IndexNavs.vue'
import IndexChart from '~/components/IndexChart.vue'
import IndexCard from '~/components/IndexCard.vue'

const panels = ref([])
const loading = ref(true)

getStatistics1().then(res => {
  panels.value = res.panels
  /**
   * 接口返回数据后，panels才有值，才能被v-for。由于和背景颜色不一样，就会导致闪屏。如果仅仅是为了解决这个问题，那么直接v-for数字，使用panels[i]获取数据即可
   *
   * 使用骨架屏，为的就是如果接口比较慢，那么显示骨架屏过渡。
   * 如果接口返回数据太快，比如200ms，那么没必要骨架屏。如果非要使用，那么刚显示骨架屏立马又显示数据dom，导致闪屏。
   * throttle属性不能解决这个问题。
   * 可以在then里判断当前时间和页面刷新时间，差值如果小于500（ms），那么settimeout，等到500ms后再改。如果大于500ms，直接改。
   */
  loading.value = false
})

const goods = ref([])
const order = ref([])
getStatistics2().then(res => {
  goods.value = res.goods
  order.value = res.order
})
</script>

<style lang="scss" scoped>
.card-header,
.card-footer {
  @apply flex items-center justify-between;
}
.card-body {
  @apply text-3xl font-bold text-gray-500;
}
.card-footer {
  @apply text-gray-500 text-sm;
}
</style>
