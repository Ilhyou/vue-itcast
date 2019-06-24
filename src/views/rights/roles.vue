<template>
  <div class="roles">
    <!-- 添加面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <div style="margin-top: 15px;">
      <el-button type="success" plain @click="addDialogFormVisible=true">添加角色</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="rolesList" border style="width: 100%;margin-top: 15px;">
      <!-- 通过设置 type="expand" 和 Scoped slot 可以开启展开行功能，el-table-column 的模板会被渲染成为展开行的内容，展开行可访问的属性与使用自定义列模板时的 Scoped slot 相同。 -->
      <!-- type="expand"：说明这列可以实现展开 -->
      <el-table-column type="expand">
        <!-- 展开的时候，template模板中的结构就是展开行的内容 -->
        <template slot-scope="scope">
          <el-row
            v-for="first in scope.row.children"
            :key="first.id"
            style="margin-bottom:15px;border-bottom: 1px dashed #ccc;"
          >
            <el-col :span="4">
              <el-tag closable type="success">{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id" style="margin-bottom:15px;">
                <el-col :span="4">
                  <el-tag closable type="info">{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    type="warning"
                    v-for="third in second.children"
                    :key="third.id"
                    style="margin-bottom:15px;margin-right:5px;"
                    @close="removeRight(scope.row,third.id)"
                  >{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="!scope.row.children.length">
            <el-col :span="24">没有任何的权限，请先分配</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="角色授权" placement="top">
            <el-button type="success" icon="el-icon-share"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" :rules="rules" ref="addForm" :label-width="'120px'">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" autocomplete="off" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addForm.roleDesc" autocomplete="off" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false;$refs.addForm.resetFields()">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAllRoles, removeRightByRid, addRole } from '@/api/roles.js'
export default {
  data () {
    return {
      // 角色列表数据
      rolesList: [],
      // 控制新增角色对话框的显示与隐藏
      addDialogFormVisible: false,
      // 新增角色数据的表单数据绑定对象
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加新增和编辑验证规则
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    // 获取角色数据列表
    this.init()
  },
  methods: {
    // 获取角色数据列表
    init () {
      getAllRoles()
        .then(res => {
          if (res.data.meta.status === 200) {
            console.log(res)
            this.rolesList = res.data.data
          } else {
            this.$message({
              message: res.data.meta.msg,
              type: 'error'
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
    // 删除角色权限 g根据角色id
    removeRight (obj, rightId) {
      console.log(obj)
      removeRightByRid(obj.id, rightId)
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message({
              message: res.data.meta.msg,
              type: 'success'
            })
            obj.children = res.data.data
          } else {
            this.$message({
              message: res.data.meta.msg,
              type: 'error'
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
    // 新增角色
    addRole () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addRole(this.addForm)
            .then(res => {
              if (res.data.meta.status === 201) {
                this.$message({
                  type: 'success',
                  message: res.data.meta.msg
                })
                // 隐藏弹出层
                this.addDialogFormVisible = false
                // 数据刷新
                this.init()
              } else {
                this.$message({
                  message: res.data.meta.msg,
                  type: 'error'
                })
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          // 给出用户提示
          this.$message({
            message: '数据输入不合法',
            type: 'error'
          })
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
