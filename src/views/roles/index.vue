<template>
  <div>
    <Breadcrumb />
    <el-card>
      <el-row>
        <el-button type="primary">添加角色</el-button>
      </el-row>
      <el-table border :data="tableRoleData">
        <el-table-column type="expand" label="#">
          <template v-slot="{ row }">
            <el-row
              v-for="item in row.children"
              :key="item.id"
              class="quanxian"
              type="flex"
              align="middle"
            >
              <el-col :span="6">
                <el-tag>{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-row
                  v-for="item2 in item.children"
                  :key="item2.id"
                  class="quanxian"
                  style="margin: 0"
                  type="flex"
                  align="middle"
                >
                  <el-col :span="5">
                    <el-tag type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <el-tag
                      @close="delAuth(item3, row)"
                      style="margin: 10px 10px"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button size="small" type="primary" icon="el-icon-edit">
              编辑
            </el-button>
            <el-button size="small" type="danger" icon="el-icon-delete">
              删除
            </el-button>
            <el-button
              size="small"
              type="warning"
              icon="el-icon-setting"
              @click="updateRoleAuth(row)"
            >
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 权限弹出层 -->
    <el-dialog
      title="分配权限"
      :visible.sync="showAuthVisible"
      @click="btnRoleCancel"
    >
      <el-tree
        :data="treeAuthData"
        :default-checked-keys="treeRole_default"
        :props="{ label: 'authName' }"
        ref="tree"
        node-key="id"
        show-checkbox
        default-expand-all
      ></el-tree>
      <el-row slot="footer" type="flex" justify="end" align="middle">
        <el-button size="small" @click="btnRoleCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnRoleOk"
          >确认</el-button
        >
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getAllAuth } from '@/api/rights'
import { getRolesList, delRoleAuth, updateRoleAuth } from '@/api/roles'

export default {
  name: 'Roles',
  created () {
    this.getRolesList()
  },
  data () {
    return {
      tableRoleData: [], // 角色列表
      treeAuthData: [], // 权限列表
      treeRole_default: [], // 角色拥有的权限
      showAuthVisible: false,
      roleId: null // 角色id

    }
  },
  methods: {
    // 获取所有表格数据
    async getRolesList () {
      this.tableRoleData = await getRolesList()
    },
    // 删除角色权限
    async delAuth (item3, row) {
      // console.log(item3)
      // console.log(row)
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await delRoleAuth(row.id, item3.id)
        console.log('删除角色权限', res)
        this.getRolesList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      } catch (err) {
        console.log(err)
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    // 分配权限
    async updateRoleAuth (row) {
      // 获取角色id
      this.roleId = row.id
      // 获取所有的权限列表
      this.treeAuthData = await getAllAuth('tree')
      // 获取角色的权限列表
      this.handleTreeData(row, this.treeRole_default)
      // console.log(this.treeRole_default)
      // 显示弹出层
      this.showAuthVisible = true
    },
    // 递归函数处理默认树结构选中节点
    // 默认选中节点 default-checked-keys：默认勾选的节点的 key 的数组
    // 因为树结构数据，只要选中了第三级数据就能自动勾选父节点数据
    // 所以这里只需要判断是否是第三级的数据id如果是就要留下来
    // node 当前节点 arr 保存的数据
    handleTreeData (node, arr) {
      // 判断是不是第三级节点
      if (!node.children) {
        // 表示已经是第三级节点了
        return arr.push(node.id)
      }

      // 表示不是第三级节点是第一级或者第二级节点
      // 遍历数据
      node.children.forEach(item => {
        // 判断是不是第三级节点
        this.handleTreeData(item, arr)
      })
    },
    btnRoleCancel () {
      // 处理，选中节点的数据,防止数据只有push 没有 删除
      this.treeAuthData = []
      // 关闭弹出层
      this.showAuthVisible = false
    },
    async btnRoleOk () {
      // 处理数据
      // 通过 getCheckedKeys() 获取 选中节点的key, 通过 getHalfCheckedKeys() 获取 半选中节点的key，将他们拼接成数组，发起请求
      const key = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ]
      // 调用接口
      await updateRoleAuth({ roleId: this.roleId, rids: key.join(',') })
      // 重新请求数据
      this.getRolesList()
      // 提示文本
      this.$message.success('分配权限成功')
      // 关闭弹出层
      this.showAuthVisible = false
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='scss'>
.el-card,
.el-table {
  margin-top: 20px;
}
.quanxian {
  margin: 0 20px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}
</style>
