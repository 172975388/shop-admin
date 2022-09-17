<template>
  <!-- v-loading是element plus提供的自定义指令 -->
  <el-aside class="image-aside" v-loading="loading">
    <div class="aside-list">
      <!-- click没有被defineEmits，所以触发的是原生click。 -->
      <AsideListItem
        v-for="item in list"
        :key="item.id"
        :active="activeId === item.id"
        @edit="handleEdit(item)"
        @delete="handleDelete(item.id)"
        @click="handleChangeActiveId(item.id)"
        >{{ item.name }}</AsideListItem
      >
    </div>
    <div class="aside-page">
      <!-- 
        total是数据个数而不是页数。页数根据数据个数和每页数量计算得来。
        page-size  每页显示多少条
        current-page 当前页码

        使用组件的v-model，监听组件模板内对应数据的改变。这里就是点击页码时currentPage将被改变为点击的页码。
        使用watch监听到改变，从而发起ajax
      -->
      <el-pagination
        background
        layout="prev, next"
        :total="total"
        v-model:current-page="currentPage"
        :page-size="limit"
      />
    </div>
  </el-aside>

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
      <el-form-item label="相册名称" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input-number v-model="ruleForm.order" :min="1" :max="1000" />
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import AsideListItem from '~/components/AsideListItem.vue'
import FormDrawer from '~/components/FormDrawer.vue'
import {
  getImageClassList,
  createImageClass,
  updateImageClass,
  deleteImageClass
} from '~/api/image_class'
import { ref, watch, reactive } from 'vue'
import { toast } from '~/composables/util'

const loading = ref(false)
const activeId = ref()

// 数据数量
const total = ref(0)
// 当前页
const currentPage = ref(1)
// 每页显示多少条
const limit = ref(10)

const list = ref([])

const emit = defineEmits(['change'])

/**
 * id是当前图片分类的id。这个值，ImageMain需要该值去获取图片分类下的图片。
 * handleChangeActiveId，在图片分类列表被点击时调用，改变激活的id。当页面一开始加载时，默认激活id是第一个图片分类的id
 * 当图片分类id（当前激活）改变时，向父组件抛出change事件。父组件监听change事件，调用ImageMain暴露的loadData函数。
 * 
 * 还有一种办法是，activeId存在父组件，因为两个子组件都要使用这个值。
 */ 

function handleChangeActiveId(id) {
  activeId.value = id
  emit('change', id)
}

async function getData () {
  try {
    loading.value = true
    const res = await getImageClassList(currentPage.value)
    list.value = res.list || []
    total.value = res.totalCount

    if (list.value[0]) {
      handleChangeActiveId(list.value[0].id)
    }
  } finally {
    loading.value = false
  }
}

watch(currentPage, () => {
  getData()
})

// setup在创建组件实例前调用。所以ajax请求直接写在setup中。
getData()

const formDrawerRef = ref(null)
const drawerTitle = ref('')

// 创建图片分类
const handleCreate = () => {
  ruleForm.name = ''
  ruleForm.order = 50
  drawerTitle.value = '新增'
  formDrawerRef.value.open()
}

defineExpose({
  handleCreate
})

const ruleFormRef = ref()
const ruleForm = reactive({
  name: '',
  order: 50
})

const ImageClassId = ref(0)

const rules = reactive({
  name: [{ required: true, message: '图库分类名不能为空', trigger: 'blur' }]
})

async function handleSubmit (ruleFormRef) {
  if (!ruleFormRef) return
  await ruleFormRef.validate(async valid => {
    if (valid) {
      try {
        formDrawerRef.value.showLoading()
        if (drawerTitle.value === '新增') {
          await createImageClass(ruleForm)
        } else {
          await updateImageClass(ImageClassId.value, ruleForm)
        }

        toast(drawerTitle.value + '成功')
        getData(drawerTitle.value === '新增' ? currentPage.value : 1)
        formDrawerRef.value.close()
      } finally {
        formDrawerRef.value.hideLoading()
      }
    } else {
      console.log('error submit!')
    }
  })
}

// 修改图片分类
const handleEdit = item => {
  drawerTitle.value = '修改'
  ImageClassId.value = item.id
  ruleForm.name = item.name
  ruleForm.order = item.order
  formDrawerRef.value.open()
}

const handleDelete = async id => {
  try {
    loading.value = true
    await deleteImageClass(id)
    toast('删除成功')
    getData(currentPage.value)
  } finally {
    loading.value = false
  }
}


</script>

<style lang="scss" scoped>
.image-aside {
  @apply w-220px relative;
  border-right: 1px solid #eee;
  .aside-list {
    //  inset-x-0 即 left-0 right-0
    @apply absolute top-0 inset-x-0 bottom-50px overflow-auto;
  }
  .aside-page {
    @apply flex items-center  absolute bottom-0 h-50px inset-x-0;
  }
}
</style>
