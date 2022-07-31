<template>
  <el-breadcrumb separator=">">
    <el-breadcrumb-item :to="{ name: 'welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item
      v-for="(item, index) in $route.meta.title"
      :key="index"
      >{{ item }}</el-breadcrumb-item
    >
  </el-breadcrumb>
</template>

<script>
export default {
  props: {},
  created () { },
  data () {
    return {}
  },
  methods: {},
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='scss'>
</style>
