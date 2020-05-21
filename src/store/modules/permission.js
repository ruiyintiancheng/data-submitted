import { constantRouterMap, dashboardRouterMap } from '@/router'
const _import = require('@/router/_import_' + process.env.NODE_ENV)
import Layout from '@/views/layout/Layout'
import { deepClone, tranformStr, isRepeatComponent } from '@/utils/index'
// import { baseRequest } from '@/api/base'

/**
 * 设置访问路由的component对应的组件
 * @param {菜单数据} menuData
 */
function setBaseRouter(menuData, baseData, parentPath) {
  for (const item of menuData) {
    if (item.component && item.component !== '') {
      if (!isRepeatComponent(item.component)) {
        item.name = tranformStr(item.component)
      } else {
        item.name = tranformStr(item.path)
        item.meta.name = tranformStr(item.component)
      }
      try {
        item.component = _import(item.component)
      } catch (e) {
        item.component = _import('errorPage/404')
      }
    } else {
      item.component = _import('errorPage/404')
    }
    if (parentPath) {
      item.path = parentPath + '/' + item.path
    } else {
      item.path = item.path + ''
    }
    if (item.children && item.children.length > 0) {
      setBaseRouter(item.children, baseData, item.path)
    } else {
      if (item.query) {
        try {
          item.meta.query = JSON.parse(item.query)
        } catch (error) {
          console.log(error)
        }
      }
      // console.log(item)

      baseData.push(item)
    }
  }
}

var leftDataMap = {} // 左侧菜单集合
/**
 * 设置顶层菜单 和左侧菜单集合
 * @param {原始数据} topData
 */
function setSideRouter(topData) {
  for (const item of topData) {
    item.path = item.path + ''
    item.name = item.path
    if (
      item.children &&
      item.children[0] &&
      item.children[0].meta.type === '2'
    ) {
      const children = item.children
      setleftIdToString(children)
      leftDataMap[item.name] = children
      item.path = ''
      delete item.children
    }
    if (item.children) {
      setSideRouter(item.children)
    }
  }
}

/**
 * 吧id改为String
 * @param {children集合} list
 */
function setleftIdToString(list) {
  for (const iterator of list) {
    iterator.path = iterator.path + ''
    if (iterator.children && iterator.children[0]) {
      setleftIdToString(iterator.children)
    }
  }
}

/**
 * 设置路由最外层layout组件
 * @param {数据菜单} menuData
 */
function setLayout(menuData) {
  const baseMenu = []
  for (const iterator of menuData) {
    const itemMenu = {
      path: '/',
      component: Layout,
      children: [iterator]
    }
    baseMenu.push(itemMenu)
  }
  return baseMenu
}

/**
 * 设置左侧菜单的真实路径
 */
function getFathPath(leftRoutes, path) {
  for (const iterator of leftRoutes) {
    if (!iterator.meta.fathPath) {
      iterator.path = path + '/' + iterator.path
      iterator.meta.fathPath = true
    }
    if (iterator.children && iterator.children.length !== 0) {
      getFathPath(iterator.children, iterator.path)
    }
  }
}

