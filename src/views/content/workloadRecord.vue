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
            <el-button style="margin-left: 10px"  type="success" size="medium" icon="el-icon-plus" @click="showDialog">工作量填报</el-button>
        </div>
        <el-table
                :data="tableData"
                height="95%"
                stripe
                style="width: 100%">
            <el-table-column
                    prop="workDate"
                    label="日期"
                    width="100"
                    align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.workDate.split(" ")[0]}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="demandName"
                    label="需求标题"
                    width="350"
                    align="center">
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
                    label="工作时长(小时)"
                    align="center"
                    width="120">
            </el-table-column>
            <el-table-column
                    label="操作"
                    align="center">
                <template slot-scope="scope">
                    <el-button type="primary" size="medium" @click="showDialog(scope.row)">修改</el-button>
                    <el-button type="danger" size="medium" @click="deleteRow(scope.row.workloadId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="this.form.workloadId ? '修改工作量':'工作量填报'" :visible.sync="dialogFormVisible" width="50%" :close-on-click-modal="false">
            <el-form :model="form" :rules="rule" ref="form" status-icon>
                <el-form-item label="对应需求" prop="workContent">
                    <el-select style="width: 100%" v-model="form.demandId" filterable :filter-method="selectChange" placeholder="若此需求未建单，请留空，建单后记得补充上">
                        <el-option
                                v-for="item in demandList"
                                :key="item.demandId"
                                :label="item.demandName"
                                :value="item.demandId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工作内容" prop="workContent">
                    <el-input :maxlength="1000" type = "textarea" rows="5" show-word-limit v-model="form.workContent" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="工作时长(小时)" prop="workTime">
                    <el-input  show-word-limit v-model="form.workTime" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import dateTimeUtils from "../../utils/DateTimeUtils"
    import DateTimeUtils from "../../utils/DateTimeUtils";
    export default {
        name: "workloadRecord",
        data(){
            return{
                userId: '',
                time: dateTimeUtils.getToday().starttime,
                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick',dateTimeUtils.formatDateStartTime(new Date()));
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', dateTimeUtils.formatDateStartTime(date));
                        }
                    }]
                },
                dialogFormVisible: false,
                form: {
                    workloadId: '',
                    demandId: '',
                    workContent: '',
                    workTime: '',
                    workDate: '',
                    userId: ''
                },
                rule: {
                    workTime: [
                        { required: true, message: '工作时长必填', trigger: 'blur' }
                    ]
                },
                demandList: [],
                tableData: [],
            }
        },
        created() {
            this.userId = this.$cookies.get('userId')
            if(this.userId == null){
                this.$message.warning('身份信息已过期，请重新登录')
                this.$router.push("login")
                return false;
            }
            this.getTableData();
        },
        methods:{
            readerDemandList(){
                // 填需求时只获取15天内的需求
                let params = {
                    beginTime: DateTimeUtils.getBeforeDate(15),
                    endTime: DateTimeUtils.getCurrentTime(),
                }
                this.$http({
                    url: this.$http.adornUrl('/demand/listDemand'),
                    method: 'post',
                    data: this.$http.adornData(params)
                }).then(res =>{
                    let arr = []
                    res.data.forEach(item => {
                        arr.push({demandId: item.demandId, demandName: item.demandName})
                    })
                    this.demandList = arr
                })
            },
            showDialog(workload){
                if(workload.workloadId){
                    this.form = workload
                }else{
                    this.clearForm();
                }
                this.readerDemandList();
                this.dialogFormVisible = true
            },
            submitForm(){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        if(this.form.workloadId){
                            this.$http({
                                url: this.$http.adornUrl('/workload/updateWorkLoad'),
                                method: 'put',
                                data: this.$http.adornData(this.form)
                            }).then(res => {
                                this.$message.success(res.msg)
                                this.dialogFormVisible = false
                                this.getTableData();
                            })
                        }else{
                            this.form.userId = this.userId
                            this.form.workDate = this.time
                            this.$http({
                                url: this.$http.adornUrl('/workload/addWorkLoad'),
                                method: 'post',
                                data: this.$http.adornData(this.form)
                            }).then(res => {
                                this.$message.success(res.msg)
                                this.dialogFormVisible = false
                                this.getTableData();
                            })
                        }
                    }
                })
            },
            clearForm(){
                Object.keys(this.form).forEach((key) => {
                    if(typeof this.form[key] == 'number'){
                        this.form[key] = 0
                    }
                    if(typeof this.form[key] == 'string'){
                        this.form[key] = ''
                    }
                })
            },
            getTableData(){
                this.$http({
                    url: this.$http.adornUrl('/workload/listWorkLoadByUserIdByTime'),
                    method: 'post',
                    data: this.$http.adornData({
                        userId: this.userId,
                        searchTime: this.time
                    })
                }).then(res => {
                    this.tableData = res.data
                })
            },
            deleteRow(id){
                this.$http({
                    url: this.$http.adornUrl('/workload/deleteById/' + id),
                    method: 'delete',
                }).then(res => {
                    this.$message.success(res.msg)
                    this.getTableData();
                })
            },
            selectChange(val){
                // 填需求时只获取15天内的需求
                let params = {
                    demandName: val
                }
                this.$http({
                    url: this.$http.adornUrl('/demand/listDemand'),
                    method: 'post',
                    data: this.$http.adornData(params)
                }).then(res =>{
                    let arr = []
                    res.data.forEach(item => {
                        arr.push({demandId: item.demandId, demandName: item.demandName})
                    })
                    this.demandList = arr
                })
            }
        }
    }
</script>

<style scoped>

</style>