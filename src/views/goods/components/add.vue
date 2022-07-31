<template>
  <div>
    <Breadcrumb />
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        center
        :closable="false"
      >
      </el-alert>

      <el-steps :active="active * 1" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addGoodsForm"
        label-position="top"
        :rules="addGoodsRules"
        ref="addGoodsRef"
      >
        <el-tabs
          v-model="active"
          :before-leave="changeTabs"
          tab-position="left"
        >
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addGoodsForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addGoodsForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addGoodsForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="options"
                :props="props"
                clearable
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">
            <el-form-item
              v-for="(item, index) in goodsMany"
              :key="index"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :key="index"
                  v-for="(val, index) in item.attr_vals"
                  :label="val"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品属性">
            <el-form-item
              :key="index"
              v-for="(item, index) in goodsOnly"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :key="index"
                  v-for="(val, index) in item.attr_vals"
                  :label="val"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3" label="商品图片">
            <!-- 注意action是上传图片接口地址 -->
            <!-- 因为上传图片没有用到axios，但是上传图片接口需要token，这时候就给图片接口拼接 headers 的koten 信息-->
            <el-upload
              :action="baseUrl"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :on-preview="handlePreview"
              :headers="{
                Authorization: getToken,
              }"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <el-dialog title="图片预览" :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
            <quillEditor v-model="addGoodsForm.goods_introduce"></quillEditor>
            <el-row style="margin-top: 10px">
              <el-button @click="addGoods" size="small" type="primary"
                >添加商品</el-button
              >
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
import { getParamsList } from '@/api/params'
import { getGoodsClassList, addGoods } from '@/api/goods'
import { getToken } from '@/utils/auth'
import { cloneDeep } from 'loadsh'
export default {
  name: 'Add',
  created () {
    this.getGoodsClassList()
  },
  data () {
    return {
      active: '0',
      addGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品介绍
        goods_introduce: '',
        attrs: []
      },
      addGoodsRules: {
        goods_name: [
          { trigger: 'blur', required: true, message: '不能为空' },
          { trigger: 'blur', min: 2, max: 8, message: '长度为2-8位' }
        ],
        goods_price: [{ trigger: 'blur', required: true, message: '不能为空' }],
        goods_number: [{ trigger: 'blur', required: true, message: '不能为空' }],
        goods_weight: [{ trigger: 'blur', required: true, message: '不能为空' }],
        goods_cat: [{ trigger: 'blur', required: true, message: '不能为空' }]
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      goodsMany: [],
      goodsOnly: [],
      baseUrl: 'http://liufusong.top:8899/api/private/v1/upload',
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  methods: {
    handleChange () {
      if (!this.isGoodsType_3) {
        this.addGoodsForm.goods_cat = []
        this.$message.error('请选择三级分类')
        return false
      }
    },
    async getGoodsClassList () {
      this.options = await getGoodsClassList()
    },
    // 点击tabs改变之前的钩子函数
    async changeTabs (activeName) {
      // 校验是够选择三级分类
      if (!this.isGoodsType_3) {
        this.$message.error('请选择三级分类')
        return Promise.reject(new Error('请选择三级分类'))
      }
      // 获取动态参数
      // console.log(this.goodsCatId)
      if (activeName === '1') {
        // 发动态参数请求
        // console.log(activeName)
        const res = await getParamsList({ id: this.goodsCatId, sel: 'many' })
        res.forEach(item => {
          // 处理响应回来的数据
          // console.log(item.attr_vals.split(' '))
          item.attr_vals = item.attr_vals.length !== 0 ? item.attr_vals.split(' ') : []
        })
        this.goodsMany = res
      }
      // 渲染页面
      if (activeName === '2') {
        // 发静态请求
        // console.log(activeName)
        const res = await getParamsList({ id: this.goodsCatId, sel: 'only' })
        res.forEach(item => {
          // 处理响应回来的数据
          item.attr_vals = item.attr_vals.length !== 0 ? item.attr_vals.split(' ') : []
        })
        this.goodsOnly = res
      }
    },
    handleRemove (file) {
      // 1. 获取将要删除的图片的临时路径
      // console.log(file)
      const tmpPath = file.response.data.tmp_path
      // 2. 从pics数组中，找到这个图片对应的索引
      const index = this.addGoodsForm.pics.findIndex(item => item.pic === tmpPath)
      // 3. 调用数组的splice 方法 ，把图片信息对象从 pics数组中移出
      if (index !== -1) {
        this.addGoodsForm.pics.splice(index, 1)
      }
      // console.log(this.addGoodsForm)
    },
    handleSuccess (response) {
      // 1. 拼接得到一个图片对象
      const picInfo = { pic: response.data.tmp_path }
      // 2. 将图片信息对象 push 到pics数组中
      this.addGoodsForm.pics.push(picInfo)
      // console.log(this.addGoodsForm)
    },
    // 预览图片事件
    handlePreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    async addGoods () {
      try {
        // 校验表单
        await this.$refs.addGoodsRef.validate()

        // 错误做法，因为 商品分类获取数据是数组所以这里需要克隆一下addGoodsForm
        // this.addGoodsForm.goods_cat = this.addGoodsForm.goods_cat.join(',')
        const form = cloneDeep(this.addGoodsForm)
        // 处理 商品分类数据
        form.goods_cat = form.goods_cat.join(',')
        // 获取商品参数的请求在点击商品参数后
        // 如果不点击商品参数，this.goodsMany 是 []
        // 静态属性同理
        if (this.goodsMany.length === 0) {
          this.$message.error('请填写商品参数')
          return
        } else {
          // 处理 动态参数
          this.goodsMany.forEach(item => {
            // 定义存放处理好参数的对象
            const attrInfo = {}
            attrInfo.attr_id = item.attr_id
            attrInfo.attr_value = item.attr_vals.join(' ')
            this.addGoodsForm.attrs.push(attrInfo)
          })
        }
        if (this.goodsOnly.length === 0) {
          this.$message.error('请填写商品参数')
          return
        } else {
          this.goodsOnly.forEach(item => {
            const attrInfo = {}
            attrInfo.attr_id = item.attr_id
            attrInfo.attr_value = item.attr_vals.join(' ')
            this.addGoodsForm.attrs.push(attrInfo)
          })
        }
        form.attrs = this.addGoodsForm.attrs
        console.log(this.addGoodsForm)
        console.log(form)
        // 发起请求
        const res = await addGoods(form)
        console.log(res)
        // 提示文本
        this.$message.success('添加商品成功')
        // 跳转页面
        this.$router.push('/goods')
      } catch (error) {
        this.$message.error('请填写商品信息')
      }
    }
  },
  computed: {
    isGoodsType_3 () {
      return this.addGoodsForm.goods_cat.length === 3
    },
    goodsCatId () {
      return this.addGoodsForm.goods_cat.length === 3 ? this.addGoodsForm.goods_cat[2] : null
    },
    getToken () {
      return getToken()
    }
  },
  watch: {},
  mounted () {
  },
  filters: {},
  components: { quillEditor }
}
</script>

<style scoped lang='scss'>
.el-card {
  margin-top: 20px;
}
.el-alert {
  margin-bottom: 10px;
}
.el-steps {
  margin-bottom: 20px;
}
::v-deep .ql-container {
  min-height: 300px;
}
</style>