const permission = {
  state: {
    routers: [],
    sideTitle: '', // 侧标题
    addRouters: [],
    topRouters: [],
    leftMap: {},
    leftRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    CLEAR_ROUTERS: state => {
      state.routers = []
    },
    SET_TOP_ROUTERS: (state, routers) => {
      state.topRouters = dashboardRouterMap.concat(routers)
    },
    SET_LEFT_MAP: (state, map) => {
      state.leftMap = map
    },
    SET_LEFT_ROUTERS: (state, routers) => {
      state.leftRouters = routers
    },
    SET_SIDE_TITLE: (state, title) => {
      state.sideTitle = title
    }
  },
  actions: {
    // 设置侧标题
    setSideTitle({ commit }, titile) {
      return new Promise(resolve => {
        commit('SET_SIDE_TITLE', titile)
        resolve()
      })
    },
    GenerateLeftRoutes({ commit }, parmObj) {
      return new Promise(resolve => {
        getFathPath(parmObj.leftRoutes, parmObj.path)
        commit('SET_LEFT_ROUTERS', parmObj.leftRoutes)
        resolve()
      })
    },
    GenerateRoutes({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        // baseRequest('/function/getMenu').then(response => {
        //   if (response.data.item[0] && response.data.item[0].children) {
        //     response.data.item[0].children.unshift({ 'path': 'dashboard', 'component': 'dashboard/index', 'meta': { 'icon': 'home', 'title': '首页', 'type': '2', 'hidden': true }})
        //   }
        //   const menuData = response.data.item
        //   const newData = deepClone(menuData)
        //   var baseData = [] // 路由数据数组
        //   setBaseRouter(menuData, baseData)
        //   const baseMenu = setLayout(baseData)
        //   commit('SET_ROUTERS', baseMenu)

        //   leftDataMap = {}
        //   setSideRouter(newData)
        //   commit('SET_TOP_ROUTERS', newData)
        //   commit('SET_LEFT_MAP', leftDataMap)
        //   resolve()
        // }).catch(error => {
        //   reject(error)
        // })
        const menuData = [
          {
            path: 10000,
            meta: {
              title: '报送管理',
              type: 'top'
            },
            children: [
              {
                path: '140',
                meta: { title: '重算管理', type: 'top' },
                children: [
                  {
                    path: '1401',
                    component: 'branchSubmission/index',
                    meta: { title: '分行报送', type: '2' }
                  },
                  {
                    path: '1402',
                    component: 'periodRecalculation/index',
                    meta: { title: '单期重算', type: '2' }
                  }
                ]
              },
              {
                path: '139',
                component: 'replacementUpdate/index',
                meta: { title: '补录更新', type: 'top' },
                children: [
                  {
                    path: '100200100000',
                    meta: {
                      icon: 'documentation',
                      title: '一、公共信息',
                      type: '2'
                    },
                    children: [
                      {
                        path: '985248',
                        component: 'replacementUpdate/index',
                        meta: {
                          title: '1. 机构信息表',
                          type: '2',
                          id: '00101'
                        },
                        query: '{ "tableCode": "00102" }'
                      },
                      {
                        path: '65845',
                        component: 'replacementUpdate/index',
                        meta: { title: '2. 员工表', type: '2', id: '00102' },
                        query: '{ "tableCode": "00303" }'
                      }
                    ]
                  }
                ]
              },
              {
                path: '138',
                component: 'totalScoreCheck/index',
                meta: { title: '总分核对', type: 'top' }
              },
              {
                path: '137',
                component: 'statisticalAnalysis/index',
                meta: { title: '统计分析', type: 'top' }
              },
              {
                path: '136',
                component: 'dataVerification/index',
                meta: { title: '数据校验', type: 'top' }
              },
              {
                path: '135',
                component: 'reportingManagement/index',
                meta: { title: '报送管理', type: 'top' }
              },
              {
                path: '100200000000',
                meta: { title: '数据查询', type: 'top' },
                children: [
                  {
                    path: '100200100000',
                    meta: {
                      icon: 'documentation',
                      title: '一、公共信息',
                      type: '2'
                    },
                    children: [
                      {
                        path: '100200100100',
                        component: 'publicReport/east',
                        meta: {
                          title: '1. 机构信息表',
                          type: '2',
                          id: '00101'
                        },
                        query: '{ "tableCode": "00101" }'
                      },
                      {
                        path: '100200100200',
                        component: 'publicReport/east',
                        meta: { title: '2. 员工表', type: '2', id: '00102' },
                        query: '{ "tableCode": "00303" }'
                      },
                      {
                        path: '100200100300',
                        component: 'publicReport/east',
                        meta: { title: '3. 柜员表', type: '2', id: '00103' }
                      },
                      {
                        path: '100200100400',
                        component: 'publicReport/east',
                        meta: { title: '4. 岗位信息表', type: '2', id: '00104' }
                      },
                      {
                        path: '100200100500',
                        component: 'publicReport/east',
                        meta: { title: '5. 机构关系表', type: '2', id: '00105' }
                      }
                    ]
                  },
                  {
                    path: '100200200000',
                    meta: {
                      icon: 'documentation',
                      title: '二、会计记账信息',
                      type: '2'
                    },
                    children: [
                      {
                        path: '100200200100',
                        component: 'publicReport/east',
                        meta: {
                          title: '6. 总账会计全科目表',
                          type: '2',
                          id: '00201'
                        }
                      },
                      {
                        path: '100200200200',
                        component: 'publicReport/east',
                        meta: {
                          title: '7. 内部科目对照表',
                          type: '2',
                          id: '00203'
                        }
                      },
                      {
                        path: '100200200300',
                        component: 'publicReport/east',
                        meta: {
                          title: '8. 个人活期存款分户账',
                          type: '2',
                          id: '00204'
                        }
                      },
                      {
                        path: '100200200400',
                        component: 'publicReport/east',
                        meta: {
                          title: '9. 个人活期存款分户账明细记录',
                          type: '2',
                          id: '00205'
                        }
                      },
                      {
                        path: '100200200500',
                        component: 'publicReport/east',
                        meta: {
                          title: '10. 个人定期存款分户账',
                          type: '2',
                          id: '00206'
                        }
                      },
                      {
                        path: '100200200600',
                        component: 'publicReport/east',
                        meta: {
                          title: '11. 个人定期存款分户账明细记录',
                          type: '2',
                          id: '00207'
                        }
                      },
                      {
                        path: '100200200700',
                        component: 'publicReport/east',
                        meta: {
                          title: '12. 对公活期存款分户账',
                          type: '2',
                          id: '00208'
                        }
                      },
                      {
                        path: '100200200800',
                        component: 'publicReport/east',
                        meta: {
                          title: '13. 对公活期存款分户账明细记录',
                          type: '2',
                          id: '00209'
                        }
                      },
                      {
                        path: '100200200900',
                        component: 'publicReport/east',
                        meta: {
                          title: '14. 对公定期存款分户账',
                          type: '2',
                          id: '00210'
                        }
                      },
                      {
                        path: '100200201000',
                        component: 'publicReport/east',
                        meta: {
                          title: '15. 对公定期存款分户账明细记录',
                          type: '2',
                          id: '00211'
                        }
                      },
                      {
                        path: '100200201100',
                        component: 'publicReport/east',
                        meta: {
                          title: '16. 内部分户账',
                          type: '2',
                          id: '00212'
                        }
                      },
                      {
                        path: '100200201200',
                        component: 'publicReport/east',
                        meta: {
                          title: '17. 内部分户账明细记录',
                          type: '2',
                          id: '00213'
                        }
                      },
                      {
                        path: '100200201300',
                        component: 'publicReport/east',
                        meta: {
                          title: '18. 个人信贷分户账',
                          type: '2',
                          id: '00214'
                        }
                      },
                      {
                        path: '100200201400',
                        component: 'publicReport/east',
                        meta: {
                          title: '19. 个人信贷分户账明细记录',
                          type: '2',
                          id: '00215'
                        }
                      },
                      {
                        path: '100200201500',
                        component: 'publicReport/east',
                        meta: {
                          title: '20. 对公信贷分户账',
                          type: '2',
                          id: '00216'
                        }
                      },
                      {
                        path: '100200201600',
                        component: 'publicReport/east',
                        meta: {
                          title: '21. 对公信贷分户账明细记录',
                          type: '2',
                          id: '00217'
                        }
                      }
                    ]
                  },
                  {
                    path: '100200300000',
                    meta: {
                      icon: 'documentation',
                      title: '三、客户信息',
                      type: '2'
                    },
                    children: [
                      {
                        path: '100200300100',
                        component: 'publicReport/east',
                        meta: {
                          title: '22. 个人基础信息',
                          type: '2',
                          id: '00301'
                        }
                      },
                      {
                        path: '100200300200',
                        component: 'publicReport/east',
                        meta: {
                          title: '23. 个人客户关系信息',
                          type: '2',
                          id: '00302'
                        }
                      },
                      {
                        path: '100200300300',
                        component: 'publicReport/east',
                        meta: { title: '24. 对公客户', type: '2', id: '00303' }
                      },
                      {
                        path: '100200300400',
                        component: 'publicReport/east',
                        meta: { title: '25. 股东信息', type: '2', id: '00304' }
                      },
                      {
                        path: '100200300500',
                        component: 'publicReport/east',
                        meta: { title: '26. 关联关系', type: '2', id: '00305' }
                      }
                    ]
                  },
                  {
                    path: '100200400000',
                    meta: {
                      icon: 'documentation',
                      title: '四、授信交易对手信息',
                      type: '2'
                    },
                    children: [
                      {
                        path: '100200400100',
                        component: 'publicReport/east',
                        meta: {
                          title: '27. 信贷合同表',
                          type: '2',
                          id: '00401'
                        }
                      },
                      {
                        path: '100200400200',
                        component: 'publicReport/east',
                        meta: {
                          title: '28. 项目贷款信息表',
                          type: '2',
                          id: '00402'
                        }
                      },
                      {
                        path: '100200400300',
                        component: 'publicReport/east',
                        meta: {
                          title: '29. 票据票面信息表',
                          type: '2',
                          id: '00403'
                        }
                      },
                      {
                        path: '100200400400',
                        component: 'publicReport/east',
                        meta: {
                          title: '30. 表外授信业务',
                          type: '2',
                          id: '00405'
                        }
                      },
                      {
                        path: '100200400500',
                        component: 'publicReport/east',
                        meta: {
                          title: '31. 贸易融资业务信息表',
                          type: '2',
                          id: '00406'
                        }
                      },
                      {
                        path: '100200400600',
                        component: 'publicReport/east',
                        meta: { title: '32. 银团贷款', type: '2', id: '00407' }
                      },
                      {
                        path: '100200400700',
                        component: 'publicReport/east',
                        meta: { title: '33. 委托贷款', type: '2', id: '00408' }
                      },
                      {
                        path: '100200400800',
                        component: 'publicReport/east',
                        meta: {
                          title: '34. 个人信贷业务借据',
                          type: '2',
                          id: '00409'
                        }
                      },
                      {
                        path: '100200400900',
                        component: 'publicReport/east',
                        meta: {
                          title: '35. 对公信贷业务借据',
                          type: '2',
                          id: '00410'
                        }
                      },
                      {
                        path: '100200401000',
                        component: 'publicReport/east',
                        meta: {
                          title: '36. 信贷业务担保合同',
                          type: '2',
                          id: '00411'
                        }
                      },
                      {
                        path: '100200401100',
                        component: 'publicReport/east',
                        meta: { title: '37. 担保关系', type: '2', id: '00412' }
                      },
                      {
                        path: '100200401200',
                        component: 'publicReport/east',
                        meta: {
                          title: '38. 信贷业务质或抵押物',
                          type: '2',
                          id: '00413'
                        }
                      }
                    ]
                  },
                  {
                    path: '100200500000',
                    meta: {
                      icon: 'documentation',
                      title: '五、卡片信息',
                      type: '2'
                    },
                    children: [
                      {
                        path: '100200500100',
                        component: 'publicReport/east',
                        meta: {
                          title: '39. 借记卡信息',
                          type: '2',
                          id: '00501'
                        }
                      },
                      {
                        path: '100200500200',
                        component: 'publicReport/east',
                        meta: { title: '40. 存折信息', type: '2', id: '00502' }
                      },
                      {
                        path: '100200500300',
                        component: 'publicReport/east',
                        meta: {
                          title: '41. 信用卡信息',
                          type: '2',
                          id: '00503'
                        }
                      },
                      {
                        path: '100200500400',
                        component: 'publicReport/east',
                        meta: {
                          title: '42. 信用卡账户交易明细记录',
                          type: '2',
                          id: '00504'
                        }
                      }
                    ]
                  },
                  {
                    path: '100200600000',
                    meta: {
                      icon: 'documentation',
                      title: '六、信贷管理信息',
                      type: '2'
                    },
                    children: [
                      {
                        path: '100200600100',
                        component: 'publicReport/east',
                        meta: { title: '43. 授信信息', type: '2', id: '00601' }
                      },
                      {
                        path: '100200600200',
                        component: 'publicReport/east',
                        meta: { title: '44. 贷款核销', type: '2', id: '00602' }
                      },
                      {
                        path: '100200600300',
                        component: 'publicReport/east',
                        meta: { title: '45. 贷款展期', type: '2', id: '00603' }
                      },
                      {
                        path: '100200600400',
                        component: 'publicReport/east',
                        meta: {
                          title: '46. 信贷资产转让',
                          type: '2',
                          id: '00604'
                        }
                      },
                      {
                        path: '100200600500',
                        component: 'publicReport/east',
                        meta: {
                          title: '47. 资产转让关系表',
                          type: '2',
                          id: '00605'
                        }
                      },
                      {
                        path: '100200600600',
                        component: 'publicReport/east',
                        meta: {
                          title: '48. 贷款五级形态变动',
                          type: '2',
                          id: '00606'
                        }
                      }
                    ]
                  },
                  {
                    path: '100200700000',
                    meta: {
                      icon: 'documentation',
                      title: '七、交易流水信息',
                      type: '2'
                    },
                    children: [
                      {
                        path: '100200700100',
                        component: 'publicReport/east',
                        meta: { title: '49. 交易流水', type: '2', id: '00701' }
                      }
                    ]
                  },
                  {
                    path: '100200800000',
                    meta: {
                      icon: 'documentation',
                      title: '八、统计全科目',
                      type: '2'
                    },
                    children: [
                      {
                        path: '100200800100',
                        component: 'publicReport/east',
                        meta: {
                          title: '50. 资产负债科目统计表',
                          type: '2',
                          id: '00801'
                        }
                      },
                      {
                        path: '100200800200',
                        component: 'publicReport/east',
                        meta: {
                          title: '51. 涉农统计表',
                          type: '2',
                          id: '00802'
                        }
                      }
                    ]
                  },
                  {
                    path: '100200900000',
                    meta: {
                      icon: 'documentation',
                      title: '九、资金业务',
                      type: '2'
                    },
                    children: [
                      {
                        path: '100200900100',
                        component: 'publicReport/east',
                        meta: {
                          title: '52. 资金交易信息表',
                          type: '2',
                          id: '01001'
                        }
                      },
                      {
                        path: '100200900200',
                        component: 'publicReport/east',
                        meta: {
                          title: '53. 金融工具信息表',
                          type: '2',
                          id: '01002'
                        }
                      },
                      {
                        path: '100200900300',
                        component: 'publicReport/east',
                        meta: {
                          title: '54. 汇率信息表',
                          type: '2',
                          id: '01003'
                        }
                      }
                    ]
                  },
                  {
                    path: '100201000000',
                    meta: {
                      icon: 'documentation',
                      title: '十、理财业务',
                      type: '2'
                    },
                    children: [
                      {
                        path: '100201000100',
                        component: 'publicReport/east',
                        meta: {
                          title: '55. 理财产品信息表',
                          type: '2',
                          id: '01101'
                        }
                      },
                      {
                        path: '100201000200',
                        component: 'publicReport/east',
                        meta: {
                          title: '56. 理财产品状态表',
                          type: '2',
                          id: '01102'
                        }
                      },
                      {
                        path: '100201000300',
                        component: 'publicReport/east',
                        meta: {
                          title: '57. 客户理财账户信息表',
                          type: '2',
                          id: '01103'
                        }
                      },
                      {
                        path: '100201000400',
                        component: 'publicReport/east',
                        meta: {
                          title: '58. 理财产品销售明细记录',
                          type: '2',
                          id: '01104'
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            path: 30,
            component: null,
            children: [
              {
                path: 130,
                component: 'sqlSearch/index',
                meta: {
                  title: 'sql查询',
                  type: '2'
                }
              },
              {
                path: 134,
                component: 'mySearch/index',
                meta: {
                  title: '我的查询',
                  type: '2'
                }
              },
              {
                path: 43,
                component: 'modelDefine/index',
                meta: {
                  title: '模型定义',
                  type: '2'
                }
              },
              {
                path: 303,
                component: 'functionConfiguration/index',
                meta: {
                  title: '函数配置',
                  type: '2'
                }
              },
              {
                path: 302,
                component: 'modelCalculation/index',
                meta: {
                  title: '模型计算',
                  type: '2'
                }
              },
              {
                path: 3011,
                component: 'svg-icons/index',
                meta: {
                  title: '图标',
                  type: '2'
                }
              }
            ],
            meta: {
              icon: 'system',
              title: '数据筛查',
              type: '1'
            },
            parentId: 0
          }
        ]
        const newData = deepClone(menuData)
        var baseData = [] // 路由数据数组
        setBaseRouter(menuData, baseData)
        const baseMenu = setLayout(baseData)
        commit('SET_ROUTERS', baseMenu)

        leftDataMap = {}
        setSideRouter(newData)
        commit('SET_TOP_ROUTERS', newData)
        commit('SET_LEFT_MAP', leftDataMap)
        resolve()
      })
    }
  }
}

export default permission
