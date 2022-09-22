<template>
  <div>
    <el-card shadow="never" class="card-wrapper">
      <template #header>
        <ListHeader
          @create="handleCreate"
          @refresh="getData"
          layout="create,refresh,delete"
          @delete="handleMultiDelete"
          :selectionDisabled="selectionDisabled"
        />
      </template>
      <!-- card body -->
      <el-table
        ref="multipleTableRef"
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="规格名称" />
        <el-table-column
          prop="default"
          label="规格值"
          width="380"
          align="center"
        />
        <el-table-column prop="order" label="排序" align="center" />
        <el-table-column label="状态" align="center">
          <template #default="{row}">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange($event, row)"
              :loading="row.statusLoading"
              :disabled="row.id === 50"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" align="center">
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
              title="是否要删除该规格？"
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
      destroyOnClose
    >
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="规格名称" />
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="ruleForm.order" :min="0" :max="1000">
          </el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="ruleForm.status"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="规格值" prop="default">
          <TagInput v-model="ruleForm.default" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup>
/**
 * 商品预设通用规格
 */

import {
  getSkusList,
  updateSkus,
  createSkus,
  deleteSkus,
  updateSkusStatus
} from '~/api/skus'
import ListHeader from '~/components/ListHeader.vue'
import FormDrawer from '~/components/FormDrawer.vue'
import TagInput from '~/components/TagInput.vue'
import { useInitTable, useInitForm } from '~/composables/useCommon'

const {
  tableData,
  loading,
  currentPage,
  total,
  limit,
  getData,
  handleDelete,
  handleStatusChange,
  handleSelectionChange,
  multipleTableRef,
  handleMultiDelete,
  selectionDisabled
} = useInitTable({
  getList: getSkusList,
  delete: deleteSkus,
  updateStatus: updateSkusStatus
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
  create: createSkus,
  update: updateSkus,
  ruleForm: {
    name: '',
    default: '',
    status: 1,
    order: 50
  },
  rules: {
    name: [{ required: true, message: '规格名不能为空', trigger: 'blur' }],
    default: [{ required: true, message: '规格值不能为空', trigger: 'blur' }]
  }
})
</script>

<style lang="scss" scoped>
.card-wrapper {
  @apply border-0;
  .page {
    @apply flex justify-center items-center mt-5;
  }
}
</style>
