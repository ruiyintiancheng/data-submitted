/*
 * @Author: lk 
 * @Date: 2019-07-22 14:52:43 
 * @Last Modified by: lk
 * @Last Modified time: 2020-01-10 17:23:29
 * @Description: sql查询-表操作-条件筛选  
 */
<template>
  <div class="condition-option">
    <ul class="ul-condition">
      <li v-for="(item,index) in queryJson"
          :key="index">
        <div class="clearfix">
          <el-select class="input-condition symbol"
                     v-model="item.symbol">
            <el-option v-if="componentType !== '4' || (componentType === '4' && selectType==='1')"
                       label="="
                       value="="></el-option>
            <el-option v-if="componentType !== '2' && componentType !== '4'"
                       label=">"
                       value=">"></el-option>
            <el-option v-if="componentType !== '2' && componentType !== '4'"
                       label="<"
                       value="<"></el-option>
            <el-option v-if="componentType !== '2' && componentType !== '4'"
                       label=">="
                       value=">="></el-option>
            <el-option v-if="componentType !== '2' && componentType !== '4'"
                       label="<="
                       value="<="></el-option>
            <el-option v-if="componentType !== '2' && componentType !== '4' && componentType !== '3'"
                       label="like"
                       value="like"></el-option>
            <el-option v-if="componentType === '4' && selectType==='2'"
                       label="in"
                       value="in"></el-option>
            <el-option v-if="componentType === '4' && selectType==='2'"
                       label="not in"
                       value="not in"></el-option>
          </el-select>
          <el-input v-if="componentType === '1'"
                    v-model="item.value"
                    class="input-condition"></el-input>
          <el-select v-else-if="componentType === '2'"
                     v-model="item.value"
                     class="input-condition">
            <el-option v-for="(text,value) in selectOptions"
                       :key="value"
                       :value="value"
                       :label="text"></el-option>
          </el-select>
          <el-date-picker v-else-if="componentType === '3' && componentParam !== '7' && componentParam !== '8' && componentParam !== '9'"
                          v-model="item.value"
                          class="input-condition"
                          :type="dateOptions[componentParam]['name']"
                          :format="dateOptions[componentParam]['format']"
                          :value-format="dateOptions[componentParam]['format']"></el-date-picker>
          <el-time-picker v-else-if="componentType === '3' && (componentParam === '7'|| componentParam === '8' || componentParam === '9')"
                          v-model="item.value"
                          class="input-condition"
                          :format="dateOptions[componentParam]['format']"
                          :value-format="dateOptions[componentParam]['format']"></el-time-picker>

          <el-select v-else-if="componentType === '4' && optionType === '1'"
                     :multiple="selectType==='2'"
                     collapse-tags
                     v-model="item.value"
                     class="input-condition">
            <el-option v-for="(text,value) in selectOptions"
                       :key="value"
                       :value="value"
                       :label="text"></el-option>
          </el-select>
          <treeselect v-else-if="componentType === '4' && optionType === '3'"
                      :multiple="selectType==='2'"
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
                      :options="selectOptions">
          </treeselect>

          <el-button v-if="index === (queryJson.length - 1)"
                     @click="addCondition"
                     icon="el-icon-plus"></el-button>
          <el-button v-if="index !== 0"
                     icon="el-icon-minus"
                     @click="reduceCondition(index)"></el-button>
        </div>
        <div class="condition-radioes"
             v-if="index !== (queryJson.length - 1)">
          <el-radio v-model="item.radio"
                    label="and">and</el-radio>
          <el-radio v-model="item.radio"
                    label="or">or</el-radio>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { baseRequest } from '@/api/base'
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
  props: {
    // 条件json
    queryJson: {
      type: [Array, Object],
      default: function() {
        return [
          {
            symbol: null,
            value: null,
            radio: 'and'
          }
        ]
      }
    },
    componentType: {
      type: String,
      default: '1'
    },
    componentParam: String
  },
  data() {
    return {
      // 下拉框选项
      selectOptions: {},
      // 日期框选项
      dateOptions: {
        '1': {
          name: 'year',
          format: 'yyyy'
        },
        '2': {
          name: 'month',
          format: 'yyyy-MM'
        },
        '3': {
          name: 'date',
          format: 'yyyy-MM-dd'
        },
        '4': {
          name: 'datetime',
          format: 'yyyy-MM-dd HH'
        },
        '5': {
          name: 'datetime',
          format: 'yyyy-MM-dd HH:mm'
        },
        '6': {
          name: 'datetime',
          format: 'yyyy-MM-dd HH:mm:ss'
        },
        '7': {
          name: 'datetime',
          format: 'HH'
        },
        '8': {
          name: 'datetime',
          format: 'HH:mm'
        },
        '9': {
          name: 'datetime',
          format: 'HH:mm:ss'
        }
      },
      optionType: null,
      selectType: null
    }
  },
  mounted() {
    if (this.componentType === '2' && this.componentParam) {
      this.getSelectOptions()
    } else if (this.componentType === '4' && this.componentParam) {
      this.getCompunentOptions()
    }
  },
  methods: {
    getSelectOptions() {
      baseRequest('/common/getSelectOptions', { dictType: this.componentParam }).then(response => {
        this.selectOptions = response.data.item
      })
    },
    // 获取组件选项
    getCompunentOptions() {
      baseRequest('/common/getSelectOptions', { dictType: 'resourceType' }).then(response => {
        this.selectOptions = [{
          id: 'a',
          label: 'a',
          children: [{
            id: 'aa',
            label: 'aa'
          }, {
            id: 'ab',
            label: 'ab'
          }]
        }, {
          id: 'b',
          label: 'b'
        }, {
          id: 'c',
          label: 'c'
        }]
        this.optionType = '3'
        this.selectType = '2'
      })
    },
    // 添加条件
    addCondition() {
      this.queryJson[this.queryJson.length - 1]['radio'] = 'and'
      this.queryJson.push({
        symbol: null,
        value: null,
        radio: 'and'
      })
    },
    // 删除条件
    reduceCondition(index) {
      this.queryJson.splice(index, 1)
    },
    // 判断条件是否为空
    judgeConditionNull() {
      return new Promise((resolve, reject) => {
        for (const iterator of this.queryJson) {
          if (iterator.symbol === null || iterator.value === null) reject()
        }
        resolve()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.condition-option {
  .ul-condition {
    list-style: none;
    margin-left: calc(50% - 210px);
    padding: 0;
    .input-condition {
      width: 175px;
      float: left;
      margin: 0 5px;
      &.symbol {
        margin: 0;
      }
    }
    .condition-radioes {
      padding: 10px 0;
    }
  }
}
</style>
