<template>
  <div class="list">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <div style="margin-top: 15px;">
        <el-input
          placeholder="请输入内容"
          v-model="userKey"
          class="input-with-select"
          style="width:300px;margin-right:15px"
        >
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" plain @click="$router.push({name:'Add'})">添加用户</el-button>
      </div>
      <!-- 表格区域 -->
      <el-table :data="goodsList" border style="width: 100%;margin-top:15px">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="580"></el-table-column>
        <el-table-column prop="goods_price" label="价格" width="120"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="120"></el-table-column>
        <el-table-column prop="add_time" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini">编辑</el-button>
            <el-button size="mini" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
import { getGoodsAllList } from '@/api/goods.js'
export default {
  data () {
    return {
      // 搜索关键字
      userKey: '',
      // 商品列表数据
      goodsList: [],
      // 查询参数
      query: '',
      // 当前页码
      pagenum: 1,
      // 每页显示条数
      pagesize: 10,
      // 数据总条数
      total: 0
    }
  },
  methods: {
    // 获取商品列表数据
    init () {
      getGoodsAllList({
        query: this.userKey,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      })
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 400) {
            this.$message({
              message: res.data.meta.msg,
              type: 'error'
            })
          } else {
            // 用户数据总条数
            this.total = res.data.data.total
            // 动态渲染
            this.goodsList = res.data.data.goods
          }
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: '服务器异常,请重试',
            type: 'error'
          })
        })
    },
    // 切换每页显示记录数时触发
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.init()
    },
    // 切换当前页码时触发
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.init()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
</style>
