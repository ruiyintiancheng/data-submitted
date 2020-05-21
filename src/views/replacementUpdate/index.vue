/*
 * @Author: wk 
 * @Date: 2020-03-13 14:55:26 
 * @Last Modified by: wk
 * @Last Modified time: 2020-05-15 12:52:16
 * @Description:  补录更新
 */
<template>
  <div class="my-search bulu">
    <div class="my-search-right">
      <div class="base-row">
        <div class="row-botton clearfix">
          <div class="row-title">
            <svg-icon icon-class="search" />
            <span>筛选查询</span>
          </div>
          <div class="row-option">
            <el-button icon="el-icon-search"
                       @click="searchOption()"
                       type="primary">查询</el-button>
            <el-button icon="el-icon-refresh"
                       @click="getOption">重置</el-button>
            <a @click="searchToggle=false"
               v-if="searchToggle">
              <svg-icon icon-class="up" />&nbsp;收起 </a>
            <a @click="searchToggle=true"
               v-else>
              <svg-icon icon-class="down" />&nbsp;展开</a>
          </div>
        </div>
        <div v-show="false">
          <div class="search-filter">
            <el-row :gutter="24"
                    v-if="conditionOptionReset">
              <div v-for="(item,prop) in queryJson"
                   :key="prop">
                <el-col v-if="item.criteria.length>0"
                        @click.native="openConditionDialog(prop)"
                        class="search-box"
                        :span="4">
                  <div class="search-item">
                    <span>{{conditionStr(item,prop)}}</span>
                    <div class="filter-delete"
                         @click.stop="clearCondition(prop)"><i class="el-icon-close"></i></div>
                  </div>
                </el-col>
              </div>
            </el-row>
          </div>
        </div>
        <!--            32132132132132132132131        -->
        <div v-show="searchToggle"
             class="form-search">
          <el-form ref="form"
                   :inline="true"
                   :model="searchData"
                   class="demo-table-expand">

            <div class="east-input-both-3"
                 style="min-width: 343px;vertical-align: top"
                 v-for="(item,i) in searchData"
                 :key="i">
              <el-form-item v-if="item.pageType==='text2'||item.pageType==='text1'">
                <span class="input-label">{{item.columnChnName}}</span>
                <el-input size="medium "
                          class="form-input"
                          v-model="item.value"
                          clearable
                          style="width:240px"></el-input>
              </el-form-item>
              <el-form-item v-if="item.pageType==='organ2'?true:item.entityType==='1'">
                <span class="input-label">{{item.columnChnName}}</span>
                <treeselect :multiple="true"
                            style="width:240px"
                            v-model="item.value"
                            class="input-condition"
                            placeholder=""
                            :valueConsistsOf="'ALL'"
                            :defaultExpandLevel="5"
                            :clearable="false"
                            :clear-on-select="true"
                            :close-on-select="true"
                            :limit="1"
                            :limitText="(count) => `+ ${count}`"
                            :options="mechanismSet">
                </treeselect>
              </el-form-item>
            </div>
            <div class="east-input-both-3"
                 style="min-width: 343px;vertical-align: top">
              <el-form-item>
                <span class="input-label">采集日期</span>
                <el-date-picker v-model="value2"
                                type="month"
                                value-format="yyyy-MM"
                                style="width:240px"
                                placeholder="选择月">
                </el-date-picker>
              </el-form-item>
            </div>
            <!-- <el-form-item style="margin-left:60px">
              <span class="input-label">数据源类型</span>
              <el-select class="form-input"
                         v-model="searchData.dsType"
                         size="medium "
                         clearable
                         style="width:255px"
                         placeholder="">
                <el-option label="Oracle"
                           value="1"></el-option>
                <el-option label="DB2"
                           value="2"></el-option>
                <el-option label="MySql"
                           value="3"></el-option>
              </el-select>
            </el-form-item> -->
          </el-form>
        </div>
      </div>
      <div class="base-row">
        <div class="row-botton clearfix">
          <div class="row-title">
            <svg-icon icon-class="ul" />
            <span>数据列表</span>
          </div>
          <div class="row-option">
            <el-dropdown @command="exportHandle">
              <el-button size="mini"
                         :disabled="tableData.length <= 0 || currentHead.length <= 0"
                         :loading="exportLoading">
                导出<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">当前页</el-dropdown-item>
                <el-dropdown-item command="2">全部</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <el-dropdown :hide-on-click="false">
              <el-button size="mini"
                         :disabled="orderJson.length<=0">
                排序选项<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item,index) in orderJson"
                                  :key="index">
                  <div class="order-options-item clearfix">
                    <span class="order-text-option">
                      {{headData.find(val => val.property === item.column).label}}&nbsp;&nbsp;
                    </span>
                    <i @click="deleteOrderColumn(index)"
                       class="el-icon-delete order-delete-option"></i>
                    <i @click="updateOrderColumn(item)"
                       class="el-icon-sort order-update-option"></i>
                    <span class="order-type-option">
                      {{item.type==='1'?'升序':'降序'}}&nbsp;&nbsp;
                    </span>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
            <!-- <el-select v-model="chooseFields"
                       collapse-tags
                       multiple
                       placeholder="字段筛选"
                       @change="selectHandle"
                       style="width:250px;">
              <el-option v-for="item in headData"
                         :key="item.property"
                         :label="item.label"
                         :value="item.property">
              </el-option>
            </el-select> -->
            <a @click="tableToggle=false"
               v-if="tableToggle">
              <svg-icon icon-class="up" />&nbsp;收起</a>
            <a @click="tableToggle=true"
               v-else>
              <svg-icon icon-class="down" />&nbsp;展开</a>
          </div>
        </div>
        <!-- 表格 -->
        <el-table :data="tableData"
                  style="width: 100%;"
                  stripe
                  fit
                  ref="tableh"
                  border
                  highlight-current-row
                  :row-class-name="tableRowClassName"
                  header-cell-class-name="ai-el-table-header"
                  @cell-click="handle"
                  v-loading="listLoading"
                  :height="tableHeight"
                  element-loading-text="给我一点时间">
          <el-table-column type="index"
                           width="50"
                           label="序号"></el-table-column>
          <el-table-column v-for="(item,index) in currentHead"
                           min-width="170"
                           align="center"
                           :key="index"
                           :label="item.label"
                           :class-name="jiashen(item.isEdit)">
            <template slot-scope="scope">
              <el-input size="mini"
                        class="form-input"
                        @focus="inputFocus(scope.row[item.property])"
                        @blur="inputBlur(scope.row,item,scope.row[item.property])"
                        v-if="scope.row.index === tabClickIndex && tabClickLabel === item.label&&item.isEdit==='1'"
                        v-model="scope.row[item.property]"></el-input>
              <span v-else>{{scope.row[item.property]}}</span>
            </template></el-table-column>
        </el-table>
        <el-pagination background
                       v-show="tableToggle&&headData.length>0"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="pageNo"
                       :page-sizes="[10,20,30,50]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="currentColumn.label"
               append-to-body
               v-el-drag-dialog
               :close-on-click-modal="false"
               :visible.sync="conditionVisable"
               width="40%"
               custom-class="dialog-default">
      <div class="dialog-contant-default"
           v-if="conditionVisable">
        <condition-option ref="conditionOption"
                          :queryJson="currentJson"
                          :componentType="componentType"
                          :componentParam="componentParam"></condition-option>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="conditionVisable = false">取消</el-button>
        <el-button @click="clearCondition()">清除</el-button>
        <el-button type="primary"
                   @click="confirmCondition()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
