/*
 * @Author: wk 
 * @Date: 2020-03-10 15:36:11 
 * @Last Modified by: wk
 * @Last Modified time: 2020-05-15 17:01:45
 * @Description:  查看数据
 */
<template>
  <div class="view-data">
    <el-dialog title="数据查看"
               width="80%"
               v-el-drag-dialog
               custom-class="dialog-default no-footer"
               :close-on-click-modal="false"
               :visible.sync="viewDataVisible">
      <div class="dialog-contant-default"
           style="padding:0;">
        <div class="my-search">
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
                  <!-- <el-button icon="el-icon-refresh"
                           @click="getOption">重置</el-button> -->
                  <a @click="searchToggle=false"
                     v-if="searchToggle">
                    <svg-icon icon-class="up" />&nbsp;收起</a>
                  <a @click="searchToggle=true"
                     v-else>
                    <svg-icon icon-class="down" />&nbsp;展开</a>
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
                </el-form>
              </div>
            </div>
            <div class="base-row">
              <div class="row-botton clearfix data-height">
                <div class="row-title">
                  <svg-icon icon-class="ul" />
                  <span>数据列表</span>
                </div>
                <div class="row-option">
                  <el-button icon="el-icon-download"
                             @click="exportXls"
                             :loading="exportLoading">导出</el-button>
                  <a @click="tableToggle=false"
                     v-if="tableToggle">
                    <svg-icon icon-class="up" />&nbsp;收起</a>
                  <a @click="tableToggle=true"
                     v-else>
                    <svg-icon icon-class="down" />&nbsp;展开</a>
                </div>
              </div>
              <!-- 表格 -->
              <el-table v-show="tableToggle&&headData.length>0"
                        :data="tableData"
                        stripe
                        fit
                        border
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
                                 :prop="item.property"></el-table-column>
              </el-table>
              <el-pagination background
                             v-show="tableToggle"
                             class="pageheight"
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
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { baseRequest } from '@/api/base'
import { baseSearch } from '@/api/base'
import { basicDownload } from '@/utils/download'
import Treeselect from '@riophae/vue-treeselect'
export default {
  name: 'viewdata',
  components: {
    Treeselect
  },
  data() {
    return {
      zhg: true,
      valCode: '',
      value2: null, // 月份
      // 隐藏显示
      tableCode: '',
      viewDataVisible: false,
      exportLoading: false,
      // 查询条件
      searchData: {},
      tableToggle: true,
      searchToggle: true,
      pageSize: null,
      pageNo: 1,
      total: null,
      // 遮罩
      listLoading: false,
      // 列信息
      headData: [],
      // 数据信息
      tableData: [],
      tableHeight: 0,
      mechanismSet: [] // 机构树
    }
  },
  computed: {
    containHeight: function() {
      return this.$store.state.app.containHeight - 10
    },
    currentHead: function() {
      // return this.headData.filter(item => item.displayFlag === '1')
      return this.headData
    }
  },
  mounted() {

  },
  methods: {
    // 列表头选项
    renderHeader(h, { column, $index }) {
      return h('div', { class: 'browse-condition' }, [
        h('span', { class: 'choose-current' }, column.label + ' ')
      ])
    },
    // 导出
    exportXls() {
      this.exportLoading = true
      const exParans = {
        tableCode: this.tableCode,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      if (this.zhg) {
        exParans.valCode = this.valCode
      } else {
        exParans.valCode = ''
      }
      for (const item in this.searchData) {
        //   params[item.columnName] = item.value
        exParans[item] = this.searchData[item].value
      }
      exParans.cjrq = this.getMonthEndData(this.value2)
      basicDownload('/totalPointsCheck/exportViewData', exParans).then(_ => {
        this.exportLoading = false
      }, _ => {
        this.exportLoading = false
      })
    },
    // 获取表格高度
    getTableHeight() {
      this.$nextTick(_ => {
        // const rightDom = document.querySelector('.my-search-right')
        // const queryHeight = rightDom.firstElementChild.offsetHeight
        // const lodheight = document.querySelector('.dialog-default').offsetHeight
        // this.tableHeight = lodheight - queryHeight - 170
        const lodheight = document.querySelector('.el-dialog__body').offsetHeight
        const rightDom = document.querySelector('.form-search')
        const queryHeight = rightDom.offsetHeight
        // const dataheight = document.querySelector('.data-height').offsetHeight
        // const pageheight = document.querySelector('.pageheight').offsetHeight
        // const head = document.querySelector('.el-dialog__header').offsetHeight
        this.tableHeight = lodheight - queryHeight - 100
      })
    },
    openDataView(row) {
      this.viewDataVisible = true
      this.tableCode = row.tableCode
      this.valCode = row.valCode
      const date = row.dateTime
      const y = date.slice(0, 4)
      const m = date.slice(4, 6)
      this.value2 = y + '-' + m
      // this.doHandleDate()
      this.getOrganizationNumber()
      this.getConfigData(row)
      this.getTableHeight()
      // this.searchOption()
      this.listLoading = true
      this.pageNo = 1
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        tableCode: this.tableCode,
        valCode: row.valCode,
        NBJGH: []
      }
      params.cjrq = row.dateTime
      params.NBJGH.push(row.nbjgh)
      baseSearch('/statisticxAnalysis/getCheckData', params).then(response => {
        this.listLoading = false
        this.tableData = response.data.item[0].tableData
        this.headData = response.data.item[0].tableHead
        this.pageSize = response.data.pageSize
        this.total = response.data.total
      })
    },
    // 获取配置查询条件
    getConfigData(row) {
      const params = {
        dateTime: row.dateTime,
        tableCode: row.tableCode,
        valCode: row.valCode,
        nbjgh: row.nbjgh
      }
      baseRequest('/totalPointsCheck/getConditions', params).then(response => {
        const result = response.data.item.queryColumns
        const obj = {}
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
    // 查询
    searchOption(pageNoChange) {
      // alert(this.value2)
      this.zhg = false
      this.listLoading = true
      this.pageNo = 1
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        tableCode: this.tableCode
      }
      for (const item in this.searchData) {
        //   params[item.columnName] = item.value
        params[item] = this.searchData[item].value
      }
      params.cjrq = this.getMonthEndData(this.value2)

      baseSearch('/statisticxAnalysis/getCheckData', params).then(response => {
        this.listLoading = false
        this.tableData = response.data.item[0].tableData
        this.headData = response.data.item[0].tableHead
        this.pageSize = response.data.pageSize
        this.total = response.data.total
      })
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
.el-table th.gutter {
  display: table-cell !important;
}
</style>