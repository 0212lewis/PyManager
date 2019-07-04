import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import ProduceSys from './views/produceSys/produceSys.vue'
import TestSys from './views/testSys/testSys.vue'
import NewSys from './views/newSys/newSys.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/produceSys' || '/',
        component: Home,
        name: '生产系统',
        // leaf: true,
        // iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/produceSys/projectList'|| '/', component: ProduceSys, name: 'projects' }
        ]
    },

    {
        path: '/testSys',
        component: Home,
        name: '测试系统',
        // iconCls: 'fa fa-address-card',
        children: [
            { path: '/testSys/projectList', component: TestSys, name: 'projects' },
        ]
    },

    {
        path: '/newSys',
        component: Home,
        name: '新建系统',
        // iconCls: 'fa fa-address-card',
        children: [
            { path: '/newSys/projectList', component: NewSys, name: 'projects' }
        ]
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: 'Charts',
    //     iconCls: 'fa fa-bar-chart',
    //     children: [
    //         { path: '/echarts', component: echarts, name: 'echarts' }
    //     ]
    // },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;