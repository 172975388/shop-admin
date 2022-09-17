<template>
  <el-main class="image-main" v-loading="loading">
    <div class="main-list">
      <el-row :gutter="10">
        <el-col :span="6" v-for="(item, index) in list" :key="index">
          <el-card shadow="hover" :body-style="{ padding: 0 }" class="card">
            <el-image
              :src="item.url"
              fit="cover"
              class="img"
              :preview-src-list="[item.url]"
              :initial-index="0"
            ></el-image>
            <div class="name">
              {{ item.name }}
            </div>
            <div class="btn">
              <el-button
                type="primary"
                size="small"
                text
                @click="handleEdit(item)"
                >重命名</el-button
              >
              <el-popconfirm
                width="180px"
                title="是否要删除该图片？"
                confirm-button-text="确定"
                cancel-button-text="取消"
                @confirm="handleDelete(item.id)"
              >
                <template #reference>
                  <el-button type="primary" size="small" text>删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="main-page">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        v-model:current-page="currentPage"
        :page-size="limit"
      />
    </div>
  </el-main>

  <el-drawer
    title="上传图片"
    v-model="drawer"
    direction="rtl"
    size="30%"
    :show-close="true"
  >
  <UploadFile :id="image_class_id" @upload-done="uploadDone"></UploadFile>
  </el-drawer>
</template>

<script setup>
import { getImageList } from '~/api/image'
import { ref, watch } from 'vue'
import { showPrompt, toast } from '~/composables/util'
import { renameImage, deleteImage } from '~/api/image'
import UploadFile from '~/components/UploadFile.vue'

const loading = ref(false)
// 数据数量
const total = ref(0)
// 当前页
const currentPage = ref(1)
// 每页显示多少条
const limit = ref(10)

const list = ref([])

const image_class_id = ref(0)

async function getData () {
  try {
    loading.value = true
    const res = await getImageList(image_class_id.value, currentPage.value)
    list.value = res.list || []
    total.value = res.totalCount
  } finally {
    loading.value = false
  }
}

watch(currentPage, () => {
  getData()
})

// 根据图片分类id，加载图片列表。
// 一开始，先获取图片分类列表，再把分类列表第一个分类的id传给该方法来获取图片列表。
const loadData = id => {
  currentPage.value = 1
  image_class_id.value = id
  getData()
}

const handleEdit = item => {
  showPrompt('重命名', item.name)
    .then(({ value }) => {
      return renameImage(item.id, value)
    })
    .then(() => {
      toast('修改成功')
      getData()
    })
}

const handleDelete = id => {
  deleteImage(id).then(() => {
    toast('删除成功')
    getData()
  })
}

// 上传图片
const drawer = ref(false)

const openUploadFile = () => {
  drawer.value = true
}

const uploadDone = () => {
  getData()
}


defineExpose({
  loadData,
  openUploadFile
})
</script>

<style lang="scss" scoped>
.image-main {
  @apply w-220px relative;
  border-right: 1px solid #eee;
  .main-list {
    //  inset-x-0 即 left-0 right-0
    @apply absolute top-0 inset-x-0 bottom-50px overflow-auto p-3;
    .card {
      @apply mb-3 relative;
      .img {
        @apply w-full h-150px;
      }
      .name {
        @apply absolute top-122px left-0 right-0 text-sm truncate text-gray-300 bg-opacity-50 bg-gray-800 px-2 py-1;
      }
      .btn {
        @apply flex items-center justify-center p-2;
      }
    }
  }
  .main-page {
    @apply flex items-center justify-center absolute bottom-0 h-50px inset-x-0;
  }
}
</style>
