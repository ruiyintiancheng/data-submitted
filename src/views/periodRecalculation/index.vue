/*
 * @Author: wk 
 * @Date: 2020-05-14 11:04:52 
 * @Last Modified by: 1k
 * @Last Modified time: 2020-05-14 18:00:26
 * @Description:  单期重算
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

          <div class="input-both-3">
            <el-form-item>
              <span class="input-label">开始日期</span>
              <el-date-picker v-model="searchData.startDate"
                              type="month"
                              value-format="yyyy-MM"
                              style="width:250px"
                              placeholder="">
              </el-date-picker>

            </el-form-item>
          </div>
          <div class="input-both-3">
            <el-form-item>
              <span class="input-label">处理状态</span>

              <el-select v-model="searchData.status"
                         style="width:250px"
                         clearable
                         placeholder="">
                <el-option label="未处理"
                           value="0">
                </el-option>
                <el-option label="处理中"
                           value="1">
                </el-option>
                <el-option label="处理完成"
                           value="2">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
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
          <el-button icon="el-icon-plus"
                     @click="addUser()">添加</el-button>
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
                           label="配置ID">
            <template slot-scope="scope">
              {{scope.row.configId}}
            </template>
          </el-table-column>
          <el-table-column :min-width="150"
                           align='center'
                           label="开始日期">
            <template slot-scope="scope">
              {{scope.row.startDate}}
            </template>
          </el-table-column>
          <el-table-column :min-width="150"
                           align='center'
                           label="结束日期">
            <template slot-scope="scope">
              {{scope.row.endDate}}
            </template>
          </el-table-column>
          <el-table-column :min-width="150"
                           align='center'
                           label="处理状态">
            <template slot-scope="scope">
              {{options.handle[scope.row.status] }}
            </template>
          </el-table-column>
          <el-table-column :width="200"
                           label="操作"
                           fixed="right"
                           align="center">
            <template slot-scope="scope">
              <el-button plain
                         type="info"
                         size="mini"
                         v-if="scope.row.status&&scope.row.status!=='0'"
                         @click="openList(scope.row)">查看</el-button>

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
    <el-dialog title="添加"
               :visible.sync="formVisible"
               width="40%"
               custom-class="dialog-default">
      <div class="dialog-contant-default-addOrUpdate">
        <el-form :model="updateFormData"
                 :rules="addRules"
                 ref="updateFrom"
                 label-width="100px"
                 class="demo-ruleForm baseUpdate-form ">

          <el-form-item label="选择日期"
                        style="width:343px"
                        prop="date">
            <el-date-picker v-model="updateFormData.date"
                            type="monthrange"
                            style="width:100%;"
                            range-separator="-"
                            value-format="yyyy-MM"
                            start-placeholder=""
                            end-placeholder="">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="选择表"
                        style="width:343px"
                        prop="tables">
            <el-select v-model="updateFormData.tables"
                       multiple
                       clearable
                       collapse-tags
                       style="width:100%"
                       placeholder="">
              <el-option v-for="item in gettables"
                         :key="item.tableCode"
                         :label="item.tableChnName"
                         :value="item.tableCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer-addOrUpdate">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="saveOperate()">保存</el-button>
      </div>
    </el-dialog>
    <process-list ref="processList"></process-list>
  </div>
</template>
<script>
// import excelFile from './components/excelFile'

import { baseSearch } from '@/api/base'
import { baseRequest } from '@/api/base'
// import { basicDownload } from '@/utils/download'
import processList from './components/ProcessList'
// import { saveUpdate } from '@/utils/validate'
export default {
  directives: {},
  name: 'reportingManagementIndex',
  components: {
    processList
  },
  data() {
    return {
      gettables: [],
      exportLoading: false, // 加载导出
      value2: null, // 月份
      updateFormData: {
        date: '',
        tables: []
      },
      addRules: {// 校验
        date: [{
          required: true, message: '请选择开始时间和结束时间'
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
      tableHeight: 0,
      pageNo: 1,
      total: null,
      pageSize: null,
      listLoading: false, // 加载圆圈是否显示
      configData: [],
      searchData: { // 查询条件字段
        startDate: '',
        status: ''
      },
      options: {
        'handle': {
          '0': '未处理',
          '1': '处理中',
          '2': '处理完成'
        }
      }
    }
  },
  mounted() {
    // this.doHandleDate()
    this.searchOption()
  },
  created() {
    this.getDefaultHeight()
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
    openList(row) { // 查看
      this.$refs.processList.openDataView(row)
    },
    addUser() { // 添加按钮
      baseRequest('/t30MultiplePackage/getTables').then(response => {
        this.gettables = response.data.item
      })
      this.updateFormData.date = ''
      this.updateFormData.tables = []
      this.formVisible = true
      this.$nextTick(function() {
        this.$refs.updateFrom.clearValidate()
      })
    },
    // 保存操作
    saveOperate() {
      this.$refs.updateFrom.validate(valid => {
        if (valid) {
          const param = {}
          param.startDate = this.getMonthEndData(this.updateFormData.date[0])
          param.endDate = this.getMonthEndData(this.updateFormData.date[1])
          param.tableCodes = this.updateFormData.tables
          baseRequest('/t30RetryFlow/add', param).then(response => {
            this.searchOption()
            this.$Message.success('操作成功')
            this.formVisible = false
          })
        }
      })
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
      const params = {}
      params.pageNo = this.pageNo
      params.pageSize = this.pageSize
      params.status = this.searchData.status
      params.startDate = this.getMonthEndData(this.searchData.startDate)
      baseSearch('/t30RetryFlow/selects', params).then(response => {
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
