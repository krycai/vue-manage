<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 代码生成器
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form :inline="true" :model="seachForm" ref="searchForm" class="demo-form-inline">
                    <el-form-item label="表名称" prop="tableName">
                        <el-input v-model="seachForm.tableName" placeholder="角色名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="handleReset('searchForm')">重置</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="handleGenerator">生成代码</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="表名" prop="tableName"></el-table-column>
                <el-table-column label="Engine" prop="engine"></el-table-column>
                <el-table-column label="表备注" align="center" prop="tableComment"></el-table-column>
                <el-table-column prop="createTime" label="创建日期"></el-table-column>
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
        </div>
        <el-dialog
                title="代码生成信息"
                :visible.sync="dialogVisible"
                width="50%"
                :before-close="handleClose">
            <el-form ref="generatorForm" :model="generatorForm" :rules="rules" label-width="80px">
                <el-form-item label="包名" prop="packageName">
                    <el-input v-model="generatorForm.packageName" placeholder='cn.com.bluemoon.admin'></el-input>
                </el-form-item>
                <el-form-item label="作者" prop="author">
                    <el-input v-model="generatorForm.author" placeholder="张三"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="generatorForm.email" placeholder="zhangsan@bluemoon.com.cn"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleSubmit('generatorForm')">BM生成器</el-button>
                    <el-button type="primary" @click="handleTkSubmit('generatorForm')">TK生成器</el-button>
                  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'SysGenerator',
        data(){
            return{
                seachForm:{
                    tableName:''
                },
                pageSize: 10,
                pageNum: 1,
                pageTotal: 0,
                tableData:[],
                selectTable:'',
                dialogVisible:false,
                generatorForm:{
                    packageName:'cn.com.bluemoon',
                    author:'张三',
                    email:'zhangsan@bluemoon.com.cn',
                    tables:''
                },
                rules: {
                    packageName: [
                        {required: true, message: '包名不能为空', trigger: ['blur', 'change']}
                    ],
                    author: [
                        {required: true, message: '作者不能为空', trigger: ['blur', 'change']}
                    ],
                    email: [
                        {required: true, message: '邮箱不能为空', trigger: ['blur', 'change']}
                    ],
                },
            }
        },
        mounted(){
            this.handleSearch();
        },
        methods:{

            handleGenerator(){
                if (!this.selectTable) {
                    this.$message({ message: '请选择列表数据', type: 'warning' });
                    return;
                }
               this.dialogVisible =true;
            },
            handleTkSubmit(formName){
                if (!this.selectTable) {
                    return;
                }
                this.generatorForm.tables = this.selectTable;
                let params = {
                    ... this.generatorForm,
                    type: 'tk'
                };
                this.doSubmit(formName,params);
                this.dialogVisible = false
            },
            handleSubmit(formName){
                if (!this.selectTable) {
                    return;
                }
                this.generatorForm.tables = this.selectTable;
                let params = {
                    ... this.generatorForm,
                    type: 'bm'
                };
                this.doSubmit(formName,params);
                this.dialogVisible = false
            },
            doSubmit(formName,params){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.api.generatorCode(params).then(response =>{
                            if (response === 'undefined'){
                                return;
                            }
                            let url = window.URL.createObjectURL(new Blob([response.data]));
                            let link= document.createElement('a');
                            link.style.display='none';
                            link.href=url;
                            link.setAttribute('download', 'source-code.zip');   // 自定义下载文件名（如exemple.txt）
                            document.body.appendChild(link);
                            link.click();
                        });
                    }
                });
            },
            handleSelectionChange(val) {
                if (val.length <1){
                    return;
                }
                let tempArr = [];
                for (let index in val) {
                    tempArr.push(val[index].tableName);
                }
                this.selectTable = tempArr.join(',');
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
            handleSearch(){
                let param = {
                    tableName: this.seachForm.tableName,
                    page:{"pageNum":this.pageNum,"pageSize":this.pageSize}
                };
                this.api.generatorList(param).then(response =>{
                    if (response.success){
                        this.tableData = response.data.list;
                        this.pageNum = response.data.pageNum;
                        this.pageSize = response.data.pageSize;
                        this.pageTotal = response.data.total;
                    }
                });
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
        }
    };
</script>

<style scoped>

</style>