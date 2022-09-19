import { ref, reactive, watch } from 'vue'
import { toast } from '~/composables/util'

/**
 *  封装了 搜索 + 获取表格数据 + 分页 + 修改状态 + 删除数据 的逻辑
 *  修改状态、删除是表格数据的操作。
 *  新增、修改（表格数据）由于会弹出弹层，编辑表单的操作，所以封装到useInitForm中。
 *
 *  有一些逻辑，各个模块是有些不同的。那么对于不同的部分，使用传入参数的方式。
 *
 *  必须导出函数，函数才能接收参数
 */
export function useInitTable (opt = {}) {
  /**
   * 搜索，结构不一定是 {keyword: 'xx'}。例如订单管理 - 订单管理 页面，展开后发现 有多个搜索参数。
   */
  let searchForm = null
  let resetSearchForm = null

  if (opt.searchForm) {
    searchForm = reactive({ ...opt.searchForm })
    resetSearchForm = () => {
      Object.keys(opt.searchForm).forEach(key => {
        searchForm[key] = opt.searchForm[key]
      })
      getData()
    }
  }

  const loading = ref(false)
  // 数据数量
  const total = ref(0)
  // 当前页
  const currentPage = ref(1)
  // 每页显示多少条
  const limit = ref(10)

  const tableData = ref([])

  // 获取表格数据
  async function getData (page) {
    if (typeof page === 'number') currentPage.value = page
    try {
      loading.value = true
      const res = await opt.getList(currentPage.value, searchForm)

      tableData.value = res.list || []
      total.value = res.totalCount

      if (opt.onGetListSuccess && typeof opt.onGetListSuccess === 'function') {
        opt.onGetListSuccess(res)
      }
    } finally {
      loading.value = false
    }
  }

  getData()

  watch(currentPage, () => {
    getData()
  })

  const handleStatusChange = (status, row) => {
    row.statusLoading = true
    opt
      .updateStatus(row.id, status)
      .then(() => {
        toast('修改状态成功')
      })
      .finally(() => {
        row.statusLoading = false
      })
  }

  const handleDelete = async id => {
    try {
      loading.value = true
      await opt.delete(id)
      getData()
      toast('删除成功')
    } finally {
      loading.value = false
    }
  }

  return {
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
  }
}

/**
 * 封装 新增、修改点击逻辑 （点击link，弹出弹层，弹层包含表单）
 */
export function useInitForm (opt = {}) {
  const formDrawerRef = ref(null)
  const ruleFormRef = ref({})
  const ruleForm = reactive({})
  const rules = reactive({})
  const updateId = ref(0)
  const drawerTitle = ref('')

  if (opt.rules)
    Object.keys(opt.rules).forEach(key => (rules[key] = opt.rules[key]))

  const resetSearchForm = defaultForm => {
    Object.keys(defaultForm).forEach(key => {
      ruleForm[key] = defaultForm[key]
    })
  }
  const handleCreate = () => {
    drawerTitle.value = '新增'
    updateId.value = 0
    if (ruleFormRef.value.clearValidate) {
      // 清除验证
      ruleFormRef.value.clearValidate()
    }
    resetSearchForm(opt.ruleForm)
    formDrawerRef.value.open()
  }

  // 可以和创建的方法结合成一个。
  const handleUpdate = async row => {
    drawerTitle.value = '修改'
    updateId.value = row.id
    if (ruleFormRef.value.clearValidate) {
      // 清除验证
      ruleFormRef.value.clearValidate()
    }
    resetSearchForm(row)
    formDrawerRef.value.open()
  }

  async function handleSubmit (ruleFormRef) {
    if (!ruleFormRef) return
    await ruleFormRef.validate(async valid => {
      if (valid) {
        try {
          formDrawerRef.value.showLoading()
          if (drawerTitle.value === '新增') {
            await opt.create(ruleForm)
          } else {
            await opt.update(updateId.value, ruleForm)
          }

          toast(drawerTitle.value + '成功')
          opt.getData(updateId.value ? null : 1)
          formDrawerRef.value.close()
        } finally {
          formDrawerRef.value.hideLoading()
        }
      } else {
        console.log('error submit!')
      }
    })
  }

  return {
    formDrawerRef,
    ruleFormRef,
    ruleForm,
    rules,
    drawerTitle,
    handleCreate,
    handleUpdate,
    handleSubmit
  }
}
