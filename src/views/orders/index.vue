<template>
  <div>
    <Breadcrumb />
    <el-card>
      <el-row type="flex" :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table border :data="ordersList">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="order_pay">
          <template v-slot="{ row }">
            <el-button v-if="row.order_pay !== '0'" size="samll" type="success"
              >已支付</el-button
            >
            <el-button v-else size="samll" type="danger">未支付</el-button>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"> </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template v-slot="{ row }">
            {{ row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="showAddressVisible = true"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.ordersQuery.pagenum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="this.ordersQuery.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>
    <el-dialog title="修改收货地址" :visible.sync="showAddressVisible">
      <el-cascader :options="options"></el-cascader>
      <el-row slot="footer" type="flex" justify="end" align="middle">
        <el-button size="small">取消</el-button>
        <el-button size="small" type="primary">确认</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import cityOptions from '@/utils/city_data2017_element'
import dayjs from 'dayjs'
import { getOrdersList } from '@/api/orders'
export default {
  name: 'Orders',
  created () {
    this.getOrdersList()
  },
  data () {
    return {
      // 城市数据
      options: cityOptions,
      showAddressVisible: false,
      // 订单请求查询参数
      ordersQuery: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        user_id: '',
        pay_status: '',
        is_send: '',
        order_fapiao_title: [],
        order_fapiao_company: '',
        order_fapiao_content: '',
        consignee_addr: ''
      },
      // 订单数据
      ordersList: [],
      total: null
    }
  },
  methods: {
    async getOrdersList () {
      const { total, goods } = await getOrdersList(this.ordersQuery)
      this.total = total
      this.ordersList = goods
    },
    handleSizeChange (val) {
      this.ordersQuery.pagesize = val
      this.getOrdersList()
    },
    handleCurrentChange (val) {
      this.ordersQuery.pagenum = val
      this.getOrdersList()
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
.el-table {
  margin: 20px 0;
}
</style>
