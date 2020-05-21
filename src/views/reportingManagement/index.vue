/*
 * @Author: wk 
 * @Date: 2020-03-03 16:49:45 
 * @Last Modified by: 1k
 * @Last Modified time: 2020-05-11 17:41:20
 * @Description:  报送管理
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
              <span class="input-label">采集日期</span>
              <el-date-picker v-model="value2"
                              type="month"
                              value-format="yyyy-MM"
                              style="width:250px"
                              placeholder="选择月">
              </el-date-picker>

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
                           label="文件名称">
            <template slot-scope="scope">
              {{scope.row.fileName}}
            </template>
          </el-table-column>
          <el-table-column :min-width="200"
                           align='center'
                           label="采集日期">
            <template slot-scope="scope">
              {{scope.row.dataVersion}}
            </template>
          </el-table-column>
          <el-table-column :min-width="200"
                           align='center'
                           label="文件大小">
            <template slot-scope="scope">
              {{scope.row.fileSize}}
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
                         :disabled="scope.row.ismodel==='2'"
                         @click="openColumn(scope.row)">下载</el-button>
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

  </div>
</template>
<script>
// import excelFile from './components/excelFile'

import { baseSearch } from '@/api/base'
import { baseRequest } from '@/api/base'
import { basicDownload } from '@/utils/download'
import { saveUpdate } from '@/utils/validate'
export default {
  directives: {},
  name: 'reportingManagementIndex',
  components: {
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
      tableHeight: 0,
      pageNo: 1,
      total: null,
      pageSize: null,
      listLoading: false, // 加载圆圈是否显示
      configData: [],
      searchData: { // 查询条件字段

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
        this.tableHeight = this.tableHeight + 70
      }
    }
  },
  methods: {
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
    openColumn(row) { //    下载
      basicDownload('/submissions/download', { fileId: row.fileId }).then(response => {
        this.exportLoading = false
      }, _ => {
        this.exportLoading = false
      })
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
      this.searchData.userId = '6'
      baseSearch('/submissions/lists', this.searchData).then(response => {
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
        console.log(y, m)

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