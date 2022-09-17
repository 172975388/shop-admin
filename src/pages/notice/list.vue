<template>
  <div>
    <el-card shadow="never" class="card-wrapper">
      <template #header>
        <div class="header">
          <el-button type="primary" size="small" @click="handleCreate"
            >新增</el-button
          >
          <el-tooltip effect="dark" content="刷新" placement="bottom">
            <el-icon class="icon-button" @click="getData" :size="20">
              <Refresh />
            </el-icon>
          </el-tooltip>
        </div>
      </template>
      <!-- card body -->
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="title" label="公告标题" />
        <el-table-column
          prop="create_time"
          label="发布时间"
          width="380"
          align="center"
        />
        <el-table-column label="操作" width="180" align="center">
          <!-- 作用域插槽  -->
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleUpdate(scope.row)"
              text
            >
              修改
            </el-button>
            <el-popconfirm
              width="180px"
              title="是否要删除该公告？"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button type="primary" size="small" text>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        v-model:current-page="currentPage"
        :page-size="limit"
        class="page"
      />
    </el-card>

    <FormDrawer
      ref="formDrawerRef"
      @submit="handleSubmit(ruleFormRef)"
      :title="drawerTitle"
    >
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="ruleForm.title" placeholder="公告标题" />
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input
            v-model="ruleForm.content"
            type="textarea"
            :rows="5"
            placeholder="公告内容"
          />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import {
  getNoticeList,
  updateNotice,
  createNotice,
  deleteNotice
} from '~/api/notice'
import FormDrawer from '~/components/FormDrawer.vue'
import { toast } from '~/composables/util'

const loading = ref(false)
// 数据数量
const total = ref(0)
// 当前页
const currentPage = ref(1)
// 每页显示多少条
const limit = ref(10)

const tableData = ref([])

async function getData () {
  try {
    loading.value = true
    const res = await getNoticeList(currentPage.value)
    tableData.value = res.list || []
    total.value = res.totalCount
  } finally {
    loading.value = false
  }
}

getData()

watch(currentPage, () => {
  getData()
})

const handleDelete = async id => {
  try {
    loading.value = true
    await deleteNotice(id)
    getData()
    toast('删除成功')
  } catch {
    toast('删除失败')
  } finally {
    loading.value = false
  }
}

const updateId = ref(0)

// 可以和创建的方法结合成一个。
const handleUpdate = async row => {
  drawerTitle.value = '修改'
  if (ruleFormRef.value.clearValidate) {
    // 清除验证
    ruleFormRef.value.clearValidate()
  }
  // 可以for
  updateId.value = row.id
  ruleForm.title = row.title
  ruleForm.content = row.content
  formDrawerRef.value.open()
}

const formDrawerRef = ref(null)
const drawerTitle = ref('')

const rules = reactive({
  title: [{ required: true, message: '公告标题不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '公告内容不能为空', trigger: 'blur' }]
})
const ruleFormRef = ref({})

const ruleForm = reactive({
  title: '',
  content: ''
})

const handleCreate = () => {
  drawerTitle.value = '新增'
  // 只能手动赋值，可以简化。
  // ruleForm.title = ''
  // ruleForm.content = ''
  Object.keys(ruleForm).forEach(key=>{ruleForm[key]=''})
  formDrawerRef.value.open()
}

async function handleSubmit (ruleFormRef) {
  if (!ruleFormRef) return
  await ruleFormRef.validate(async valid => {
    if (valid) {
      try {
        formDrawerRef.value.showLoading()
        if (drawerTitle.value === '新增') {
          await createNotice(ruleForm)
        } else {
          await updateNotice(updateId.value, ruleForm)
        }

        toast(drawerTitle.value + '成功')
        currentPage.value = drawerTitle.value === '新增' ? 1 : currentPage.value
        getData()
        formDrawerRef.value.close()
      } finally {
        formDrawerRef.value.hideLoading()
      }
    } else {
      console.log('error submit!')
    }
  })
}
</script>

<style lang="scss" scoped>
.card-wrapper {
  @apply border-0;
  .header {
    @apply flex justify-between items-center mb-4;
  }
  .page {
    @apply flex justify-center items-center mt-5;
  }
}
</style>
