// 引入 moment 时间插件
import moment from "moment";
export default {
    // 获取今日的开始结束时间
    getToday() {
        let obj = {
            starttime: '',
            endtime: ''
        }

        obj.starttime = moment(moment().startOf("day").valueOf()).format("YYYY-MM-DD HH:mm:ss");
        obj.endtime = moment(moment().endOf("day")).format("YYYY-MM-DD HH:mm:ss");
        return obj
    },
    // 获取明日的开始结束时间
    getNextDay() {
        let obj = {
            starttime: '',
            endtime: ''
        }

        obj.starttime = moment(moment().day(moment().day() + 1).startOf("day").valueOf()).format("YYYY-MM-DD HH:mm:ss");
        obj.endtime = moment(moment().day(moment().day() + 1).endOf("day")).format("YYYY-MM-DD HH:mm:ss");
        return obj
    },
    /**
     * 获取后 i 周的周一和周日日期，并以数组的方式返回。
     * 当 i=1，获取的是下周一和下周日的日期；
     * 当 i=2，获取的是下下周一和下下周日的日期
     * ...以此类推
     * @param i
     */
    getNextWeek(i) {
        let obj = {
            starttime: '',
            endtime: ''
        }
        let weekOfDay = parseInt(moment().format('E'));//计算今天是这周第几天
        obj.starttime = moment().add((7 - weekOfDay) + 7 * (i - 1) + 1, 'days').format('YYYY-MM-DD');//周一日期
        obj.endtime = moment().add((7 - weekOfDay) + 7 * i, 'days').format('YYYY-MM-DD');//周日日期
        return obj
    },
    // 获取当前月的开始结束时间
    getCurrMonthDays() {
        let obj = {
            starttime: '',
            endtime: ''
        }
        obj.starttime = moment(moment().month(moment().month()).startOf('month').valueOf()).format('YYYY-MM-DD HH:mm:ss');
        obj.endtime = moment(moment().month(moment().month()).endOf('month').valueOf()).format('YYYY-MM-DD HH:mm:ss');
        return obj
    },
    // 获取上一个月的开始结束时间
    getLastMonthDays() {
        let obj = {
            starttime: '',
            endtime: ''
        }
        obj.starttime = moment(moment().month(moment().month() - 1).startOf('month').valueOf()).format('YYYY-MM-DD HH:mm:ss');
        obj.endtime = moment(moment().month(moment().month() - 1).endOf('month').valueOf()).format('YYYY-MM-DD HH:mm:ss');
        return obj
    },
    // 获取下一个月的开始结束时间
    getNextMonthDays() {
        let obj = {
            starttime: '',
            endtime: ''
        }
        obj.starttime = moment(moment().month(moment().month() + 1).startOf('month').valueOf()).format('YYYY-MM-DD HH:mm:ss');
        obj.endtime = moment(moment().month(moment().month() + 1).endOf('month').valueOf()).format('YYYY-MM-DD HH:mm:ss');
        return obj
    },
    // 获取指定月份的上个N月
    getLastMonthForDate(date,N){
        let obj = {
            starttime: '',
            endtime: ''
        }
        obj.starttime = moment(moment(date).month(moment().month() - N).startOf('month').valueOf()).format('YYYY-MM-DD HH:mm:ss');
        obj.endtime = moment(moment(date).month(moment().month() - N).endOf('month').valueOf()).format('YYYY-MM-DD HH:mm:ss');
        return obj

    },
    // 获取指定月份的下N个月
    getNextMonthForDate(date,N){
        let obj = {
            starttime: '',
            endtime: ''
        }
        obj.starttime = moment(moment(date).month(moment().month() + N).startOf('month').valueOf()).format('YYYY-MM-DD HH:mm:ss');
        obj.endtime = moment(moment(date).month(moment().month() + N).endOf('month').valueOf()).format('YYYY-MM-DD HH:mm:ss');
        return obj

    },
    // 获取当前时间
    getCurrentTime(){
        return moment().format("YYYY-MM-DD HH:mm:ss");
    },

    /**
     * 返回日期格式的字符串,忽略时间
     * @param date
     * @returns 日期(" 2017-01-10 ")
     */
    formatDate(date){
        return moment(date).format("YYYY-MM-DD");
    },

    /**
     * 返回日期格式的字符串,时间为 00:00:00
     * @param date
     * @returns 日期(" 2017-01-10 ")
     */
    formatDateStartTime(date){
        return moment(date).format("YYYY-MM-DD") + " 00:00:00";
    },

    /**
     * 返回时分秒格式的字符串,忽略日期
     * @param date
     * @returns 时间（" 14:18:58 "）
     */
    formatTime(date){
        return moment(date).format("HH:mm:ss");
    }

}