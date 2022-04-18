<template>
    <div class="contentBox">
        <div class="header">
            统计日期范围：
            <el-date-picker
                    v-model="time"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    end-placeholder="结束日期"
                    :default-time="defaultTime"
                    align="right">
            </el-date-picker>
            <el-button style="margin-left: 10px"  type="primary" size="medium" icon="el-icon-search" @click="getTableData">查询</el-button>
            <el-button style="margin-left: 10px"  type="primary" size="medium" icon="el-icon-search" @click="exportWord">导出周报</el-button>
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
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="demandName"
                        label="需求名称"
                        align="center"
                        width="350">
                </el-table-column>
                <el-table-column
                        prop="workTime"
                        label="工作量"
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
                <el-table-column
                        label="操作"
                        align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="medium" plain @click="showContent(scope.row)">查看工作明细</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--  -->
            <el-dialog title="工作内容明细" :visible.sync="dialogTableVisible">
                <el-table :data="contentData">
                    <el-table-column property="workDate" label="工作日期" align="center" width="150">
                        <template slot-scope="scope">
                            <span>{{scope.row.workDate.split(" ")[0]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column property="workContent" label="工作内容" align="left">
                        <template slot-scope="scope">
                            <span v-html="scope.row.workContent.replace(/\n/g,'<br/>')"></span>
                        </template>
                    </el-table-column>
                    <el-table-column property="workTime" label="工作时长" width="80" align="center"></el-table-column>
                </el-table>
            </el-dialog>
        </div>
</template>

<script>
    import dateTimeUtils from "../../utils/DateTimeUtils";

    export default {
        name: "workloadStatistics",
        data(){
            return{
                defaultTime: ['00:00:00', '23:59:59'],
                pickerOptions: {
                    shortcuts: [{
                        text: '上周',
                        onClick(picker) {
                            const end = dateTimeUtils.getNextWeek(-1).endtime + ' 23:59:59';
                            const start = dateTimeUtils.getNextWeek(-1).starttime + ' 00:00:00'
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '本月',
                        onClick(picker) {
                            const end = dateTimeUtils.getCurrMonthDays().endtime;
                            const start = dateTimeUtils.getCurrMonthDays().starttime;
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '上个月',
                        onClick(picker) {
                            const end = dateTimeUtils.getLastMonthDays().endtime;
                            const start = dateTimeUtils.getLastMonthDays().starttime;
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                time: [dateTimeUtils.getNextWeek(-1).starttime + ' 00:00:00', dateTimeUtils.getNextWeek(-1).endtime + ' 23:59:59'],
                tableData: [],
                span: [],
                dialogTableVisible: false,
                contentData: []
            }
        },
        created() {
            this.getTableData()
        },
        methods:{
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
            getTableData(){
                this.$http({
                    url: this.$http.adornUrl('/workload/listWorkLoadByDepartmentIdByTimeRange'),
                    method: 'post',
                    data: this.$http.adornData({
                        departmentId: 1, //只有一个部门，先默认它
                        beginTime: this.time[0],
                        endTime: this.time[1]
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
            showContent(row){
                this.$http({
                    url: this.$http.adornUrl('/workload/listWorkLoadContentByTimeRange'),
                    method: 'post',
                    data: this.$http.adornData({
                        userId: row.userId,
                        demandId: row.demandId,
                        beginTime: this.time[0],
                        endTime: this.time[1],
                    })
                }).then(res => {
                    this.contentData = res.data
                    this.dialogTableVisible = true
                })
            },
            exportWord(){
                this.$http({
                    url: this.$http.adornUrl(`/workload/exportWord`),
                    method: 'post',
                    responseType: 'blob',
                    data: this.$http.adornData({
                        fullName: this.$cookies.get('fullName'),
                        beginTime: this.time[0],
                        endTime: this.time[1],
                    })
                }).then(res => {
                    const link = document.createElement('a') // 创建元素
                    const blob = new Blob([res], { type: 'application/octet-stream' })
                    link.style.display = 'none'
                    link.href = URL.createObjectURL(blob) // 创建下载的链接
                    link.setAttribute('download', '政务事业部周例会会议纪要.doc') // 给下载后的文件命名
                    document.body.appendChild(link)
                    link.click() // 点击下载
                    document.body.removeChild(link) //  下载完成移除元素
                    window.URL.revokeObjectURL(link.href) // 释放掉blob对象
                })
            }
        }
    }
</script>

<style scoped>

</style>