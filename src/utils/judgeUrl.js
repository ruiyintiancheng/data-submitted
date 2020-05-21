import store from '@/store'
console.log(store.state)
/**
 * 判断是否是当期 返回地址
 * @param {*} date
 */
export function getJudgeDateUrl(date) {
  if (!date) {
    return ''
  } else {
    if (store.state.user.currentDate === date) {
      return '/east-current'
    } else {
      return '/east-web'
    }
  }
}

/**
 * 判断是否是江苏苏州用户 返回地址
 */
export function getJudgeDepUrl() {
  if (store.state.user.normalUser === '1') {
    return '/js-web'
  } else {
    return '/east-web'
  }
}

/**
 * 判断时候为当期且是否是江苏苏州用户 返回地址
 * @param {*} date
 */
export function getJudgeUrl(date) {
  if (!date) {
    return ''
  } else {
    console.log('aa' + store.state.user.currentDate)
    console.log('bb' + date)
    if (store.state.user.currentDate === date) {
      if (store.state.user.normalUser === '1') {
        return '/js-current'
      } else {
        return '/east-current'
      }
    } else {
      if (store.state.user.normalUser === '1') {
        return '/js-web'
      } else {
        return '/east-web'
      }
    }
  }
}
