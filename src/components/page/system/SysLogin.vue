<template>
    <div class="logo-bg">
        <el-container>
            <el-header></el-header>
            <el-main>
                <div class="logo" style="text-align: center;">
                    <a href="#">
                        <img src="../../../assets/img/logo.png" width="180px" height="180px"/>
                    </a>
                </div>
                <div class="ms-title">海信管理系统</div>
                <div class="login-form">
                    <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                        <el-form-item prop="username">
                            <el-input v-model="param.loginName" placeholder="userName">
                                <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input
                                    type="password"
                                    placeholder="password"
                                    v-model="param.password"
                                    @keyup.enter.native="submitForm()"
                            >
                                <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                            </el-input>
                        </el-form-item>
                        <div class="login-btn">
                            <el-button type="primary" @click="submitForm()" style="width: 200px;" :disabled="disabled">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</el-button>
                        </div>
                    </el-form>
                </div>
            </el-main>
            <el-footer>
                Copyright 2013-2016 版权所有 ©tzhsweet 2015-2018 <a href="#" target="_blank" style="text-decoration:none;color: #c1c8d1;">粤ICP备666666666666号-1</a>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: 'SysLogin',
        data: function() {
            return {
                disabled:false,
                param: {
                    loginName: 'sysadmin',
                    password: 'qq123123',
                },
                rules: {
                    loginName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                },
            };
        },
        methods: {
            submitForm() {
                this.disabled = true;
                this.$refs.login.validate(valid => {
                    if (valid) {
                        this.api.login(this.param).then(response =>{
                            this.disabled = false;
                            if (response.success){
                                this.$message.success('登录成功');
                                let userInfo = response.data;
                                let authorization = userInfo.token;
                                sessionStorage.setItem('Authorization', authorization);
                                sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
                                this.menuNav();
                            }else {
                                this.$message.error(response.responseMsg);
                            }
                        });
                    } else {
                        this.$message.error('请输入账号和密码');
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            menuNav(){
                this.api.menuNav(null).then(response =>{
                    if (response.success){
                        sessionStorage.setItem("sideItems",JSON.stringify(response.data.menus));
                        sessionStorage.setItem("permission",response.data.permission)
                        this.$router.push('/home');
                    }
                });
            }
        },
    };
</script>

<style scoped>
    .logo-bg{
        position: relative;
        background-color: #2a799f;
        background-image: url(../../../assets/img/login-bg.png);
        width: 100%;
        height: 100%;
    }
    .el-header, .el-footer {
        color: #c1c8d1;
        text-align: center;
        line-height: 60px ;
    }

    .el-main {
        padding: 0px !important;
        color: #333;
        text-align: center;
        min-height: calc(100vh - 120px)
    }

    body > .el-container {
        margin-bottom: 40px;
    }
    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: #fff;
    }
    .login-form{
        padding: 15px 30px;
        background-color: #fff;
        width: 350px;
        margin: 0 auto;
        border-radius: 30px;
    }
    .login-btn {
        text-align: center;
    }
</style>