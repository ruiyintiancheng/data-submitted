/*
 * @Author: wk 
 * @Date: 2020-03-10 11:45:13 
 * @Last Modified by: 1k
 * @Last Modified time: 2020-03-24 20:13:47
 * @Description:  统计分析
 */
 <template>
  <div class="notifacation-ma">
    <div class="base-row">
      <div class="row-botton clearfix">
        <div class="row-title">
          <svg-icon icon-class="search" />
          <span>筛选查询</span>
        </div>
        <div class="row-option">
          <!-- <a href="javascript:void(0)" class="button" @click="searchOption">查询</a> -->
          <el-button icon="el-icon-search"
                     @click="searchOption"
                     type="primary">查询</el-button>
          <a @click="searchToggle=false"
             v-if="searchToggle">
            <svg-icon icon-class="up" />&nbsp;收起</a>
          <a @click="searchToggle=true"
             v-else>
            <svg-icon icon-class="down" />&nbsp;展开</a>
        </div>
      </div>
      <div v-show="searchToggle"
           class="form-search">
        <el-form ref="form"
                 :inline="true"
                 :model="searchData"
                 class="demo-table-expand">

          <div class="east-input-both-3"
               style="min-width: 343px;vertical-align: top">
            <el-form-item>
              <span class="input-label"
                    v-show="searchData.statisticxType==='1'">机构名称</span>
              <span class="input-label"
                    v-show="searchData.statisticxType==='2'">业务局名称</span>

              <treeselect :multiple="true"
                          style="width:250px"
                          v-model="searchData.statisticxName"
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
              <span class="input-label">统计类型</span>
              <el-select class="form-input"
                         v-model="searchData.statisticxType"
                         size="medium "
                         clearable
                         @change="headerConversion"
                         style="width:250px"
                         placeholder="">
                <el-option label="按分行统计"
                           value="1"></el-option>
                <el-option label="按业务局统计"
                           value="2"></el-option>
              </el-select>

            </el-form-item>
          </div>
          <div class="east-input-both-3"
               style="min-width: 343px;vertical-align: top">
            <el-form-item>
              <span class="input-label">采集日期</span>
              <el-date-picker v-model="value2"
                              type="month"
                              value-format="yyyy-MM"
                              style="width:250px"
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
      <div v-show="tableToggle">
        <!-- 表格 -->
        <el-table ref="basicTable"
                  :data="configData"
                  style="width: 100%;"
                  v-loading="listLoading"
                  element-loading-text="给我一点时间"
                  :height="tableHeight"
                  stripe
                  border
                  highlight-current-row
                  fit
                  header-cell-class-name="ai-el-table-header">
          <el-table-column width=50
                           type="index"
                           align="center"
                           fixed="left"
                           label="序号"></el-table-column>
          <el-table-column :min-width="150"
                           align='center'
                           :label="typeOrganization">
            <template slot-scope="scope">
              {{scope.row.statisticxName}}
            </template>
          </el-table-column>
          <el-table-column :min-width="200"
                           align='center'
                           label="检核规则编号">
            <template slot-scope="scope">
              {{scope.row.valNo}}
            </template>
          </el-table-column>
          <el-table-column :min-width="200"
                           align='center'
                           label="数据批次">
            <template slot-scope="scope">
              {{scope.row.cjrq}}
            </template>
          </el-table-column>
          <el-table-column :min-width="200"
                           align='center'
                           label="检核规则">
            <template slot-scope="scope">
              {{scope.row.valRule}}
            </template>
          </el-table-column>
          <el-table-column :min-width="200"
                           align='center'
                           label="表中文名">
            <template slot-scope="scope">
              {{scope.row.tableChnName}}
            </template>
          </el-table-column>
          <el-table-column :min-width="200"
                           align='center'
                           label="字段中文名">
            <template slot-scope="scope">
              {{scope.row.columnChnName}}
            </template>
          </el-table-column>
          <el-table-column :min-width="200"
                           align='center'
                           sortable
                           prop="errorInfo"
                           label="检核规则描述">
          </el-table-column>
          <el-table-column :min-width="200"
                           align='center'
                           sortable
                           prop="errorCount"
                           label="错误条数">
          </el-table-column>
          <el-table-column :min-width="200"
                           align='center'
                           label="总量">
            <template slot-scope="scope">
              {{scope.row.recodNum}}
            </template>
          </el-table-column>
          <el-table-column :min-width="200"
                           align='center'
                           label="错误数占比">
            <template slot-scope="scope">
              {{scope.row.errorCountPre}}
            </template>
          </el-table-column>
          <!-- <el-table-column :min-width="150"
                           align='center'
                           label="数据源类型">
            <template slot-scope="scope">
              {{options.dsType[scope.row.dsType] }}
            </template>
          </el-table-column> -->
          <el-table-column :width="150"
                           label="操作"
                           fixed="right"
                           align="center">
            <template slot-scope="scope">
              <el-button plain
                         type="primary"
                         size="mini"
                         @click="openColumn(scope.row)">查看数据</el-button>
              <!-- <el-button type="danger"
                         plain
                         size="mini"
                         @click="handleDelete(scope.row)">删除</el-button> -->
            </template>
          </el-table-column>
          <!-- <el-table-column :min-width="150"
                           align='center'
                           label="数据采集模板类型">
            <template slot-scope="scope">
              {{options.collectTemplateType[scope.row.collectTemplateType]}}
            </template>
          </el-table-column> -->
        </el-table>
        <el-pagination background
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="pageNo"
                       :total="total"
                       layout="total, sizes, prev, pager, next, jumper"
                       :page-sizes="[10,15,20]"
                       :page-size="pageSize">
        </el-pagination>
      </div>
    </div>
    <view-data ref="viewData"></view-data>
  </div>
