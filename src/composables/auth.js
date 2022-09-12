import { useCookies } from '@vueuse/integrations/useCookies'

const TokenKey = 'admin-token'

const cookies = useCookies()

export function getToken () {
  return cookies.get(TokenKey) || ''
}

export function setToken (token) {
  cookies.set(TokenKey, token)
}

export function removeToken () {
  cookies.remove(TokenKey)
}
