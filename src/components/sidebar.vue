<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            background-color="#324157"
            text-color="#ffffff"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template>
                <el-menu-item index="/index" key="/index">
                    <i class="el-icon-menu"></i>
                    <template #title>首页</template>
                </el-menu-item>
            </template>
            <template>
                <el-menu-item index="/demand" key="/demand">
                    <i class="el-icon-menu"></i>
                    <template #title>需求管理</template>
                </el-menu-item>
            </template>
            <template>
                <el-menu-item index="/workloadRecord" key="/workloadRecord">
                    <i class="el-icon-menu"></i>
                    <template #title>工作量记录</template>
                </el-menu-item>
            </template>
            <template>
                <el-menu-item index="/workloadStatistics" key="/workloadStatistics">
                    <i class="el-icon-menu"></i>
                    <template #title>工作量统计</template>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        computed: {
            onRoutes() {
                return this.$route.path.replace("/", "");
            },
        },
    };
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 0px;
        bottom: 0;
        overflow-y: scroll;
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 250px;
    }

    .sidebar > ul {
        height: 100%;
    }

    .sidebar .el-menu-item, .el-submenu {
        text-align: left;
    }

    .sidebar .el-menu-item >>> i, .el-submenu >>> i {
        margin-right: 23px;
    }
</style>