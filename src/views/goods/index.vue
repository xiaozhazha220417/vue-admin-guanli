<template>
  <div>
    <Breadcrumb />
    <el-card>
      <el-row type="flex" :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="value" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col>
          <el-button type="primary" @click="$router.push('/goods/add')"
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <el-table border :data="goods">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column
          label="商品名称"
          prop="goods_name"
          min-width="400"
        ></el-table-column>
        <el-table-column
          min-width="150"
          label="商品价格（元）"
          prop="goods_price"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          min-width="100"
          prop="goods_weight"
        ></el-table-column>
        <el-table-column label="创建时间" min-width="150" prop="add_time">
          <template v-slot="{ row }">
            {{ row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="200">
          <template>
            <el-button size="small" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="small" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.goodsList.pagenum"
        :page-sizes="[1, 2, 5, 10, 100]"
        :page-size="this.goodsList.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getGoodsList } from '@/api/goods'
export default {
  name: 'Goods',
  created () {
    this.getGoodsList()
  },
  data () {
    return {
      total: null,
      value: '',
      goodsList: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      goods: []
    }
  },
  methods: {
    async getGoodsList () {
      const { total, goods } = await getGoodsList(this.goodsList)
      this.total = total
      this.goods = goods
    },
    handleSizeChange (val) {
      this.goodsList.pagesize = val
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      this.goodsList.pagenum = val
      this.getGoodsList()
    }
  },
  computed: {},
  watch: {},
  filters: {
    dateFormat (val) {
      return dayjs(val * 1000).format('YYYY-MM-DD')
    }
  },
  components: {}
}
</script>

<style scoped lang='scss'>
.el-card {
  margin-top: 20px;
}
.el-row {
  margin-bottom: 20px;
}
.el-pagination {
  margin-top: 20px;
}
</style>
