<template>
    <div class="site-wrapper site-page--login">
        <div class="site-content__wrapper">
            <div class="site-content">
                <div class="brand-info">
                    <h2 class="brand-info__text">工作量管理系统</h2>
                    <p class="brand-info__intro">用于记录各开发人员每日工作量信息</p>
                </div>
                <div class="login-main">
                    <h3 class="login-title">登录</h3>
                    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="login" status-icon>
                        <el-form-item prop="userName">
                            <el-input v-model="dataForm.userName" placeholder="帐号"></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input v-model="dataForm.password" type="password" placeholder="密码/电话号码"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="login-btn-submit" type="primary" @click="login">登录</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                showRegister: false,
                dataForm: {
                    userName: '',
                    password: '',
                },
                dataRule: {
                    userName: [
                        { required: true, message: '帐号不能为空', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                    ],
                }
            }
        },
        methods:{
            login(){
                this.$refs['dataForm'].validate((valid) => {
                    if(valid){
                        this.$http({
                            url: this.$http.adornUrl('/login'),
                            method: 'post',
                            data: this.$http.adornData({
                                username: this.dataForm.userName,
                                password: this.dataForm.password
                            })
                        }).then(res =>{
                            //一个月不用登录
                            this.$cookies.config('30d')
                            this.$cookies.set('userId', res.data.userId)
                            this.$cookies.set('fullName', res.data.fullName)
                            this.$router.push('/index')
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .site-wrapper.site-page--login{
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
        width: 100%;
        height: 100%;
        content: "";
        background-color: #fa8bff;
        background-image: linear-gradient(
                45deg,
                #fa8bff 0%,
                #2bd2ff 52%,
                #2bff88 90%
        );
        background-size: cover;
    }
    .site-content__wrapper {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        padding: 0;
        margin: 0;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: transparent;
    }
    .site-content {
        min-height: 100%;
        padding: 30px 500px 30px 30px;
    }
    .brand-info {
        margin: 220px 100px 0 90px;
        color: #fff;
    }
    .brand-info__text {
        margin: 0 0 22px 0;
        font-size: 48px;
        font-weight: 400;
        text-transform: uppercase;
    }
    .brand-info__intro {
        margin: 10px 0;
        font-size: 16px;
        line-height: 1.58;
        opacity: 0.6;
    }
    .login-main {
        position: absolute;
        top: 0;
        right: 0;
        padding: 150px 60px 180px;
        width: 470px;
        min-height: 100%;
        background-color: #fff;
        text-align: center;
    }
    .login-title {
        font-size: 16px;
    }
    .login-btn-submit {
        width: 48%;
        margin-top: 10px;
    }
</style>