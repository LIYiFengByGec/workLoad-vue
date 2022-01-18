<template>
    <div class="wrapper">
        <sidebar></sidebar>
        <div class="content" style="overflow:scroll;">
            <transition name="move" mode="out-in">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </transition>
        </div>
    </div>
</template>

<script>
    import sidebar from './sidebar'
    export default {
        components: {sidebar},
        name: "index"
    }
</script>

<style scoped>
    .content {
        position: absolute;
        left: 250px;
        right: 0;
        bottom: 0;
        transition: left .3s ease-in-out;
        background: #f0f0f0;
        width: auto;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
    }
</style>