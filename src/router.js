import {createRouter, createWebHistory} from 'vue-router'
import Login from './pages/Login.vue'
import ArrivalForm from './pages/ArrivalForm.vue'
import Dashboard from './pages/Dashboard.vue'
import ArrivalDetail from './pages/ArrivalDetail.vue'

const routes = [
    {path: '/', component: ArrivalForm},
    {path: '/form', component: ArrivalForm}, // Tambahkan path form
    {path: '/login', component: Login},
    {
        path: '/dashboard', 
        component: Dashboard,
        meta: { requiresAuth: true } // Menandai rute ini memerlukan autentikasi
    },
    {
        path: '/arrivals/:id', 
        component: ArrivalDetail,
        meta: { requiresAuth: true } // Menandai rute ini memerlukan autentikasi
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Navigation Guard untuk memeriksa autentikasi
router.beforeEach((to, from, next) => {
    // Jika rute memerlukan autentikasi
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // Periksa apakah ada cookie autentikasi
        // Karena kita menggunakan httpOnly cookie, kita tidak bisa langsung memeriksa cookie
        // Sebagai gantinya, kita akan memeriksa status autentikasi dengan cara lain
        
        // Kita bisa menggunakan localStorage sebagai penanda sederhana bahwa user sudah login
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        if (!isLoggedIn) {
            // Jika tidak terautentikasi, redirect ke halaman login
            next({ path: '/login' });
        } else {
            // Jika terautentikasi, lanjutkan navigasi
            next();
        }
    } else {
        // Jika rute tidak memerlukan autentikasi, lanjutkan navigasi
        next();
    }
});

export default router
