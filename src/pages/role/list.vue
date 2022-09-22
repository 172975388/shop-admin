<template>
  <div>
    <el-card shadow="never" class="card-wrapper">
      <template #header>
        <ListHeader @create="handleCreate" @refresh="getData" />
      </template>
      <!-- card body -->
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="name" label="角色名称" />
        <el-table-column
          prop="desc"
          label="角色描述"
          width="380"
          align="center"
        />
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
              @click="openSetRule(scope.row)"
              text
            >
              配置权限
            </el-button>
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
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input
            v-model="ruleForm.desc"
            type="textarea"
            :rows="5"
            placeholder="角色描述"
          />
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

    <!-- 权限 -->
    <FormDrawer
      ref="setRuleFormDrawerRef"
      @submit="handleSetRuleSubmit"
      title="权限配置"
    >
      <!-- v2，不需要设置node-key -->
      <el-tree-v2
        :data="ruleList"
        :props="{
          children: 'child',
          label: 'name',
          value: 'id' // 当前节点标识。default-expanded-keys数组中存的就是该值
        }"
        show-checkbox
        :height="treeHeight"
        :default-expanded-keys="defaultExpandedKeys"
        ref="elTreeRef"
        @check="handleTreeCheck"
        :check-strictly="checkStrictly"
      >
        <template #default="{ data }">
          <el-tag size="small" :type="data.menu ? '' : 'info'">{{
            data.menu ? '菜单' : '权限'
          }}</el-tag>

          <span class="ml-2 text-gray-600 text-sm">{{ data.name }}</span>
        </template>
      </el-tree-v2>
    </FormDrawer>
  </div>
</template>

<script setup>
import {
  getRoleList,
  updateRole,
  createRole,
  deleteRole,
  updateRoleStatus,
  setRoleRules
} from '~/api/role'
import { getRuleList } from '~/api/rules'
import ListHeader from '~/components/ListHeader.vue'
import FormDrawer from '~/components/FormDrawer.vue'
import { useInitTable, useInitForm } from '~/composables/useCommon'
import { nextTick, ref } from 'vue'
import { toast } from '~/composables/util'

const {
  tableData,
  loading,
  currentPage,
  total,
  limit,
  getData,
  handleDelete,
  handleStatusChange
} = useInitTable({
  getList: getRoleList,
  delete: deleteRole,
  updateStatus: updateRoleStatus
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
  create: createRole,
  update: updateRole,
  ruleForm: {
    name: '',
    desc: '',
    status: 1
  },
  rules: {
    name: [{ required: true, message: '角色名不能为空', trigger: 'blur' }]
  }
})

const ruleList = ref([])
const treeHeight = ref(0)
const setRuleFormDrawerRef = ref(null)
const roleId = ref(0)
const defaultExpandedKeys = ref([])
const elTreeRef = ref(null)
const ruleIds = ref([]) // 当前角色拥有的权限id数组
const checkStrictly = ref(false)
const openSetRule = row => {
  treeHeight.value = window.innerHeight - 170
  // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false true即父节点选中，子节点也被选中。
  checkStrictly.value = true
  roleId.value = row.id
  getRuleList().then(async res => {
    // 获取所有规则
    ruleList.value = res.list
    // 打开弹层
    setRuleFormDrawerRef.value.open()
    // 展开所有规则的第一级节点
    defaultExpandedKeys.value = res.list.map(o => o.id)

    ruleIds.value = row.rules.map(o => o.id)
    setTimeout(() => {
      elTreeRef.value.setCheckedKeys(ruleIds.value)
      checkStrictly.value = false
    }, 0)
    // 我十分不理解为什么nextTick不行？？？
    // nextTick(()=>{
    //   elTreeRef.value.setCheckedKeys(ruleIds.value)
    // })
  })
}

const handleTreeCheck = (...e) => {
  // checkedKeys，当前选中的id数组。halfCheckedKeys，所有祖先节点的id数组。
  const { halfCheckedKeys, checkedKeys } = e[1]
  ruleIds.value = [...halfCheckedKeys, ...checkedKeys]
}

const handleSetRuleSubmit = () => {
  setRuleFormDrawerRef.value.showLoading()
  setRoleRules(roleId.value, ruleIds.value)
    .then(res => {
      setRuleFormDrawerRef.value.close()
      toast('配置成功')
      getData()
    })
    .finally(() => {
      setRuleFormDrawerRef.value.hideLoading()
    })
}
</script>

<style lang="scss" scoped>
.card-wrapper {
  @apply border-0;
  .page {
    @apply flex justify-center items-center mt-5;
  }
}
</style>
