/*
 * @Author: wk 
 * @Date: 2020-03-06 15:46:33 
 * @Last Modified by: wk
 * @Last Modified time: 2020-05-15 11:00:21
 * @Description:  数据校验
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
      <div v-if="searchToggle"
           class="form-search">
        <el-form ref="form"
                 :inline="true"
                 :model="searchData"
                 class="demo-table-expand">
          <div class="east-input-both-3"
               style="min-width: 343px;vertical-align: top">
            <el-form-item>
              <span class="input-label">表中文名</span>
              <el-input size="medium "
                        class="form-input"
                        v-model="searchData.tableChnName"
                        clearable
                        style="width:255px"></el-input>

            </el-form-item>
          </div>
          <div class="east-input-both-3"
               style="min-width: 343px;vertical-align: top">
            <el-form-item>
              <span class="input-label">字段中文名</span>
              <el-input size="medium "
                        class="form-input"
                        v-model="searchData.columnChnName"
                        clearable
                        style="width:255px"></el-input>

            </el-form-item>
          </div>
          <div class="east-input-both-3"
               style="min-width: 343px;vertical-align: top">
            <el-form-item>
              <span class="input-label">检验规则</span>
              <el-input size="medium "
                        class="form-input"
                        v-model="searchData.valRule"
                        clearable
                        style="width:255px"></el-input>

            </el-form-item>
          </div>
          <div class="east-input-both-3"
               style="min-width: 343px;vertical-align: top">
            <el-form-item>
              <span class="input-label">检核规则描述</span>
              <el-input size="medium "
                        class="form-input"
                        v-model="searchData.errorInfo"
                        clearable
                        style="width:255px"></el-input>

            </el-form-item>
          </div>
          <div class="east-input-both-3"
               style="min-width: 343px;vertical-align: top">
            <el-form-item>
              <span class="input-label">采集日期</span>
              <el-date-picker v-model="value2"
                              type="month"
                              value-format="yyyy-MM"
                              style="width:255px"
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
      <div v-if="tableToggle">
        <!-- 表格 -->
        <el-table ref="basicTable"
                  :data="configData"
                  style="width: 100%;"
                  v-loading="listLoading"
                  element-loading-text="给我一点时间"
                  :height="tableHeight"
                  :default-sort="{prop: 'errorCount', order: 'descending'}"
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
                           label="检核规则描述">
            <template slot-scope="scope">
              {{scope.row.errorInfo}}
            </template>
          </el-table-column>
          <el-table-column :min-width="200"
                           align='center'
                           sortable
                           prop="errorCount"
                           label="错误条数">
          </el-table-column>
          <el-table-column :min-width="200"
                           align='center'
                           sortable
                           prop="recodNum"
                           label="总量">
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
import { saveUpdate } from '@/utils/validate'
import viewData from './components/ViewData'
export default {
  directives: {},
  name: 'dataVerificationIndex',
  components: {
    viewData
  },
  mounted() {
    this.doHandleDate()
    this.searchOption()
  },
  created() {
    this.getDefaultHeight()
  },
  data() {
    return {
      // backupDate: null,
      tableHeight: 0,
      exportLoading: false, // 加载导出
      value2: null, // 月份
      updateFormData: {
        keyName: null,
        keyDesc: null,
        dsType: null
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
        tableChnName: '', // 表中文名
        columnChnName: '', // 字段中文名
        valRule: '', // 检核规则
        errorInfo: '', // 检核规则描述
        cjrq: this.value2// 采集时间
      },
      options: {
        'dsType': {
          '1': 'Oracle',
          '2': 'DB2',
          '3': 'MySql'
        }
      }
    }
  },
  watch: {
    searchToggle(val) {
      if (val) {
        this.getDefaultHeight()
      } else {
        this.getDefaultHeight()
        this.tableHeight = this.tableHeight + 120
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
      basicDownload('/dataCheck/download', this.searchData).then(response => {
        this.exportLoading = false
      })
    },
    // 保存操作
    saveOperate() {
      if (this.operateStatus === 1) {
        saveUpdate('keywordInfos/add', this.updateFormData, this.addRules, this.$refs.form).then(() => {
          this.searchOption()
          this.$Message.success('操作成功')
          this.formVisible = false
        })
      } else {
        saveUpdate('keywordInfos/update', this.updateFormData, this.addRules, this.$refs.form).then(() => {
          this.searchOption()
          this.$Message.success('操作成功')
          this.formVisible = false
        })
      }
    },
    handleDelete(row) { // 删除
      this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          keyId: row.keyId
        }
        baseRequest('/keywordInfos/delete', param).then(request => {
          this.searchOption()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
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
      this.tableHeight = this.$store.state.app.containHeight - 280
    },
    searchOption(page) {
      this.listLoading = true
      if (!page) {
        this.pageNo = 1
      }
      this.searchData.pageNo = this.pageNo
      this.searchData.pageSize = this.pageSize
      this.searchData.cjrq = this.getMonthEndData(this.value2)
      // let url = '/east-current/dataCheck/lists'
      // if (this.value2 === this.backupDate) {
      //   url = '/east-current/dataCheck/lists'
      //   // this.searchData.routeParam = 'current'
      // } else {
      //   url = '/east-web/dataCheck/lists'
      //   // this.searchData.routeParam = 'web'
      // }
      baseSearch('/dataCheck/lists', this.searchData).then(response => {
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
        // this.backupDate = response.data.item.result
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