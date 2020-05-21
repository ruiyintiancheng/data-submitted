import { logout, getUserInfo } from '@/api/login'
import { baseRequest } from '@/api/base'
import { getToken, setToken, removeToken } from '@/utils/auth'
// import { closeWebSocket } from '@/utils/websocket'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    ip: '',
    port: '',
    avatar: '',
    introduction: '',
    roles: [],
    buttonJurisdiction: [],
    newsCount: 0,
    setting: {
      articlePlatform: []
    },
    normalUser: '0', // 0 :  普通地区用户， 1：江苏/苏州用户
    currentDate: ''
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_IP: (state, ip) => {
      state.ip = ip
    },
    SET_PORT: (state, port) => {
      state.port = port
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_BJ: (state, buttonJurisdiction) => {
      state.buttonJurisdiction = buttonJurisdiction
    },
    SET_NEWS_COUNT: (state, newsCount) => {
      state.newsCount = newsCount
    },
    SET_NORMAL_USER: (state, normalUser) => {
      state.normalUser = normalUser
    },
    SET_CURRENT_DATE: (state, currentDate) => {
      state.currentDate = currentDate
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, token) {
      // const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', token)
        setToken(token)
        commit('CLEAR_ROUTERS')
        resolve()
        // loginByUsername(username, userInfo.password).then(response => {
        //   const data = response.data.item
        //   commit('SET_TOKEN', data.token)
        //   setToken(data.token)
        //   commit('CLEAR_ROUTERS')
        //   resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          if (!response.data) {
            reject('error')
          }
          const data = response.data.item
          commit('SET_NAME', data.name)
          commit('SET_IP', data.ip)
          commit('SET_PORT', data.port)
          commit('SET_BG_COLOR', data.color)
          commit('SET_LANGUAGE', data.language)
          baseRequest('/checkQuestion/checkIsNormalUser').then(response => {
            commit('SET_NORMAL_USER', response.data.item.result)
          })
          baseRequest('/eastDataQuery/getCjrq').then(response => {
            commit('SET_CURRENT_DATE', response.data.item.result)
          })

          // commit('SET_NORMAL_USER', '1')
          // commit('SET_CURRENT_DATE', '20200331')
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          removeToken()
          // closeWebSocket()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },
    // 写入未读数
    SetNewsCount({ commit }, newsCount) {
      return new Promise(resolve => {
        commit('SET_NEWS_COUNT', newsCount)
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
