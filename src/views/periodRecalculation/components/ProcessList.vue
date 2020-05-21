/*
 * @Author: wk 
 * @Date: 2020-05-14 11:24:44 
 * @Last Modified by: wk
 * @Last Modified time: 2020-05-15 15:20:18
 * @Description: 计算流程列表
 */
<template>
  <div class="pro-data">
    <el-dialog title="数据查看"
               width="80%"
               v-el-drag-dialog
               custom-class="dialog-default no-footer"
               :close-on-click-modal="false"
               :visible.sync="viewDataVisible">
      <div class="dialog-contant-default"
           style="padding:0;">
        <div class="my-pro">
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
                  <div class="input-both-3">
                    <el-form-item>
                      <span class="input-label">数据日期</span>
                      <el-date-picker v-model="searchData.dataTime"
                                      type="date"
                                      value-format="yyyy-MM-dd"
                                      style="width:250px"
                                      placeholder="">
                      </el-date-picker>

                    </el-form-item>
                  </div>
                  <div class="input-both-3">
                    <el-form-item>
                      <span class="input-label">计算状态</span>

                      <el-select v-model="searchData.calStatus"
                                 style="width:250px"
                                 clearable
                                 placeholder="">
                        <el-option label="节点错误"
                                   value="0">
                        </el-option>
                        <el-option label="未计算"
                                   value="1">
                        </el-option>
                        <el-option label="计算中"
                                   value="2">
                        </el-option>
                        <el-option label="计算完成"
                                   value="3">
                        </el-option>
                        <el-option label="计算终止"
                                   value="4">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-form>
              </div>
            </div>
            <div class="base-row">
              <div class="row-botton clearfix data-height">
                <div class="row-title ">
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
              <!-- 表格 -->
              <el-table v-show="tableToggle"
                        :data="tableData"
                        stripe
                        fit
                        border
                        highlight-current-row
                        v-loading="listLoading"
                        :height="tableHeight"
                        element-loading-text="给我一点时间">
                <el-table-column type="index"
                                 width="50"
                                 label="序号"></el-table-column>
                <el-table-column :min-width="150"
                                 align='center'
                                 label="计算流程ID">
                  <template slot-scope="scope">
                    {{scope.row.task_flow_id}}
                  </template>
                </el-table-column>
                <el-table-column :min-width="150"
                                 align='center'
                                 label="数据日期">
                  <template slot-scope="scope">
                    {{scope.row.data_time}}
                  </template>
                </el-table-column>
                <el-table-column :min-width="150"
                                 align='center'
                                 label="计算状态">
                  <template slot-scope="scope">
                    {{options.handle[scope.row.cal_status] }}
                  </template>
                </el-table-column>
                <el-table-column label="操作"
                                 align="center"
                                 width="170">
                  <template slot-scope="scope">
                    <el-button type="success"
                               v-if="scope.row.cal_status === '4'"
                               plain
                               size="mini"
                               @click="runFlow(scope.row)">计算</el-button>
                    <el-button type="danger"
                               v-if="scope.row.cal_status !== '3' && scope.row.cal_status !== '4'"
                               plain
                               size="mini"
                               @click="stopFlow(scope.row)">中止</el-button>
                    <el-button type="primary"
                               plain
                               size="mini"
                               @click="look(scope.row)">查看</el-button>
                  </template>
                </el-table-column>
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
    <flow-figure ref="flowFigure"></flow-figure>

  </div>
</template>
<script>
import { baseRequest } from '@/api/base'
import { baseSearch } from '@/api/base'
import flowFigure from 'process-g6-ry'

// import { basicDownload } from '@/utils/download'
// import Treeselect from '@riophae/vue-treeselect'
export default {
  name: 'viewdata',
  components: {
    flowFigure

    // Treeselect
  },
  data() {
    return {
      value2: null, // 月份
      // 隐藏显示
      tableCode: '',
      viewDataVisible: false,
      exportLoading: false,
      // 查询条件
      searchData: {
        dataTime: '',
        calStatus: ''
      },
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
      tableHeight: null,
      options: {
        handle: {
          '0': '节点错误',
          '1': '未计算',
          '2': '计算中',
          '3': '计算完成',
          '4': '计算中止'
        }
      }
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
  created() {

  },
  mounted() {
  },
  methods: {
    look(row) {
      this.$refs.flowFigure.openDialog(row)
    },
    stopFlow(row) {
      this.$confirm('流程将在当前计算中节点完成后暂停执行,确定中止?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        baseRequest('/taskFlow/update', { taskFlowId: row.task_flow_id, calStatus: '4' }).then(response => {
          this.$Message.success('操作成功')
          this.searchOption()
        })
      })
    },
    runFlow(row) {
      baseRequest('/taskFlow/update', { taskFlowId: row.task_flow_id, calStatus: '1' }).then(response => {
        this.$Message.success('操作成功')
        this.searchOption()
      })
    },

    // 获取表格高度
    getTableHeight() {
      this.$nextTick(_ => {
        // const page = document.querySelector('.el-pagination').offsetHeight
        // const row = document.querySelector('.row-botton').offsetHeight
        // this.tableHeight = lodheight - queryHeight - head - page - row - 20
        // const tr = document.querySelector('.has-gutter').offsetHeight
        const lodheight = document.querySelector('.el-dialog__body').offsetHeight
        const rightDom = document.querySelector('.my-search-right')
        const queryHeight = rightDom.firstElementChild.offsetHeight
        // const dataheight = document.querySelector('.data-height').offsetHeight
        // const pageheight = document.querySelector('.pageheight').offsetHeight
        // const head = document.querySelector('.el-dialog__header').offsetHeight
        this.tableHeight = lodheight - queryHeight - 100
      })
    },
    openDataView(row) {
      this.viewDataVisible = true
      this.tableCode = row

      this.searchOption()
      this.getTableHeight()
    },
    // 查询
    searchOption(page) {
      // alert(this.value2)
      this.listLoading = true
      if (!page) {
        this.pageNo = 1
      }
      this.searchData.pageNo = this.pageNo
      this.searchData.pageSize = this.pageSize
      this.searchData.deployFlowId = this.tableCode.deployFlowId
      this.searchData.flowParams = this.tableCode.configId

      baseSearch('/taskFlow/selects', this.searchData).then(response => {
        this.listLoading = false
        this.tableData = response.data.item
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
    }

  }
}
</script>
<style>
body .el-table th.gutter {
  display: table-cell !important;
}

body .el-table colgroup.gutter {
  display: table-cell !important;
}
</style>