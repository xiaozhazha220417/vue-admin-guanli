<template>
  <div>
    欢迎登陆
    <el-menu>
      <el-submenu :index="item.order + ''" v-for="item in data" :key="item.id">
        <template slot="title">
          <i class="el-icon-user-solid"></i>
          <span slot="title">{{ item.authName }}</span>
        </template>
        <el-menu-item
          v-for="obj in item.children"
          :key="obj.id"
          :index="obj.path"
          @click="ceshi(obj, item)"
        >
          <i class="el-icon-user"></i>
          {{ obj.authName }}
          {{ obj }}
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { getLeftRoles } from '@/api/rights'
export default {
  name: 'home',
  created () {
    this.getLeftRoles()
  },
  data () {
    return {
      data: []
      // data: [
      //   {
      //     id: 125,
      //     authName: '用户管理',
      //     path: 'users',
      //     children: [
      //       {
      //         id: 110,
      //         authName: '用户列表',
      //         path: 'users',
      //         children: [],
      //         order: null
      //       }
      //     ],
      //     order: 1
      //   },
      //   {
      //     id: 103,
      //     authName: '权限管理',
      //     path: 'rights',
      //     children: [
      //       {
      //         id: 111,
      //         authName: '角色列表',
      //         path: 'roles',
      //         children: [],
      //         order: null
      //       },
      //       {
      //         id: 112,
      //         authName: '权限列表',
      //         path: 'rights',
      //         children: [],
      //         order: null
      //       }
      //     ],
      //     order: 2
      //   },
      //   {
      //     id: 101,
      //     authName: '商品管理',
      //     path: 'goods',
      //     children: [
      //       {
      //         id: 104,
      //         authName: '商品列表',
      //         path: 'goods',
      //         children: [],
      //         order: 1
      //       },
      //       {
      //         id: 115,
      //         authName: '分类参数',
      //         path: 'params',
      //         children: [],
      //         order: 2
      //       },
      //       {
      //         id: 121,
      //         authName: '商品分类',
      //         path: 'categories',
      //         children: [],
      //         order: 3
      //       }
      //     ],
      //     order: 3
      //   },
      //   {
      //     id: 102,
      //     authName: '订单管理',
      //     path: 'orders',
      //     children: [
      //       {
      //         id: 107,
      //         authName: '订单列表',
      //         path: 'orders',
      //         children: [],
      //         order: null
      //       }
      //     ],
      //     order: 4
      //   },
      //   {
      //     id: 145,
      //     authName: '数据统计',
      //     path: 'reports',
      //     children: [
      //       {
      //         id: 146,
      //         authName: '数据报表',
      //         path: 'reports',
      //         children: [],
      //         order: null
      //       }
      //     ],
      //     order: 5
      //   }
      // ]
    }
  },
  methods: {
    async getLeftRoles () {
      try {
        this.data = await getLeftRoles()
      } catch (err) {
        console.log(err)
      }
    },
    ceshi (obj, item) {
      const arr = []
      arr.push(item.authName)
      arr.push(obj.authName)
      console.log(obj)
      console.log(item)
      console.log(arr)
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