import SearchForm from 'search-form-ry'
import { baseRequest } from '@/api/base'
import { baseSearch } from '@/api/base'
import { basicDownload } from '@/utils/download'
import conditionOption from '../../components/ConditionOption'
import { deepClone } from '@/utils/index'
export default {
  components: {
    conditionOption,
    SearchForm,
    Treeselect
  },
  name: 'replacementUpdateIndex',
  computed: {
    containHeight: function() {
      return this.$store.state.app.containHeight - 10
    },
    currentHead: function() {
      for (const item of this.headData) {
        item.displayFlag = '1'
      }
      return this.headData.filter(item => item.displayFlag === '1')
      // return this.headData
    }
  },
  data() {
    return {
      focusValue: null, // 失焦比较
      tabClickIndex: null, // 点击的单元格
      tabClickLabel: '', // 当前点击的列名
      searchData: {},
      mechanismSet: [], // 机构数
      mechanismValue: null, // 机构数选定值
      value2: null, // 月份
      configData: {}, // 模板数据
      // 加载导出
      exportLoading: false,
      // 选中列
      chooseFields: [],
      // 表格高度
      tableHeight: 0,
      pageSize: null,
      pageNo: 1,
      total: null,
      // 当前树节点
      currentTreeNode: {},
      // 遮罩
      listLoading: false,
      // if重新加载dom
      conditionOptionReset: true,
      conditionReset: true,
      // 当前点击列
      currentColumn: {},
      // 当前点击查询json
      currentJson: [],
      // 结果类型
      componentType: '1',
      // 类型选项值
      componentParam: null,
      // 条件开关
      conditionVisable: false,
      // 列信息
      headData: [],
      // 数据信息
      tableData: [],
      // 所有条件JSON
      queryJson: {},
      // 所有排序JSON
      orderJson: [],
      tableToggle: true,
      searchToggle: true,
      // 是否展开
      explosion: true,
      // 分类树数据
      claTreeData: [],
      defaultProps: { // 树对应关系
        children: 'children',
        label: 'groupName'
      }
    }
  },
  watch: {
    '$route'(to, from) {
      // console.log(from)
      if (this.$store.state.publicReport.publicReports[to.name]) {
        this.getHistory()
      } else {
        // this.getOrganizationNumber()
        // this.getConfigData()
        this.getOption()
      }
    },
    // '$route': function (newUrl, oldUrl) {
    //   if (newUrl.meta.query && oldUrl.meta.query) {
    //     if (newUrl.meta.query.tableCode !== oldUrl.meta.query.tableCode) {
    //       this.getConfigData()
    //       this.getOption()
    //     }
    //   }
    //   // if (newUrl !== oldUrl) {
    //   //   this.getConfigData()
    //   //   this.getOption()
    //   // }
    // },
    searchToggle() {
      this.getTableHeight()
    }
  },
  created() {
    // this.getTree()
    // if (this.$store.state.publicReport.publicReports[this.$route.name]) {
    //   this.getHistory()
    // } else {
    //   // this.getOrganizationNumber()
    //   // this.getConfigData()
    //   this.getOption()
    // }
  },
  beforeRouteLeave(to, from, next) {
    const tagExsit = this.$store.state.tagsView.cachedViews.find(function(value, index, arr) {
      return value === from.name
    })
    if (tagExsit) {
      this.saveHistory(from.name)
    } else {
      this.deleteHistory(from.name)
    }
    next()
  },
  mounted() {
    // this.getTree()
    if (this.$store.state.publicReport.publicReports[this.$route.name]) {
      this.getHistory()
    } else {
      // this.getOrganizationNumber()
      // this.getConfigData()
      this.getOption()
    }
    // this.getOrganizationNumber()
    // this.getConfigData()
    // this.getOption()
  },
  methods: {
    jiashen(item) {
      if (item === '1') {
        return 'editstyle'
      } else {
        return ''
      }
    },
    getHistory() {
      const historyData = this.$store.state.publicReport.publicReports[this.$route.name]
      // this.url = url + '/' + historyData.name
      this.searchData = historyData.configData
      // this.$nextTick(_ => {
      this.headData = historyData.tableParam.head
      this.tableData = historyData.tableParam.data
      this.pageSize = historyData.tableParam.pageSize
      this.pageNo = historyData.tableParam.pageNo
      this.total = historyData.tableParam.total
      this.value2 = historyData.tableParam.valeu
      this.mechanismSet = historyData.tableParam.mechanismSet
      this.tableHeight = historyData.tableParam.tableheight
      this.getTableHeight()
      // this.$refs.basicTable.getTableParam(historyData.tableParam)
      // this.$refs.basicTable.updateUrl(this.url)
      // })
    },
    saveHistory(name) {
      const baseObj = {
        configData: this.searchData,
        tableParam: {
          head: this.headData,
          data: this.tableData,
          pageSize: this.pageSize,
          pageNo: this.pageNo,
          total: this.total,
          valeu: this.value2,
          mechanismSet: this.mechanismSet
        },
        name: name }
      // console.log(baseObj.tableParam.head)
      this.$store.dispatch('setBasePublicReport', baseObj).then(() => {
        // this.getOption()
      }).catch(() => { })
    },
    deleteHistory(name) {
      this.$store.dispatch('deleteBasePublicReport', name).then(() => { })
    },
    // 获取配置查询条件
    getConfigData() {
      baseRequest('/eastOnlineSupplement/getConditions', { tableCode: this.$route.meta.query.tableCode }).then(response => {
        const result = response.data.item.queryColumns
        // result.formConfig = JSON.parse(result.formConfig)
        // result.tableConfig = JSON.parse(result.tableConfig)
        // this.configData = result
        const obj = {}
        // result = JSON.parse(result)
        result.forEach(item => {
          obj[item.columnName] = item
          obj[item.columnName].value = null
        })

        this.searchData = obj
        this.$nextTick(_ => {
          // this.searchOption()
        })
      })
    },
    // 下载点击事件
    exportHandle(exportType) {
      if (exportType === '2') {
        this.exportLoading = true
        const params = {
          tableCode: this.$route.meta.query.tableCode

        }
        for (const item in this.searchData) {
          //   params[item.columnName] = item.value
          params[item] = this.searchData[item].value
        }
        params.cjrq = this.getMonthEndData(this.value2)
        basicDownload('/eastOnlineSupplement/exportAll', params).then(response => {
          this.exportLoading = false
        })
      } else {
        this.exportLoading = true
        const exParans = {
          tableCode: this.$route.meta.query.tableCode,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
        for (const item in this.searchData) {
          //   params[item.columnName] = item.value
          exParans[item] = this.searchData[item].value
        }
        exParans.cjrq = this.getMonthEndData(this.value2)
        basicDownload('/eastOnlineSupplement/exportCurrentPage', exParans).then(_ => {
          this.exportLoading = false
        }, _ => {
          this.exportLoading = false
        })
      }
    },
    // excel下载
    downloadExcel(exportType) {
      this.exportLoading = true
      const currentActions = this.$route.path.split('/')
      const currentActionId = currentActions[currentActions.length - 1]
      const queryJson = {}
      for (const key in this.queryJson) {
        queryJson[key] = {}
        queryJson[key].label = this.queryJson[key].label
        queryJson[key].criteria = JSON.stringify(this.queryJson[key].criteria)
      }
      const params = {
        headData: this.currentHead,
        exportType: exportType,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        total: this.total,
        sqlId: this.currentTreeNode.data.sqlId,
        dataSourceCode: this.currentTreeNode.data.dataSourceCode,
        queryJson: queryJson,
        orderJson: this.orderJson,
        actionId: currentActionId,
        downloadName: this.currentTreeNode.label
      }
      basicDownload('/sqlConfig/exportExcel', params).then(_ => {
        this.exportLoading = false
      }, _ => {
        this.exportLoading = false
      })
    },
    // CSV格式保存
    saveCsv(downloadName) {
      this.exportLoading = true
      const currentActions = this.$route.path.split('/')
      const currentActionId = currentActions[currentActions.length - 1]
      const queryJson = {}
      for (const key in this.queryJson) {
        queryJson[key] = {}
        queryJson[key].label = this.queryJson[key].label
        queryJson[key].criteria = JSON.stringify(this.queryJson[key].criteria)
      }
      const params = {
        headData: this.currentHead,
        exportType: '3',
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        total: this.total,
        sqlId: this.currentTreeNode.data.sqlId,
        dataSourceCode: this.currentTreeNode.data.dataSourceCode,
        queryJson: queryJson,
        orderJson: this.orderJson,
        actionId: currentActionId,
        downloadName: downloadName
      }
      baseRequest('/sqlConfig/exportCsv', params).then(response => {
        const fileName = response.data.item.fileName
        const routers = this.$store.getters.addRouters
        this.exportLoading = false
        baseRequest('/configs/selectByConfigCode', { configCode: 'createFileActionID' }).then(response => {
          const createFileActionID = response.data.item.configValue
          const router = routers.find(item => {
            const routerPaths = item.children[0].path.split('/')
            const actionId = routerPaths[routerPaths.length - 1]
            return actionId === createFileActionID + ''
          })
          if (router) {
            const routerItem = router.children[0]
            this.$confirm(`文件${fileName}处理中,请到${routerItem.meta.title}查看进度并下载`, '提示', {
              confirmButtonText: '跳转',
              cancelButtonText: '关闭',
              type: 'warning'
            }).then(() => {
              this.$router.push('/' + routerItem.path)
            })
          }
        })
      })
    },
    // 多选选中事件
    selectHandle(val) {
      this.listLoading = true
      this.currentHead.length = 0
      for (const i of val) {
        this.currentHead.push(this.headData.find(item => item.property === i))
      }
      this.listLoading = false
    },
    // 选中值
    selectArr() {
      this.chooseFields = []
      for (const iterator of this.headData) {
        if (iterator.displayFlag === '1') {
          this.chooseFields.push(iterator.property)
        }
      }
    },
    // 获取表格高度
    getTableHeight() {
      this.$nextTick(_ => {
        const rightDom = document.querySelector('.my-search-right')
        const queryHeight = rightDom.firstElementChild.offsetHeight
        this.tableHeight = this.containHeight - queryHeight - 80
        this.$refs.tableh.doLayout()
      })
    },
    // 重新渲染
    resetConditionsDom() {
      this.conditionReset = false
      this.$nextTick(_ => {
        this.conditionReset = true
      })
    },
    // 判断该字段是否被查询选中
    isChoose(column) {
      return this.queryJson.hasOwnProperty(column.property) && this.queryJson[column.property].criteria.length > 0 ? ' active' : ''
    },
    // 选项更改排序
    updateOrderColumn(item) {
      item.type = item.type === '1' ? '2' : '1'
    },
    // 选项删除排序
    deleteOrderColumn(index) {
      this.orderJson.splice(index, 1)
    },
    // 判断是否被排序
    isOrder(column, type) {
      return this.orderJson.some(item => item.column === column.property && item.type === type) ? ' current' : ''
    },
    // 点击排序
    sortClick(column, type) {
      const currentOrder = this.orderJson.find(item => item.column === column.property)
      if (currentOrder) {
        if (currentOrder.type === type) {
          const deleteIndex = this.orderJson.findIndex(item => item.column === column.property)
          this.orderJson.splice(deleteIndex, 1)
        } else {
          currentOrder.type = type
        }
      } else {
        this.orderJson.push({
          column: column.property,
          type: type
        })
      }
    },
    // 清除当前条件
    clearCondition(prop) {
      if (prop) {
        delete this.queryJson[prop]
      } else {
        delete this.queryJson[this.currentColumn.property]
      }
      this.conditionVisable = false
      this.resetConditionsDom()
      this.getTableHeight()
    },
    // 确认条件
    confirmCondition() {
      this.$refs.conditionOption.judgeConditionNull().then(_ => {
        if (!this.queryJson[this.currentColumn.property]) {
          this.queryJson[this.currentColumn.property] = {}
          this.queryJson[this.currentColumn.property].label = this.currentColumn.label
          if (this.currentColumn.componentType === '2' && this.currentColumn.componentParam && !this.currentColumn.componentOptions) {
            baseRequest('/common/getSelectOptions', { dictType: this.currentColumn.componentParam }).then(resopnse => {
              this.currentColumn.componentOptions = resopnse.data.item
              this.queryJson[this.currentColumn.property].criteria = this.currentJson
              this.conditionVisable = false
              this.resetConditionsDom()
              this.getTableHeight()
              return
            })
          }
        }
        this.queryJson[this.currentColumn.property].criteria = this.currentJson
        this.conditionVisable = false
        this.resetConditionsDom()
        this.getTableHeight()
      }).catch(_ => {
        this.$message.warning('保存选项不能为空')
      })
    },
    // 获取条件文字
    conditionStr(item, prop) {
      const headItem = this.headData.find(item => item.property === prop)
      let str = item.label + ' '
      for (const [index, iterator] of item.criteria.entries()) {
        str += iterator.symbol + ' ' + (headItem.componentOptions ? headItem['componentOptions'][iterator.value] + ' ' : iterator.value + ' ')
        if (index !== item.criteria.length - 1) {
          str += iterator.radio + ' '
        }
      }
      return str
    },
    // 打开条件
    openConditionDialog(prop) {
      const column = this.headData.find(item => item.property === prop)
      this.currentColumn = column
      this.componentType = column.componentType
      this.componentParam = column.componentParam
      if (this.queryJson.hasOwnProperty(column.property) && this.queryJson[column.property].criteria.length > 0) {
        this.currentJson = deepClone(this.queryJson[column.property].criteria)
      } else {
        this.currentJson = [
          {
            symbol: null,
            value: null,
            radio: 'and'
          }
        ]
      }
      this.conditionVisable = true
    },
    // 列表头选项
    renderHeader(h, { column, $index }) {
      return h('div', { class: 'browse-condition' }, [
        h('span', { class: 'choose-current' + this.isChoose(column) }, column.label + ' ')
      ])
    },
    // 查询
    searchOption(pageNoChange) {
      // alert(this.value2)
      this.listLoading = true
      const queryJson = {}
      for (const key in this.queryJson) {
        queryJson[key] = {}
        queryJson[key].label = this.queryJson[key].label
        queryJson[key].criteria = JSON.stringify(this.queryJson[key].criteria)
      }
      this.pageNo = 1
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        tableCode: this.$route.meta.query.tableCode,
        dataSourceCode: 'eastDataSource',
        queryJson: queryJson,
        orderJson: this.orderJson
      }
      for (const item in this.searchData) {
        //   params[item.columnName] = item.value
        params[item] = this.searchData[item].value
      }
      params.cjrq = this.getMonthEndData(this.value2)

      baseSearch('/eastOnlineSupplement/lists', params).then(response => {
        this.listLoading = false
        this.tableData = response.data.item[0].tableData
        this.pageSize = response.data.pageSize
        this.total = response.data.total
      })
    },
    // 获取条件中的选项
    getComponentOptions() {
      for (const key in this.queryJson) {
        const item = this.headData.find(v => v.property === key)
        if (item.componentType === '2' && item.componentParam) {
          baseRequest('/common/getSelectOptions', { dictType: item.componentParam }).then(resopnse => {
            item['componentOptions'] = resopnse.data.item
            this.conditionOptionReset = false
            this.$nextTick(_ => {
              this.conditionOptionReset = true
            })
          })
        }
      }
    },
    // 重设
    getOption() {
      this.getOrganizationNumber()
      this.getConfigData()
      this.doHandleDate()
      const params = {
        tableCode: this.$route.meta.query.tableCode
      }
      baseRequest('/eastOnlineSupplement/lists', params).then(response => {
        this.headData = response.data.item[0].tableHead
        const queryJson = response.data.item[0].queryJson ? response.data.item[0].queryJson : {}
        for (const key in queryJson) {
          queryJson[key].criteria = JSON.parse(queryJson[key].criteria)
        }
        this.queryJson = queryJson
        this.orderJson = response.data.item[0].orderJson ? response.data.item[0].orderJson : []
        this.getComponentOptions()
        this.getTableHeight()
        this.selectArr()
        this.searchOption()
        this.$refs.tableh.doLayout()
      })
    },
    // 获取树
    getTree() {
      baseRequest('/sqlGroup/selectGroups').then(response => {
        this.claTreeData = response.data.item
      })
    },
    // 点击树
    treeNodeHandle(e, node) {
      if (node.data.children && node.data.children.length > 0) {
        return
      }
      if (!node.data.sqlId && node.data.sqlId !== 0) {
        return
      }
      this.currentTreeNode = node
      this.getOption()
    },
    handleSizeChange(val) { // 分页
      this.pageSize = val
      this.searchOption()
    },
    handleCurrentChange(val) { // 分页
      this.pageNo = val
      this.searchOption(true)
    },
    doHandleDate() {
      baseRequest('/eastDataQuery/getCjrq').then(response => {
        const date = response.data.item.result
        const y = date.slice(0, 4)
        const m = date.slice(4, 6)
        this.value2 = y + '-' + m
      })
    },
    getMonthEndData(date) {
      if (date) {
        const data = date.replace(/-/g, '')
        const y = data.slice(0, 4)
        const m = data.slice(4)
        const d = new Date(y, m, 0).getDate()
        date = y + m + d
        return date
      } else {
        return date
      }
    },
    // 获取焦点
    inputFocus(val) {
      this.focusValue = val
    },
    // 补录事件
    inputBlur(row, item, val) {
      if (item.isEdit === '1') {
        if (this.focusValue === val) {
          this.tabClickIndex = null
          this.tabClickLabel = ''
          return
        }
        const param = {
          tableCode: this.$route.meta.query.tableCode,
          recordId: row.RECORD_ID
        }
        param[item.property] = val
        baseRequest('/eastOnlineSupplement/supplement', param).then(response => {
          this.searchOption()
          this.tabClickIndex = null
          this.tabClickLabel = ''
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        })
      } else {
        this.tabClickIndex = null
        this.tabClickLabel = ''
      }
    },
    // 添加明细原因 row 当前行 column 当前列
    tableRowClassName({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex
    },
    // 当某个单元格被点击时会触发该事件
    handle(row, column, event, cell) {
      if (column.label) {
        this.tabClickIndex = row.index
        this.tabClickLabel = column.label
      }
      this.$nextTick(_ => {
        event.getElementsByClassName('el-input__inner')[0].focus()
      })
    },
    // 获取内部机构号
    getOrganizationNumber() {
      baseRequest('/eastDataQuery/getOrgans', { entityType: 1 }).then(response => {
        this.mechanismSet = response.data.item
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.my-search {
  height: 100%;
  padding: 5px;
  .my-search-left {
    float: left;
    width: 300px;
    border-right: 1px solid #ccc;
    height: 100%;
    overflow-x: hidden;
    transition: width 0.28s linear;
  }
  .east-input-both-3 {
    height: 52px;
    width: 33.1%;
    display: inline-block;
    text-align: right;
  }
  .my-search-button {
    float: left;
    height: 100%;
    .botton-body {
      width: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
  }
  .my-search-right {
    // float: left;
    // transition: width 0.28s linear;
    .base-row {
      margin: 0;
    }
  }
  .search-filter {
    margin-left: 12px;
    padding-top: 10px;
  }
  .search-box {
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin-left: 1%;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .search-box:hover {
    border-color: #409eff;
  }
  .search-item {
    height: 50px;
    line-height: 15px;
    font-size: 12px;
    color: #606266;
    width: 94%;
    margin: 5px 3%;
    /* text-align: center; */
    vertical-align: middle;
    position: relative;
  }
  .search-item span {
    display: inline-block;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .filter-delete {
    color: #f56c6c;
    position: absolute;
    top: 0;
    right: calc(-3% - 5px);
    font-size: 16px;
    &:hover {
      background: rgba(0, 0, 0, 0.2);
    }
  }
}
</style>

<style lang="scss">
.bulu {
  thead {
    .editstyle {
      background-color: #ecf5ff;
    }
  }
}

.page-tooptip-text {
  text-align: center;
  font-size: 20px;
  color: #409eff;
  letter-spacing: 1px;
  font-weight: 600;
  height: 100%;
  padding-top: 23%;
}

.order-text-option {
  float: left;
}
.order-type-option {
  float: right;
}
.order-delete-option,
.order-update-option {
  margin-top: 9px;
  float: right;
  &:hover {
    color: #f56c6c;
  }
}
</style>
<style >
.my-search .demo-form-inline {
  width: auto;
}
.my-search .vue-treeselect {
  display: inline-block;
  vertical-align: middle;
}

.el-form-item--medium .el-form-item__content {
  line-height: 20px;
}
</style>