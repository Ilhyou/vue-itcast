<template>
  <div class="users">
    <!-- 添加面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        v-model="userKey"
        class="input-with-select"
        style="width:300px;margin-right:15px"
        @keyup.enter.native="init"
      >
        <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
      </el-input>
      <el-button type="success" plain @click="addDialogFormVisible=true">添加用户</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="usersList" border style="width: 100%;margin-top:15px">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="300"></el-table-column>
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
          <!-- 之前都是绑定了同个属性值--value2,所以其中一个状态变化也会影响到其它switch的状态变化,而数据中有一个属性mg_state，它就是用来描述当前用户的状态 -->
          <!-- <el-switch v-model="value2" active-color="#13ce66" inactive-color="#ff4949"></el-switch> -->
          <!-- 为switch添加状态切换的事件：change事件就是在切换状态时的触发事件，这个事件有一个参数，就是当前状态 -->
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="updateStatus(scope.row.mg_state,scope.row.id)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="success" icon="el-icon-share" @click="handleGrant(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete" @click="handleDelete(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 新增用户对话框 -->
    <!-- @close点击关闭按钮关闭对话框 清空表单 -->
    <el-dialog
      title="新增用户"
      :visible.sync="addDialogFormVisible"
      @close="$refs.addForm.resetFields()"
    >
      <el-form :model="addForm" :rules="rules" ref="addForm" :label-width="'120px'">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false;$refs.addForm.resetFields()">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :rules="rules" ref="editForm" :label-width="'120px'">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="editForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false;$refs.editForm.resetFields()">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="roleDialogFormVisible">
      <el-form ref="grantForm" :model="grantForm" :label-width="'120px'">
        <el-form-item label="用户名">
          <el-input v-model="grantForm.username" auto-complete="off" style="width:122px" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <!-- <el-select v-model="myvalue" placeholder="请选择" @change="roleChange"> -->
          <!-- value-key作为 value 唯一标识的键名，绑定值为对象类型时必填  默认值value -->
          <el-select v-model="grantForm.rid" placeholder="请选择" @change="roleChange">
            <!-- :label是roleList数据的label属性 只给用户看的 -->
            <!-- :value是roleList数据的value属性 是我们要的 -->
            <!-- v-model双向绑定的值与 :value一致  我们从接口文档上得知 我们需要rid这个参数 所以 v-model就绑定rid -->
            <!-- v-model：后期用户选择数据所对应的:value值就会和这个v-model中的数据进行绑定 -->
            <!-- 为下拉列表的v-model赋值一个id，这个id会对应着下拉列表的value，如果赋值了Value，那么就会让这个value数据所对应的字符串数据显示 -->
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogFormVisible = false;">取 消</el-button>
        <el-button type="primary" @click="grantRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
/**
 *
 *    @size-change="handleSizeChange" //当切换每页显示记录数的时候触发
      @current-change="handleCurrentChange" //切换当前页码，如从第一页到第二页
      :current-page="currentPage4" // 当前页码
      :page-sizes="[100, 200, 300, 400]" // 当前显示记录数的数组
      :page-size="100" // 默认每页显示的记录数
      layout="total, sizes, prev, pager, next, jumper" // 布局结构
      :total="400" // 总记录数
 *
 */
import {
  getAllList,
  addUser,
  editUser,
  delUser,
  updateUserStatus,
  grantRole
} from '@/api/users.js'
import { getAllRoles } from '@/api/roles.js'
export default {
  data () {
    return {
      // 搜索关键字
      userKey: '',
      // 查询参数
      query: '',
      // 当前页码
      pagenum: 1,
      // 每页显示条数
      pagesize: 2,
      // 表格数据
      usersList: [],
      // 用户数据总条数
      total: 0,
      // 控制新增用户对话框的显示和隐藏
      addDialogFormVisible: false,
      // 新增数据的表单数据绑定对象
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加新增用户和编辑用户验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            message: '请输入合法的邮箱',
            pattern: /\w+[@]\w+[.]\w+/,
            trigger: 'blur'
          }
        ],
        mobile: [
          // wuhu0723@126.com
          { required: true, message: '请输入手机号', trigger: 'blur' }
          // { message: '请输入正确的手机号', pattern: /^1\d{10}$/, trigger: 'blur' }
        ]
      },
      // 控制编辑用户对话框的显示和隐藏
      editDialogFormVisible: false,
      // 编辑数据的表单数据绑定对象
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 控制分配角色对话框的显示和隐藏
      roleDialogFormVisible: false,
      // 下拉选项数据
      roleList: [],
      // 下拉双向绑定
      myvalue: '',
      // 分配角色对应数据
      grantForm: {
        id: '',
        rid: '',
        username: ''
      }
    }
  },
  // 页面加载完成就去获取用户列表数据
  mounted () {
    this.init()

    // 获取角色数据列表
    getAllRoles()
      .then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          // let roleData = res.data.data
          this.roleList = res.data.data
          // for (var i = 0; i < roleData.length; i++) {
          //   var obj = {
          //     value: roleData[i].id,
          //     label: roleData[i].roleName
          //   }
          //   // this.roleList.push(obj)
          // }
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
  methods: {
    // 获取数据
    init () {
      getAllList({
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
            this.usersList = res.data.data.users
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
    // 显示编辑用户对话框以及显示需要的数据
    handleEdit (row) {
      // console.log(row)

      this.editDialogFormVisible = true
      this.editForm.id = row.id
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
    },
    // 弹出确定提示框删除用户
    handleDelete (id) {
      this.$confirm(`此操作将永久删除id号为${id}的用户, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delUser(id)
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
    },
    // 新增用户
    add () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addUser(this.addForm)
            .then(res => {
              if (res.data.meta.status === 201) {
                this.$message({
                  type: 'success',
                  message: res.data.meta.msg
                })
                // 隐藏弹出层
                this.addDialogFormVisible = false
                // 表单元素的数据重置
                this.$refs.addForm.resetFields()
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
    // 编辑用户
    edit () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          editUser(this.editForm)
            .then(res => {
              if (res.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: res.data.meta.msg
                })
                // 隐藏弹出层
                this.editDialogFormVisible = false
                // 表单元素的数据重置
                this.$refs.editForm.resetFields()
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
    // 修改用户状态
    /**
     *  - 这个事件如果没有传递参数，那么就默认的当前状态做为参数
        - 如果你手动传递了参数，默认的参数就不会再进行传递，你可以手动的添加$event
        - $event的值就是当前的状态值
        - 你也可以将之前数据源数据双向绑定属性做为参数传递 scope.row.mg_state
     */
    updateStatus (type, id) {
      // console.log(type, id)
      updateUserStatus(type, id)
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
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
    // 分配角色 选择下拉列表的时候触发 下拉列表切换
    roleChange (value) {
      // value是他的默认值 就是roleLists数据中的value属性 就是:value 绑定的值
      // // console.log(value, this.myvalue)
      this.grantForm.rid = value
    },
    // 显示分配角色对话框
    handleGrant (obj) {
      // console.log(obj)
      this.roleDialogFormVisible = true
      this.grantForm.username = obj.username
      this.grantForm.id = obj.id
      // 让下拉列表有默认选项选中
      this.grantForm.rid = obj.rid
    },
    // 分配角色提交
    grantRole () {
      // console.log(this.grantForm)
      if (this.grantForm.rid) {
        grantRole(this.grantForm.id, this.grantForm.rid)
          .then(res => {
            if (res.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: res.data.meta.msg
              })
              this.roleDialogFormVisible = false
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
        this.$message({
          type: 'warning',
          message: '请先选择一个角色'
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
