<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form :inline="true" :model="seachForm" ref="searchForm" class="demo-form-inline">
                    <el-form-item label="登录名称" prop="loginName">
                        <el-input v-model="seachForm.loginName" placeholder="登录名称"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="seachForm.name" placeholder="姓名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="handleReset('searchForm')">重置</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="handleAdd">新增</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column label="登录名称" prop="loginName" width="120px"></el-table-column>
                <el-table-column label="姓名" prop="name"> </el-table-column>
                <el-table-column label="状态" align="center" width="80px">
                    <template slot-scope="scope">
                        <el-tag
                                :type="scope.row.enabled?'success':'danger'"
                        >{{scope.row.enabled ? '可用':'停用'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机"></el-table-column>
                <el-table-column prop="email" label="邮件"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column label="操作" align="center" width="380px">
                    <template slot-scope="scope">
                        <el-button size="mini" v-show="false"
                                @click="handleAuth(scope.$index, scope.row)"
                        >授权</el-button>
                        <el-button
                                type="warning"  size="mini"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                                   type="danger"  size="mini"
                                   @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                        <el-button v-if="scope.row.enabled"
                                type="success"  size="mini"
                                @click="handleEnabled(false, scope.row)"
                        >停用</el-button>
                        <el-button v-else
                                   type="info"  size="mini"
                                   @click="handleEnabled(true, scope.row)"
                        >启用</el-button>
                        <el-button
                                type="primary"  size="mini"
                                @click="handlePwd(scope.$index, scope.row)"
                        >更新密码</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total,sizes, prev, pager, next"
                        :current-page="pageNum"
                        :page-size="pageSize"
                        :total="pageTotal"
                        :page-sizes="[10, 20, 30, 40]"
                        @current-change="handlePageChange"
                        @size-change="handleSizeChange"
                ></el-pagination>
            </div>

            <el-dialog
                    :title="titleName"
                    :visible.sync="dialogVisible"
                    width="50%"
                    :before-close="handleClose">
                <el-form ref="userForm" :model="userForm" :rules="rules" label-width="80px">
                    <el-form-item label="登录名称" prop="loginName">
                        <el-input v-model="userForm.loginName" :disabled="!showFlag" placeholder='登录名称'></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="userForm.name" placeholder="姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password" v-if="showFlag">
                        <el-input type="password" v-model="userForm.password" placeholder="密码"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="userForm.mobile" placeholder="手机"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="userForm.email" placeholder="邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="remarks">
                        <el-input type="textarea" rows="5" v-model="userForm.remarks" placeholder='备注'></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleSubmit('userForm')">确 定</el-button>
                  </span>
            </el-dialog>

            <el-dialog
                    title="更新密码"
                    :visible.sync="pwdVisible"
                    width="40%">
                <el-input type="password" v-model="newPassword" placeholder="密码"></el-input>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="pwdVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handlePwdSubmit()">确 定</el-button>
                  </span>
            </el-dialog>

            <el-dialog
                    title="授权"
                    :visible.sync="authVisible"
                    width="40%">
                <el-table
                        :data="roleData"
                        border
                        @selection-change="handleSelectionChange"
                        class="table"
                        ref="authTable"
                        header-cell-class-name="table-header"
                >
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column label="角色名称" prop="name"></el-table-column>
                    <el-table-column label="角色代码" prop="code"></el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="authVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleAuthSubmit()">确 定</el-button>
                  </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'SysUser',
        data(){
            return{
                roleIds:'',
                roleData:[],
                authVisible:false,
                pwdVisible:false,
                newPassword:'',
                seachForm:{
                    loginName:'',
                    name:''
                },
                pageSize: 10,
                pageNum: 1,
                pageTotal: 0,
                tableData:[],
                dialogVisible:false,
                titleName:'添加',
                showFlag: true,
                userForm:{
                    id:'',
                    loginName:'',
                    name:'',
                    password:'',
                    email:'',
                    mobile:'',
                    enabled: true,
                    remarks:''
                },
                rules: {
                    name: [
                        {required: true, message: '姓名不能为空', trigger: ['blur', 'change']}
                    ],
                    loginName: [
                        {required: true, message: '登录名不能为空', trigger: ['blur', 'change']}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: ['blur', 'change']}
                    ],
                    mobile: [
                        {required: true, message: '手机不能为空', trigger: ['blur', 'change']}
                    ]
                }
            }
        },
        mounted() {
            this.handleSearch();
            this.handleAllRole()
        },
        methods:{
            // 获取所有的角色
            handleAllRole(){
                this.api.getAllRole(null).then(response =>{
                    if (response.success){
                        this.roleData = response.data;
                    }
                });
            },
            // 列表查询
            handleSearch(){
                let param = {
                    user: this.seachForm,
                    page:{"pageNum":this.pageNum,"pageSize":this.pageSize}
                };
                this.api.userList(param).then(response =>{
                    if (response.success){
                        this.tableData = response.data.list;
                        this.pageNum = response.data.pageNum;
                        this.pageSize = response.data.pageSize;
                        this.pageTotal = response.data.total;
                    }
                });
            },

            // 当前页处理
            handlePageChange(val){
                this.pageNum = val;
                this.handleSearch();
            },

            // 每页数变动
            handleSizeChange(val){
                this.pageSize = val;
                this.handleSearch();
            },

            // 重置查询
            handleReset(formName){
                this.$refs[formName].resetFields();
            },

            handleAdd(){
                this.titleName = '添加';
                this.cleanForm();
                this.dialogVisible = true;
                this.$nextTick(()=>{
                    //等弹窗里的form表单的dom渲染完在执行this.$refs.staffForm.resetFields()，去除验证
                    this.$refs['userForm'].clearValidate();
                });
            },

            cleanForm(){
                this.userForm.loginName = '';
                this.userForm.name ='';
                this.userForm.id= '';
                this.userForm.remarks = '';
                this.userForm.email = '';
                this.userForm.password = '';
                this.userForm.mobile = '';
                this.showFlag = true;

            },

            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },

            handleEdit(index,row){
                let param ={
                    userId:row.id
                };
                this.api.getUserInfo(param).then(response =>{
                    if (response.success){
                        this.titleName = '修改';
                        this.showFlag = false;
                        this.dialogVisible = true;
                        this.userForm = response.data;
                    }
                })
            },

            handleSubmit(formName){
                let params = this.userForm;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.api.saveUserInfo(params).then(response =>{
                            if (response.success){
                                this.$message({ message: response.responseMsg, type: 'success' });
                                this.dialogVisible = false;
                                this.handleSearch();
                            }
                        });
                    }
                });
            },

            handleDelete(index,row){
                let param ={
                    userId:row.id
                };
                this.api.deleteUserInfo(param).then(response =>{
                    if (response.success){
                        this.$message({ message: response.responseMsg, type: 'success' });
                        this.handleSearch();
                    }
                });
            },
            handleEnabled(flag,row){
                let params = {
                    id : row.id,
                    enabled:flag
                };
                this.api.saveUserInfo(params).then(response =>{
                    if (response.success){
                        this.$message({ message: response.responseMsg, type: 'success' });
                        this.handleSearch();
                    }
                });
            },
            handlePwd(index,row){
               this.newPassword = '';
               this.userForm.id = row.id;
               this.pwdVisible = true;
            },
            handlePwdSubmit(){
                if (!this.userForm.id){
                    return;
                }
                if (!this.newPassword){
                    this.$message({ message: '请出入新密码', type: 'waring' });
                    return;
                }
                let param ={
                    id:this.userForm.id,
                    newPassword:this.newPassword
                };
                this.api.editPassword(param).then(response =>{
                    if (response.success){
                        this.pwdVisible = false;
                        this.$message({ message: response.responseMsg, type: 'success' });
                        this.handleSearch();
                    }
                });
            },
            handleSelectionChange(val) {
                if (val.length <1){
                    this.roleIds = '';
                    return;
                }
                let tempArr = [];
                for (let index in val) {
                    tempArr.push(val[index].id);
                }
                this.roleIds = tempArr.join(',');
            },
            handleAuth(index,row){
                this.userForm.id = row.id;
                let params = {
                    userId: row.id
                };
                this.api.getUserAuthMsg(params).then(response =>{
                    if (response.success) {
                        this.authVisible = true;
                        let roles = response.data;
                        if (roles.length > 0) {
                            this.$nextTick(()=>{
                                roles.forEach(row => {
                                    // 不能自己自定义对象来设置选中（原因如下分析），那我可以从列表中找到需要选中的那个对象，然后把它拿过来作为选中的项就可以了
                                    this.$refs.authTable.toggleRowSelection(this.roleData.find(item => {
                                        return row.id === item.id;  // 注意这里寻找的字段要唯一，示例仅参考
                                    }), true);
                                });
                            });
                        }
                    }
                });
            },

            handleAuthSubmit(){
                let userId = this.userForm.id;
                if (!userId){
                    return;
                }

                let param ={
                    userId:userId,
                    roleId:this.roleIds
                };
                this.api.saveUserRole(param).then(response =>{
                    if (response.success){
                        this.authVisible = false;
                        this.$refs.authTable.clearSelection();
                        this.$message({ message: response.responseMsg, type: 'success' });
                        this.handleSearch();
                    }
                });
            }

        }
    };
</script>

<style scoped>

</style>