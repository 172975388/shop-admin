<template>
  <el-card shadow="never" class="border-0">
    <template #header>
      <ListHeader @create="handleCreate" @refresh="getData" />
    </template>
    <!-- card body -->
    <el-tree
      :data="tableData"
      :props="{
        children: 'child',
        label: 'name'
      }"
      node-key="id"
      :default-expanded-keys="defaultExpandedKeys"
      v-loading="loading"
    >
      <!-- 自定义节点内容。作用域插槽解构的node为树节点对象。data为树节点绑定的数据（不仅仅是显示的数据） -->
      <template #default="{ data }">
        <div class="node">
          <div class="left">
            <!-- data.menu为1是菜单，为0是权限 -->
            <el-tag size="small" :type="data.menu ? '' : 'info'">{{
              data.menu ? '菜单' : '权限'
            }}</el-tag>
            <el-icon v-if="data.icon" :size="16" class="ml-2">
              <component :is="data.icon"></component>
            </el-icon>
            <span>{{ data.name }}</span>
          </div>
          <div class="right">
            <el-switch
              v-model="data.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange($event, data)"
            />
            <el-button
              text
              type="primary"
              size="small"
              @click.stop="handleUpdate(data)"
              >修改</el-button
            >
            <el-button
              v-if="data.menu===1"
              text
              type="primary"
              size="small"
              @click.stop="addChild(data.id)"
              >增加</el-button
            >
            <el-popconfirm
                width="200px"
                title="是否要删除该记录？"
                confirm-button-text="确定"
                cancel-button-text="取消"
                @confirm="handleDelete(data.id)"
              >
                <template #reference>
                  <el-button type="primary" size="small" text>删除</el-button>
                </template>
              </el-popconfirm>
            >
          </div>
        </div>
      </template>
    </el-tree>

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
        <el-form-item label="上级菜单" prop="rule_id">
          <!-- 
            v-model 选中项绑定值
            options 指定数组即可渲染出一个级联选择器，键名可通过 Props 属性配置（children，label，value）
           -->
          <el-cascader
            v-model="ruleForm.rule_id"
            :options="options"
            :props="{
              children: 'child',
              label: 'name',
              value: 'id',
              checkStrictly: true, // 选择任意一级选项
              emitPath: false // true，把当前节点的所有祖先节点的值（value属性指定的值）组成数组（没有祖先元素也是数组），绑定给v-model。false，直接把当前节点的值绑定给v-model。
            }"
            placeholder="请选择上级菜单"
            clearable
          />
        </el-form-item>
        <el-form-item label="菜单/规则" prop="menu">
          <el-radio-group v-model="ruleForm.menu">
            <el-radio :label="1" size="large" border>菜单</el-radio>
            <el-radio :label="0" size="large" border>规则</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="名称"
            clearable
            style="width: 30%;"
          />
        </el-form-item>
        <el-form-item v-if="ruleForm.menu === 1" label="菜单图标" prop="icon">
          <IconSelect v-model="ruleForm.icon" />
        </el-form-item>
        <el-form-item
          v-if="ruleForm.menu === 1 && ruleForm.rule_id > 0"
          label="前端路由"
          prop="frontpath"
        >
          <el-input
            v-model="ruleForm.frontpath"
            placeholder="前端路由path"
            clearable
          />
        </el-form-item>
        <el-form-item
          v-if="ruleForm.menu === 0"
          label="后端规则"
          prop="condition"
        >
          <el-input
            v-model="ruleForm.condition"
            placeholder="后端规则"
            clearable
          />
        </el-form-item>
        <el-form-item v-if="ruleForm.menu === 0" label="请求方式" prop="method">
          <el-select v-model="ruleForm.method">
            <el-option
              v-for="item in ['GET', 'POST', 'PUT', 'DELETE']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="order"
          ><el-input-number v-model="ruleForm.order" :min="0" :max="1000" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<script setup>
/**
 * 布局，左侧菜单栏点击菜单项进入某个页面。该页面下能用ajax发起多个接口的请求。
 * 该权限管理页面，显示页面中接口的规则、菜单项的图标、菜单项对应的前端路由等等。
 */

import { ref } from 'vue'
import ListHeader from '~/components/ListHeader.vue'
import {
  getRuleList,
  createRule,
  updateRule,
  updateRuleStatus,
  deleteRule
} from '~/api/rules'
import { useInitTable, useInitForm } from '~/composables/useCommon'
import FormDrawer from '~/components/FormDrawer.vue'
import IconSelect from '~/components/IconSelect.vue'

const options = ref([])
/**
 * node-key指定:data下的某个属性，作为树节点的唯一标识。注意，node-key前没有:
 * :default-expanded-keys，一个数组。数组元素为树节点的唯一标识。表示该树节点默认展开。
 */
const defaultExpandedKeys = ref([])
const {
  loading,
  tableData,
  getData,
  handleStatusChange,
  handleDelete
} = useInitTable({
  getList: getRuleList,
  onGetListSuccess: res => {
    //一个数组，元素为多个id值。id为一级菜单的id
    defaultExpandedKeys.value = res.list.map(o => o.id)
    options.value = res.rules
  },
  updateStatus: updateRuleStatus,
  delete: deleteRule
})

/**
 * :props，指定:data下两个属性。children表示嵌套的key名，label表示显示的key（对应value）
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
  create: createRule,
  update: updateRule,
  ruleForm: {
    rule_id: 0, //上级菜单ID
    menu: 0, //是否是菜单，0否1是
    name: '', // 菜单/权限名称
    condition: '', // 后端规则，由后端提供的接口别名（menu为0时必填）
    method: 'GET', // 请求方式：GET/POST/PUT/DELETE（menu为0时必填）
    status: 1, // 是否启用
    order: 50, // 排序
    icon: '', // element-plus图标（menu为1必填）
    frontpath: '' // 对应前端路由路径（menu为1且rule_id>0时必填）
  },
  rules: {}
})

// 添加子分类
const addChild = id => {
  handleCreate() // 会重置表单。所以赋值在后面。
  ruleForm.rule_id = id
}
</script>

<style lang="scss" scoped>
:deep(.el-tree-node__content) {
  @apply py-20px;
}
.node {
  @apply flex justify-between items-center w-full text-14px;
  .left {
    @apply flex items-center;
  }
  .right {
    > * {
      @apply ml-15px;
    }
  }
}
</style>
