<template>
    <div class="contentBox">
        <div class="header">
            <span style="font-size: 22px;">模糊搜索</span>
            <el-input style="display: inline-block;width: 180px;margin: 0 20px" type="text" v-model="demandNameSearch"></el-input>
            <el-button icon="el-icon-search" @click="getTableData" circle></el-button>
            <el-button  type="success" size="medium" icon="el-icon-plus" @click="showDialog">新增需求</el-button>
            <el-checkbox style="margin-left: 20px" v-model="isFinish" @change="getTableData">查询已完成需求</el-checkbox>
            <el-checkbox style="margin-left: 20px" v-model="isCreate" @change="getTableData">仅查询未建单</el-checkbox>
        </div>
        <el-table
                :data="tableData"
                height="95%"
                stripe
                style="width: 100%">
            <el-table-column
                    prop="demandName"
                    label="需求标题"
                    width="350"
                    align="center">
            </el-table-column>
            <el-table-column
                    label="jira地址"
                    width="380"
                    align="center">
                <template slot-scope="scope">
                    <a target="_blank" :href="scope.row.jiraAddress">{{scope.row.jiraAddress}}</a>
                </template>
            </el-table-column>
            <el-table-column
                    prop="modifyTime"
                    label="编辑时间"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    label="是否建单"
                    width="100"
                    align="center">
                <template slot-scope="scope">
                    <el-switch
                            v-model="scope.row.isCreate"
                            active-color="#13ce66"
                            :active-value="1"
                            :inactive-value="0"
                            inactive-color="#ff4949"
                            @change="updateIsCreate(scope.row)"
                    >
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                    prop="demandName"
                    label="是否完成"
                    align="center">
                <template slot-scope="scope">
                    <el-switch
                            v-model="scope.row.isFinish"
                            :active-value="1"
                            :inactive-value="0"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="updateIsFinish(scope.row)"
                    >
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    align="center">
                <template slot-scope="scope">
                    <el-button type="warning" size="medium" @click="showDialog(scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="this.form.demandId ? '修改需求':'新增需求'" :visible.sync="dialogFormVisible" width="35%" :close-on-click-modal="false">
            <el-form :model="form" :rules="rule" ref="form" status-icon>
                <el-form-item label="需求标题" prop="demandName">
                    <el-input :maxlength="100" type = "textarea" show-word-limit v-model="form.demandName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="jira地址">
                    <el-input :maxlength="255" show-word-limit v-model="form.jiraAddress" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否建单">
                    <el-switch
                            v-model="form.isCreate"
                            :active-value="1"
                            :inactive-value="0"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                    >
                    </el-switch>
                </el-form-item>
                <el-form-item label="是否完成">
                    <el-switch
                            v-model="form.isFinish"
                            :active-value="1"
                            :inactive-value="0"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                    >
                    </el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "demand",
        data() {
            return {
                tableData: [],
                dialogFormVisible: false,
                form: {
                    demandName: '',
                    jiraAddress: '',
                    isCreate: 0,
                    isFinish: 0,
                },
                rule:{
                    demandName: [
                        { required: true, message: '需求标题不可为空', trigger: 'blur' }
                    ]
                },
                demandNameSearch: '',
                isFinish: false,
                isCreate: false
            }
        },
        created() {
            this.getTableData();
        },
        methods:{
            getTableData(){
                let params = {
                    demandName: this.demandNameSearch,
                    isFinish: this.isFinish ? 1 : 0,
                    isCreate: this.isCreate ? 0 : null,
                    beginTime: null,
                    endTime:null
                }
                this.$http({
                    url: this.$http.adornUrl(`/demand/listDemand`),
                    method: 'post',
                    data: this.$http.adornData(params)
                }).then(res =>{
                    this.tableData = res.data
                })
            },
            updateIsCreate(row){
                this.$http({
                    url: this.$http.adornUrl('/demand/updateDemandCreateByDemandId/' + row.demandId),
                    method: 'get'
                })
            },
            updateIsFinish(row){
                this.$http({
                    url: this.$http.adornUrl('/demand/updateDemandFinishByDemandId/' + row.demandId),
                    method: 'get',
                })
            },
            showDialog(demand){
                if(demand.demandId){
                    this.form = demand
                }else{
                    this.clearForm();
                }
                this.dialogFormVisible = true;
            },
            submitForm(){
                this.$refs['form'].validate((valid) => {
                    if(valid){
                        if(this.form.demandId){
                            this.$http({
                                url: this.$http.adornUrl('/demand/updateDemand'),
                                method: 'put',
                                data: this.$http.adornData(this.form)
                            }).then(res =>{
                                this.$message.success(res.msg)
                                this.dialogFormVisible = false
                                this.getTableData()
                            })
                        }else{
                            this.$http({
                                url: this.$http.adornUrl('/demand/addDemand'),
                                method: 'post',
                                data: this.$http.adornData(this.form)
                            }).then(res =>{
                                this.$message.success(res.msg)
                                this.dialogFormVisible = false
                                this.getTableData()
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
        }
    }
</script>

<style scoped>

</style>