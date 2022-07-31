<template>
  <div>
    <Breadcrumb />
    <el-card>
      <el-row type="flex" :gutter="20">
        <el-col :span="10">
          <el-input
            @clear="getUserList"
            placeholder="请输入内容"
            v-model="userList.query"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col>
          <el-button type="primary" @click="showUsersVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <el-table border :data="users">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template v-slot="{ row }">
            <el-switch
              v-model="row.mg_state"
              @change="updateUserStatus(row.id, $event)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="editUser(row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="delUser(row.id)"
            ></el-button>
            <el-button
              type="warning"
              size="small"
              icon="el-icon-setting"
              @click="updateRole(row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="userList.pagenum * 1"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="userList.pagesize * 1"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>

    <!-- 新增用户弹出层 -->
    <el-dialog
      title="添加用户"
      :visible.sync="showUsersVisible"
      @close="btnAddCancel"
    >
      <el-form
        ref="addFormRef"
        label-width="80px"
        :model="addUserForm"
        :rules="addRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="end" align="middle">
        <el-button @click="btnAddCancel">取消</el-button>
        <el-button type="primary" @click="btnAddOk">确认</el-button>
      </el-row>
    </el-dialog>

    <!-- 编辑用户弹出层 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="showEditVisible"
      @close="btnEditCancel"
    >
      <el-form
        ref="editFormRef"
        label-width="80px"
        :model="editUserForm"
        :rules="editRules"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input disabled v-model="editUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="end" align="middle">
        <el-button @click="btnEditCancel">取消</el-button>
        <el-button type="primary" @click="btnEditOk">确认</el-button>
      </el-row>
    </el-dialog>

    <!-- 分配角色弹出层 -->
    <el-dialog
      title="分配角色"
      :visible.sync="showRoleVisible"
      @close="btnRoleCancel"
    >
      <el-row>
        <span>当前的用户：</span><span>{{ updateRoles.username }}</span>
      </el-row>
      <el-row>
        <span>当前的角色：</span><span>{{ updateRoles.rolename }}</span>
      </el-row>
      <el-row type="flex">
        <p>分配新角色：</p>
        <el-select v-model="roleValue" placeholder="请选择">
          <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-row>
      <el-row type="flex" justify="end" align="middle">
        <el-button @click="btnRoleCancel">取消</el-button>
        <el-button type="primary" @click="btnRoleOk">确认</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, delUser, addUser, updateUserRole, updateUserStatus, getUserId, updateUserInfo } from '@/api/user'
import { getRolesList } from '@/api/roles'
export default {
  name: 'Users',
  created () {
    this.getUserList()
  },
  data () {
    return {
      // 用户列表数据
      userList: {
        query: '',
        pagenum: '1',
        pagesize: '5'
      },
      // 添加用户
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' },
          { trigger: 'blur', message: '长度在 2 到 7 个字符', min: 2, max: 7 }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' },
          { trigger: 'blur', message: '长度在 2 到 7 个字符', min: 2, max: 7 }
        ],

        email: [
          { required: true, trigger: 'blur', message: '邮箱不能为空' },
          { trigger: 'blur', message: '邮箱格式不正确', pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ }
        ],
        mobile: [
          { required: true, trigger: 'blur', message: '手机号不能为空' },
          { trigger: 'blur', message: '邮箱格式不正确', pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/ }
        ]
      },
      editUserForm: {
        id: '',
        rid: '',
        username: '',
        email: '',
        mobile: ''
      },
      editRules: {
        email: [
          { required: true, trigger: 'blur', message: '邮箱不能为空' },
          { trigger: 'blur', message: '邮箱格式不正确', pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ }
        ],
        mobile: [
          { required: true, trigger: 'blur', message: '手机号不能为空' },
          { trigger: 'blur', message: '邮箱格式不正确', pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/ }
        ]
      },
      // 分配用户角色
      updateRoles: {
        id: '',
        username: '',
        rolename: ''
      },
      showUsersVisible: false, // 添加用户
      showEditVisible: false, // 编辑用户
      showRoleVisible: false, // 分配角色
      total: null,
      roleValue: '',
      users: [], // 用户表格数据
      roles: []
    }
  },
  methods: {
    // 获取用户列表
    async getUserList () {
      const res = await getUserList(this.userList)
      // console.log(res)
      this.total = res.total
      this.users = res.users
    },
    // 分页
    handleSizeChange (val) {
      this.userList.pagesize = val
      this.getUserList()
    },
    // 分页
    handleCurrentChange (val) {
      this.userList.pagenum = val
      this.getUserList()
    },
    // 删除用户
    delUser (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delUser(id)
        // 如果当前页删除数据完了，就会变成空数据，需要处理
        if (this.users.length === 1 && this.userList.pagenum > 1) {
          this.userList.pagenum -= 1
        }
        this.getUserList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 取消
    btnAddCancel () {
      this.$refs.addFormRef.resetFields()
      this.showUsersVisible = false
    },
    // 新增用户
    async btnAddOk () {
      try {
        await this.$refs.addFormRef.validate()
        try {
          // res 暂时没有什么用
          const res = await addUser(this.addUserForm)
          console.log('用户列表新增用户', res)
          // this.roleId = res.role_id
          this.getUserList()
          this.$message.success('添加用户成功')
          this.showUsersVisible = false
        } catch (err) {
          console.log(err)
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 修改状态
    async updateUserStatus (id, val) {
      // console.log(id)
      // console.log(val)
      // res 暂时没什么用 先留着
      const res = await updateUserStatus(id, val)
      console.log('用户列表修改状态', res)
      this.$message.success('修改用户状态成功')
    },
    // 准备编辑用户参数
    async editUser (id) {
      this.editUserForm = await getUserId(id)
      this.showEditVisible = true
    },
    // 取消
    btnEditCancel () {
      this.showEditVisible = false
      this.$refs.editFormRef.resetFields()
    },
    // 编辑用户
    async btnEditOk () {
      const res = await updateUserInfo(this.editUserForm)
      console.log('用户列表编辑用户', res)
      this.getUserList()
      this.$message.success('修改用户信息成功')
      this.showEditVisible = false
    },
    // 分配角色
    async updateRole (row) {
      // console.log(obj)
      this.updateRoles.id = row.id
      this.updateRoles.username = row.username
      this.updateRoles.rolename = row.role_name
      this.roles = await getRolesList()
      this.showRoleVisible = true
    },
    // 取消
    btnRoleCancel () {
      this.roleValue = ''
      this.showRoleVisible = false
    },
    // 分配角色
    async btnRoleOk () {
      if (this.roleValue.length !== 0) {
        try {
          // console.log(this.updateRoles.id)
          // console.log(this.roleValue)
          const res = await updateUserRole({ id: this.updateRoles.id, rid: this.roleValue })
          console.log(res)
        } catch (err) {
          console.log(err)
        }
        this.showRoleVisible = false
        this.getUserList()
      } else {
        this.$message.error('角色信息不能为空')
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
.el-card {
  margin-top: 20px;
}
.el-table {
  margin: 20px 0;
}
</style>
