<template>
  <div class="add">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{br_type}}</el-breadcrumb-item>
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
      <el-form style="margin-top:15px" label-width="80px">
        <!-- tabs标签页 -->
        <!--
        tab-position:用来设置标签页导航项的位置，内容与这个位置对应，如导航在top，内容就在bottom
        v-model='activeName',用来设置当前被激活的内容面板，这个值就应该设置为内容面板的name属性的值
        -->
        <el-tabs v-model="activeName" tab-position="left" style="margin-top:15px">
          <el-tab-pane label="基本参数" name="0">
            <el-form-item label="商品名称">
              <el-input v-model="goodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="goodsForm.goods_price" max="100" min="0" step="0.1" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input v-model="goodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input v-model="goodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <!-- 添加级联选择器 -->
              <!--
                :options="options"  //数据源
                :props=""  // 配置选项
                clearable> //可清空
              -->
              <!--
                props:
                  value    指定选项的值为选项对象的某个属性值
                  label    指定选项标签为选项对象的某个属性值
                  children 指定选项的子选项为选项对象的某个属性值
              -->
              <el-cascader
                v-model="goodsForm.goods_cat"
                :options="cateList"
                :props="cateprops"
                clearable
                @change="getcatid"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="上传图片" name="1">
            <el-upload
              class="upload-demo"
              action="http://localhost:8888/api/private/v1/upload"
              :headers="getToken()"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :before-upload="bu"
              :file-list="fileList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品描述" name="2">
            <quill-editor
              v-model="goodsForm.goods_introduce"
              ref="myQuillEditor"
              :options="editorOption"
              style="height:300px;border-bottom:1px solid #ccc;"
            ></quill-editor>
          </el-tab-pane>
          <el-tab-pane label="定时任务补偿" name="3">定时任务补偿</el-tab-pane>
        </el-tabs>
        <el-button type="success" @click="addGoods">添加商品</el-button>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { getCategoriesList } from '@/api/category.js'
import { addGoodsInfo, getGoodsById } from '@/api/goods.js'
export default {
  data () {
    return {
      // 面包屑文字
      br_type: '添加商品',
      // 富文本的配置，主要用来配置样式按钮
      editorOption: {},
      // 标签页当前被激活的内容面板
      activeName: '0',
      // 基本参数数据
      goodsForm: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        atts: []
      },
      // 所有分类数据
      cateList: [],
      // props选项对象
      cateprops: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      fileList: []
    }
  },
  methods: {
    // 获取当前级联选择器的value
    getcatid (value) {
      // console.log(value.join(','))
      this.goodsForm.goods_cat = value.join(',')
      console.log(this.goodsForm.goods_cat)
    },
    // 设置请求头传递token
    getToken () {
      var token = localStorage.getItem('itcast_manager')
      return { Authorization: token }
    },
    // 上传成功之后的处理函数
    handleSuccess (response, file, fileList) {
      console.log(response, file, fileList)
      // 数据就存储在reponse中
      this.goodsForm.pics.push({ pic: response.data.tmp_path })
      console.log(this.goodsForm.pics)
    },
    // 预览
    handlePreview () {},
    // 移除
    handleRemove (file, fileList) {
      console.log(file)
      if (!file.response) {
        return
      }
      // file就是当前你移除的文件
      var filename = file.response.data.tmp_path
      // 我们要根据 file里面的数据删除this.goodsForm.pics中的数据
      for (var i = 0; i < this.goodsForm.pics.length; i++) {
        if (this.goodsForm.pics[i].pic === filename) {
          this.goodsForm.pics.splice(i, 1)
          break
        }
      }
    },
    bu (file) {
      console.log(file)
      if (file.type.indexOf('image/') !== 0) {
        this.$message({
          type: 'warning',
          message: '请选择图片格式的文件'
        })
        // return false会触发handleRemove操作
        return false
      }
    },
    // 添加商品信息
    addGoods () {
      console.log(this.goodsForm)
      addGoodsInfo(this.goodsForm)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 201) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            this.$router.push({ name: 'List' })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    console.log(this.$route.query.id)
    if (this.$route.query.id) {
      this.br_type = '编辑商品'
    }
    getCategoriesList([3])
      .then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.cateList = res.data.data
        } else if (res.data.meta.status === 401) {
          this.$message({
            type: 'warning',
            message: res.data.meta.msg
          })
        } else {
          this.$message({
            type: 'error',
            message: res.data.meta.msg
          })
        }
      })
      .catch(() => {
        this.$message({
          type: 'error',
          message: 'error'
        })
      })
    getGoodsById(this.$route.query.id).then(res => {
      console.log(res)
      if (res.data.meta.status === 200) {
        this.goodsForm.goods_price = res.data.data.goods_price
        this.goodsForm.goods_number = res.data.data.goods_number
        this.goodsForm.goods_weight = res.data.data.goods_weight
        this.goodsForm.goods_introduce = res.data.data.goods_introduce
        this.goodsForm.goods_name = res.data.data.goods_name
        this.goodsForm.goods_cat = res.data.data.goods_cat.split(',').map(v => {
          return v - 0
        })
        this.goodsForm.pics = res.data.data.pics
        this.fileList = this.goodsForm.pics.map(v => {
          return {
            goods_id: v.goods_id,
            url: v.pics_mid_url
          }
        })
        this.goodsForm.atts = res.data.data.atts
        console.log(this.fileList)
      }
    })
  }
}
</script>
<style lang="less" scoped>
</style>
