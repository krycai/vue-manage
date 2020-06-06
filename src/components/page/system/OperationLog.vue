<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 日志管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form :inline="true" :model="seachForm" ref="searchForm" class="demo-form-inline">
                    <el-form-item label="姓名" prop="userName">
                        <el-input v-model="seachForm.userName" placeholder="支持模糊查询" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="用户ID" prop="userId">
                        <el-input v-model="seachForm.userId" placeholder="支持模糊查询" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="接口名称" prop="interfaceName">
                        <el-input v-model="seachForm.interfaceName" placeholder="支持模糊查询" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="查询时间" prop="code">
                        <el-date-picker
                                v-model="seachForm.startTime"
                                value-format ="yyyy-MM-dd 00:00:00"
                                type="date">
                        </el-date-picker>
                        至
                        <el-date-picker
                                v-model="seachForm.endTime"
                                value-format ="yyyy-MM-dd 23:59:59"
                                type="date">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleReset('searchForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="roleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column label="姓名" prop="userName" width="100px"></el-table-column>
                <el-table-column label="用户ID" prop="userId" width="100px"></el-table-column>
                <el-table-column label="Ip地址" prop="operIp"></el-table-column>
                <el-table-column label="接口名称" prop="operContent" :show-overflow-tooltip='true'></el-table-column>
                <el-table-column label="接口" prop="operMethod" align="center"></el-table-column>
                <el-table-column label="接口参数" prop="operParams" :show-overflow-tooltip='true'></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="140px"></el-table-column>
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
    </div>
</template>

<script>
    export default {
        name: 'OperationLog',
        data() {
            return {
                seachForm:{
                    userName:'',
                    userId:'',
                    interfaceName:'',
                    startTime:'',
                    endTime:''
                },
                pageSize: 10,
                pageNum: 1,
                pageTotal: 0,
                tableData:[],
            }
        },
        mounted(){
          this.handleSearch();
        },
        methods:{
            handleSearch(){
                let startTime = new Date(this.seachForm.startTime).getTime();
                let endTime = new Date(this.seachForm.endTime).getTime();
                if (startTime > endTime){
                    this.$message.warning('开始时间不能大于结束时间，请重新选择');
                    return;
                }
                let param = {
                    ... this.seachForm,
                    page:{"pageNum":this.pageNum,"pageSize":this.pageSize}
                };
                this.api.operationList(param).then(response =>{
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
                this.seachForm.startTime = "";
                this.seachForm.endTime ="";
            },
        }
    };
</script>

<style scoped>

</style>