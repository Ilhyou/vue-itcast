<template>
  <div class="add">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 步骤条 -->
      <!-- active属性对应着当前需要展示的内容面板的索引，索引从0开始 -->
      <el-steps :active="activeName-0" finish-status="success">
        <el-step title="步骤 1"></el-step>
        <el-step title="步骤 2"></el-step>
        <el-step title="步骤 3"></el-step>
        <el-step title="步骤 4"></el-step>
      </el-steps>
      <!-- tabs标签页 -->
      <!--
        tab-position:用来设置标签页导航项的位置，内容与这个位置对应，如导航在top，内容就在bottom
        v-model='activeName',用来设置当前被激活的内容面板，这个值就应该设置为内容面板的name属性的值
      -->
      <el-tabs v-model="activeName" tab-position="left" style="margin-top:15px">
        <el-tab-pane label="基本参数" name="0">基本参数</el-tab-pane>
        <el-tab-pane label="上传图片" name="1">上传图片</el-tab-pane>
        <el-tab-pane label="商品描述" name="2">商品描述</el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="3">定时任务补偿</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      activeName: '0'
    }
  }
}
</script>
<style lang="less" scoped>
</style>
