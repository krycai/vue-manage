<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 角色管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form :inline="true" :model="seachForm" ref="searchForm" class="demo-form-inline">
                    <el-form-item label="角色名称" prop="name">
                        <el-input v-model="seachForm.name" placeholder="角色名称"></el-input>
                    </el-form-item>
                    <el-form-item label="角色代码" prop="code">
                        <el-input v-model="seachForm.code" placeholder="角色代码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleReset('searchForm')">重置</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleAdd">新增</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleUser">配置用户</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table
                    :data="tableData"
                    @selection-change="handleSelectionChange"
                    border
                    class="table"
                    ref="roleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="角色名称" prop="name"></el-table-column>
                <el-table-column label="角色代码" width="250px" prop="code"></el-table-column>
                <el-table-column label="可见" align="center">
                    <template slot-scope="scope">
                        <el-tag
                                :type="scope.row.enabled?'success':'danger'"
                        >{{scope.row.enabled ? '是':'否'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="opTime" label="更新时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
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
                <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="80px">
                    <el-form-item label="角色名称" prop="name">
                        <el-input v-model="roleForm.name" placeholder='角色名称'></el-input>
                    </el-form-item>
                    <el-form-item label="角色编码" prop="code">
                        <el-input v-model="roleForm.code" placeholder="角色编码必须以ROLE_开头"></el-input>
                    </el-form-item>
                    <el-form-item label="是否可用" prop="enabled">
                        <el-switch v-model="roleForm.enabled"></el-switch>
                    </el-form-item>
                    <el-form-item label="角色授权" prop="enabled">
                        <el-tree ref="tree"
                                :data="treeData"
                                show-checkbox
                                node-key="id"
                                default-expand-all
                                :props="defaultProps">
                        </el-tree>

                    </el-form-item>
                    <el-form-item label="备注" prop="remarks">
                        <el-input type="textarea" rows="5" v-model="roleForm.remarks" placeholder='备注'></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleSubmit('roleForm')">确 定</el-button>
                  </span>
            </el-dialog>

            <el-dialog
                    title="配置用户"
                    :visible.sync="userVisible"
                    width="45%">
                <el-button type="primary" @click="handleAddStaff()">增加人员</el-button>
                <el-table
                        :data="userData"
                        border height="350px"
                        class="table"
                        ref="authTable"
                        header-cell-class-name="table-header"
                >
                    <el-table-column label="用户ID" prop="userId"></el-table-column>
                    <el-table-column label="用户名称" prop="userName"></el-table-column>
                    <el-table-column label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <el-button
                                    type="text"
                                    icon="el-icon-delete"
                                    class="red"
                                    @click="handleUserDelete(scope.$index, scope.row)"
                            >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>

            <el-dialog
                    title="添加人员"
                    :visible.sync="staffVisible"
                    width="45%">
                <el-input v-model="staffCode" placeholder="用户ID，即员工编号"  style="display: inline-block;width: 50%;margin-bottom: 10px;"></el-input>
                <el-button type="primary" @click="handleStaffSearch()"  style="display: inline-block;">增加人员</el-button>
                <el-table
                        :data="staffData"
                        class="table"
                        ref="authTable"
                        header-cell-class-name="table-header"
                >
                    <el-table-column label="用户ID" prop="staffNum"></el-table-column>
                    <el-table-column label="用户名称" prop="staffName"></el-table-column>
                    <el-table-column label="部门" prop="department" align="center"></el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="staffVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleStaffSubmit()">确 定</el-button>
                  </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'SysRole',
        data(){
            return{
                staffVisible:false,
                staffCode:'',
                staffData:[],
                tableRoleId:'',
                userData:[],
                userVisible:false,
                seachForm:{
                    name:'',
                    code:''
                },
                pageSize: 10,
                pageNum: 1,
                pageTotal: 0,
                tableData:[],
                dialogVisible:false,
                titleName:'添加',
                roleForm:{
                    id:'',
                    name:'',
                    code:'',
                    enabled: true,
                    remarks:'',
                    menuIds:''
                },
                rules: {
                    name: [
                        {required: true, message: '角色名称不能为空', trigger: ['blur', 'change']}
                    ],
                    code: [
                        {required: true, message: '角色编码不能为空', trigger: ['blur', 'change']}
                    ],
                    remarks: [
                        {required: true, message: '备注不能为空', trigger: ['blur', 'change']}
                    ],
                },
                defaultProps: {
                    children: 'children',
                    label: 'text'
                },
                treeData:[]
            }
        },
        mounted() {
          this.handleSearch();
          this.handleTree();
        },
        methods:{
            // 菜单树数据
            handleTree(){
                this.api.menuList(null).then(response =>{
                    if (response.success){
                        this.treeData = response.data;
                    }
                });
            },

            // 列表查询
            handleSearch(){
                let param = {
                    role: this.seachForm,
                    page:{"pageNum":this.pageNum,"pageSize":this.pageSize}
                };
                this.api.roleList(param).then(response =>{
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

            handleSelectionChange(selection) {
                if (selection.length === 0) { // 判断selection是否有值存在
                    this.tableRoleId = '';
                    return;
                };
                if (selection.length > 2) {
                    // 不让他多选
                    this.$refs.roleTable.clearSelection()
                    this.$message.error('不能多选');
                    return;
                }
                if (selection.length > 1) {
                    // 多选框实现单选功能
                    this.$refs.roleTable.clearSelection()
                    this.$refs.roleTable.toggleRowSelection(selection.pop())
                    return
                }
                this.tableRoleId = selection[0].id;
                return
            },

            // 重置查询
            handleReset(formName){
                this.$refs[formName].resetFields();
            },

            handleUser(){
                if (!this.tableRoleId){
                    this.$message({ message:'请选择一个角色，再进行操作', type: 'warning' });
                    return;
                }
                let param = {
                    roleId:this.tableRoleId
                };
                this.api.getUserByRoleId(param).then(response =>{
                    if (response.success){
                        this.userData = response.data;
                        this.userVisible = true;
                    }
                });
            },

            // 删除用户
            handleUserDelete(index,row){
                let param = {
                    roleId:this.tableRoleId,
                    userId:row.userId
                };
                this.api.deleteUserRole(param).then(response =>{
                    if (response.success){
                        this.handleUser();
                    }
                });
            },

            handleAddStaff(){
                this.staffCode = "";
                this.staffData = [];
                this.staffVisible = true;
            },

            handleStaffSearch(){
                if (!this.staffCode){
                    return;
                }
                let params = {
                    userId:this.staffCode
                };
                this.api.findUserByUserId(params).then(response =>{
                    if (response.success){
                        let data = response.data;
                        if (data){
                            this.staffData = [];
                            this.staffData.push(data);
                        }
                    }
                });
            },
            handleStaffSubmit(){
                if (this.staffData.length <1){
                    this.$message({ message: '请添加用户', type: 'warning' });
                    return;
                }
                let params ={
                    roleId:this.tableRoleId,
                    userId:parseInt(this.staffData[0].staffNum)
                };
                this.api.submitUserRole(params).then(response =>{
                    if (response.success){
                        this.staffVisible = false;
                        this.handleUser();
                    }
                });
            },

            handleAdd(){
                this.titleName = '添加';
                this.cleanForm();
                this.dialogVisible = true;
                this.$nextTick(()=>{
                    //等弹窗里的form表单的dom渲染完在执行this.$refs.staffForm.resetFields()，去除验证
                    this.$refs['roleForm'].clearValidate();
                    this.$refs.tree.setCheckedKeys([]);
                });
            },

            cleanForm(){
              this.roleForm.code = '';
              this.roleForm.name ='';
              this.roleForm.id= '';
              this.roleForm.remarks = '';
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
                    roleId:row.id
                };
                this.api.getRoleInfo(param).then(response =>{
                    if (response.success){
                        this.titleName = '修改';
                        this.dialogVisible = true;
                        this.roleForm = response.data;
                        let menuIdArr = response.data.roleMenus;
                        let tempArr = [];
                        for (let index in menuIdArr){
                            tempArr.push(menuIdArr[index].menuId);
                        }
                        if (tempArr.length > 0) {
                            this.$nextTick(() => {
                                this.$refs.tree.setCheckedKeys(tempArr);
                            });
                        }
                    }
                });
            },

            handleSubmit(formName){
                let ids = this.$refs.tree.getCheckedKeys();
                this.roleForm.menuIds = ids.join(",");
                let params = this.roleForm;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.api.roleSave(params).then(response =>{
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
                    roleId:row.id
                };
                this.api.deleteRole(param).then(response =>{
                    if (response.success){
                        this.$message({ message: response.responseMsg, type: 'success' });
                        this.handleSearch();
                    }
                });

            },

        }
    };
</script>


<style scoped>

    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }

</style>