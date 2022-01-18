import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/index'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import( '../views/login/index'),
        meta: {title: '登录'}
    },
    {
        path: '/home',
        name: 'home',
        component: () => import( '../components/home'),
        meta: {title: '主页'},
        children: [
            {
                path: '/index',
                name: 'index',
                component: () => import( '../views/content/index'),
                meta: {title: '首页'}
            },
            {
                path: '/demand',
                name: 'demand',
                component: () => import( '../views/content/demand'),
                meta: {title: '需求管理'}
            },
            {
                path: '/workloadRecord',
                name: 'workloadRecord',
                component: () => import( '../views/content/workloadRecord'),
                meta: {title: '工作量记录'}
            },
            {
                path: '/workloadStatistics',
                name: 'workloadStatistics',
                component: () => import( '../views/content/workloadStatistics'),
                meta: {title: '工作量统计'}
            }
        ]
    },
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    const userId = Vue.prototype.$cookies.get("userId");
    if (to.meta.title) {
        document.title = to.meta.title
    }
    if(to.path === "/login"){
        next();
    }else if(!userId){
        next("/login")
    }else{
        next();
    }
})
export default router
