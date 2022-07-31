<template>
  <div>
    <Breadcrumb />
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            v-model="activeGoodsType"
            style="margin-left: 5px"
            :options="goodsTypes"
            :props="defaultCascader"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="changeTabs">
        <el-tab-pane label="用户管理" name="many">
          <el-row>
            <el-button
              size="small"
              type="primary"
              :disabled="activeGoodsType.length === 0"
              @click="showDialogVisible = true"
              >添加参数</el-button
            >
          </el-row>
          <el-table border :data="manyTableData" style="margin-top: 10px">
            <el-table-column type="expand">
              <template v-slot="{ row }">
                <el-tag
                  :key="index"
                  v-for="(tag, index) in row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag, row)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              label="分类名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-button
                  size="small"
                  icon="el-icon-edit"
                  type="primary"
                  @click="editManyAndOnlyAttr(row)"
                  >编辑</el-button
                >
                <el-button
                  size="small"
                  icon="el-icon-delete"
                  type="danger"
                  @click="delManyAndOnlyAttr(row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="only">
          <el-row>
            <el-button
              size="small"
              type="primary"
              :disabled="activeGoodsType.length === 0"
              @click="showDialogVisible = true"
              >添加属性</el-button
            >
          </el-row>
          <el-table border :data="onlyTableData" style="margin-top: 10px">
            <el-table-column type="expand">
              <template v-slot="{ row }">
                <el-tag
                  :key="index"
                  v-for="(tag, index) in row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag, row)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  @click="showInput(row)"
                  size="small"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              label="分类名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-button
                  size="small"
                  icon="el-icon-edit"
                  type="primary"
                  @click="editManyAndOnlyAttr(row)"
                  >编辑</el-button
                >
                <el-button
                  size="small"
                  icon="el-icon-delete"
                  type="danger"
                  @click="delManyAndOnlyAttr(row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="addAndEditTitle + dialogTitle"
      :visible.sync="showDialogVisible"
      @close="btnAttrCancel"
    >
      <el-form
        label-width="120px"
        ref="addManyAndOnlyAttrRef"
        :model="addManyAndOnlyAttrForm"
        :rules="addManyAndOnlyAttrRules"
      >
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="addManyAndOnlyAttrForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="end" align="middle">
        <el-button size="small" @click="btnAttrCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnAttrOk"
          >确定</el-button
        >
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getParamsList, addManyAndOnlyAttr, delManyAndOnlyAttr, editManyAndOnlyAttr } from '@/api/params'
import { getGoodsClassList } from '@/api/goods'
export default {
  name: 'Params',
  created () {
    this.getGoodsClassList()
  },
  data () {
    return {
      showDialogVisible: false,
      activeName: 'many',
      // 商品分类数据
      goodsTypes: [],
      // 选中的商品分类
      activeGoodsType: [],
      // 级联选择器配置项
      defaultCascader: {
        value: 'cat_id',
        label: 'cat_name'
        // 是否严格的遵守父子节点不互相关联 默认false
        // checkStrictly: true
      },
      manyTableData: [], // 动态参数数据
      onlyTableData: [], // 静态参数数据
      // 表单绑定数据和提交请求的参数
      addManyAndOnlyAttrForm: {
        id: '',
        attr_name: '',
        attr_sel: '',
        attr_vals: ''
      },
      // 表单绑定数据校验规则
      addManyAndOnlyAttrRules: {
        attr_name: [
          { trigger: 'blur', required: true, message: '值不能为空' },
          { min: 2, max: 8, trigger: 'blur', message: '值长度为2-8位' }
        ]
      }
    }
  },
  methods: {
    // 获取级联选择器数据
    async getGoodsClassList () {
      const res = await getGoodsClassList()
      // console.log(res)
      this.goodsTypes = res
    },
    // 级联选择器发生改变事件
    async handleChange () {
      this.getParamsList()
    },
    // 功能函数，发送请求
    async getParamsList () {
      if (this.activeGoodsType.length !== 3) {
        // 不可以选择
        this.activeGoodsType = []
        this.manyTableData = []
        this.onlyTableData = []
        this.$message.error('只允许为第三级分类设置相关参数')
        return
      }
      // console.log(this.id)
      // console.log(this.activeName)
      if (this.activeName === 'many') {
        // 动态参数数据
        const res = await getParamsList({ id: this.id, sel: this.activeName })
        res.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          // 控制输入框与按钮的切换形式
          item.inputVisible = false
          // 文本框中输入的值
          item.inputValue = ''
        })
        this.manyTableData = res
      } else {
        // 静态参数数据
        const res = await getParamsList({ id: this.id, sel: this.activeName })
        res.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          // 控制输入框与按钮的切换形式
          item.inputVisible = false
          // 文本框中输入的值
          item.inputValue = ''
        })
        this.onlyTableData = res
      }
    },
    // tabs改变触发
    async changeTabs () {
      this.getParamsList()
    },
    // 取消
    btnAttrCancel () {
      this.addManyAndOnlyAttrForm = {
        id: '',
        attr_name: '',
        attr_sel: '',
        attr_vals: ''
      }
      this.$refs.addManyAndOnlyAttrRef.resetFields()
      this.showDialogVisible = false
    },
    // 添加动态参数和静态属性
    async btnAttrOk () {
      try {
        await this.$refs.addManyAndOnlyAttrRef.validate()
        if (!this.addManyAndOnlyAttrForm.attr_id) {
          // 添加
          this.addManyAndOnlyAttrForm.id = this.id
          this.addManyAndOnlyAttrForm.attr_sel = this.activeName
          await addManyAndOnlyAttr(this.addManyAndOnlyAttrForm)
          this.$message.success('添加成功')
        } else {
          const data = {
            id: this.addManyAndOnlyAttrForm.cat_id * 1,
            attrId: this.addManyAndOnlyAttrForm.attr_id * 1,
            attr_name: this.addManyAndOnlyAttrForm.attr_name,
            attr_sel: this.addManyAndOnlyAttrForm.attr_sel
          }
          // console.log(data)
          await editManyAndOnlyAttr(data)
          this.$message.success('修改成功')
        }
        this.getParamsList()
        this.showDialogVisible = false
      } catch (error) {
        this.$message.error('表单校验不通过')
      }
    },
    // 删除动态参数和静态属性
    async delManyAndOnlyAttr (row) {
      // console.log(row)
      try {
        await this.$confirm('确认删除该分类吗？')
        await delManyAndOnlyAttr(row.cat_id, row.attr_id)
        this.$message.success('删除成功')
        this.getParamsList()
      } catch (error) {
        this.$message.info('已取消')
      }
    },
    // 编辑动态参数和静态属性
    editManyAndOnlyAttr (row) {
      // console.log(row)
      this.addManyAndOnlyAttrForm = { ...row }
      this.showDialogVisible = true
    },
    showInput (row) {
      // 显示input
      row.inputVisible = true
      // input 获取焦点 因为获取焦点是同步事件,而点击事件是异步事件，所以这里需要$nextTick
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 显示按钮
    async handleInputConfirm (row) {
      // 添加 tags
      if (row.inputValue.trim()) {
        row.attr_vals.push(row.inputValue)
        // 将 数组中的值转换成字符串
        const ceshi = row.attr_vals.join(' ')
        // console.log(ceshi)
        const data = {
          id: row.cat_id * 1,
          attrId: row.attr_id * 1,
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: ceshi
        }
        await editManyAndOnlyAttr(data)
        this.$message.success('添加成功')
      }
      row.inputVisible = false
      row.inputValue = ''
    },
    // 删除tag
    async handleClose (tag, row) {
      console.log(tag)
      const index = row.attr_vals.findIndex(item => item === tag)
      row.attr_vals.splice(index, 1)
      // console.log(row.attr_vals)
      // 将 数组中的值转换成字符串
      const ceshi = row.attr_vals.join(' ')
      const data = {
        id: row.cat_id * 1,
        attrId: row.attr_id * 1,
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: ceshi
      }
      await editManyAndOnlyAttr(data)
      this.$message.success('删除成功')
    }
  },
  computed: {
    // 分类id
    id () {
      return this.activeGoodsType[this.activeGoodsType.length - 1]
    },
    // 弹出层title
    dialogTitle () {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    },
    // 弹出层title
    addAndEditTitle () {
      return this.addManyAndOnlyAttrForm.attr_id ? '编辑' : '添加'
    }
  },
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='scss'>
.el-card {
  margin-top: 20px;
}
.el-alert {
  margin-bottom: 20px;
}
.el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
