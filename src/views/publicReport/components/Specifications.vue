/*
 * @Author: wk 
 * @Date: 2020-04-02 09:42:26 
 * @Last Modified by: 1k
 * @Last Modified time: 2020-04-16 11:55:18
 * @Description:  报送规范说明
 */
<template>
  <div class="ver-problem"
       @click="bodyClik">
    <el-dialog title="报送规范说明"
               v-el-drag-dialog
               width="75%"
               :visible.sync="dialogFormVisible">
      <div style="padding:3px 10px">
        <span style="font-size:18px;font-weight:600;">报送范围:</span>
        <p>{{submissionScope}}</p>
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
                    :data="tableData"
                    element-loading-text="给我一点时间"
                    stripe
                    height="400"
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
                             label="字段名">
              <template slot="header">
                <div class="browse-condition">
                  <span class="choose-current">字段名</span>
                  <span class="caret-wrapper"
                        @click="aaa1($event)">
                    <i class="sort-caret  el-icon-arrow-down"></i>
                  </span>
                  <div class="tb-filter"
                       id="bszd"
                       @click="$event=>$event.stopPropagation()">
                    <input class="filter-input"
                           type="text"
                           v-model="tanleField"
                           size="small"
                           style="outline:none; border-radius: 5px;border: 1px solid #ccc;"
                           id="bszdinput"
                           placeholder="" />
                    <div class="filter-btn">
                      <span class="btnt"
                            @click="conditionScreening1">查询</span>
                      <span class="btnt"
                            @click="clearanceCondition1">重置</span>
                    </div>
                  </div>
                </div>
              </template>
              <template slot-scope="scope">
                {{scope.row.columnChnName}}
              </template>
            </el-table-column>
            <el-table-column :min-width="250"
                             align='center'
                             label="表名">
              <template slot="header">
                <div class="browse-condition">
                  <span class="choose-current">报送说明</span>
                  <span class="caret-wrapper"
                        @click="aaa($event)">
                    <i class="sort-caret  el-icon-arrow-down"></i>
                  </span>
                  <div class="tb-filter"
                       id="bssm"
                       @click="$event=>$event.stopPropagation()">
                    <input class="filter-input"
                           type="text"
                           v-model="tanleName"
                           size="small"
                           style="outline:none; border-radius: 5px;border: 1px solid #ccc;"
                           id="bssminput"
                           placeholder="" />
                    <div class="filter-btn">
                      <span class="btnt"
                            @click="conditionScreening">查询</span>
                      <span class="btnt"
                            @click="clearanceCondition">重置</span>
                    </div>
                  </div>
                </div>
              </template>
              <template slot-scope="scope">
                {{scope.row.submissionExplication}}
              </template>
            </el-table-column>
            <el-table-column :min-width="150"
                             align='center'
                             label="备注">
              <template slot-scope="scope">
                {{scope.row.remark}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { baseSearch } from '@/api/base'
export default {
  data() {
    return {
      submissionScope: '',
      tanleName: '',
      tanleField: '',
      tableData: [],
      // tableHead: {},
      tableToggle: true,
      searchToggle: true,
      dialogFormVisible: false,
      gridData: []
    }
  },
  mounted() {
    // this.tableData = this.gridData
    // this.bodyClik()
  },
  methods: {
    // 重置
    clearanceCondition() {
      this.tableData = this.gridData
      document.getElementById('bssminput').value = ''
    },
    // 筛选条件
    conditionScreening() {
      // console.log(this.tanleName)
      if (this.tanleName) {
        this.tableData = this.gridData.filter((data) => {
          if (data.submissionExplication) {
            return data.submissionExplication.toLowerCase().includes(this.tanleName.toLowerCase())
          } else {
            return false
          }
        })

        const serach = document.getElementById('bssm')
        serach.style.display = 'none'
      } else {
        return
      }
    },
    aaa(e) {
      e.stopPropagation()
      const s = document.getElementById('bszd')
      s.style.display = 'none'
      const serach = document.getElementById('bssm')
      if (serach.style.display === 'none') {
        serach.style.display = 'block'
      } else {
        serach.style.display = 'none'
      }
    },
    // 重置
    clearanceCondition1() {
      this.tableData = this.gridData
      document.getElementById('bszdinput').value = ''
    },
    // 筛选条件
    conditionScreening1() {
      // console.log(this.tanleName)
      if (this.tanleField) {
        this.tableData = this.gridData.filter(data => data.columnChnName.toLowerCase().includes(this.tanleField.toLowerCase()))
        const serach = document.getElementById('bszd')
        serach.style.display = 'none'
      } else {
        return
      }
    },
    aaa1(e) {
      e.stopPropagation()
      const s = document.getElementById('bssm')
      s.style.display = 'none'
      const serach = document.getElementById('bszd')
      if (serach.style.display === 'none') {
        serach.style.display = 'block'
      } else {
        serach.style.display = 'none'
      }
    },
    onpenTable(code) {
      if (code) {
        const params = {
          tableCode: code,
          columnChnName: '字段名',
          submissionExplication: '报送说明'
        }
        baseSearch('/eastDataQuery/specificationForSubmission', params).then(response => {
          this.submissionScope = response.data.item.submissionRange
          this.gridData = response.data.item.tableData
          this.dialogFormVisible = true
          this.tableData = this.gridData
        })
        // this.dialogFormVisible = true
      }
    },
    bodyClik() {
      const serach = document.getElementById('bssm')
      const serach1 = document.getElementById('bszd')
      serach.style.display = 'none'
      serach1.style.display = 'none'
      document.getElementById('bssminput').value = ''
      document.getElementById('bszdinput').value = ''
    }
  }
}
</script>
<style lang="scss" scope>
.ver-problem {
  .caret-wrapper {
    position: relative;
    top: 3px;
  }
  .el-table .browse-condition {
    position: relative;
    //   // margin-top: 10px;
    //   // .choose-current {
    //   // }
    .tb-filter {
      z-index: 99999999999999999999999999999;
      width: 150px;
      height: 90px;
      position: absolute;
      left: -30px;
      top: 30px;
      background-color: #fff;
      border: 1px solid #ebeef5;
      border-radius: 2px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      margin: 2px 0;
      text-align: center;
      display: none;
      .filter-input {
        width: 100%;
        height: 28px;
        margin-top: 8px;
        padding: 0;
        // border-radius: 5px;
        // display: block;
        // border: 1px solid #dcdfe6;
      }
      .filter-btn {
        width: 100%;
        height: 40px;
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: 1px solid #ebeef5;
        padding-top: 5px;
        // text-align: center;
        .btnt {
          display: inline-block;
          height: 30px;
          line-height: 30px;
          width: 50px;
          margin: 0;
        }
      }
    }
  }
  .el-table th {
    overflow: visible;
  }
  .el-table th div {
    overflow: visible;
    line-height: 15px;
  }
  .el-table__header-wrapper {
    overflow: visible;
  }
}
</style>