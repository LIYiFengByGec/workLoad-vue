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
                            <el-button class="login-btn-submit" type="success" @click="toRegister">注册</el-button>
                            <el-button class="login-btn-submit" type="primary" @click="login">登录</el-button>
                        </el-form-item>
                    </el-form>
                    <el-dialog title="新用户注册" width="35%" :visible.sync="showRegister" :modal-append-to-body="false" :close-on-click-modal="false">
                        <el-form :model="registerForm" label-width="90px" ref="registerForm" :rules="registerRule">
                            <el-form-item label="姓名" prop="fullName">
                                <el-input v-model="registerForm.fullName" placeholder="您的真实姓名">></el-input>
                            </el-form-item>
                            <el-form-item label="用户名" prop="username">
                                <el-input v-model="registerForm.username" placeholder="姓_名拼音（如：zhang_san）">></el-input>
                            </el-form-item>
                            <el-form-item label="电话号码" prop="phoneNumber">
                                <el-input v-model="registerForm.phoneNumber" placeholder="电话号码(作为密码)">></el-input>
                            </el-form-item>
                            <el-form-item label="评级" prop="level">
                                <el-input v-model="registerForm.level" placeholder="开发等级（p6,p7,p8）">></el-input>
                            </el-form-item>
                            <el-form-item label="所在部门" prop="departmentId">
                                <el-select v-model="departmentId" placeholder="请选择">
                                    <el-option
                                            v-for="item in departmentList"
                                            :key="item.departmentId"
                                            :label="item.departmentName"
                                            :value="item.departmentId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="showRegister = false">取 消</el-button>
                            <el-button type="primary" @click="register">确 定</el-button>
                        </div>
                    </el-dialog>
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
                departmentId: '',
                departmentList: '',
                dataForm: {
                    userName: '',
                    password: '',
                },
                registerForm: {
                    fullName: '',
                    username: '',
                    phoneNumber: '',
                    level: '',
                    departmentId: ''
                },
                dataRule: {
                    userName: [
                        { required: true, message: '帐号不能为空', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                    ],
                },
                registerRule: {
                    fullName: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    username: [
                        { required: true, message: '用户名不能为空', trigger: 'blur' }
                    ],
                    phoneNumber: [
                        { required: true, message: '手机号不能为空', trigger: 'blur' }
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
                            this.$router.push('/index')
                        })
                    }
                })
            },
            register() {
                this.$refs['registerForm'].validate((valid) => {
                    if(valid){
                        this.$http({
                            url: this.$http.adornUrl('/register'),
                            method: 'post',
                            data: this.$http.adornData({
                                username: this.registerForm.username,
                                fullName: this.registerForm.fullName,
                                level: this.registerForm.level,
                                phoneNumber: this.registerForm.phoneNumber,
                                departmentId: this.departmentId
                            })
                        }).then(() =>{
                            this.$message.success('注册成功')
                            this.showRegister = false
                        })
                    }
                })
            },
            toRegister(){
                this.showRegister = true;
                this.getDepartmentList();
            },
            getDepartmentList(){
                // 先只考虑政务事业部
                this.departmentList = [{departmentId: 1, departmentName: '政务事业部'}]
                this.departmentId = 1
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