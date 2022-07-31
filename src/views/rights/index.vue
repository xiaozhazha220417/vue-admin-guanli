<template>
  <div>
    <Breadcrumb />
    <el-card>
      <el-table border :data="authData">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
          <template v-slot="{ row }">
            <el-tag v-if="row.level === '0'"> 等级一</el-tag>
            <el-tag type="success" v-else-if="row.level === '1'">等级二</el-tag>
            <el-tag type="warning" v-else>等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getAllAuth } from '@/api/rights'
export default {
  created () {
    this.getAllAuth()
  },
  data () {
    return {
      authData: [] // 权限数据
    }
  },
  methods: {
    async getAllAuth () {
      this.authData = await getAllAuth('list')
      // console.log(this.authData)
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='scss'>
.el-card {
  margin-top: 20px;
}
</style>
