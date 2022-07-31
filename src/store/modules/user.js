import { setToken, getToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
const state = {
  token: getToken()
}
const mutations = {
  setToken (state, token) {
    state.token = token
  },
  removeToken (state) {
    state.token = null
    removeToken()
  }
}
const actions = {
  async login (context, data) {
    const res = await login(data)
    context.commit('setToken', res.token)
    setToken(res.token)
  },
  async logout (context) {
    context.commit('removeToken')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
