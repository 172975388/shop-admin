<template>
  <div>
    <el-card shadow="never" class="card-wrapper">
      <!-- header -->
      <div>
        <el-form :model="searchForm" class="searchForm" size="small">
          <el-form-item label="关键词">
            <!-- clearable 可一键清空 -->
            <el-input
              v-model="searchForm.keyword"
              placeholder="管理员昵称"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="getData">搜索</el-button>
            <el-button @click="resetSearchForm">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 新增/刷新 -->
        <ListHeader @create="handleCreate" @refresh="getData" />
      </div>

      <!-- table -->
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
        height="65vh"
      >
        <el-table-column label="管理员">
          <template #default="{row}">
            <div class="manager-col">
              <el-avatar :size="40" :src="row.avatar">
                <!-- :src无法加载图片，则加载插槽中的图片 -->
                <img
                  src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                />
              </el-avatar>
              <div class="ml-3">
                <h6>{{ row.username }}</h6>
                <small>ID: {{ row.id }}</small>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="所属角色" align="center">
          <template #default="{row}">
            {{ row.role?.name || '-' }}
          </template>
        </el-table-column>

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

        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <small v-if="scope.row.id === 50" class="text-sm text-gray-500"
              >暂无操作</small
            >
            <div v-else>
              <el-button
                type="primary"
                size="small"
                @click="handleUpdate(scope.row)"
                text
              >
                修改
              </el-button>
              <el-popconfirm
                width="200px"
                title="是否要删除该管理员？"
                confirm-button-text="确定"
                cancel-button-text="取消"
                @confirm="handleDelete(scope.row.id)"
              >
                <template #reference>
                  <el-button type="primary" size="small" text>删除</el-button>
                </template>
              </el-popconfirm>
            </div>
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <!-- 点击选框，弹出组件。所以不能使用el-upload，el-upload是弹出系统选择文件 -->
          <!-- 需要的数据（接口指定）就是图片的url -->
          <ChooseImage v-model="ruleForm.avatar"></ChooseImage>
        </el-form-item>
        <el-form-item label="所属角色" prop="role_id">
          <el-select
            v-model="ruleForm.role_id"
            value-key=""
            placeholder="选择所属角色"
            clearable
            filterable
            @change=""
          >
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="ruleForm.status"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import ListHeader from '~/components/ListHeader.vue'
import FormDrawer from '~/components/FormDrawer.vue'
import ChooseImage from '~/components/ChooseImage.vue'

import {
  getManagerList,
  updateManagerStatus,
  createManager,
  updateManager,
  deleteManager
} from '~/api/manager'

import { useInitTable, useInitForm } from '~/composables/useCommon'

const roles = ref([])

const {
  searchForm,
  resetSearchForm,
  tableData,
  loading,
  currentPage,
  total,
  limit,
  getData,
  handleStatusChange,
  handleDelete
} = useInitTable({
  getList: getManagerList,
  /**
   * js采用词法作用域，一个声明（定义变量、函数等）的词法作用域就是它被定义时所在的作用域。
   * onGetListSuccess在此处定义，所以只能访问定义处的作用域。
   * tableData被解构，所以能访问到，
   */
  onGetListSuccess: res => {
    // map() 方法创建一个新数组，这个新数组由原数组中的每个元素都调用一次提供的函数后的返回值组成。
    // 这里就是给每个元素添加了一个statusLoading属性
    tableData.value = res.list.map(o => {
      o.statusLoading = false
      return o
    })
    roles.value = res.roles
  },
  searchForm: {
    keyword: ''
  },
  delete: deleteManager,
  updateStatus: updateManagerStatus
})

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
  create: createManager,
  update: updateManager,
  ruleForm: {
    username: '',
    password: '',
    role_id: null,
    status: 1,
    avatar: ''
  }
})
</script>

<style lang="scss" scoped>
.card-wrapper {
  @apply border-0;
  
  .searchForm {
    @apply flex justify-between mb-3;
  }
  .page {
    @apply flex justify-center items-center mt-5;
  }
}

.manager-col {
  @apply flex items-center;
}
</style>
