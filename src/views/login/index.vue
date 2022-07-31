<template>
  <div class="login">
    <div class="login-box">
      <!-- 头像 -->
      <el-avatar
        class="avatar"
        :size="100"
        src="http://liufusong.top/hm-admin/img/logo.82b9c7a5.png"
      ></el-avatar>
      <!-- 表单 -->
      <el-form class="formData" :model="formData" :rules="rules" ref="formData">
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="formData.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="formData.password"
          ></el-input>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button type="primary" @click="submitForm">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Login',
  created () { },
  data () {
    return {
      formData: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapActions(['user/login']),
    submitForm () {
      this.$refs.formData.validate(async valid => {
        if (valid) {
          // 登录成功
          try {
            // console.log(1)
            await this['user/login'](this.formData)
            this.$router.push('/')
            this.$message.success('登录成功')
          } catch (err) {
            console.log(err)
          }
        }
      })
    },
    // 重置
    resetForm () {
      this.$refs.formData.resetFields()
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='scss'>
.login {
  width: 100vw;
  height: 100vh;

  background-color: #afdfe4;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-box {
    position: relative;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    .avatar {
      position: absolute;
      transform: translateY(-50%);
      background-color: #fff;
      box-shadow: 0 0 10px green;
    }
    .formData {
      width: 90%;
      margin-top: 80px;
    }
  }
}
</style>
