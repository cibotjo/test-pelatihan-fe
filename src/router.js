import {createRouter, createWebHistory} from 'vue-router'
import Login from './pages/Login.vue'
import ArrivalForm from './pages/ArrivalForm.vue'
import Dashboard from './pages/Dashboard.vue'
import ArrivalDetail from './pages/ArrivalDetail.vue'

const routes = [
    {path: '/', component: Login},
    {path: '/form', component: ArrivalForm},
    {path: '/dashboard', component: Dashboard},
    {path: '/arrival/:id', component: ArrivalDetail},
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