</template>
<script>
// import excelFile from './components/excelFile'

import { baseSearch } from '@/api/base'
import { baseRequest } from '@/api/base'
import { basicDownload } from '@/utils/download'
// import { saveUpdate } from '@/utils/validate'
import Treeselect from '@riophae/vue-treeselect'
import viewData from './components/ViewData'
export default {
  directives: {},
  name: 'statisticalAnalysisIndex',
  components: {
    viewData,
    Treeselect
  },
  mounted() {
    this.getOrganizationNumber()
    this.doHandleDate()
    this.searchOption()
  },
  created() {
    this.getDefaultHeight()
  },
  data() {
    return {
      tableHeight: 0,
      typeOrganization: '机构名称', // 表头显示
      exportLoading: false, // 加载导出
      value2: null, // 月份
      updateFormData: {
        keyName: null,
        keyDesc: null,
        dsType: 1
      },
      addRules: {// 校验
        dsType: [{
          required: true, message: '请选择数据源类别'
        }],
        keyName: [{
          required: true, message: '请填写关键字'
        }]
      },
      formVisible: false, // 弹框开关
      operateStatus: null, // 操作选项
      dialogTitle: { // 弹框标题
        1: '添加',
        2: '修改'
      },
      tableToggle: true,
      searchToggle: true,
      pageNo: 1,
      total: null,
      pageSize: null,
      listLoading: false, // 加载圆圈是否显示
      configData: [],
      searchData: { // 查询条件字段
        cjrq: this.value2, // 采集时间
        statisticxType: '1', // 同价类型
        statisticxName: null // 机构名称
      },
      options: {
        'statisticxType': {
          '1': '机构名称',
          '2': '业务局名称'
        }
      },
      mechanismSet: []
    }
  },
  watch: {
    searchToggle(val) {
      if (val) {
        this.getDefaultHeight()
      } else {
        this.getDefaultHeight()
        this.tableHeight = this.tableHeight + 70
      }
    }
  },
  methods: {
    // 导出
    exportXls() {
      this.exportLoading = true
      this.searchData.pageNo = this.pageNo
      this.searchData.pageSize = this.pageSize
      this.searchData.cjrq = this.getMonthEndData(this.value2)

      basicDownload('/statisticxAnalysis/download', this.searchData).then(response => {
        this.exportLoading = false
      })
    },
    openColumn(row) { //   打开查看数据
      this.$refs.viewData.openDataView(row)
    },
    // 获取修改表单
    getUpdateForm(row) {
      const param = {
        keyId: row.keyId
      }
      baseRequest('/keywordInfos/select', param).then(response => {
        this.updateFormData = response.data.item
        this.formVisible = true
      })
    },
    openAddSqoop() { // 打开添加
      this.updateFormData.dsType = ''
      this.updateFormData.keyDesc = ''
      this.updateFormData.keyName = ''
      this.updateFormData.keyId = ''
      this.$nextTick(_ => {
        this.$refs.form.clearValidate()
      })
      this.operateStatus = 1
      this.formVisible = true
    },
    getDefaultHeight() { // 获取表格高度
      this.tableHeight = this.$store.state.app.containHeight - 230
    },
    searchOption(page) {
      this.listLoading = true
      if (!page) {
        this.pageNo = 1
      }
      this.searchData.pageNo = this.pageNo
      this.searchData.pageSize = this.pageSize
      this.searchData.cjrq = this.getMonthEndData(this.value2)
      baseSearch('/statisticxAnalysis/lists', this.searchData).then(response => {
        this.configData = response.data.item
        this.total = response.data.total
        this.pageSize = response.data.pageSize
        this.listLoading = false
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
    // 切换表头名称
    headerConversion(item) {
      if (item === '1') {
        this.typeOrganization = '机构名称'
        baseRequest('/eastDataQuery/getOrgans', { entityType: 1 }).then(response => {
          this.mechanismSet = response.data.item
        })
      }
      if (item === '2') {
        this.typeOrganization = '业务局名称'
        baseRequest('/eastDataQuery/getOrgans', { entityType: 2 }).then(response => {
          this.mechanismSet = response.data.item
        })
      }
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
.east-input-both-3 {
  height: 52px;
  width: 33.1%;
  display: inline-block;
  text-align: right;
}
.dialog-contant-default-addOrUpdate {
  margin-top: 10px;
  padding: 0px;
  border: 0px;
}
.dialog-contant-default-addOrUpdate {
  .baseUpdate-form {
    margin-left: calc(50% - 150px);
    .form-input {
      width: 200px;
    }
  }
}
</style>
<style >
.notifacation-ma .demo-form-inline {
  width: auto;
}
.notifacation-ma .vue-treeselect {
  display: inline-block;
  vertical-align: middle;
}
.el-table th.gutter {
  display: table-cell !important;
}
</style>