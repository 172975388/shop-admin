import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { toast, showModal } from '~/composables/util'
import { updatePassword } from '~/api/manager'

import { ref, reactive } from 'vue'

export function useRepassword () {
  const store = useStore()
  const router = useRouter()
  const formDrawerRef = ref()

  // 组件上ref，在js中得这么写才能拿到组件实例。
  const ruleFormRef = ref()

  const form = reactive({
    oldpassword: '',
    password: '',
    repassword: ''
  })

  const rules = {
    oldpassword: [
      { required: true, message: '旧密码不能为空', trigger: 'blur' }
    ],
    password: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
    repassword: [
      { required: true, message: '确认密码不能为空', trigger: 'blur' }
    ]
  }

  const submitForm = ruleFormRef => {
    ruleFormRef.validate(async valid => {
      if (valid) {
        formDrawerRef.value.showLoading()
        try {
          // 假如token失效，然后发起修改密码请求，那么就要判断error返回的接口定义的code类型。如果是非法token的code，就退出登录，提示用户信息失效，请先重新登录
          await updatePassword(form)
          await store.dispatch('logout')
          toast('修改密码成功，请重新登录')
          router.push('/login')
        } catch (error) {
          console.log(error)
        } finally {
          formDrawerRef.value.hideLoading()
        }
      } else {
        console.log('验证失败')
        return false
      }
    })
  }

  const openRepasswordForm = () => formDrawerRef.value.open()

  return {
    formDrawerRef,
    ruleFormRef,
    form,
    rules,
    submitForm,
    openRepasswordForm
  }
}

export function useLogout () {
  // const这两行不能放在export外。因为useStore、useRouter只能在组件script setup中使用。
  // https://stackoverflow.com/questions/65340740/vue-3-inject-can-only-be-used-inside-setup-or-functional-components
  const store = useStore()
  const router = useRouter()
  function logout () {
    showModal('确定退出？').then(async () => {
      await store.dispatch('logout')
      router.push('/login')
      toast('退出登录', 'success')
    })
  }
  return {
    logout
  }
}
