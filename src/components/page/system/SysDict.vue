<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 字典管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row>
                <el-col :span="12">
                    <div class="handle-box">
                        <div style="display: flex;flex-wrap: wrap;margin-bottom: 10px;">
                            <el-input v-model="typeName" placeholder="类型名称" style="width: 140px;margin-right: 5px;"></el-input>
                            <el-input v-model="typeCode" placeholder="类型代码" style="width: 140px;margin-right: 5px;"></el-input>
                            <el-button type="primary" @click="handleSearch">查询</el-button>
                            <el-button type="primary" @click="handleReset">重置</el-button>
                            <el-button type="primary" @click="handleAdd">新增</el-button>
                        </div>
                    </div>
                    <el-table
                            :data="typeData"
                            border
                            class="table"
                            ref="typeTable"
                            header-cell-class-name="table-header"
                            highlight-current-row
                            @current-change="handleCurrentChange"
                    >
                        <el-table-column label="类型代码" prop="dicttypeId" width="250px"></el-table-column>
                        <el-table-column label="类型名称" prop="dicttypeName"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button
                                        type="text"
                                        icon="el-icon-edit"
                                        @click="handleTypeEdit(scope.$index, scope.row)"
                                >编辑</el-button>
                                <el-button
                                        type="text"
                                        icon="el-icon-delete"
                                        class="red"
                                        @click="handleTypeDelete(scope.$index, scope.row)"
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
                </el-col>
                <el-col :span="12">
                    <div style="margin-bottom: 10px">
                        <el-button type="success" @click="handleDictAdd">新增字典项</el-button>
                        <el-button type="success" @click="handleLoadCache">刷新缓存</el-button>
                    </div>
                    <el-table
                            :data="dictData"
                            border
                            class="table"
                            ref="dictTable"
                            header-cell-class-name="table-header"
                    >
                        <el-table-column label="字典项代码" prop="dictId"></el-table-column>
                        <el-table-column label="字典项名称" prop="dictName"></el-table-column>
                        <el-table-column label="字典项状态" prop="status">
                            <template slot-scope="scope">
                                <el-tag
                                        :type="scope.row.status === 1?'success':'danger'"
                                >{{scope.row.status ===1 ? '是':'否'}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button
                                        type="text"
                                        icon="el-icon-edit"
                                        @click="handleDictEdit(scope.$index, scope.row)"
                                >编辑</el-button>
                                <el-button
                                        type="text"
                                        icon="el-icon-delete"
                                        class="red"
                                        @click="handleDictDelete(scope.$index, scope.row)"
                                >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination
                                background
                                layout="total,sizes, prev, pager, next"
                                :current-page="dictPageNum"
                                :page-size="dictPageSize"
                                :total="dictPageTotal"
                                :page-sizes="[10, 20, 30, 40]"
                                @current-change="handleDictPageChange"
                                @size-change="handleDictSizeChange"
                        ></el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>

        <el-dialog
                :title="typeTitle"
                :visible.sync="dialogVisible"
                width="50%">
            <el-form ref="typeForm" :model="typeForm" :rules="rules" label-width="80px">
                <el-form-item label="类型代码" prop="dicttypeId">
                    <el-input v-model="typeForm.dicttypeId" placeholder='类型代码' :disabled="disabledFlag"></el-input>
                </el-form-item>
                <el-form-item label="类型名称" prop="dicttypeName">
                    <el-input v-model="typeForm.dicttypeName" placeholder="类型名称"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleTypeSubmit('typeForm')">确 定</el-button>
                  </span>
        </el-dialog>

        <el-dialog
                :title="dictTitle"
                :visible.sync="dialogDictVisible"
                width="50%">
            <el-form ref="dictForm" :model="dictForm" :rules="dictRules" label-width="100px">
                <el-form-item label="类型代码" prop="dicttypeId">
                    <el-input v-model="dictForm.dicttypeId" placeholder='类型代码' disabled></el-input>
                </el-form-item>
                <el-form-item label="字典项代码" prop="dictId">
                    <el-input v-model="dictForm.dictId" placeholder="字典项代码" :disabled="dictDisabled"></el-input>
                </el-form-item>
                <el-form-item label="字典项名称" prop="dictName">
                    <el-input v-model="dictForm.dictName" placeholder="字典项名称"></el-input>
                </el-form-item>
                <el-form-item label="是否有效" prop="status">
                    <el-switch v-model="dictForm.status" :active-value= 1 :inactive-value=0></el-switch>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input-number v-model="dictForm.sort" :min="1" :max="100"></el-input-number>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogDictVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleDictSubmit('dictForm')">确 定</el-button>
                  </span>
        </el-dialog>

    </div>

</template>

<script>
    export default {
        name: 'SysDict',
        data(){
            return{
                typeName:'',
                typeCode:'',
                pageSize: 10,
                pageNum: 1,
                pageTotal: 0,
                typeData:[],
                dialogVisible:false,
                disabledFlag:false,
                typeTitle:'新增',
                typeForm:{
                    id:'',
                    dicttypeId:'',
                    dicttypeName:''
                },
                rules: {
                    dicttypeId: [
                        {required: true, message: '类型代码不能为空', trigger: ['blur', 'change']}
                    ],
                    dicttypeName: [
                        {required: true, message: '类型名称不能为空', trigger: ['blur', 'change']}
                    ]
                },
                dictData:[],
                dictPageSize: 10,
                dictPageNum: 1,
                dictPageTotal: 0,
                dialogDictVisible:false,
                dictTitle:'字典项代码新增',
                dictForm:{
                    id:'',
                    dictId:'',
                    dictName:'',
                    dicttypeId:'',
                    status: 1,
                    sort:'',
                },
                dictDisabled:false,
                dictRules: {
                    dicttypeId: [
                        {required: true, message: '类型代码不能为空', trigger: ['blur', 'change']}
                    ],
                    dictId: [
                        {required: true, message: '字典项代码不能为空', trigger: ['blur', 'change']}
                    ],
                    dictName: [
                        {required: true, message: '字典项名称不能为空', trigger: ['blur', 'change']}
                    ]
                },
            }
        },
        mounted() {
            this.handleSearch();
            },
        methods:{
            handleCurrentChange(row){
                this.dictForm.dicttypeId =row.dicttypeId;
                let params ={
                    dictEntry:{'dicttypeId':row.dicttypeId},
                    page:{'pageNum':this.pageNum,'pageSize':this.pageSize}
                };
                this.api.dictList(params).then(response =>{
                    if (response.success){
                        this.dictData = response.data.list;
                        this.dictPageNum = response.data.pageNum;
                        this.dictPageSize = response.data.pageSize;
                        this.dictPageTotal = response.data.total;
                    }
                });
            },
            // 当前页处理
            handleDictPageChange(val){
                this.dictPageNum = val;
                this.handleCurrentChange();
            },

            // 每页数变动
            handleDictSizeChange(val){
                this.dictPageSize = val;
                this.handleCurrentChange();
            },
            handleSearch(){
                let params ={
                    dictType:{'dicttypeId':this.typeCode,'dicttypeName':this.typeName},
                    page:{'pageNum':this.pageNum,'pageSize':this.pageSize}
                };
                this.api.typeDictList(params).then(response =>{
                    if (response.success){
                        this.typeData = response.data.list;
                        this.pageNum = response.data.pageNum;
                        this.pageSize = response.data.pageSize;
                        this.pageTotal = response.data.total;
                    }
                });
            },
            // 当前页处理
            handlePageChange(val){
                this.dictData = [];
                this.dictForm.dicttypeId = '';
                this.pageNum = val;
                this.handleSearch();
            },

            // 每页数变动
            handleSizeChange(val){
                this.dictData = [];
                this.dictForm.dicttypeId = '';
                this.pageSize = val;
                this.handleSearch();
            },

            handleReset(){
                this.typeName = '';
                this.typeCode = '';
            },
            handleAdd(){
                this.typeTitle = '新增';
                this.typeForm.dicttypeId = '';
                this.typeForm.dicttypeName = '';
                this.dialogVisible = true;
                this.disabledFlag = false;
                this.$nextTick(()=>{
                    //等弹窗里的form表单的dom渲染完在执行this.$refs.staffForm.resetFields()，去除验证
                    this.$refs['typeForm'].clearValidate();
                });
            },

            handleTypeEdit(index,row){
                let param ={
                    id:row.id
                };
                this.api.getTypeDictInfo(param).then(response =>{
                    if (response.success){
                        this.typeTitle = '编辑类型';
                        this.disabledFlag = true;
                        this.dialogVisible = true;
                        this.typeForm = response.data
                    }
                });
            },
            handleTypeDelete(index,row){
                let param ={
                    id:row.id
                };
                this.api.deleteTypeDict(param).then(response =>{
                    if (response.success){
                        this.$message({ message: response.responseMsg, type: 'success' });
                        this.handleSearch();
                    }
                });
            },
            handleTypeSubmit(formName){
                let params = this.typeForm;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.api.saveTypeDict(params).then(response =>{
                            if (response.success){
                                this.$message({ message: response.responseMsg, type: 'success' });
                                this.dialogVisible = false;
                                this.handleSearch();
                            }
                        });
                    }
                });
            },

            handleDictAdd(){
                if (!this.dictForm.dicttypeId){
                    this.$message({ message: '请点击字典类型，再操作字典项', type: 'warning' });
                    return;
                }
                this.cleanDictForm();
                this.$nextTick(()=>{
                    //等弹窗里的form表单的dom渲染完在执行this.$refs.staffForm.resetFields()，去除验证
                    this.$refs['dictForm'].clearValidate();
                });
                this.dialogDictVisible = true;
            },
            handleDictEdit(index,row){
                let param ={
                    id:row.id
                };
                this.api.getEntryInfo(param).then(response =>{
                    if (response.success){
                        this.typeTitle = '编辑字典项代码';
                        this.dialogDictVisible = true;
                        this.dictForm = response.data
                        this.dictDisabled = true;
                    }
                });
            },
            handleDictSubmit(formName){
                let params = this.dictForm;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.api.saveDict(params).then(response =>{
                            if (response.success){
                                this.$message({ message: response.responseMsg, type: 'success' });
                                this.dialogDictVisible = false;
                                let row = {
                                    dicttypeId:this.dictForm.dicttypeId
                                };
                                this.handleCurrentChange(row);
                            }
                        });
                    }
                });
            },
            handleDictDelete(index,row){
                let param ={
                    id:row.id
                };
                this.api.deleteDict(param).then(response =>{
                    if (response.success){
                        this.handleCurrentChange(row);
                    }
                });
            },

            handleLoadCache(){
                if (!this.dictForm.dicttypeId){
                    this.$message({ message: '请点击字典类型，再刷新缓存', type: 'warning' });
                    return;
                }
                let param ={
                    type:this.dictForm.dicttypeId
                };
                this.api.reloadCache(param).then(response =>{
                    if (response.success){
                        this.$message({ message: response.responseMsg, type: 'success' });
                    }
                });
            },
            cleanDictForm(){
                this.dictForm.id = '';
                this.dictForm.dictId = '';
                this.dictForm.dictName ='';
                this.dictForm.sort = '';
                this.dictForm.status = 1;
                this.dictDisabled = false;
            }
        }
    };
</script>

<style scoped>
    .red {
        color: #ff0000;
    }
</style>