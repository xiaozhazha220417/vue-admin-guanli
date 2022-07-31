<template>
  <div>
    <Breadcrumb />
    <el-card style="margin-top: 20px">
      <el-row style="margin-bottom: 10px">
        <el-button size="small" type="primary" @click="addGoodsTypes"
          >添加分类</el-button
        >
      </el-row>
      <TreeTable
        :data="goodsTypes"
        show-index
        border
        index-text="#"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
      >
        <template #isOk="{ row }">
          <i
            class="el-icon-success"
            v-if="!row.cat_deleted"
            style="color: green"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template #sort="{ row }">
          <el-tag
            v-if="row.cat_level === 0 || row.cat_level === null"
            type="primary"
            >一级</el-tag
          >
          <el-tag v-else-if="row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <template #handle="{ row }">
          <el-button size="small" icon="el-icon-edit" type="primary"
            >编辑</el-button
          >
          <el-button
            size="small"
            icon="el-icon-delete"
            type="danger"
            @click="delGoodsType(row.cat_id)"
            >删除</el-button
          >
        </template>
      </TreeTable>
      <el-row>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="goodsType.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="goodsType.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>
    <el-dialog
      title="添加商品分类"
      :visible.sync="showGoodsTypeVisible"
      @close="btnGoodsTypeCancel"
    >
      <el-form
        ref="addGoodsTypeFormRef"
        label-width="120px"
        :model="addGoodsTypeForm"
        :rules="addGoodsTypeFormRules"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addGoodsTypeForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="value"
            style="width: 100%"
            clearable
            :options="options"
            :props="defaultProps"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="end" align="middle">
        <el-button size="small" @click="btnGoodsTypeCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnGoodsTypeOk"
          >确认</el-button
        >
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsClassList, addGoodsType, delGoodsType } from '@/api/goods'
export default {
  name: 'GoodsType',
  created () {
    this.getGoodsClassList()
  },
  data () {
    return {
      // 商品分类
      goodsType: {
        type: '',
        pagenum: 1,
        pagesize: 5
      },
      total: null,
      value: [], // 级联选择器存放值的数组
      showGoodsTypeVisible: false,
      goodsTypes: [], // 商品分类数据
      // 这是表格插件的列
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'handle'
        }
      ],
      // 添加商品分类请求参数
      addGoodsTypeForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      // 校验规则
      addGoodsTypeFormRules: {
        cat_name: [
          { trigger: 'blur', required: true, message: '不能为空' },
          { trigger: 'blur', min: 2, max: 8, message: '长度为2-8位' }
        ]
      },
      options: [], // 级联选择数据
      // 级联选择器 的配置项
      defaultProps: {
        value: 'cat_id',
        children: 'children',
        label: 'cat_name',
        checkStrictly: true
      }

    }
  },
  methods: {
    // 获取商品分类数据
    async getGoodsClassList () {
      const { total, result } = await getGoodsClassList(this.goodsType)
      this.total = total
      this.goodsTypes = result
    },
    handleSizeChange (val) {
      this.goodsType.pagesize = val
      this.getGoodsClassList()
    },
    handleCurrentChange (val) {
      this.goodsType.pagenum = val
      this.getGoodsClassList()
    },
    // 获取添加商品分类2级数据
    async addGoodsTypes () {
      const goodsTypeQuery = { ...this.goodsType }
      goodsTypeQuery.pagesize = this.total
      goodsTypeQuery.type = 2
      const { result } = await getGoodsClassList(goodsTypeQuery)
      this.options = result
      // console.log(this.options)
      this.showGoodsTypeVisible = true
    },
    handleChange (value) {
      // 处理添加分类的参数
      if (value.length !== 0) {
        // 选择父级节点
        console.log(value + '添加')
        this.addGoodsTypeForm.cat_pid = value[value.length - 1]
        this.addGoodsTypeForm.cat_level = value.length
      } else {
        console.log(value + '未添加')
        // 没有选择父级节点
        this.addGoodsTypeForm.cat_pid = 0
        this.addGoodsTypeForm.cat_level = 0
      }
    },
    async btnGoodsTypeOk () {
      try {
        await this.$refs.addGoodsTypeFormRef.validate()
        console.log(this.addGoodsTypeForm)
        // 发送请求
        const res = await addGoodsType(this.addGoodsTypeForm)
        console.log(res)
        // 重新刷新数据
        this.getGoodsClassList()
        // 关闭弹出层
        this.showGoodsTypeVisible = false
        // 提示信息
        this.$message.success('添加分类成功')
      } catch (err) {
        console.log(err)
      }
    },
    btnGoodsTypeCancel () {
      this.value = []
      this.$refs.addGoodsTypeFormRef.resetFields()
      this.showGoodsTypeVisible = false
    },
    async delGoodsType (id) {
      try {
        await this.$confirm('确认删除该分类吗')
        await delGoodsType(id)
        if (this.goodsTypes.length === 1 && this.goodsType.pagenum > 1) {
          this.goodsType.pagenum -= 1
        }
        this.getGoodsClassList()
        this.$message.success('删除分类成功')
      } catch (err) {
        this.$message.info('已取消')
      }
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='scss'>
</style>
