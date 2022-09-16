<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span>订单统计</span>
        <div>
          <el-check-tag
            v-for="(item, index) in options"
            :key="index"
            :checked="currentTag === item.value"
            @change="changeTag(item.value)"
            class="ml-2"
            >{{ item.text }}</el-check-tag
          >
        </div>
      </div>
    </template>
    <div ref="el" id="chart" style="width: 100%;height: 300px;"></div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getStatistics3 } from '~/api/index'
import { useResizeObserver } from '@vueuse/core'

import * as echarts from 'echarts/core'
import { GridComponent } from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

// value和接口对应
const options = [
  {
    text: '近一个月',
    value: 'month'
  },
  {
    text: '近一周',
    value: 'week'
  },
  {
    text: '近24小时',
    value: 'hour'
  }
]

const currentTag = ref('week')

function changeTag (tagValue) {
  currentTag.value = tagValue
  getData()
}

let myChart = null
/**
 * setup运行在组件创建之前。所以dom根本没有挂载，所以document.getElementById获取不到dom元素。必须在挂载后才能获取。
 */
onMounted(() => {
  echarts.use([GridComponent, BarChart, CanvasRenderer])

  const chartDom = document.getElementById('chart')

  // 如果没权限，则没这个dom节点。
  if (chartDom) {
    myChart = echarts.init(chartDom)
    getData()
  }
})

async function getData () {
  try {
    myChart.showLoading()
    const res = await getStatistics3(currentTag.value)
    
    let option = {
      xAxis: {
        type: 'category',
        data: res.x
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: res.y,
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          }
        }
      ]
    }

    option && myChart.setOption(option)
  } finally {
    myChart.hideLoading()
  }
}

/**
 * 在容器节点被销毁时，总是应调用 echartsInstance.dispose 以销毁实例释放资源，避免内存泄漏。
 */
onBeforeUnmount(() => {
  myChart.dispose()
})

// window.onresize = function () {
//   myChart.resize()
// }

// 监听图表容器的大小并改变图表大小
const el = ref(null)
useResizeObserver(el, () => {
  myChart.resize()
})
</script>

<style lang="scss" scoped>
.card-header {
  @apply flex justify-between items-center;
}
</style>
