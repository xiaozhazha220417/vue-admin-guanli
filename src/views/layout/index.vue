<template>
  <el-container>
    <el-header>
      <!-- 头部 -->
      <el-row class="header" type="flex" align="middle" justify="space-between">
        <el-col>
          <el-row type="flex" align="middle">
            <img class="avatar" src="http://liufusong.top/logo.jpeg" alt="" />
            <p>管理系统</p>
          </el-row>
        </el-col>
        <el-col>
          <el-row type="flex" justify="end" style="margin-right: 20px">
            <el-button @click="logout">退出</el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside :class="{ active: isCollapse }" width="200px">
        <el-button
          :class="{ active: isCollapse }"
          class="btnActive"
          type="text"
          :icon="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
          @click="isCollapse = !isCollapse"
        ></el-button>
        <el-menu
          router
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          background-color="#afdfe4"
          active-text-color="#fff"
          :default-active="$route.path"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span slot="title">用户管理</span>
            </template>
            <el-menu-item index="/users">
              <i class="el-icon-user"></i>
              用户列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-box"></i>
              <span slot="title">权限管理</span>
            </template>
            <el-menu-item index="/roles">
              <i class="el-icon-box"></i>
              角色列表
            </el-menu-item>
            <el-menu-item index="/rights">
              <i class="el-icon-box"></i>
              权限列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-shopping-bag-2"></i>
              <span slot="title">商品管理</span>
            </template>
            <el-menu-item index="/goods">
              <i class="el-icon-shopping-bag-2"></i>
              商品列表
            </el-menu-item>
            <el-menu-item index="/params">
              <i class="el-icon-shopping-bag-2"></i>
              分类参数
            </el-menu-item>
            <el-menu-item index="/categories">
              <i class="el-icon-shopping-bag-2"></i>
              商品分类
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span slot="title">订单管理</span>
            </template>
            <el-menu-item index="/orders">
              <i class="el-icon-s-order"></i>
              订单列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-s-marketing"></i>
              <span slot="title">数据统计</span>
            </template>
            <el-menu-item index="/reports">
              <i class="el-icon-s-marketing"></i>
              数据报表
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: 'layout',
  created () { },
  data () {
    return {
      isCollapse: false
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('user/logout')
      this.$router.push('/login')
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='scss'>
.el-header {
  padding: 0;
}
.header {
  height: 60px;
  background-color: #afdfe4;
  .avatar {
    margin: 0 10px 0 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  p {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
  }
}
.active {
  width: 64px !important;
}
.el-aside {
  overflow: unset;
  background-color: #afdfe4;
}
.el-menu {
  border: 0;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.btnActive {
  height: 40px;
  border-radius: 0;
  width: 100%;
  background-color: #feeeed !important;
  display: flex;
  color: #afdfe4 !important;
  font-size: 26px;
  align-items: center;
  justify-content: center;
}
.el-main {
  height: 100vh;
  overflow: scroll;
  background-color: #eaedf1;
}
</style>
