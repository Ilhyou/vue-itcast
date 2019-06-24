<template>
  <div class="right">
    <!-- 添加面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table :data="rightList" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <!-- 写插槽的时候可以省略prop属性 -->
      <!-- <el-table-column prop="level" label="层级"> </el-table-column>-->
      <el-table-column label="层级">
        <template slot-scope="scope">
          <span>{{scope.row.level | levelFormat}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getAllRightList } from '@/api/right.js'
export default {
  data () {
    return {
      rightList: []
    }
  },
  mounted () {
    getAllRightList('list')
      .then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.rightList = res.data.data
        } else {
          this.$message({
            type: 'error',
            message: res.data.meta.msg
          })
        }
      })
      .catch(err => {
        console.log(err)
        this.$message({
          message: 'error',
          type: 'error'
        })
      })
  },
  // 创建局部过滤器
  filters: {
    levelFormat (level) {
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else if (level === '2') {
        return '三级'
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
