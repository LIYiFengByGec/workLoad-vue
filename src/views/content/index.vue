<template>
    <div class="contentBox">
        <div class="header">
            日期：
            <el-date-picker
                    v-model="time"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="pickerOptions">
            </el-date-picker>
            <el-button style="margin-left: 10px"  type="primary" size="medium" icon="el-icon-search" @click="getTableData">查询</el-button>
            <el-button style="margin-left: 10px"  type="success" size="medium" icon="el-icon-plus" @click="toWorkLoad">我要填报</el-button>
            <el-button class="login-btn-submit" type="success" @click="toRegister">注册</el-button>
        </div>
        <el-table
                :data="tableData"
                :span-method="objectSpanMethod"
                border
                height="95%"
                stripe
                style="width: 100%; margin-top: 20px">
            <el-table-column
                    prop="fullName"
                    label="姓名"
                    align="center"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="demandName"
                    label="需求名称"
                    align="center"
                    width="350">
            </el-table-column>
            <el-table-column
                    prop="workContent"
                    label="工作内容"
                    width="500"
                    align="left">
                <template slot-scope="scope">
                    <span v-html="scope.row.workContent.replace(/\n/g,'<br/>')"></span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="workTime"
                    label="总工作量"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="isCreate"
                    label="是否建单"
                    align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.isCreate === 0" type="danger">未建单</el-tag>
                    <el-tag v-else type="success">已建单</el-tag>
                </template>
            </el-table-column>
        </el-table>
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
</template>

<script>
    import dateTimeUtils from "../../utils/DateTimeUtils";

    export default {
        name: "index",
        data() {
            return {
                time: dateTimeUtils.getBeforeDate(1),
                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', dateTimeUtils.formatDateStartTime(new Date()));
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', dateTimeUtils.formatDateStartTime(date));
                        }
                    }, {
                        text: '前天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 48);
                            picker.$emit('pick', dateTimeUtils.formatDateStartTime(date));
                        }
                    }]
                },
                tableData: [],
                span: [],
                showRegister: false,
                departmentId: '',
                departmentList: '',
                registerForm: {
                    fullName: '',
                    username: '',
                    phoneNumber: '',
                    level: '',
                    departmentId: ''
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
            };
        },
        created() {
            this.getTableData()
        },
        methods: {
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
                    const _row = this.span[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        // [0,0] 表示这一行不显示， [2,1]表示行的合并数
                        rowspan: _row,
                        colspan: _col
                    };
                }
            },
            toWorkLoad(){
                this.$router.push('workloadRecord')
            },
            getTableData(){
                this.$http({
                    url: this.$http.adornUrl('/workload/listWorkLoadByTimeByDepartmentId'),
                    method: 'post',
                    data: this.$http.adornData({
                        departmentId: 1, //只有一个部门，先默认它
                        searchTime: this.time
                    })
                }).then(res => {
                    this.tableData = res.data
                    this.span = []
                    this.getSpan()
                })
            },
            getSpan(){
                let data = this.tableData
                for (let i = 0; i < data.length; i++) {
                    if (i === 0) {
                        this.span.push(1);
                        this.pos = 0;
                    } else {
                        // 判断当前元素与上一个元素是否相同
                        if (data[i].fullName === data[i - 1].fullName) {
                            this.span[this.pos] += 1;
                            this.span.push(0);
                        } else {
                            this.span.push(1);
                            this.pos = i;
                        }
                    }
                }
            },
            toRegister(){
                this.showRegister = true;
                this.getDepartmentList();
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
            getDepartmentList(){
                // 先只考虑政务事业部
                this.departmentList = [{departmentId: 1, departmentName: '政务事业部'}]
                this.departmentId = 1
            }
        }
    }
</script>

<style scoped>

</style>