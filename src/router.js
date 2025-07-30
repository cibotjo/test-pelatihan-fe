import {createRouter, createWebHistory} from 'vue-router'
import Login from './pages/Login.vue'
import ArrivalForm from './pages/ArrivalForm.vue'
import Dashboard from './pages/Dashboard.vue'
import ArrivalDetail from './pages/ArrivalDetail.vue'

const routes = [
    {path: '/', component: ArrivalForm},
    {path: '/login', component: Login},
    {path: '/dashboard', component: Dashboard},
    {path: '/arrivals/:id', component: ArrivalDetail},
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
