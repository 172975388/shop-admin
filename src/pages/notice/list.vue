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
import { useInitTable, useInitForm } from '~/composables/useCommon'

const {
  tableData,
  loading,
  currentPage,
  total,
  limit,
  getData,
  handleDelete
} = useInitTable({
  getList: getNoticeList,
  delete: deleteNotice
})

/**
 * rules本来就要在这个文件下定义，但是放在了别的文件，这就提示了需要这个rules数据。
 */
const {
  formDrawerRef,
  ruleFormRef,
  ruleForm,
  rules,
  drawerTitle,
  handleCreate,
  handleUpdate,
  handleSubmit
} = useInitForm({
  getData,
  create: createNotice,
  update: updateNotice,
  ruleForm: {
    title: '',
    content: ''
  },
  rules: {
    title: [{ required: true, message: '公告标题不能为空', trigger: 'blur' }],
    content: [{ required: true, message: '公告内容不能为空', trigger: 'blur' }]
  }
})
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
