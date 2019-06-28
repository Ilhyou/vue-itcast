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
              <el-tag
                closable
                type="success"
                style="margin-bottom:15px;"
                @close="ctn=0;removeRight(scope.row,first.id)"
              >{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id" style="margin-bottom:15px;">
                <el-col :span="4">
                  <el-tag
                    closable
                    type="info"
                    @close="ctn=0;removeRight(scope.row,second.id)"
                  >{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    type="warning"
                    v-for="third in second.children"
                    :key="third.id"
                    style="margin-bottom:15px;margin-right:5px;"
                    @close="ctn=0;removeRight(scope.row,third.id)"
                  >{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="!scope.row.children.length">
            <el-col :span="24">没有任何的权限，请先添加</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="角色授权" placement="top">
            <el-button type="success" icon="el-icon-share" @click="handleRight(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete" @click="handleDel(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增角色对话框 -->
    <!-- @close点击关闭按钮关闭对话框 清空表单 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogFormVisible"
      @close="$refs.addForm.resetFields()"
    >
      <el-form :model="addForm" :rules="rules" ref="addForm" :label-width="'120px'">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" autocomplete="off" placeholder="请输入角色名称" v-focus></el-input>
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
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :rules="rules" ref="editForm" :label-width="'120px'">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc" autocomplete="off" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false;$refs.editForm.resetFields()">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色授权对话框 -->
    <el-dialog title="角色授权" :visible.sync="grantDialogFormVisible">
      <div>
        <!-- 分别通过default-expanded-keys和default-checked-keys设置默认展开和默认选中的节点。需要注意的是，此时必须设置node-key，其值为节点数据中的一个字段名，该字段在整棵树中是唯一的。 -->
        <!--
            el-tree  :default-checked-keys 默认勾选的节点的 key 的数组
              :default-expanded-keys 默认展开的节点的 key 的数组
             :default-expand-all 是否默认展开所有节点
            props
                label   指定节点标签为节点对象的某个属性值
                children   指定子树为节点对象的某个属性值
        -->
        <el-tree
          :data="rightsList"
          show-checkbox
          node-key="id"
          :default-expanded-keys="[2,3]"
          :default-expand-all="true"
          :default-checked-keys="defaultCheckedArr"
          :props="defaultProps"
          style="overflow: scroll;height: 350px;"
          ref="tree"
        ></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllRoles,
  removeRightByRid,
  addRole,
  editRole,
  delRole,
  rightRole
} from '@/api/roles.js'
import { getAllRightList } from '@/api/right.js'
export default {
  data () {
    return {
      // 当值为0的时候弹出提示信息 当我们删权限的时候 用递归出现很多提示框，所以用此判断一下
      ctn: 0,
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
      },
      // 控制编辑角色对话框的显示与隐藏
      editDialogFormVisible: false,
      // 编辑角色数据的表单数据绑定对象
      editForm: {
        roleName: '123',
        roleDesc: '',
        id: 0
      },
      // 控制授权角色对话框的显示与隐藏
      grantDialogFormVisible: false,
      // 树形数据
      rightsList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中数据
      defaultCheckedArr: [],
      // 存储角色id
      rid: 0
    }
  },
  directives: {
    focus: {
      inserted (el, binding) {
        // el.focus()
        console.log(el)
        console.log(el.children[0])
        console.log(binding)
        el.children[0].focus()
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
    removeRight (row, rightId) {
      console.log(row)
      removeRightByRid(row.id, rightId)
        .then(res => {
          if (res.data.meta.status === 200) {
            console.log(res)
            if (this.ctn === 0) {
              this.$message({
                message: res.data.meta.msg,
                type: 'success'
              })
              this.ctn++
            }
            // 当删除完这个权限之后 应该判断这个权限还有没有兄弟权限 就应该删除上一级权限
            // 我们需要对返回的数据（删除之后这个角色还拥有的权限）进行重新的遍历，判断某个权限是否还有子级权限 如果有 则不处理 如果没有 则也要删除没有人格自己权限的权限

            var data = res.data.data
            data.forEach((v1, i1) => {
              if (v1.children.length === 0) {
                this.removeRight(row, v1.id)
              } else {
                v1.children.forEach((v2, i2) => {
                  if (v2.children.length === 0) {
                    this.removeRight(row, v2.id)
                  }
                })
              }
            })
            row.children = res.data.data
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
    },
    // 点击按钮打开弹框编辑角色显示数据
    handleEdit (obj) {
      console.log(obj)
      this.editDialogFormVisible = true
      this.editForm.roleName = obj.roleName
      this.editForm.roleDesc = obj.roleDesc
      this.editForm.id = obj.id
    },
    // 编辑角色提交
    edit () {
      console.log(this.editForm)
      this.$refs.editForm.validate(valid => {
        if (valid) {
          editRole(this.editForm)
            .then(res => {
              if (res.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: '编辑成功'
                })
                // 隐藏弹出层
                this.editDialogFormVisible = false
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
              this.$message({
                message: 'error',
                type: 'error'
              })
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
    },
    // 根据角色id删除角色
    handleDel (id) {
      this.$confirm(`此操作将永久删除id号为${id}的角色, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delRole(id)
            .then(res => {
              if (res.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: res.data.meta.msg
                })
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
              this.$message({
                message: 'error',
                type: 'error'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 点击打开角色授权对话框
    handleRight (obj) {
      console.log(obj)
      this.rid = obj.id

      this.grantDialogFormVisible = true
      getAllRightList('tree')
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            this.rightsList = res.data.data
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
      this.defaultCheckedArr = []
      console.log(this.defaultCheckedArr)
      if (obj.children.length > 0) {
        obj.children.forEach((first, index) => {
          if (first.children.length > 0) {
            first.children.forEach((second, index) => {
              if (second.children.length > 0) {
                second.children.forEach((item, index) => {
                  console.log(item.id)
                  this.defaultCheckedArr.push(item.id)
                })
              }
            })
          }
        })
      }
      console.log(this.defaultCheckedArr)
    },
    // 角色授权提交
    submitRole () {
      /**
       * getCheckedKeys  若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
       * getHalfCheckedKeys 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点的 key 所组成的数组
       */
      // console.log(this.$refs.tree.getCurrentKey())
      console.log([
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ])
      var arr = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ]
      console.log(arr.join(','))
      console.log(typeof arr.join(','))
      rightRole(this.rid, arr.join(','))
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            // 刷新数据
            this.init()
            // 隐藏对话框
            this.grantDialogFormVisible = false
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
    }
  }
}
</script>
<style lang="less" scoped>
</style>
