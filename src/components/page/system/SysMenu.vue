<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 菜单管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-search" @click="handleRefresh()">刷新</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加顶级菜单</el-button>
            </div>

            <el-table :data="tableData" style="width: 100%" row-key="id" border lazy class="table"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column prop="text" label="名称"></el-table-column>
                <el-table-column prop="url" label="链接"></el-table-column>
                <el-table-column prop="icon" label="图标"></el-table-column>
                <el-table-column prop="sort" label="排序" width="50"></el-table-column>
                <el-table-column prop="show" label="是否可见" width="80">
                    <template slot-scope="scope">
                        <el-tag
                                :type="scope.row.show?'success':'danger'"
                        >{{scope.row.show ? '是':'否'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="permission" label="权限标识"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column label="操作" align="center" width="320">
                    <template slot-scope="scope">
                        <el-button
                                type="warning"  size="mini"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button v-show="!checkChildren(scope.row)"
                                type="danger"  size="mini"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                        <el-button
                                type="info"  size="mini"
                                @click="handleInfo(scope.$index, scope.row)"
                        >详情</el-button>
                        <el-button
                                type="primary"  size="mini"
                                @click="handleChildren(scope.$index, scope.row)"
                        >添加子菜单</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog
                    :title="titleName"
                    :visible.sync="dialogVisible"
                    width="50%"
                    :before-close="handleClose">
                <el-form ref="menuForm" :model="menuForm" :rules="rules" label-width="100px">
                    <el-form-item label="父菜单名称" prop="parentName">
                        <el-input v-model="menuForm.parentName" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="名称" prop="text">
                        <el-input v-model="menuForm.text" placeholder="菜单名称" :disabled="disabled"></el-input>
                    </el-form-item>
                    <el-form-item label="链接" prop="url">
                        <el-input v-model="menuForm.url" placeholder="菜单链接" :disabled="disabled"></el-input>
                    </el-form-item>
                    <el-form-item label="图标" prop="icon">
                        <el-input v-model="menuForm.icon" placeholder="菜单图标" :disabled="disabled"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="sort">
                        <el-input-number v-model="menuForm.sort" :min="1" :max="100" :disabled="disabled" ></el-input-number>
                    </el-form-item>
                    <el-form-item label="是否可用" prop="show">
                        <el-switch v-model="menuForm.show" :disabled="disabled"></el-switch>
                    </el-form-item>
                    <el-form-item label="权限标识" prop="permission">
                        <el-input v-model="menuForm.permission" placeholder="菜单权限标识" :disabled="disabled"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="remarks">
                        <el-input type="textarea" rows="5" v-model="menuForm.remarks" placeholder='备注' :disabled="disabled"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleSubmit('menuForm')" v-show="viewFlag">确 定</el-button>
                  </span>
            </el-dialog>

        </div>
    </div>
</template>

<script>
    export default {
        name: 'SysMenu',
        data(){
            return{
                tableData:[],
                dialogVisible:false,
                titleName : '添加',
                disabled:false,
                viewFlag:true,
                menuForm:{
                    parentId:'',
                    parentName:'',
                    id:'',
                    text:'',
                    url:'',
                    icon:'',
                    sort:'',
                    permission:'',
                    show: true,
                    remarks:'',
                    targetType:'iframe-tab'
                },
                rules: {
                    text: [
                        {required: true, message: '名称不能为空', trigger: ['blur', 'change']}
                    ],
                    sort: [
                        {required: true, message: '排序不能为空', trigger: ['blur', 'change']}
                    ]
                }
            }
        },
        mounted() {
            this.handleRefresh();
        },
        methods:{
            checkChildren(row){
                let length =row.children.length;
                return length >0;
            },
            // 加载列表数据
            handleRefresh(){
                this.api.menuList(null).then(response =>{
                   if (response.success){
                       this.tableData = response.data;
                   }
                });
            },

            handleAdd(){
                this.dialogVisible = true;
                this.titleName="添加";
                this.clearForm();
                this.$nextTick(()=>{
                    //等弹窗里的form表单的dom渲染完在执行this.$refs.staffForm.resetFields()，去除验证
                    this.$refs['menuForm'].clearValidate();
                });
                this.menuForm.parentName = '已是顶级菜单';
            },
            clearForm(){
              this.menuForm.id='';
              this.menuForm.icon='';
              this.menuForm.isShow =true;
              this.menuForm.parentId ='';
              this.menuForm.parentName = '';
              this.menuForm.permission = '';
              this.menuForm.remarks = '';
              this.menuForm.sort='';
              this.menuForm.text = '';
              this.menuForm.url = '';
              this.disabled = false;
              this.viewFlag = true;
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            handleSubmit(formName){
                let params = this.menuForm;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.api.saveMenu(params).then(response =>{
                            if (response.success){
                                this.$message({ message: response.responseMsg, type: 'success' });
                                this.dialogVisible = false;
                                this.handleRefresh();
                            }
                        });
                    }
                });
            },
            handleEdit(index,row){
                if (!row.id){
                    return;
                }
                this.titleName = '编辑';
                this.disabled = false;
                this.viewFlag = true;
                this.getMenuInfo(row);
            },
            handleInfo(index,row){
                this.titleName = '查看';
                this.disabled = true;
                this.viewFlag = false;
                this.getMenuInfo(row);
            },
            getMenuInfo(row){
                let param ={
                    menuId:row.id
                };
                this.api.menuInfo(param).then(response =>{
                    if (response.success){
                        this.dialogVisible = true;
                        this.menuForm = response.data;
                        if (!row.parentId){
                            this.menuForm.parentName = '已是顶级菜单';
                        } ;
                    }
                });
            },
            handleDelete(index,row){
                if (!row.id){
                    return;
                }
                let param ={
                    menuId:row.id
                };
                this.api.deleteMenuInfo(param).then(response =>{
                    if (response.success){
                        this.$message({ message: response.responseMsg, type: 'success' });
                        this.handleRefresh();
                    }
                });
            },
            handleChildren(index,row){
                this.dialogVisible = true;
                this.titleName="添加子菜单";
                this.clearForm();
                this.$nextTick(()=>{
                    //等弹窗里的form表单的dom渲染完在执行this.$refs.staffForm.resetFields()，去除验证
                    this.$refs['menuForm'].clearValidate();
                });
                this.menuForm.parentName = row.text;
                this.menuForm.parentId = row.id;
            }
        }
    }

</script>

<style scoped>
    .handle-box{
        margin-bottom: 10px;
    }
</style>